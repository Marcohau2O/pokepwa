const CACHE_NAME = 'poke-api-cache-v1';
const API_URL = 'https://pokeapi.co/api/v2/pokemon';

self.addEventListener('install', event => {
  console.log('[SW] Instalado');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Activado');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }))
    )
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.url.startsWith(API_URL)) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          console.log('[SW] Usando caché:', request.url);
          return cachedResponse;
        }

        console.log('[SW] Fetching y cacheando:', request.url);
        return fetch(request).then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        }).catch(error => {
          console.error('[SW] Error en fetch:', error);
        });
      })
    );
  }
});
