// PWA Audit Utility - Comprehensive PWA best practices validation

/**
 * PWA Audit Results
 */
export class PWAAuditResult {
  constructor() {
    this.score = 0
    this.maxScore = 100
    this.checks = []
    this.errors = []
    this.warnings = []
    this.recommendations = []
  }

  addCheck(name, passed, weight = 1, details = '') {
    this.checks.push({ name, passed, weight, details })
    if (passed) {
      this.score += weight
    }
  }

  addError(message) {
    this.errors.push(message)
  }

  addWarning(message) {
    this.warnings.push(message)
  }

  addRecommendation(message) {
    this.recommendations.push(message)
  }

  getScore() {
    return Math.round((this.score / this.maxScore) * 100)
  }

  getGrade() {
    const score = this.getScore()
    if (score >= 90) return 'A+'
    if (score >= 80) return 'A'
    if (score >= 70) return 'B'
    if (score >= 60) return 'C'
    if (score >= 50) return 'D'
    return 'F'
  }
}

/**
 * Comprehensive PWA Audit
 */
export async function auditPWA() {
  const result = new PWAAuditResult()
  
  // Core PWA Checks
  await checkManifest(result)
  await checkServiceWorker(result)
  await checkHTTPS(result)
  await checkResponsiveDesign(result)
  await checkOfflineFunctionality(result)
  
  // Performance Checks
  await checkPerformance(result)
  await checkCaching(result)
  
  // User Experience Checks
  await checkInstallability(result)
  await checkAccessibility(result)
  await checkCrossBrowserCompatibility(result)
  
  // Platform-Specific Checks
  await checkIOSOptimizations(result)
  await checkAndroidOptimizations(result)
  await checkWindowsOptimizations(result)
  
  // Security Checks
  await checkSecurityHeaders(result)
  await checkContentSecurityPolicy(result)
  
  return result
}

/**
 * Check Web App Manifest
 */
async function checkManifest(result) {
  try {
    const manifestResponse = await fetch('/manifest.webmanifest')
    if (!manifestResponse.ok) {
      result.addError('Manifest file not found or not accessible')
      return
    }

    const manifest = await manifestResponse.json()
    
    // Required fields
    result.addCheck('Manifest has name', !!manifest.name, 2)
    result.addCheck('Manifest has short_name', !!manifest.short_name, 2)
    result.addCheck('Manifest has start_url', !!manifest.start_url, 2)
    result.addCheck('Manifest has display', !!manifest.display, 2)
    result.addCheck('Manifest has theme_color', !!manifest.theme_color, 1)
    result.addCheck('Manifest has background_color', !!manifest.background_color, 1)
    
    // Icons
    if (manifest.icons && manifest.icons.length > 0) {
      result.addCheck('Manifest has icons', true, 3)
      
      const has192Icon = manifest.icons.some(icon => 
        icon.sizes === '192x192' || icon.sizes === '192x192'
      )
      const has512Icon = manifest.icons.some(icon => 
        icon.sizes === '512x512' || icon.sizes === '512x512'
      )
      
      result.addCheck('Has 192x192 icon', has192Icon, 2)
      result.addCheck('Has 512x512 icon', has512Icon, 2)
      
      // Check for maskable icons
      const hasMaskableIcons = manifest.icons.some(icon => 
        icon.purpose && icon.purpose.includes('maskable')
      )
      result.addCheck('Has maskable icons', hasMaskableIcons, 2)
    } else {
      result.addError('Manifest missing icons')
    }
    
    // Screenshots
    if (manifest.screenshots && manifest.screenshots.length > 0) {
      result.addCheck('Manifest has screenshots', true, 2)
    } else {
      result.addWarning('Manifest missing screenshots for better install experience')
    }
    
    // Categories
    if (manifest.categories && manifest.categories.length > 0) {
      result.addCheck('Manifest has categories', true, 1)
    }
    
    // Protocol handlers
    if (manifest.protocol_handlers && manifest.protocol_handlers.length > 0) {
      result.addCheck('Manifest has protocol handlers', true, 2)
    }
    
    // Shortcuts
    if (manifest.shortcuts && manifest.shortcuts.length > 0) {
      result.addCheck('Manifest has shortcuts', true, 2)
    }
    
  } catch (error) {
    result.addError(`Manifest check failed: ${error.message}`)
  }
}

