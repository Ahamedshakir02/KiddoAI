// registerSW.js - Registers the service worker to support offline and quick caching

export function register() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('PWA ServiceWorker registered successfully: ', registration.scope);
        })
        .catch((error) => {
          console.error('PWA ServiceWorker registration failed: ', error);
        });
    });
  }
}
