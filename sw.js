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
  // Cache first then network but also update cache
  event.respondWith(
    (async () => {
      const res = await caches.match(event.request);
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
});
