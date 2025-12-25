# F90 Music Studio - Project Outline

## Website Structure (11 Pages Total)

### 1. index.html - Homepage
**Purpose**: Welcome visitors with studio atmosphere and featured content
**Sections**:
- Navigation bar with logo and menu
- Hero section with studio background image and typewriter animation
- "استمع الآن" (Listen Now) call-to-action button
- Featured tracks carousel with latest releases
- Top-rated tracks section
- Studio image gallery preview
- Quick access playlists
- Social media links
- App install prompt
- Footer with copyright and links

### 2. music.html - All Tracks
**Purpose**: Complete music library with search and filtering
**Sections**:
- Navigation bar
- Page header with search bar
- Filter controls (playlist, sort options)
- Track grid/list with artwork, titles, ratings
- Pagination or infinite scroll
- Mini player integration
- Footer

### 3. playlists.html - Curated Playlists
**Purpose**: Organized collections from YouTube playlists
**Sections**:
- Navigation bar
- Playlist cards with thumbnails and descriptions
- Track count and duration info
- Click to view individual playlist contents
- Search within playlists
- Footer

### 4. track.html - Single Track Page
**Purpose**: Detailed view of individual songs with interaction
**Sections**:
- Navigation bar
- Large track artwork
- Track information (title, artist, duration)
- YouTube player integration
- Rating system (5 stars)
- Like/favorite button
- Comments section
- Add comment form
- Related tracks
- Footer

### 5. studio.html - Studio Gallery
**Purpose**: Showcase professional studio environment
**Sections**:
- Navigation bar
- Studio hero image
- Equipment showcase gallery
- Studio features and amenities
- Technical specifications
- Image carousel with professional photos
- Booking information
- Footer

### 6. requests.html - Song Requests
**Purpose**: Allow users to request custom songs
**Sections**:
- Navigation bar
- Request form (name, message)
- Delivery options (WhatsApp/Email)
- Contact information display
- Response time expectations
- Footer

### 7. about.html - Studio Information
**Purpose**: Tell the story of F90 Music Studio
**Sections**:
- Navigation bar
- Studio background image
- Studio history and mission
- Services offered
- Equipment and capabilities
- Team information (if applicable)
- Studio philosophy
- Footer

### 8. contact.html - Contact Information
**Purpose**: Provide multiple ways to connect
**Sections**:
- Navigation bar
- Contact form
- WhatsApp integration button
- Email contact
- Social media links
- Studio location (if applicable)
- Response times
- Footer

### 9. privacy.html - Privacy Policy
**Purpose**: Legal privacy information
**Sections**:
- Navigation bar
- Privacy policy content
- Data collection practices
- LocalStorage usage explanation
- YouTube content ownership
- Footer

### 10. terms.html - Terms of Use
**Purpose**: Legal terms and conditions
**Sections**:
- Navigation bar
- Terms of service content
- Content usage rights
- DMCA information
- Copyright notice
- Footer

### 11. manifest.json - PWA Manifest
**Purpose**: Enable app installation
**Content**:
- App name and description
- Icons and splash screens
- Display mode settings
- Theme colors
- Start URL configuration

## Core JavaScript Files

### main.js - Primary Application Logic
**Functions**:
- Music player management
- YouTube API integration via proxy
- Local storage management (ratings, comments, favorites)
- Search and filtering logic
- Language switching functionality
- PWA install prompts
- Navigation management

### player.js - Audio Player System
**Functions**:
- Player state management
- Track progression handling
- Volume and playback controls
- Shuffle and repeat modes
- Mini player and full player switching
- Background audio continuation

### i18n.js - Internationalization
**Functions**:
- 20+ language translations
- Automatic language detection
- Manual language switching
- RTL/LTR direction handling
- Dynamic content translation

### sw.js - Service Worker
**Functions**:
- Cache static assets
- Offline functionality
- Background sync
- Push notifications (future)
- App update management

## Resource Files

### resources/ Directory
- f90-logo.png - Studio logo
- studio-hero.jpg - Main hero image
- vocal-booth.jpg - Vocal booth photo
- mixing-console.jpg - Console close-up
- studio-monitors.jpg - Monitor setup
- studio-equipment.jpg - Equipment collection

### Language Files (JSON)
- ar.json - Arabic (default)
- en.json - English
- es.json - Spanish
- fr.json - French
- de.json - German
- And 15+ additional languages

## Key Features Implementation

### Music Player
- Custom HTML5 audio controls
- YouTube iframe backup
- Progress tracking
- Volume control
- Playlist management
- Background playback

### Rating System
- 5-star interactive interface
- Local storage persistence
- Average rating calculation
- Visual feedback animations

### Comments System
- Local storage based
- Form validation
- Timestamp management
- Character count limits

### Search & Filter
- Real-time search with debouncing
- Playlist filtering
- Sort options (newest, oldest, title, rating)
- URL parameter integration

### PWA Features
- App manifest
- Service worker
- Install prompts
- Offline caching
- App icon generation

### Multi-Language
- Automatic detection
- Manual switching
- RTL support for Arabic
- Dynamic content loading

## Technical Architecture

### Frontend Stack
- HTML5 semantic markup
- CSS3 with Tailwind framework
- Vanilla JavaScript (ES6+)
- Progressive enhancement

### External APIs
- YouTube Data API v3 (via secure proxy)
- Google Fonts (self-hosted fallback)
- CDN for libraries (local fallback)

### Performance Optimizations
- Lazy loading for images
- Code splitting for JavaScript
- CSS minification
- Service worker caching
- Progressive image loading

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader compatibility
- High contrast mode
- Reduced motion support

This comprehensive structure ensures a professional, feature-rich music studio website that works seamlessly across all devices and provides an exceptional user experience while maintaining the sophisticated aesthetic of a premium recording facility.