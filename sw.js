// const cacheName = "v1";
// const urlsToCache = [
//   "/",
//   "/index.html",
//   "/index.html?source=pwa",
//   "/assets/js/onboarding.js",
//   "/style.css",
//   "/notificationHome.html",
//   "/assets/js/notificationHome.js",
//   "newRequestRequest.html",
//   "/assets/js/newRequestRequest.js",
//   "/calendar.html",
//   "/assets/js/calendar.js",
//   "/assets/fonts/futura_medium_bt.ttf",
//   "/assets/fonts/SFProDisplayRegular.ttf",
//   "/assets/fonts/SFProDisplaySemibold.ttf",
// ];

self.addEventListener("install", (event) => {
  console.log(`Event fired: ${event.type}`);
  console.dir(event);
//   event.waitUntil(
//     caches.open(cacheName).then((cache) => {
//       return cache.addAll(urlsToCache);
//     })
//   );
});

self.addEventListener("activate", (event) => {
  console.log(`Event fired: ${event.type}`);
  console.dir(event);
    // event.waitUntil(
    //   caches.keys().then((keyList) => {
    //     return Promise.all(
    //       keyList.map((key) => {
    //         if (key !== cacheName) {
    //           return caches.delete(key);
    //         }
    //       })
    //     );
    //   })
    // );
});

self.addEventListener("fetch", (event) => {
  console.log(`Fetching ${event.request.url}`);
//   event.respondWith(
//     (async () => {
//       const req = await caches.match(event.request);
//       if (req) {
//         return req;
//       }
//       const response = await fetch(event.request);
//       const newCache = await caches.open(cacheName);
//       newCache.put(event.request, response.clone());
//       return response;
//     })()
//   );
});
