export function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/infotucws/sw.js')
        .then((registration) => {
          console.log('SW registrado:', registration.scope);
        })
        .catch((error) => {
          console.error('Error al registrar SW:', error);
        });
    });
  }
}