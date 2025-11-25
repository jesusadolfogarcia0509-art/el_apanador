const CACHE_NAME = 'apana-te-v2'; // Cambiamos versión para forzar actualización
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './images/logo-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});