// Platform-specific PWA utilities for Android and Windows
// iOS functionality is handled separately in iosPWA.js

/**
 * Detect the current platform
 */
export function detectPlatform() {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform;
  
  return {
    isAndroid: /android/.test(userAgent),
    isWindows: /windows/.test(userAgent) || platform === 'Win32',
    isIOS: /ipad|iphone|ipod/.test(userAgent) || 
           (platform === 'MacIntel' && navigator.maxTouchPoints > 1),
    isChrome: /chrome/.test(userAgent) && !/edge/.test(userAgent),
    isEdge: /edge/.test(userAgent),
    isFirefox: /firefox/.test(userAgent),
    isSafari: /safari/.test(userAgent) && !/chrome/.test(userAgent),
    isStandalone: window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches
  };
}

/**
 * Initialize Android-specific PWA features
 */
export function initializeAndroidPWA() {
  const platform = detectPlatform();
  
  if (!platform.isAndroid) return;

  // Add Android-specific classes
  document.body.classList.add('android-device');
  
  if (platform.isStandalone) {
    document.body.classList.add('android-standalone');
    setupAndroidStandaloneMode();
  }
  
  // Setup Android-specific features
  setupAndroidTouchHandling();
  setupAndroidKeyboardHandling();
  setupAndroidStatusBar();
  setupAndroidBackButton();
  setupAndroidSwipeGestures();
}

/**
 * Initialize Windows-specific PWA features
 */
export function initializeWindowsPWA() {
  const platform = detectPlatform();
  
  if (!platform.isWindows) return;

  // Add Windows-specific classes
  document.body.classList.add('windows-device');
  
  if (platform.isStandalone) {
    document.body.classList.add('windows-standalone');
    setupWindowsStandaloneMode();
  }
  
  // Setup Windows-specific features
  setupWindowsTouchHandling();
  setupWindowsKeyboardShortcuts();
  setupWindowsSystemIntegration();
}

/**
 * Setup Android standalone mode
 */
function setupAndroidStandaloneMode() {
  // Prevent pull-to-refresh in standalone mode
  document.body.style.overscrollBehavior = 'none';
  
  // Add Android-specific styles
  const style = document.createElement('style');
  style.textContent = `
    .android-standalone {
      /* Android-specific standalone styles */
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    
    .android-standalone .app-content {
      height: 100vh;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
    }
    
    /* Android status bar integration */
    .android-status-bar {
      background: var(--status-bar-bg, #000);
      color: var(--status-bar-color, #fff);
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 500;
    }
    
    /* Android navigation bar spacing */
    .android-nav-bar-spacing {
      padding-bottom: env(safe-area-inset-bottom);
    }
  `;
  document.head.appendChild(style);
}

/**
 * Setup Windows standalone mode
 */
