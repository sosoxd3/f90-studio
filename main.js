// F90 Music Studio - Main JavaScript
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
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupPWA();
        this.loadMockData();
        this.initializeGallery();
        this.setupScrollAnimations();
        this.initializeParticles();
        
        // Load content based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        await this.loadPageContent(currentPage);
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
    }

    initializeAnimations() {
        // Hero typewriter effect
        if (document.getElementById('heroText')) {
            const typed = new Typed('#heroText', {
                strings: ['F90 Music Studio', 'استوديو اف تسعين', 'Professional Recording', 'تسجيل احترافي'],
                typeSpeed: 80,
                backSpeed: 50,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        }

        // Initialize Splitting.js for text animations
        if (typeof Splitting !== 'undefined') {
            Splitting();
        }
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.section-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    initializeParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.width = (Math.random() * 4 + 2) + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    initializeGallery() {
        if (document.getElementById('studioGallery')) {
            new Splide('#studioGallery', {
                type: 'loop',
                perPage: 1,
                perMove: 1,
                gap: '2rem',
                autoplay: true,
                interval: 4000,
                pauseOnHover: true,
                arrows: true,
                pagination: true,
                breakpoints: {
                    768: {
                        perPage: 1
                    }
                }
            }).mount();
        }
    }

    loadMockData() {
        // Mock tracks data
        this.tracks = [
            {
                id: 'track1',
                title: 'صوت الحرية',
                artist: 'F90 Studio',
                duration: '3:45',
                thumbnail: 'resources/studio-hero.jpg',
                youtubeId: 'dQw4w9WgXcQ',
                rating: 4.8,
                plays: 1250
            },
            {
                id: 'track2',
                title: 'ليلة هادئة',
                artist: 'F90 Studio',
                duration: '4:12',
                thumbnail: 'resources/vocal-booth.jpg',
                youtubeId: 'dQw4w9WgXcQ',
                rating: 4.6,
                plays: 980
            },
            {
                id: 'track3',
                title: 'أحلام واقعية',
                artist: 'F90 Studio',
                duration: '3:28',
                thumbnail: 'resources/mixing-console.jpg',
                youtubeId: 'dQw4w9WgXcQ',
                rating: 4.9,
                plays: 2100
            },
            {
                id: 'track4',
                title: 'نبض المدينة',
                artist: 'F90 Studio',
                duration: '3:56',
                thumbnail: 'resources/studio-monitors.jpg',
                youtubeId: 'dQw4w9WgXcQ',
                rating: 4.7,
                plays: 1580
            },
            {
                id: 'track5',
                title: 'فجر جديد',
                artist: 'F90 Studio',
                duration: '4:33',
                thumbnail: 'resources/studio-equipment.jpg',
                youtubeId: 'dQw4w9WgXcQ',
                rating: 4.5,
                plays: 750
            },
            {
                id: 'track6',
                title: 'ذكريات لا تموت',
                artist: 'F90 Studio',
                duration: '3:18',
                thumbnail: 'resources/studio-hero.jpg',
                youtubeId: 'dQw4w9WgXcQ',
                rating: 4.8,
                plays: 1890
            }
        ];

        // Mock playlists data
        this.playlists = [
            {
                id: 'playlist1',
                title: 'أفضل الإصدارات',
                description: 'مجموعة من أفضل أعمالنا',
                trackCount: 12,
                thumbnail: 'resources/studio-hero.jpg'
            },
            {
                id: 'playlist2',
                title: 'موسيقى هادئة',
                description: 'للاسترخاء والهدوء',
                trackCount: 8,
                thumbnail: 'resources/vocal-booth.jpg'
            },
            {
                id: 'playlist3',
                title: 'إيقاعات حية',
                description: 'موسيقى ديناميكية ونشطة',
                trackCount: 15,
                thumbnail: 'resources/mixing-console.jpg'
            }
        ];
    }

    async loadPageContent(page) {
        switch (page) {
            case 'index.html':
            case '':
                await this.loadHomepageContent();
                break;
            case 'music.html':
                await this.loadMusicPage();
                break;
            case 'playlists.html':
                await this.loadPlaylistsPage();
                break;
            case 'track.html':
                await this.loadTrackPage();
                break;
            case 'studio.html':
                await this.loadStudioPage();
                break;
            case 'requests.html':
                await this.loadRequestsPage();
                break;
            case 'about.html':
                await this.loadAboutPage();
                break;
            case 'contact.html':
                await this.loadContactPage();
                break;
        }
    }

    async loadHomepageContent() {
        this.renderFeaturedTracks();
        this.renderTopRatedTracks();
        this.renderPlaylistPreview();
    }

    renderFeaturedTracks() {
        const container = document.getElementById('featuredTracks');
        if (!container) return;

        const featuredTracks = this.tracks.slice(0, 3);
        container.innerHTML = featuredTracks.map(track => this.createTrackCard(track)).join('');
    }

    renderTopRatedTracks() {
        const container = document.getElementById('topRatedTracks');
        if (!container) return;

        const topRated = [...this.tracks].sort((a, b) => b.rating - a.rating).slice(0, 3);
        container.innerHTML = topRated.map(track => this.createTrackCard(track)).join('');
    }

    renderPlaylistPreview() {
        const container = document.getElementById('playlistPreview');
        if (!container) return;

        container.innerHTML = this.playlists.map(playlist => this.createPlaylistCard(playlist)).join('');
    }

    createTrackCard(track) {
        const isFavorite = this.favorites.includes(track.id);
        const userRating = this.ratings[track.id] || 0;
        
        return `
            <div class="track-card rounded-2xl overflow-hidden cursor-pointer" onclick="f90Studio.playTrack('${track.id}')">
                <div class="relative">
                    <img src="${track.thumbnail}" alt="${track.title}" class="w-full h-48 object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
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

    createPlaylistCard(playlist) {
        return `
            <div class="track-card rounded-2xl overflow-hidden cursor-pointer" onclick="f90Studio.openPlaylist('${playlist.id}')">
                <div class="relative">
                    <img src="${playlist.thumbnail}" alt="${playlist.title}" class="w-full h-48 object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div class="absolute bottom-4 left-4 right-4">
                        <h3 class="text-xl font-bold text-white mb-2">${playlist.title}</h3>
                        <p class="text-studio-silver mb-2">${playlist.description}</p>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-studio-silver">${playlist.trackCount} أغنية</span>
                            <svg class="w-6 h-6 text-studio-gold" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '★';
        }
        
        if (hasHalfStar) {
            stars += '☆';
        }
        
        while (stars.length < 5) {
            stars += '☆';
        }

        return stars;
    }

    playTrack(trackId) {
        const track = this.tracks.find(t => t.id === trackId);
        if (!track) return;

        this.currentTrack = track;
        this.isPlaying = true;
        this.showMiniPlayer();
        this.updatePlayerControls();
        
        // Simulate YouTube player integration
        console.log('Playing:', track.title);
    }

    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        this.updatePlayerControls();
    }

    previousTrack() {
        if (!this.currentTrack) return;
        
        const currentIndex = this.tracks.findIndex(t => t.id === this.currentTrack.id);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : this.tracks.length - 1;
        this.playTrack(this.tracks[prevIndex].id);
    }

    nextTrack() {
        if (!this.currentTrack) return;
        
        const currentIndex = this.tracks.findIndex(t => t.id === this.currentTrack.id);
        const nextIndex = currentIndex < this.tracks.length - 1 ? currentIndex + 1 : 0;
        this.playTrack(this.tracks[nextIndex].id);
    }

    showMiniPlayer() {
        const miniPlayer = document.getElementById('miniPlayer');
        if (miniPlayer && this.currentTrack) {
            miniPlayer.classList.remove('translate-y-full');
            
            // Update track info
            document.getElementById('currentTrackArtwork').src = this.currentTrack.thumbnail;
            document.getElementById('currentTrackTitle').textContent = this.currentTrack.title;
            document.getElementById('currentTrackArtist').textContent = this.currentTrack.artist;
        }
    }

    updatePlayerControls() {
        const playIcon = document.getElementById('playIcon');
        const pauseIcon = document.getElementById('pauseIcon');
        
        if (this.isPlaying) {
            playIcon?.classList.add('hidden');
            pauseIcon?.classList.remove('hidden');
        } else {
            playIcon?.classList.remove('hidden');
            pauseIcon?.classList.add('hidden');
        }
    }

    toggleFavorite(trackId) {
        const index = this.favorites.indexOf(trackId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(trackId);
        }
        
        localStorage.setItem('f90_favorites', JSON.stringify(this.favorites));
        this.refreshTrackDisplay();
    }

    rateTrack(trackId, rating) {
        this.ratings[trackId] = rating;
        localStorage.setItem('f90_ratings', JSON.stringify(this.ratings));
        this.refreshTrackDisplay();
    }

    refreshTrackDisplay() {
        // Refresh track displays on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (currentPage === 'index.html' || currentPage === '') {
            this.renderFeaturedTracks();
            this.renderTopRatedTracks();
        }
    }

    openTrackPage(trackId) {
        window.location.href = `track.html?id=${trackId}`;
    }

    openPlaylist(playlistId) {
        window.location.href = `playlists.html?id=${playlistId}`;
    }

    setupPWA() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(registration => console.log('SW registered'))
                .catch(error => console.log('SW registration failed'));
        }

        // Handle PWA install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            document.getElementById('installApp')?.classList.remove('hidden');
        });
    }

    async installApp() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            this.deferredPrompt = null;
            document.getElementById('installApp')?.classList.add('hidden');
        }
    }

    // Search functionality
    searchTracks(query) {
        return this.tracks.filter(track => 
            track.title.toLowerCase().includes(query.toLowerCase()) ||
            track.artist.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Filter functionality
    filterTracks(playlistId) {
        // Mock filter - in real app would filter by actual playlist
        return this.tracks;
    }

    // Sort functionality
    sortTracks(tracks, sortBy) {
        switch (sortBy) {
            case 'newest':
                return [...tracks].reverse();
            case 'oldest':
                return [...tracks];
            case 'title':
                return [...tracks].sort((a, b) => a.title.localeCompare(b.title));
            case 'rating':
                return [...tracks].sort((a, b) => b.rating - a.rating);
            default:
                return tracks;
        }
    }
}

// Initialize the application
const f90Studio = new F90Studio();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = F90Studio;
}