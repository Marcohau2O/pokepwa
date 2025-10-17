const CACHE_NAME = 'poke-pwa-cache-v2';
const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=20';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pokeball-192.png',
  '/pokeball-512.png'
];

self.addEventListener('install', event => {
  console.log('[SW] Instalado');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Activado');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.url.startsWith(API_URL)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request)
          .then(networkRes => {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(request, networkRes.clone());
              return networkRes;
            });
          })
          .catch(() => caches.match('/index.html'));
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      return (
        cached ||
        fetch(request)
          .then(networkRes => {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(request, networkRes.clone());
              return networkRes;
            });
          })
          .catch(() => caches.match('/index.html'))
      );
    })
  );
});
