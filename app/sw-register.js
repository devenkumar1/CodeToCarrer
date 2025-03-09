// Register service worker
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {

    
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