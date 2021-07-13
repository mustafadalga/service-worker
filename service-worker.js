const expectedCaches = ['static-v3'];

self.addEventListener('install', event => {
    console.log('V2 installing…');
    self.skipWaiting(); //Skip the waiting phase


    // cache a horse SVG into a new cache, static-v2
    event.waitUntil(
        caches.open(expectedCaches[0]).then(cache => cache.add('/assets/img/cat.jpeg'))
    );
});

self.addEventListener('activate', event => {
    // delete any caches that aren't in expectedCaches
    // which will get rid of static-v1
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                console.log(key)
                if (!expectedCaches.includes(key)) {
                    return caches.delete(key);
                }
            })
        )).then(() => {
            console.log('V2 now ready to handle fetches!');
        })
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // serve the horse SVG from the cache if the request is
    // same-origin and the path is '/dog.s
    console.log(url)
    if (url.origin == location.origin && url.pathname == '/assets/img/people.png') {
        event.respondWith(caches.match('/assets/img/cat.jpeg'));
    }
});

self.caches.c