// Register service worker
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    // Only register service worker in production
    if (process.env.NODE_ENV !== 'production') {
      console.log('Service Worker registration skipped in development environment');
      return;
    }
    
    // Wait until the page is fully loaded
    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW);
    }
    
    // Add event listeners for online/offline status
    window.addEventListener('online', () => {
      console.log('Application is online');
    });
    
    window.addEventListener('offline', () => {
      console.log('Application is offline');
    });
  }
}

function registerSW() {
  const swUrl = '/sw.js';
  
  navigator.serviceWorker.register(swUrl, {
    scope: '/',
  })
    .then(registration => {
      console.log('Service Worker registration successful with scope:', registration.scope);
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New content is available; please refresh.');
            }
          });
        }
      });
    })
    .catch(err => {
      console.error('Service Worker registration failed:', err);
    });
} 