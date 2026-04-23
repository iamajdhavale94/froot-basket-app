const cacheName = "fruitbasket-cache-v1";

const filesToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./fruits.json",
  "./manifest.json",
  "./assets/logo.jpg",
  "./assets/bg.jpg",
  "./assets/upi-qr.jpeg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then(async (cache) => {
      for (const file of filesToCache) {
        try {
          await cache.add(file);
        } catch (err) {
          console.log("Failed to cache:", file);
        }
      }
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
