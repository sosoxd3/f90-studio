// F90 Music Studio - Service Worker
const CACHE_NAME = 'f90-studio-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/music.html',
  '/playlists.html',
  '/track.html',
  '/studio.html',
  '/requests.html',
  '/about.html',
  '/contact.html',
  '/privacy.html',
  '/terms.html',
  '/main.js',
  '/manifest.json',
  '/resources/f90-logo.png',
  '/resources/studio-hero.jpg',
  '/resources/vocal-booth.jpg',
  '/resources/mixing-console.jpg',
  '/resources/studio-monitors.jpg',
  '/resources/studio-equipment.jpg',
  // External resources with fallbacks
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.12/typed.min.js',
  'https://unpkg.com/splitting@1.0.6/dist/splitting.js',
  'https://unpkg.com/splitting@1.0.6/dist/splitting.css',
  'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js',
  'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Cached all files successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.log('Service Worker: Cache failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return response;
        }

        console.log('Service Worker: Fetching from network', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return offline fallback for HTML pages
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // Return offline fallback for images
            if (event.request.destination === 'image') {
              return caches.match('/resources/f90-logo.png');
            }
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      doBackgroundSync()
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'New content available!',
    icon: '/resources/f90-logo.png',
    badge: '/resources/f90-logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/resources/f90-logo.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/resources/f90-logo.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('F90 Music Studio', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received');

  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync function
async function doBackgroundSync() {
  try {
    // Handle any pending offline tasks
    console.log('Service Worker: Performing background sync');
    
    // Example: Sync user preferences, ratings, etc.
    // This would typically sync with a backend server
    
  } catch (error) {
    console.log('Service Worker: Background sync failed', error);
  }
}

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('Service Worker: Script loaded successfully');