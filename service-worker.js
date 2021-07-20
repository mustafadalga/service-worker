const cacheVersion = 'v1.0.5';

self.addEventListener('install', event => {
    console.log('installing…');
    event.waitUntil(
       caches.open(cacheVersion).then(cache => cache.add('/assets/js/main.js'))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                console.log(key)
                if (!cacheVersion.includes(key)) {
                    return caches.delete(key);
                }
            })
        ))
    );
});



// https://developers.google.com/web/fundamentals/primers/service-workers#cache_and_return_requests

self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url);
    if (url.origin == location.origin && url.pathname == '/assets/js/main.js') {

        event.respondWith(
            caches.match(event.request)
              .then(function(response) {
                // Cache hit - return response
                if (response) {
                  return response;
                }
        
                return fetch(event.request).then(
                  function(response) {
                    // Check if we received a valid response
                    if(!response || response.status !== 200 || response.type !== 'basic') {
                      return response;
                    }
        
                    // IMPORTANT: Clone the response. A response is a stream
                    // and because we want the browser to consume the response
                    // as well as the cache consuming the response, we need
                    // to clone it so we have two streams.
                    var responseToCache = response.clone();
        
                    caches.open(cacheVersion)
                      .then(function(cache) {
                        cache.put(event.request, responseToCache);
                      });
        
                    return response;
                  }
                );
              })
            );

    }
   
  });


// self.addEventListener('fetch',  async (event) =>{
//   const url = new URL(event.request.url);
//   if (url.origin == location.origin && url.pathname == '/assets/js/main.js') {

//     // if cache data has , return cache data
//     const cacheResponse=event.respondWith(caches.match('/assets/js/main.js'));
//     console.log(cacheResponse,11111)
//     if (cacheResponse)return cacheResponse;//if has cache data

//     const response=await fetch(event.request);
//     if(!response || response.status !== 200 || response.type !== 'basic') {
//       return response;
//     }

//     //Added response to cache and return response
//     var responseToCache = response.clone();
//     const cache=await caches.open(cacheVersion);
//     cache.put(event.request,responseToCache);
//     return response;

//   }
// })



  self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
      console.log("yüklendi")
      self.skipWaiting();
    }
  });


  