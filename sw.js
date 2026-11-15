const CACHE_NAME = 'ds-demo-app-v10';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/stack.html',
  '/queue.html',
  '/linkedlist.html',
  '/hanoi.html',
  '/dsa-lab.html',
  '/manifest.json?v=10',
  '/assets/profile/naveen-profile.png',
  '/assets/icons/app-icon.png?v=10',
  '/assets/icons/icon-192.png?v=10',
  '/assets/icons/icon-512.png?v=10',
  '/assets/icons/apple-touch-icon.png?v=10',
  '/assets/icons/favicon-64.png?v=10',
  '/assets/icons/favicon-32.png?v=10'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() =>
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        })
      )
  );
});
