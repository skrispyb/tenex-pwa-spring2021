const cacheName = "v1";
const urlsToCache = ["/index.html?source=pwa"];

self.addEventListener("install", (event) => {
  //   console.log(`Event fired: ${event.type}`);
  //   console.dir(event);
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      // console.log(cache);
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  //   console.log(`Event fired: ${event.type}`);
  //   console.dir(event);
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  //   console.log(`Fetching ${event.request.url}`);

  // Cache first then network but also update cache
  event.respondWith(
    (async () => {
      const res = await caches.match(event.request);
      // fetch(event.request).then(async (response) => {
      //   const newCache = await caches.open(cacheName);
      //   newCache.put(event.request, response.clone());
      // });
      if (res) {
        return res;
      } else {
        const response = await fetch(event.request);
        const newCache = await caches.open(cacheName);
        // if (event.request.url have images)
        if (event.request.method === "GET") {
          newCache.put(event.request, response.clone());
        }
        return response;
      }
    })()
  );

  // Cache first then network
  // event.respondWith(
  //   caches.match( event.request ).then( (response) => {
  //     return response || fetch( event.request);
  //   })
  // );

  // Network first then cache
  // event.respondWith(
  //   fetch(event.request).catch(function() {
  //     return caches.match(event.request);
  //   })
  // );
});
