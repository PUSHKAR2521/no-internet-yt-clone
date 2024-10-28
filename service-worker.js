// service-worker.js

const CACHE_NAME = 'site-static-v1';
const urlsToCache = [
    '/',
    '/styles.css',          // Cache CSS
    '/script.js',            // Cache main JavaScript
    '/offline.html'          // Custom offline page for the main content
];

// Install the Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event to serve cached content when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // If the request is cached, serve it; otherwise, fetch it from the network
            return response || fetch(event.request).catch(() => {
                // If fetching fails (offline), show offline message for main content
                if (event.request.mode === 'navigate') {
                    return caches.match('/offline.html');
                }
            });
        })
    );
});
