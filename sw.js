const CACHE_NAME = 'bustalk-discrecional-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json?v=4',
  './icono-192.png',
  './icono-512.png'
];

// Instalación y almacenamiento en caché de los nuevos archivos e iconos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activación: Borra las cachés antiguas de raíz para evitar conflictos de iconos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de red en tiempo real para la base de datos de tráfico
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
