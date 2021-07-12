var CACHE_NAME = 'my-site-cache-v4';
var urlsToCache = [
    // '/',
    // '/assets/css/main.css',
    // '/assets/img/book.png',
    // '/assets/js/main.js',
    '/assets/icons/1.svg'
];


//Install a service worker

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache..');
            return cache.addAll(urlsToCache);
        })
    );
});

// Cache and return requests

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            // Cache hit - return response
            if (response) {
                return response;
            }

            return fetch(event.request).then(response => {

                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic' || response) {
                    return response;
                }

                var responseToCache = response.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseToCache);
                    });

                return response;

            });
        })
    );
});

self.addEventListener('activate', function(event) {

    var cacheAllowlist = ['my-site-cache-v4'];

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    console.log(cacheName, cacheAllowlist.indexOf(cacheName) === -1)
                    if (cacheAllowlist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});