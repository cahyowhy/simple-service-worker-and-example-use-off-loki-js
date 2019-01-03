/*
 *  setiap ada perubahan ubah
 *  pada cacheVersion
 *  supaya browser tahu bahwa
 *  ada perubahan terbaru
 */
const cacheVersion = "try-in-mem-js-27";
const filesToCache = [
  "/",
  "/assets/images/icon-144x144.png",
  "/assets/images/bulma-logo.png",
  "/index.html",
  "/favicon.ico",
  "/users.html",
  "/assets/css/bulma.min.css",
  "/assets/css/main.css",
  "/assets/js/jquery.min.js",
  "/assets/js/loki.min.js",
  "/assets/js/index-page.js",
  "/assets/js/users-page.js",
  "/assets/js/Main.js"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(cacheVersion).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (res) {
      if (res) return res;

      return fetch(event.request);
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (cacheName) {
            return cacheName !== cacheVersion;
          })
          .map(function (cacheName) {
            caches.delete(cacheName);
          })
      );
    })
  );
});

self.addEventListener("message", function (event) {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
