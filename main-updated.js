// F90 Music Studio - Main JavaScript with YouTube Integration
class F90Studio {
    constructor() {
        this.currentTrack = null;
        this.isPlaying = false;
        this.tracks = [];
        this.playlists = [];
        this.currentLanguage = 'ar';
        this.player = null;
        this.ratings = JSON.parse(localStorage.getItem('f90_ratings') || '{}');
        this.favorites = JSON.parse(localStorage.getItem('f90_favorites') || '[]');
        this.comments = JSON.parse(localStorage.getItem('f90_comments') || '{}');
        this.youtubeService = new YouTubeService();
        this.youtubeData = [];
        this.isLoadingYouTube = false;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupPWA();
        await this.loadYouTubeData(); // Load YouTube data first
        this.loadMockData(); // Load mock data as fallback
        this.initializeGallery();
        this.setupScrollAnimations();
        this.initializeParticles();
        
        // Load content based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        await this.loadPageContent(currentPage);
    }

    async loadYouTubeData() {
        if (this.isLoadingYouTube) return;
        
        this.isLoadingYouTube = true;
        console.log('Loading YouTube data...');
        
        try {
            // Try to load from YouTube API
            const youtubeVideos = await this.youtubeService.getAllContent();
            
            if (youtubeVideos && youtubeVideos.length > 0) {
                console.log(`Loaded ${youtubeVideos.length} videos from YouTube`);
                this.youtubeData = youtubeVideos;
                
                // Merge with existing tracks
                this.mergeYouTubeData();
            } else {
                console.log('No YouTube data available, using mock data');
            }
        } catch (error) {
            console.error('Error loading YouTube data:', error);
        } finally {
            this.isLoadingYouTube = false;
        }
    }

    mergeYouTubeData() {
        // Convert YouTube videos to track format
        const youtubeTracks = this.youtubeData.map((video, index) => ({
            id: video.id || `yt_${index}`,
            title: video.title || 'F90 Studio Track',
            artist: video.artist || 'F90 Studio',
            duration: video.duration || '3:45',
            thumbnail: video.thumbnail || 'resources/studio-hero.jpg',
            youtubeId: video.youtubeId || video.id,
            rating: parseFloat(video.rating) || (Math.random() * 2 + 3).toFixed(1),
            plays: parseInt(video.plays) || Math.floor(Math.random() * 5000) + 500,
            publishedAt: video.publishedAt || new Date().toISOString(),
            isYouTube: true
        }));

        // Merge with mock data (YouTube data takes priority)
        const existingIds = new Set(this.tracks.map(t => t.id));
        const newTracks = youtubeTracks.filter(track => !existingIds.has(track.id));
        
        this.tracks = [...this.tracks, ...newTracks];
        
        // Update playlists
        this.updatePlaylistsFromYouTube();
        
        console.log(`Merged ${newTracks.length} YouTube tracks, total: ${this.tracks.length}`);
    }

