import { useState, useEffect } from 'react'
import { detectPlatform, getPlatformDeviceInfo } from '../utils/platformPWA'

/**
 * React hook for platform detection and platform-specific features
 * @returns {Object} Platform information and utilities
 */
export function usePlatform() {
  const [platform, setPlatform] = useState(detectPlatform())
  const [deviceInfo, setDeviceInfo] = useState(getPlatformDeviceInfo())

  useEffect(() => {
    // Update platform info on mount and window resize
    const updatePlatformInfo = () => {
      setPlatform(detectPlatform())
      setDeviceInfo(getPlatformDeviceInfo())
    }

    // Initial update
    updatePlatformInfo()

    // Listen for window resize (orientation changes, etc.)
    window.addEventListener('resize', updatePlatformInfo)
    
    // Listen for standalone mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    mediaQuery.addEventListener('change', updatePlatformInfo)

    return () => {
      window.removeEventListener('resize', updatePlatformInfo)
      mediaQuery.removeEventListener('change', updatePlatformInfo)
    }
  }, [])

  return {
    // Platform detection
    isAndroid: platform.isAndroid,
    isWindows: platform.isWindows,
    isIOS: platform.isIOS,
    isChrome: platform.isChrome,
    isEdge: platform.isEdge,
    isFirefox: platform.isFirefox,
    isSafari: platform.isSafari,
    isStandalone: platform.isStandalone,
    
    // Device info
    deviceInfo,
    
    // Platform-specific classes
    platformClasses: {
      'android-device': platform.isAndroid,
      'windows-device': platform.isWindows,
      'ios-device': platform.isIOS,
      'android-standalone': platform.isAndroid && platform.isStandalone,
      'windows-standalone': platform.isWindows && platform.isStandalone,
      'ios-standalone': platform.isIOS && platform.isStandalone
    },
    
    // Platform-specific utilities
    platformUtils: {
      // Get platform-specific CSS classes
      getPlatformClasses: () => {
        const classes = []
        if (platform.isAndroid) classes.push('android-device')
        if (platform.isWindows) classes.push('windows-device')
        if (platform.isIOS) classes.push('ios-device')
        if (platform.isStandalone) {
          if (platform.isAndroid) classes.push('android-standalone')
          if (platform.isWindows) classes.push('windows-standalone')
          if (platform.isIOS) classes.push('ios-standalone')
        }
        return classes.join(' ')
      },
      
      // Platform-specific styling
      getPlatformStyles: () => {
        const styles = {}
        
        if (platform.isAndroid) {
          styles.fontFamily = 'Roboto, sans-serif'
        } else if (platform.isWindows) {
          styles.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
        }
        
        return styles
      },
      
      // Platform-specific behavior
      isTouchDevice: platform.isAndroid || platform.isIOS,
      isDesktop: platform.isWindows,
      isMobile: platform.isAndroid || platform.isIOS,
      
      // Platform-specific features
      supportsRipple: platform.isAndroid,
      supportsAccentColor: platform.isWindows,
      supportsSafeAreas: platform.isIOS,
      
      // Platform-specific shortcuts
      getKeyboardShortcuts: () => {
        if (platform.isWindows) {
          return {
            newTimer: 'Ctrl+N',
            stopwatch: 'Ctrl+S',
            worldClock: 'Ctrl+W',
            fullscreen: 'F11'
          }
        }
        return {}
      }
    }
  }
} 