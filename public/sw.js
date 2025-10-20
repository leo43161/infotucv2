const CACHE_NAME = 'infotucws-v1';
const STATIC_CACHE = 'infotucws-static-v1';
const API_CACHE = 'infotucws-api-v1';

const STATIC_ASSETS = [
  '/infotucws/?lang=ES', // Página de inicio
  '/infotucws/?lang=EN', // Página de inicio
  '/infotucws/', // Página de inicio
  '/infotucws/transportes',
  '/infotucws/actividades',
  '/infotucws/restaurantes',
  '/infotucws/alojamientos',
  '/infotucws/agencias',
  '/infotucws/autos',
  '/infotucws/itinerario',
  '/infotucws/mapas',
  '/infotucws/transportes?lang=EN',
  '/infotucws/actividades?lang=EN',
  '/infotucws/restaurantes?lang=EN',
  '/infotucws/alojamientos?lang=EN',
  '/infotucws/agencias?lang=EN',
  '/infotucws/autos?lang=EN',
  '/infotucws/itinerario?lang=EN',
  '/infotucws/mapas?lang=EN',
  '/infotucws/transportes?lang=ES',
  '/infotucws/actividades?lang=ES',
  '/infotucws/restaurantes?lang=ES',
  '/infotucws/alojamientos?lang=ES',
  '/infotucws/agencias?lang=ES',
  '/infotucws/autos?lang=ES',
  '/infotucws/itinerario?lang=ES',
  '/infotucws/mapas?lang=ES',
  '/public/jesuita.png',
  '/public/alchaqui-2025.png',
  '/public/yungas-2025.png',
  '/public/azucar-2025.png',
  '/public/sur-2025.png',
  '/public/historica-2025.png',
  '/public/choromoro-2025.png',
  '/public/rural2.png',
  '/public/rural1.png',
];

// INSTALL: Precarga de archivos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
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
  if (url.origin === 'https://www.tucumanturismo.gob.ar') {
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