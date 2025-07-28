// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { initializeIOSPWA, addIOSMetaTags } from './utils/iosPWA.js'
import { initializeAndroidPWA, initializeWindowsPWA, addPlatformMetaTags } from './utils/platformPWA.js'


// Initialize platform-specific PWA features
// iOS takes priority - initialize first
initializeIOSPWA();
addIOSMetaTags();

// Initialize Android and Windows features (won't interfere with iOS)
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

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available - auto reload
              window.location.reload();
            }
          });
        });
      })
      .catch((registrationError) => {
        // Silent fail in production
      });
  });
}
