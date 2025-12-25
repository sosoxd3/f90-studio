// F90 Music Studio - YouTube Service
// Robust YouTube API integration (playlist-first)

class YouTubeService {
  constructor() {
    this.apiKey = 'AIzaSyD3mvCx80XsvwrURRg2RwaD8HmOKqhYkek';

    // ✅ لا تعتمد على channelId طالما مش متأكد منه.
    // خليّه فاضي، والموقع رح يشتغل من البلايليستات مباشرة.
    this.channelId = '';

    // ✅ Playlists
    this.playlists = [
      'PL2FIA-SoBgYvY4B-0IDWTtKriVGPb1qnx',
      'PL2FIA-SoBgYtotc48ZfKSYagxMd3AMmVp',
      'PL2FIA-SoBgYuXeLdvKXaMlRJiF3B2opAP'
    ];

    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  // ✅ API call (safe): supports endpoints with or without "?"
  async apiCall(endpoint) {
    try {
      const join = endpoint.includes('?') ? '&' : '?';
      const url = `https://www.googleapis.com/youtube/v3/${endpoint}${join}key=${encodeURIComponent(this.apiKey)}`;

      const response = await fetch(url);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const msg = data?.error?.message || `HTTP ${response.status}`;
        throw new Error(msg);
      }

      return data;
    } catch (error) {
      console.error('YouTube API Error:', error);
      return null;
    }
  }

  // ✅ Optional: channel info (only if channelId is set)
  async getChannelInfo() {
    if (!this.channelId) return null;

    const cacheKey = 'channel_info';
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) return cached.data;

    const endpoint = `channels?part=snippet,statistics&id=${encodeURIComponent(this.channelId)}`;
    const data = await this.apiCall(endpoint);

    if (data?.items?.[0]) {
      const it = data.items[0];
      const channelInfo = {
        title: it.snippet?.title || '',
        description: it.snippet?.description || '',
        thumbnail: it.snippet?.thumbnails?.high?.url || it.snippet?.thumbnails?.default?.url || '',
        subscriberCount: it.statistics?.subscriberCount || '0',
        videoCount: it.statistics?.videoCount || '0',
        viewCount: it.statistics?.viewCount || '0'
      };
      this.cache.set(cacheKey, { data: channelInfo, timestamp: Date.now() });
      return channelInfo;
    }
    return null;
  }

  // ✅ Optional: channel videos (only if channelId is set)
  async getChannelVideos(maxResults = 50) {
    if (!this.channelId) return [];

    const cacheKey = 'channel_videos';
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) return cached.data;

    const endpoint =
      `search?part=snippet&channelId=${encodeURIComponent(this.channelId)}` +
      `&maxResults=${encodeURIComponent(maxResults)}&order=date&type=video`;

    const data = await this.apiCall(endpoint);

    if (data?.items) {
      const videos = data.items
        .filter(item => item?.id?.videoId)
        .map(item => ({
          youtubeId: item.id.videoId,
          title: item.snippet?.title || '',
          description: item.snippet?.description || '',
          thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || '',
          publishedAt: item.snippet?.publishedAt || '',
          channelTitle: item.snippet?.channelTitle || ''
        }));

      this.cache.set(cacheKey, { data: videos, timestamp: Date.now() });
      return videos;
    }

    return [];
  }

  // ✅ Playlist videos with pagination (important!)
  async getPlaylistVideos(playlistId, maxResults = 50) {
    const cacheKey = `playlist_${playlistId}_${maxResults}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) return cached.data;

    let items = [];
    let pageToken = '';

    while (true) {
      const endpoint =
        `playlistItems?part=snippet,contentDetails&playlistId=${encodeURIComponent(playlistId)}` +
        `&maxResults=${encodeURIComponent(Math.min(50, maxResults))}` +
        (pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : '');

      const data = await this.apiCall(endpoint);
      const chunk = (data?.items || [])
        .filter(it => it?.contentDetails?.videoId || it?.snippet?.resourceId?.videoId)
        .map(it => {
          const vid = it.contentDetails?.videoId || it.snippet?.resourceId?.videoId;
          return {
            youtubeId: vid,
            title: it.snippet?.title || '',
            description: it.snippet?.description || '',
            thumbnail: it.snippet?.thumbnails?.high?.url || it.snippet?.thumbnails?.default?.url || '',
            publishedAt: it.snippet?.publishedAt || '',
            channelTitle: it.snippet?.channelTitle || '',
            position: it.snippet?.position ?? 0
          };
        })
        .filter(v => v.youtubeId && v.title && v.title !== 'Private video' && v.title !== 'Deleted video');

      items.push(...chunk);

      if (!data?.nextPageToken) break;
      pageToken = data.nextPageToken;

      // stop if exceeded maxResults requested
      if (items.length >= maxResults) break;
    }

    // unique
    const uniq = Array.from(new Map(items.map(v => [v.youtubeId, v])).values());
    this.cache.set(cacheKey, { data: uniq, timestamp: Date.now() });
    return uniq;
  }

  // ✅ All content (playlist-first)
  async getAllContent() {
    try {
      const allVideos = [];

      // Playlists
      for (const playlistId of this.playlists) {
        const playlistVideos = await this.getPlaylistVideos(playlistId, 50);
        allVideos.push(...playlistVideos);
      }

      // Optional channel recent videos (only if channelId exists)
      if (this.channelId) {
        const channelVideos = await this.getChannelVideos(30);
        allVideos.push(...channelVideos);
      }

      // unique + sort
      const uniqueVideos = Array.from(new Map(allVideos.map(v => [v.youtubeId, v])).values());
      uniqueVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

      // ✅ IMPORTANT: لا تغيّر id. خلي id = youtubeId حتى ما تنكسر الصفحات
      return uniqueVideos.map(video => ({
        id: video.youtubeId,          // ✅ هذا اللي أغلب الأكواد تتوقعه
        youtubeId: video.youtubeId,   // ✅ للاستخدام الواضح
        title: video.title,
        description: video.description,
        thumbnail: video.thumbnail || 'resources/studio-hero.jpg',
        publishedAt: video.publishedAt,
        channelTitle: video.channelTitle || 'F90 Music',
        artist: 'F90 Studio'
      }));

    } catch (error) {
      console.error('Error fetching all content:', error);
      return this.getMockData();
    }
  }

  getMockData() {
    return [
      {
        id: 'dQw4w9WgXcQ',
        youtubeId: 'dQw4w9WgXcQ',
        title: 'F90 Studio Session - Demo',
        artist: 'F90 Studio',
        thumbnail: 'resources/studio-hero.jpg',
        publishedAt: new Date().toISOString()
      }
    ];
  }

  clearCache() {
    this.cache.clear();
    console.log('YouTube Service: Cache cleared');
  }

  getCacheStats() {
    return { size: this.cache.size, keys: Array.from(this.cache.keys()) };
  }
}

const youtubeService = new YouTubeService();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = YouTubeService;
}
