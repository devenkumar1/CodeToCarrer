// Register service worker
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    // Only register service worker in production
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Service Worker registration skipped in development environment');
      return;
    }
    
    window.addEventListener('load', function() {
      const swUrl = '/sw.js';
      
      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('Service Worker registration successful with scope:', registration.scope);
        })
        .catch(err => {
          console.error('Service Worker registration failed:', err);
        });
    });

    // Add event listeners for online/offline status
    window.addEventListener('online', () => {
      console.log('Application is online');
    });
    
    window.addEventListener('offline', () => {
      console.log('Application is offline');
    });
  }
} 