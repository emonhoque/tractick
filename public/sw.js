// Service Worker for TrakTick PWA
const CACHE_NAME = 'traktick-v1.0.0';
const STATIC_CACHE = 'traktick-static-v1.0.0';
const DYNAMIC_CACHE = 'traktick-dynamic-v1.0.0';

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
  '/assets/screenshot-mobile.webp',
  // Android icons
  '/assets/android/android-launchericon-48-48.webp',
  '/assets/android/android-launchericon-72-72.webp',
  '/assets/android/android-launchericon-96-96.webp',
  '/assets/android/android-launchericon-144-144.webp',
  '/assets/android/android-launchericon-192-192.webp',
  '/assets/android/android-launchericon-512-512.webp',
  // iOS icons
  '/assets/ios/180.webp',
  '/assets/ios/167.webp',
  '/assets/ios/152.webp',
  '/assets/ios/120.webp',
  '/assets/ios/1024.webp',
  '/assets/ios/512.webp',
  // Windows icons
  '/assets/windows11/Square150x150Logo.scale-100.webp',
  '/assets/windows11/Square150x150Logo.scale-125.webp',
  '/assets/windows11/Square150x150Logo.scale-150.webp',
  '/assets/windows11/Square150x150Logo.scale-200.webp',
  '/assets/windows11/Square150x150Logo.scale-400.webp'
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
      .catch((error) => {
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
      !url.hostname.includes('api.openweathermap.org') &&
      !url.hostname.includes('maps.googleapis.com')) {
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
    // Images - cache first, fallback to network
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
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    throw error;
  }
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
    
  } catch (error) {
          // Background sync failed
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from TrakTick',
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
    self.registration.showNotification('TrakTick', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
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
self.addEventListener('error', (event) => {
      // Service Worker error
});

self.addEventListener('unhandledrejection', (event) => {
      // Unhandled promise rejection
}); 