/**
 * Check Service Worker
 */
async function checkServiceWorker(result) {
  if ('serviceWorker' in navigator) {
    result.addCheck('Service Worker supported', true, 3)
    
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        result.addCheck('Service Worker registered', true, 5)
        result.addCheck('Service Worker active', registration.active !== null, 3)
      } else {
        result.addError('Service Worker not registered')
      }
    } catch (error) {
      result.addError(`Service Worker check failed: ${error.message}`)
    }
  } else {
    result.addError('Service Worker not supported')
  }
}

/**
 * Check HTTPS
 */
async function checkHTTPS(result) {
  const isHTTPS = window.location.protocol === 'https:'
  
  result.addCheck('HTTPS enabled', isHTTPS, 5)
  
  if (!isHTTPS) {
    result.addError('PWA requires HTTPS')
  }
}

/**
 * Check Responsive Design
 */
async function checkResponsiveDesign(result) {
  const viewport = document.querySelector('meta[name="viewport"]')
  if (viewport) {
    result.addCheck('Viewport meta tag present', true, 2)
    
    const content = viewport.getAttribute('content')
    if (content && content.includes('width=device-width')) {
      result.addCheck('Responsive viewport configured', true, 2)
    }
  } else {
    result.addError('Viewport meta tag missing')
  }
  
  // Check for responsive CSS
  const styleSheets = Array.from(document.styleSheets)
  const hasResponsiveCSS = styleSheets.some(sheet => {
    try {
      return sheet.cssRules && Array.from(sheet.cssRules).some(rule => 
        rule.media && (rule.media.mediaText.includes('max-width') || rule.media.mediaText.includes('min-width'))
      )
    } catch (e) {
      return false
    }
  })
  
  result.addCheck('Responsive CSS present', hasResponsiveCSS, 2)
}

/**
 * Check Offline Functionality
 */
async function checkOfflineFunctionality(result) {
  // Check if app works offline
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration && registration.active) {
        // Test offline functionality
        const offlineResponse = await fetch('/offline.html')
        if (offlineResponse.ok) {
          result.addCheck('Offline page available', true, 3)
        } else {
          result.addWarning('Offline page not found')
        }
      }
    } catch (error) {
      result.addWarning('Could not verify offline functionality')
    }
  }
  
  // Check for offline indicators - improved detection
  const hasOfflineIndicator = document.querySelector('[data-offline]') !== null ||
                             document.querySelector('[role="status"][aria-label*="network"]') !== null ||
                             document.querySelector('[aria-live="polite"]') !== null
  result.addCheck('Offline indicator present', hasOfflineIndicator, 1)
}

/**
 * Check Performance
 */
async function checkPerformance(result) {
  // Check for performance optimizations
  const hasPreload = document.querySelectorAll('link[rel="preload"]').length > 0
  const hasPrefetch = document.querySelectorAll('link[rel="prefetch"]').length > 0
  const hasPreconnect = document.querySelectorAll('link[rel="preconnect"]').length > 0
  
  result.addCheck('Resource preloading', hasPreload || hasPrefetch || hasPreconnect, 2)
  
  // Check for critical CSS inline
  const hasCriticalCSS = document.querySelector('style') !== null ||
                        document.querySelector('style[data-critical]') !== null
  result.addCheck('Critical CSS inline', hasCriticalCSS, 1)
  
  // Check for image optimization
  const images = document.querySelectorAll('img')
  const optimizedImages = Array.from(images).filter(img => 
    img.src.includes('.webp') || img.src.includes('.avif') || img.hasAttribute('loading')
  )
  
  if (images.length > 0) {
    const optimizationRatio = optimizedImages.length / images.length
    result.addCheck('Image optimization', optimizationRatio > 0.5, 2)
  }
}