function setupWindowsStandaloneMode() {
  // Add Windows-specific styles
  const style = document.createElement('style');
  style.textContent = `
    .windows-standalone {
      /* Windows-specific standalone styles */
      background: var(--windows-bg, #f3f4f6);
    }
    
    .windows-standalone .app-content {
      height: 100vh;
      overflow-y: auto;
    }
    
    /* Windows accent color support */
    .windows-accent {
      background: var(--windows-accent-color, #0078d4);
      color: white;
    }
    
    /* Windows system font */
    .windows-font {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Setup Android touch handling
 */
function setupAndroidTouchHandling() {
  // Android-specific touch optimizations
  let lastTouchEnd = 0;
  
  document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
  
  // Android ripple effect simulation
  document.addEventListener('touchstart', (event) => {
    if (event.target.tagName === 'BUTTON' || event.target.closest('button')) {
      event.target.classList.add('android-ripple');
    }
  });
  
  document.addEventListener('touchend', (event) => {
    if (event.target.tagName === 'BUTTON' || event.target.closest('button')) {
      setTimeout(() => {
        event.target.classList.remove('android-ripple');
      }, 200);
    }
  });
}

/**
 * Setup Windows touch handling
 */
function setupWindowsTouchHandling() {
  // Windows-specific touch optimizations
  document.addEventListener('touchstart', (event) => {
    if (event.target.tagName === 'BUTTON' || event.target.closest('button')) {
      event.target.classList.add('windows-touch-active');
    }
  });
  
  document.addEventListener('touchend', (event) => {
    if (event.target.tagName === 'BUTTON' || event.target.closest('button')) {
      event.target.classList.remove('windows-touch-active');
    }
  });
}

/**
 * Setup Android keyboard handling
 */
function setupAndroidKeyboardHandling() {
  let initialViewportHeight = window.innerHeight;
  
  window.addEventListener('resize', () => {
    const currentHeight = window.innerHeight;
    const heightDifference = initialViewportHeight - currentHeight;
    
    if (heightDifference > 150) {
      document.body.classList.add('android-keyboard-visible');
      document.body.style.height = `${currentHeight}px`;
    } else {
      document.body.classList.remove('android-keyboard-visible');
      document.body.style.height = '';
    }
  });
  
  // Prevent zoom on input focus (Android Chrome)
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      if (parseInt(window.getComputedStyle(input).fontSize) < 16) {
        input.style.fontSize = '16px';
      }
    });
  });
}

/**
 * Setup Windows keyboard shortcuts
 */
function setupWindowsKeyboardShortcuts() {
  document.addEventListener('keydown', (event) => {
    // Ctrl+N for new timer
    if (event.ctrlKey && event.key === 'n') {
      event.preventDefault();
      window.location.href = '/timer';
    }
    
    // Ctrl+S for stopwatch
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      window.location.href = '/stopwatch';
    }
    
    // Ctrl+W for world clock
    if (event.ctrlKey && event.key === 'w') {
      event.preventDefault();
      window.location.href = '/world-clock';
    }
    
    // F11 for fullscreen
    if (event.key === 'F11') {
      event.preventDefault();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  });
}

/**
 * Setup Android status bar
 */
function setupAndroidStatusBar() {
  // Update status bar color based on theme
  const updateStatusBarColor = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const color = isDark ? '#000000' : '#ffffff';
    
    // Update theme-color meta tag
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta');
      themeColorMeta.name = 'theme-color';
      document.head.appendChild(themeColorMeta);
    }
    themeColorMeta.content = color;
  };
  
  // Listen for theme changes
  window.addEventListener('themeChange', updateStatusBarColor);
  
  // Initial setup
  updateStatusBarColor();
}

/**
 * Setup Android back button
 */
function setupAndroidBackButton() {
  // Handle Android back button
  window.addEventListener('popstate', () => {
    // Custom back button handling if needed
            // Back button pressed
  });
  
  // Add back button support for navigation
  if ('navigation' in window) {
    window.navigation.addEventListener('navigate', () => {
      // Handle navigation events
    });
  }
}

/**
 * Setup Android swipe gestures
 */
function setupAndroidSwipeGestures() {
  let startX = 0;
  let startY = 0;
  
  document.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  });
  
  document.addEventListener('touchend', (event) => {
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    
    // Detect swipe gestures
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe right - could trigger back navigation
        // Swipe right detected
      } else {
        // Swipe left - could trigger forward navigation
        // Swipe left detected
      }
    }
  });
}

/**
 * Setup Windows system integration
 */
function setupWindowsSystemIntegration() {
  // Windows system integration features
  
  // Handle Windows accent color
  const updateWindowsAccentColor = () => {
    // Try to get Windows accent color from CSS custom properties
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--windows-accent-color')
      .trim() || '#0078d4';
    
    document.documentElement.style.setProperty('--windows-accent-color', accentColor);
  };
  
  // Update on theme change
  window.addEventListener('themeChange', updateWindowsAccentColor);
  
  // Initial setup
  updateWindowsAccentColor();
  
  // Windows-specific media queries
  const windowsStyle = document.createElement('style');
  windowsStyle.textContent = `
    @media (prefers-color-scheme: dark) {
      .windows-standalone {
        --windows-bg: #1f2937;
        --windows-accent-color: #60a5fa;
      }
    }
    
    @media (prefers-color-scheme: light) {
      .windows-standalone {
        --windows-bg: #f3f4f6;
        --windows-accent-color: #0078d4;
      }
    }
  `;
  document.head.appendChild(windowsStyle);
}

/**
 * Get platform-specific device information
 */
export function getPlatformDeviceInfo() {
  const platform = detectPlatform();
  const userAgent = navigator.userAgent;
  
  let deviceInfo = {
    platform: 'unknown',
    version: null,
    isStandalone: platform.isStandalone,
    hasTouch: 'ontouchstart' in window,
    hasKeyboard: 'onkeydown' in window
  };
  
  if (platform.isAndroid) {
    const match = userAgent.match(/Android\s([0-9.]*)/);
    deviceInfo.platform = 'android';
    deviceInfo.version = match ? match[1] : null;
  } else if (platform.isWindows) {
    const match = userAgent.match(/Windows NT\s([0-9.]*)/);
    deviceInfo.platform = 'windows';
    deviceInfo.version = match ? match[1] : null;
  } else if (platform.isIOS) {
    const match = userAgent.match(/OS\s([0-9_]*)/);
    deviceInfo.platform = 'ios';
    deviceInfo.version = match ? match[1].replace(/_/g, '.') : null;
  }
  
  return deviceInfo;
}

/**
 * Add platform-specific meta tags
 */
export function addPlatformMetaTags() {
  const platform = detectPlatform();
  
  if (platform.isAndroid) {
    // Android-specific meta tags
    const androidMetaTags = [
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'theme-color', content: '#ffffff' },
      { name: 'msapplication-TileColor', content: '#ffffff' },
      { name: 'msapplication-TileImage', content: '/assets/android/android-launchericon-192-192.webp' }
    ];
    
    androidMetaTags.forEach(tag => {
      let meta = document.querySelector(`meta[name="${tag.name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = tag.name;
        document.head.appendChild(meta);
      }
      meta.content = tag.content;
    });
  }
  
  if (platform.isWindows) {
    // Windows-specific meta tags
    const windowsMetaTags = [
      { name: 'msapplication-TileColor', content: '#ffffff' },
      { name: 'msapplication-TileImage', content: '/assets/windows11/Square150x150Logo.scale-100.webp' },
      { name: 'msapplication-config', content: '/browserconfig.xml' }
    ];
    
    windowsMetaTags.forEach(tag => {
      let meta = document.querySelector(`meta[name="${tag.name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = tag.name;
        document.head.appendChild(meta);
      }
      meta.content = tag.content;
    });
  }
}

/**
 * Handle platform-specific PWA installation
 */
export function handlePlatformPWAInstall() {
  const platform = detectPlatform();
  
  if (platform.isAndroid && !platform.isStandalone) {
    showAndroidInstallPrompt();
  } else if (platform.isWindows && !platform.isStandalone) {
    showWindowsInstallPrompt();
  }
}

/**
 * Show Android-specific install prompt
 */
function showAndroidInstallPrompt() {
  const prompt = document.createElement('div');
  prompt.className = 'android-install-prompt';
  prompt.innerHTML = `
    <div class="android-install-content">
      <h3>Install tractick</h3>
      <p>Tap the menu button <span class="android-menu-icon">⋮</span> and select "Add to Home screen"</p>
      <button onclick="this.parentElement.parentElement.remove()">Got it!</button>
    </div>
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    .android-install-prompt {
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
    
    .android-install-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px;
      text-align: center;
    }
    
    .android-menu-icon {
      font-size: 20px;
      color: #4285f4;
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(prompt);
}

/**
 * Show Windows-specific install prompt
 */
function showWindowsInstallPrompt() {
  const prompt = document.createElement('div');
  prompt.className = 'windows-install-prompt';
  prompt.innerHTML = `
    <div class="windows-install-content">
      <h3>Install tractick</h3>
      <p>Click the install button <span class="windows-install-icon">⬇</span> in your browser's address bar</p>
      <button onclick="this.parentElement.parentElement.remove()">Got it!</button>
    </div>
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    .windows-install-prompt {
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
    
    .windows-install-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px;
      text-align: center;
    }
    
    .windows-install-icon {
      font-size: 20px;
      color: #0078d4;
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(prompt);
} 