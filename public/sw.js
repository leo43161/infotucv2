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
  '/infotuc/img/mapas/jesuita.jpg',
  '/infotuc/img/mapas/calchaqui-2025.jpg',
  '/infotuc/img/mapas/yungas-2025.jpg',
  '/infotuc/img/mapas/azucar-2025.jpg',
  '/infotuc/img/mapas/sur-2025.jpg',
  '/infotuc/img/mapas/historica-2025.jpg',
  '/infotuc/img/mapas/choromoro-2025.jpg',
  '/infotuc/img/mapas/rural2.jpg',
  '/infotuc/img/mapas/rural1.jpg',
];

async function precacheAssets() {
  const cache = await caches.open(STATIC_CACHE);
  console.log('[SW] Instalando y precargando assets...');

  // Promesa robusta: si falla una imagen, no cancela la instalación del SW
  const promises = STATIC_ASSETS.map(asset =>
    cache.add(asset).catch(err => console.warn(`[SW] Fallo precarga: ${asset}`, err))
  );

  await Promise.all(promises);
}

// INSTALL: Precarga de archivos estáticos
self.addEventListener('install', (event) => {
  // Usamos la nueva función robusta
  event.waitUntil(precacheAssets());
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
  const url = new URL(request.url);

  // Ignorar cosas que no sean HTTP (ej: chrome-extension://)
  if (!request.url.startsWith('http')) return;

  // Ignorar llamadas de Hot Module Replacement (HMR) en desarrollo
  // Esto evita errores en consola como el que mencionaste antes
  if (url.pathname.includes('webpack-hmr') || request.url.includes('hot-update')) {
    return;
  }

  // 1. ESTRATEGIA PARA HTML (Navegación) -> Network First
  // Queremos que el usuario vea siempre la última versión de la página.
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(networkFirst(request, STATIC_CACHE));
    return;
  }

  // 2. ESTRATEGIA PARA ASSETS (CSS, JS, Fuentes, Imágenes) -> Stale While Revalidate
  // Carga instantánea desde caché, pero actualiza en background para la próxima visita.
  if (['script', 'style', 'image', 'font'].includes(request.destination)) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  // 3. ESTRATEGIA PARA API -> Network First
  // Prioriza datos frescos de tu API.
  if (url.origin === 'https://www.tucumanturismo.gob.ar' || url.pathname.startsWith('/api')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // 4. Default -> Cache First (para cualquier otra cosa estática)
  event.respondWith(cacheFirst(request, STATIC_CACHE));
});

// Estrategia Cache First
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  return cached || fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  });
}

// Nueva Estrategia Stale-While-Revalidate
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Lanzamos la petición a red en paralelo para actualizar el caché futuro
  const fetchPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Si falla la actualización en background, no pasa nada, ya entregamos el caché
  });

  // Si hay caché, devuélvelo YA. Si no, espera al fetch.
  return cachedResponse || fetchPromise;
}

// Estrategia Network First
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    // Intentamos red
    const response = await fetch(request);
    // Si la respuesta es válida (200), la guardamos
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Si falla la red, vamos al caché
    const cached = await cache.match(request);

    if (cached) return cached;

    // Si no hay caché y es navegación, podríamos devolver una página offline.html
    // if (request.mode === 'navigate') { return cache.match('/infotuc/offline.html'); }

    return new Response('Sin conexión', { status: 503, statusText: 'Offline' });
  }
}