/**
 * Check Caching
 */
async function checkCaching(result) {
  if ('caches' in window) {
    result.addCheck('Cache API supported', true, 2)
    
    try {
      const cacheNames = await caches.keys()
      if (cacheNames.length > 0) {
        result.addCheck('Caching implemented', true, 3)
      } else {
        result.addWarning('No caches found')
      }
    } catch (error) {
      result.addWarning('Could not verify caching')
    }
  } else {
    result.addWarning('Cache API not supported')
  }
}

/**
 * Check Installability
 */
async function checkInstallability(result) {
  // Check for install prompt support
  if ('BeforeInstallPromptEvent' in window) {
    result.addCheck('Install prompt supported', true, 3)
  } else {
    result.addWarning('Install prompt not supported')
  }
  
  // Check for standalone mode - improved detection
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                      window.matchMedia('(display-mode: window-controls-overlay)').matches ||
                      window.navigator.standalone ||
                      window.location.search.includes('standalone=true') ||
                      document.referrer.includes('android-app://') ||
                      document.referrer.includes('ios-app://')
  result.addCheck('Standalone mode supported', isStandalone, 2)
  
  // Check for install button/component - improved detection
  const hasInstallButton = document.querySelector('[data-install]') !== null ||
                          document.querySelector('[role="dialog"][aria-labelledby*="install"]') !== null ||
                          document.querySelector('[aria-describedby*="install"]') !== null
  result.addCheck('Install button present', hasInstallButton, 1)
}

/**
 * Check Accessibility
 */
async function checkAccessibility(result) {
  // Check for ARIA labels
  const hasAriaLabels = document.querySelectorAll('[aria-label], [aria-labelledby]').length > 0
  result.addCheck('ARIA labels present', hasAriaLabels, 2)
  
  // Check for semantic HTML
  const hasSemanticElements = document.querySelectorAll('main, nav, section, article, aside, header, footer').length > 0
  result.addCheck('Semantic HTML used', hasSemanticElements, 2)
  
  // Check for keyboard navigation
  const hasFocusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]').length > 0
  result.addCheck('Keyboard navigation supported', hasFocusableElements, 2)
  
  // Check for color contrast (basic check)
  const hasDarkMode = document.querySelector('[data-theme="dark"]') !== null || 
                     document.documentElement.classList.contains('dark')
  result.addCheck('Dark mode support', hasDarkMode, 1)
}

/**
 * Check Cross Browser Compatibility
 */
async function checkCrossBrowserCompatibility(result) {
  const userAgent = navigator.userAgent.toLowerCase()
  
  // Check for modern browser features
  const hasES6Support = typeof Promise !== 'undefined' && typeof fetch !== 'undefined'
  result.addCheck('ES6+ support', hasES6Support, 2)
  
  // Check for CSS Grid/Flexbox support
  const hasModernCSS = CSS.supports('display', 'grid') && CSS.supports('display', 'flex')
  result.addCheck('Modern CSS support', hasModernCSS, 2)
  
  // Check for WebP support
  const hasWebPSupport = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0
  result.addCheck('WebP support', hasWebPSupport, 1)
}

/**
 * Check iOS Optimizations
 */
async function checkIOSOptimizations(result) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  
  if (isIOS) {
    // Check for iOS-specific meta tags
    const hasAppleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]') !== null
    result.addCheck('iOS touch icon', hasAppleTouchIcon, 2)
    
    const hasAppleMobileWebAppCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]') !== null
    result.addCheck('iOS web app capable', hasAppleMobileWebAppCapable, 2)
    
    const hasAppleMobileWebAppStatusBarStyle = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]') !== null
    result.addCheck('iOS status bar style', hasAppleMobileWebAppStatusBarStyle, 1)
    
    // Check for splash screens
    const hasSplashScreens = document.querySelectorAll('link[rel="apple-touch-startup-image"]').length > 0
    result.addCheck('iOS splash screens', hasSplashScreens, 2)
  }
}

