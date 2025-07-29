import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { initializeIOSPWA, addIOSMetaTags } from './utils/iosPWA.js'
import { initializeAndroidPWA, initializeWindowsPWA, addPlatformMetaTags } from './utils/platformPWA.js'


initializeIOSPWA();
addIOSMetaTags();
initializeAndroidPWA();
initializeWindowsPWA();
addPlatformMetaTags();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              window.location.reload();
            }
          });
        });
      })
      .catch(() => {
        // Silent fail in production
      });
  });
}
