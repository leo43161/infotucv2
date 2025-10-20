const CACHE_NAME = 'infotuc-v1';
const STATIC_CACHE = 'infotuc-static-v1';
const API_CACHE = 'infotuc-api-v1';

const STATIC_ASSETS = [
  '/infotuc/?lang=ES', // Página de inicio
  '/infotuc/?lang=EN', // Página de inicio
  '/infotuc/', // Página de inicio
  '/infotuc/transportes',
  '/infotuc/actividades',
  '/infotuc/restaurantes',
  '/infotuc/alojamientos',
  '/infotuc/agencias',
  '/infotuc/autos',
  '/infotuc/itinerario',
  '/infotuc/mapas',
  '/infotuc/transportes?lang=EN',
  '/infotuc/actividades?lang=EN',
  '/infotuc/restaurantes?lang=EN',
  '/infotuc/alojamientos?lang=EN',
  '/infotuc/agencias?lang=EN',
  '/infotuc/autos?lang=EN',
  '/infotuc/itinerario?lang=EN',
  '/infotuc/mapas?lang=EN',
  '/infotuc/transportes?lang=ES',
  '/infotuc/actividades?lang=ES',
  '/infotuc/restaurantes?lang=ES',
  '/infotuc/alojamientos?lang=ES',
  '/infotuc/agencias?lang=ES',
  '/infotuc/autos?lang=ES',
  '/infotuc/itinerario?lang=ES',
  '/infotuc/mapas?lang=ES',
  '/infotuc/img/mapas/jesuita.png',
  '/infotuc/img/mapas/alchaqui-2025.png',
  '/infotuc/img/mapas/yungas-2025.png',
  '/infotuc/img/mapas/azucar-2025.png',
  '/infotuc/img/mapas/sur-2025.png',
  '/infotuc/img/mapas/historica-2025.png',
  '/infotuc/img/mapas/choromoro-2025.png',
  '/infotuc/img/mapas/rural2.png',
  '/infotuc/img/mapas/rural1.png',
];

// INSTALL: Precarga de archivos estáticos
self.addEventListener('install', (event) => {
  console.log(caches);
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Precargando archivos estáticos...');
      console.log(STATIC_ASSETS);
      console.log(cache);
      return cache.addAll(STATIC_ASSETS);
    })
  );
  console.log("caches");
  console.log(caches);
  self.skipWaiting();
});

// ACTIVATE: Limpieza de cachés antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (![STATIC_CACHE, API_CACHE].includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// FETCH: Estrategias de caché
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (!request.url.startsWith('http')) {
    return; // Deja que el navegador maneje estas peticiones por su cuenta
  }
  const url = new URL(request.url);

  // Estrategia para archivos estáticos: Cache First
  if (
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image'
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Estrategia para API: Network First con fallback
  if (url.origin === 'https://www.tucumanturismo.gob.ar/') {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }
});

// Estrategia Cache First
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}
// Nueva Estrategia Stale-While-Revalidate
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  // Retorna el caché de inmediato si existe, si no, espera a la red.
  // La promesa de red se ejecuta en segundo plano de todas formas.
  return cachedResponse || fetchPromise;
}

// Estrategia Network First
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}