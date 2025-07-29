// Service Worker for tractick PWA
const CACHE_NAME = 'tractick-v1.0.0';
const STATIC_CACHE = 'tractick-static-v1.0.0';
const DYNAMIC_CACHE = 'tractick-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/browserconfig.xml',
  '/favicon.png',
  '/assets/header-logo-1.svg',
  '/assets/header-logo-2.svg',
  '/assets/screenshot-desktop.webp',
  '/assets/screenshot-mobile.webp'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch(() => {
        // Error caching static files
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests (except for essential APIs)
  if (!url.origin.includes(self.location.origin) && 
      !url.hostname.includes('firestore.googleapis.com') &&
      !url.hostname.includes('api.openweathermap.org')) {
    return;
  }
  
  // Skip Google Maps API requests to avoid CORS issues
  if (url.hostname.includes('maps.googleapis.com')) {
    return;
  }
  
  // Handle different types of requests
  if (request.destination === 'document' || request.destination === '') {
    // HTML pages - network first, fallback to cache
    event.respondWith(networkFirst(request));
  } else if (request.destination === 'script' || request.destination === 'style') {
    // JS/CSS files - cache first, fallback to network
    event.respondWith(cacheFirst(request));
  } else if (request.destination === 'image') {
    // Images - cache first, fallback to network, but skip icon conflicts
    if (url.pathname.includes('/assets/android/') || url.pathname.includes('/assets/ios/') || url.pathname.includes('/assets/windows11/')) {
      // Skip caching platform-specific icons to avoid conflicts
      return;
    }
    event.respondWith(cacheFirst(request));
  } else {
    // Other requests - network first, fallback to cache
    event.respondWith(networkFirst(request));
  }
});

// Network first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

// Cache first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Handle background sync
async function doBackgroundSync() {
  try {
    // Sync any pending data when connection is restored
    
    // You can add specific sync logic here
    // For example, syncing timer data, user preferences, etc.
    
  } catch {
          // Background sync failed
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from tractick',
    icon: '/assets/android/android-launchericon-192-192.webp',
    badge: '/assets/android/android-launchericon-96-96.webp',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/assets/android/android-launchericon-96-96.webp'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/android/android-launchericon-96-96.webp'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('tractick', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          return cache.addAll(event.data.urls);
        })
    );
  }
});

// Error handling
self.addEventListener('error', () => {
      // Service Worker error
});

self.addEventListener('unhandledrejection', () => {
      // Unhandled promise rejection
}); 