/**
 * Check Android Optimizations
 */
async function checkAndroidOptimizations(result) {
  const isAndroid = /Android/.test(navigator.userAgent)
  
  if (isAndroid) {
    // Check for Android-specific optimizations
    const hasThemeColor = document.querySelector('meta[name="theme-color"]') !== null
    result.addCheck('Android theme color', hasThemeColor, 2)
    
    const hasMobileWebAppCapable = document.querySelector('meta[name="mobile-web-app-capable"]') !== null
    result.addCheck('Android web app capable', hasMobileWebAppCapable, 2)
  }
}

/**
 * Check Windows Optimizations
 */
async function checkWindowsOptimizations(result) {
  const isWindows = /Windows/.test(navigator.userAgent)
  
  if (isWindows) {
    // Check for Windows-specific optimizations
    const hasTileColor = document.querySelector('meta[name="msapplication-TileColor"]') !== null
    result.addCheck('Windows tile color', hasTileColor, 1)
    
    const hasTileImage = document.querySelector('meta[name="msapplication-TileImage"]') !== null
    result.addCheck('Windows tile image', hasTileImage, 1)
    
    const hasBrowserConfig = document.querySelector('meta[name="msapplication-config"]') !== null
    result.addCheck('Windows browser config', hasBrowserConfig, 1)
  }
}

/**
 * Check Security Headers
 */
async function checkSecurityHeaders(result) {
  // Check for security meta tags
  const hasCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null
  result.addCheck('Content Security Policy', hasCSP, 3)
  
  const hasXFrameOptions = document.querySelector('meta[http-equiv="X-Frame-Options"]') !== null
  result.addCheck('X-Frame-Options', hasXFrameOptions, 2)
  
  const hasXContentTypeOptions = document.querySelector('meta[http-equiv="X-Content-Type-Options"]') !== null
  result.addCheck('X-Content-Type-Options', hasXContentTypeOptions, 2)
  
  const hasReferrerPolicy = document.querySelector('meta[name="referrer"]') !== null ||
                           document.querySelector('meta[http-equiv="Referrer-Policy"]') !== null
  result.addCheck('Referrer Policy', hasReferrerPolicy, 1)
}

/**
 * Check Content Security Policy
 */
async function checkContentSecurityPolicy(result) {
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]')
  
  if (cspMeta) {
    const csp = cspMeta.getAttribute('content')
    
    if (csp) {
      const hasDefaultSrc = csp.includes('default-src')
      const hasScriptSrc = csp.includes('script-src')
      const hasStyleSrc = csp.includes('style-src')
      const hasImgSrc = csp.includes('img-src')
      
      result.addCheck('CSP default-src', hasDefaultSrc, 1)
      result.addCheck('CSP script-src', hasScriptSrc, 1)
      result.addCheck('CSP style-src', hasStyleSrc, 1)
      result.addCheck('CSP img-src', hasImgSrc, 1)
    }
  } else {
    result.addWarning('Content Security Policy not found')
  }
}

/**
 * Generate PWA Audit Report
 */
export function generatePWAAuditReport(auditResult) {
  const report = {
    score: auditResult.getScore(),
    grade: auditResult.getGrade(),
    summary: {
      total: auditResult.checks.length,
      passed: auditResult.checks.filter(check => check.passed).length,
      failed: auditResult.checks.filter(check => !check.passed).length
    },
    checks: auditResult.checks,
    errors: auditResult.errors,
    warnings: auditResult.warnings,
    recommendations: auditResult.recommendations
  }
  
  return report
}

/**
 * Log PWA Audit Results
 */
export function logPWAAuditResults(auditResult) {
  // Silent in production
} 