    updatePlaylistsFromYouTube() {
        // Create playlists from YouTube playlists
        this.playlists = [
            {
                id: 'latest',
                title: 'أحدث الإصدارات',
                description: 'أحدث أعمال F90 Studio',
                trackCount: Math.min(this.tracks.length, 20),
                thumbnail: 'resources/studio-hero.jpg',
                isYouTube: true
            },
            {
                id: 'popular',
                title: 'الأكثر مشاهدة',
                description: 'الأعمال الأكثر شعبية',
                trackCount: Math.min(this.tracks.length, 15),
                thumbnail: 'resources/vocal-booth.jpg',
                isYouTube: true
            },
            {
                id: 'favorites',
                title: 'المفضلة',
                description: 'أغانيك المفضلة',
                trackCount: this.favorites.length,
                thumbnail: 'resources/mixing-console.jpg',
                isYouTube: false
            }
        ];
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenu');
        const mobileMenuContent = document.getElementById('mobileMenuContent');
        
        if (mobileMenuBtn && mobileMenuContent) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenuContent.classList.toggle('hidden');
            });
        }

        // PWA install button
        const installBtn = document.getElementById('installApp');
        if (installBtn) {
            installBtn.addEventListener('click', () => this.installApp());
        }

        // Mini player controls
        const playPauseBtn = document.getElementById('playPause');
        const prevBtn = document.getElementById('prevTrack');
        const nextBtn = document.getElementById('nextTrack');

        if (playPauseBtn) playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousTrack());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextTrack());

        // YouTube sync button (if exists)
        const syncBtn = document.getElementById('syncYouTube');
        if (syncBtn) {
            syncBtn.addEventListener('click', () => this.syncYouTubeData());
        }
    }

    async syncYouTubeData() {
        console.log('Manual YouTube sync triggered');
        this.youtubeService.clearCache();
        await this.loadYouTubeData();
        
        // Refresh current page content
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        await this.loadPageContent(currentPage);
        
        this.showNotification('تم تحديث المحتوى من YouTube!');
    }

    // ... (rest of the existing methods remain the same)
    
    // Update the loadMockData method to include YouTube data
    loadMockData() {
        // Only load mock data if no YouTube data is available
        if (this.tracks.length === 0) {
            this.tracks = [
                {
                    id: 'track1',
                    title: 'صوت الحرية',
                    artist: 'F90 Studio',
                    duration: '3:45',
                    thumbnail: 'resources/studio-hero.jpg',
                    youtubeId: 'dQw4w9WgXcQ',
                    rating: 4.8,
                    plays: 1250,
                    isYouTube: false
                },
                {
                    id: 'track2',
                    title: 'ليلة هادئة',
                    artist: 'F90 Studio',
                    duration: '4:12',
                    thumbnail: 'resources/vocal-booth.jpg',
                    youtubeId: 'dQw4w9WgXcQ',
                    rating: 4.6,
                    plays: 980,
                    isYouTube: false
                },
                {
                    id: 'track3',
                    title: 'أحلام واقعية',
                    artist: 'F90 Studio',
                    duration: '3:28',
                    thumbnail: 'resources/mixing-console.jpg',
                    youtubeId: 'dQw4w9WgXcQ',
                    rating: 4.9,
                    plays: 2100,
                    isYouTube: false
                },
                {
                    id: 'track4',
                    title: 'نبض المدينة',
                    artist: 'F90 Studio',
                    duration: '3:56',
                    thumbnail: 'resources/studio-monitors.jpg',
                    youtubeId: 'dQw4w9WgXcQ',
                    rating: 4.7,
                    plays: 1580,
                    isYouTube: false
                },
                {
                    id: 'track5',
                    title: 'فجر جديد',
                    artist: 'F90 Studio',
                    duration: '4:33',
                    thumbnail: 'resources/studio-equipment.jpg',
                    youtubeId: 'dQw4w9WgXcQ',
                    rating: 4.5,
                    plays: 750,
                    isYouTube: false
                },
                {
                    id: 'track6',
                    title: 'ذكريات لا تموت',
                    artist: 'F90 Studio',
                    duration: '3:18',
                    thumbnail: 'resources/studio-hero.jpg',
                    youtubeId: 'dQw4w9WgXcQ',
                    rating: 4.8,
                    plays: 1890,
                    isYouTube: false
                }
            ];
        }

        // Update playlists
        if (this.playlists.length === 0) {
            this.updatePlaylistsFromYouTube();
        }
    }

    // ... (rest of the existing methods remain unchanged)

    // Update track card creation to show YouTube indicator
    createTrackCard(track) {
        const isFavorite = this.favorites.includes(track.id);
        const userRating = this.ratings[track.id] || 0;
        const isYouTube = track.isYouTube || false;
        
        return `
            <div class="track-card rounded-2xl overflow-hidden cursor-pointer" onclick="f90Studio.playTrack('${track.id}')">
                <div class="relative">
                    <img src="${track.thumbnail}" alt="${track.title}" class="w-full h-48 object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    ${isYouTube ? '<div class="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">YouTube</div>' : ''}
                    <div class="absolute top-4 left-4">
                        <button onclick="event.stopPropagation(); f90Studio.toggleFavorite('${track.id}')" class="text-2xl ${isFavorite ? 'text-red-500' : 'text-white hover:text-red-500'} transition-colors">
                            ${isFavorite ? '❤️' : '🤍'}
                        </button>
                    </div>
                    <div class="absolute bottom-4 left-4 right-4">
                        <h3 class="text-xl font-bold text-white mb-1">${track.title}</h3>
                        <p class="text-studio-silver mb-2">${track.artist}</p>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <div class="star-rating">
                                    ${this.renderStars(track.rating)}
                                </div>
                                <span class="text-sm text-studio-silver">${track.rating}</span>
                            </div>
                            <span class="text-sm text-studio-silver">${track.duration}</span>
                        </div>
                        <div class="flex items-center justify-between mt-2">
                            <span class="text-xs text-studio-silver">${track.plays} مشاهدة</span>
                            <button onclick="event.stopPropagation(); f90Studio.openTrackPage('${track.id}')" class="text-studio-gold hover:text-white transition-colors">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Show notification method
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-24 right-6 z-50 px-6 py-3 rounded-xl text-white font-bold transition-all duration-300 transform translate-x-full ${
            type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize the application
const f90Studio = new F90Studio();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = F90Studio;
}