import Hilo from './hilo';
import './style.css';

// We skip the service worker for localhost so we don't need
// to worry about clearing the cache during local development
if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
  // Once the caching service worker is installed the application
  // can be loaded offline; files are served from the worker
  navigator.serviceWorker.register('service-worker.js');
}

// Passing-in a reference to window and body makes it
// a bit easier to add tests later if you want
new Hilo(window, document.body);
