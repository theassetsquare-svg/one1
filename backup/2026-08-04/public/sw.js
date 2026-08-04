const CACHE = 'one1-3md-v1';
const ASSETS = [
  '/',
  '/info',
  '/hours',
  '/ladies',
  '/faq',
  '/contact',
  '/site.webmanifest',
  '/og/og-thumb.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(request).then((r) => r || caches.match('/')))
    );
    return;
  }
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
