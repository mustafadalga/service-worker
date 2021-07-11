var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    '/',
    '/assets/css/main.css',
    '/assets/img/book.png',
    '/assets/js/main.js'
];


//Install a service worker

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

// Cache and return requests

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            console.log(response)
                // Cache hit - return response
            if (response) {
                return response;
            }
            console.log(event, 2)

            return fetch(event.request);
        })
    );
});