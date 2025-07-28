// iOS-specific PWA utilities and enhancements

/**
 * Initialize iOS-specific PWA features
 */
export function initializeIOSPWA() {
  // Check if running on iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  if (!isIOS) return;

  // Add iOS-specific classes to body
  document.body.classList.add('ios-device');
  
  // Handle iOS standalone mode
  if (window.navigator.standalone) {
    document.body.classList.add('ios-standalone');
    setupIOSStandaloneMode();
  }
  
  // Handle iOS safe areas
  setupIOSSafeAreas();
  
  // Handle iOS keyboard events
  setupIOSKeyboardHandling();
  
  // Handle iOS orientation changes
  setupIOSOrientationHandling();
  
  // Handle iOS touch events
  setupIOSTouchHandling();
}

/**
 * Setup iOS standalone mode specific features
 */
function setupIOSStandaloneMode() {
  // Prevent pull-to-refresh in standalone mode
  document.body.style.overscrollBehavior = 'none';
  
  // Add standalone-specific styles
  const style = document.createElement('style');
  style.textContent = `
    .ios-standalone {
      /* Prevent address bar from showing */
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    
    .ios-standalone .app-content {
      height: 100vh;
      height: -webkit-fill-available;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Setup iOS safe area handling
 */
function setupIOSSafeAreas() {
  // Add safe area CSS variables
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --safe-area-inset-top: env(safe-area-inset-top, 0px);
      --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
      --safe-area-inset-left: env(safe-area-inset-left, 0px);
      --safe-area-inset-right: env(safe-area-inset-right, 0px);
    }
    
    .ios-safe-top {
      padding-top: var(--safe-area-inset-top);
    }
    
    .ios-safe-bottom {
      padding-bottom: var(--safe-area-inset-bottom);
    }
    
    .ios-safe-left {
      padding-left: var(--safe-area-inset-left);
    }
    
    .ios-safe-right {
      padding-right: var(--safe-area-inset-right);
    }
    
    .ios-safe-all {
      padding: var(--safe-area-inset-top) var(--safe-area-inset-right) var(--safe-area-inset-bottom) var(--safe-area-inset-left);
    }
  `;
  document.head.appendChild(style);
}

/**
 * Setup iOS keyboard handling
 */
function setupIOSKeyboardHandling() {
  let initialViewportHeight = window.innerHeight;
  
  // Handle keyboard show/hide
  window.addEventListener('resize', () => {
    const currentHeight = window.innerHeight;
    const heightDifference = initialViewportHeight - currentHeight;
    
    if (heightDifference > 150) {
      // Keyboard is likely shown
      document.body.classList.add('ios-keyboard-visible');
      document.body.style.height = `${currentHeight}px`;
    } else {
      // Keyboard is likely hidden
      document.body.classList.remove('ios-keyboard-visible');
      document.body.style.height = '';
    }
  });
  
  // Handle input focus to prevent zoom
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      // Ensure font size is at least 16px to prevent zoom
      if (parseInt(window.getComputedStyle(input).fontSize) < 16) {
        input.style.fontSize = '16px';
      }
    });
  });
}

/**
 * Setup iOS orientation handling
 */
function setupIOSOrientationHandling() {
  // Handle orientation change
  window.addEventListener('orientationchange', () => {
    // Add orientation class to body
    const orientation = window.orientation === 0 ? 'portrait' : 'landscape';
    document.body.className = document.body.className.replace(/ios-orientation-\w+/g, '');
    document.body.classList.add(`ios-orientation-${orientation}`);
    
    // Trigger resize event after orientation change
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  });
  
  // Set initial orientation
  const initialOrientation = window.orientation === 0 ? 'portrait' : 'landscape';
  document.body.classList.add(`ios-orientation-${initialOrientation}`);
}

/**
 * Setup iOS touch handling
 */
function setupIOSTouchHandling() {
  // Prevent double-tap zoom
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
  
  // Add touch feedback classes
  document.addEventListener('touchstart', (event) => {
    if (event.target.tagName === 'BUTTON' || event.target.closest('button')) {
      event.target.classList.add('ios-touch-active');
    }
  });
  
  document.addEventListener('touchend', (event) => {
    if (event.target.tagName === 'BUTTON' || event.target.closest('button')) {
      event.target.classList.remove('ios-touch-active');
    }
  });
}

/**
 * Get iOS device information
 */
export function getIOSDeviceInfo() {
  const userAgent = navigator.userAgent;
  const isIPad = /iPad/.test(userAgent);
  const isIPhone = /iPhone/.test(userAgent);
  const isIPod = /iPod/.test(userAgent);
  const isIOS = isIPad || isIPhone || isIPod;
  
  if (!isIOS) return null;
  
  // Extract iOS version
  const match = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
  const version = match ? {
    major: parseInt(match[1]),
    minor: parseInt(match[2]),
    patch: match[3] ? parseInt(match[3]) : 0
  } : null;
  
  return {
    isIPad,
    isIPhone,
    isIPod,
    isIOS,
    version,
    isStandalone: window.navigator.standalone,
    hasNotch: isIPhone && version && version.major >= 11,
    hasHomeIndicator: isIPhone && version && version.major >= 11
  };
}

/**
 * Add iOS-specific meta tags dynamically
 */
export function addIOSMetaTags() {
  const deviceInfo = getIOSDeviceInfo();
  if (!deviceInfo) return;
  
  // Add dynamic meta tags based on device
  const metaTags = [
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'apple-mobile-web-app-title', content: 'tractick' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no' }
  ];
  
  metaTags.forEach(tag => {
    let meta = document.querySelector(`meta[name="${tag.name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = tag.name;
      document.head.appendChild(meta);
    }
    meta.content = tag.content;
  });
}

/**
 * Handle iOS PWA installation
 */
export function handleIOSPWAInstall() {
  // Show iOS-specific install prompt
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = window.navigator.standalone;
  
  if (isIOS && !isStandalone) {
    // Show iOS install instructions
    showIOSInstallPrompt();
  }
}

/**
 * Show iOS-specific install prompt
 */
function showIOSInstallPrompt() {
  const prompt = document.createElement('div');
  prompt.className = 'ios-install-prompt';
  prompt.innerHTML = `
    <div class="ios-install-content">
      <h3>Install tractick</h3>
      <p>Tap the share button <span class="ios-share-icon">⎋</span> and select "Add to Home Screen"</p>
      <button onclick="this.parentElement.parentElement.remove()">Got it!</button>
    </div>
  `;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .ios-install-prompt {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }
    
    .ios-install-content {
      background: white;
      padding: 20px;
      border-radius: 12px;
      margin: 20px;
      text-align: center;
    }
    
    .ios-share-icon {
      font-size: 20px;
      color: #007AFF;
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(prompt);
} 