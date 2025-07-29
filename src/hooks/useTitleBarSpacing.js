import { useState, useEffect } from 'react'

/**
 * Hook to manage title bar spacing for window controls overlay
 * @returns {Object} Title bar spacing information
 */
export function useTitleBarSpacing() {
  const [titleBarHeight, setTitleBarHeight] = useState(0)
  const [isSupported, setIsSupported] = useState(false)
  const [isPWA, setIsPWA] = useState(false)

  useEffect(() => {
    // Check if PWA is installed
    const checkPWAStatus = () => {
      try {
        const isStandalone = window.navigator.standalone || 
                           window.matchMedia('(display-mode: standalone)').matches ||
                           window.matchMedia('(display-mode: window-controls-overlay)').matches
        setIsPWA(isStandalone)
      } catch {
        setIsPWA(false)
      }
    }

    checkPWAStatus()

    // Check if window controls overlay is supported with proper error handling
    try {
      const hasSupport = 'windowControlsOverlay' in navigator && navigator.windowControlsOverlay
      setIsSupported(hasSupport)

      if (hasSupport) {
        // Get initial title bar geometry with error handling
        const updateTitleBarGeometry = () => {
          try {
            const { titlebarAreaRect } = navigator.windowControlsOverlay
            if (titlebarAreaRect && titlebarAreaRect.height) {
              setTitleBarHeight(titlebarAreaRect.height)
            } else {
              setTitleBarHeight(32) // Default height fallback
            }
          } catch {
            setTitleBarHeight(32) // Default height fallback
          }
        }

        // Listen for geometry changes (window resize, etc.) with error handling
        try {
          navigator.windowControlsOverlay.addEventListener('geometrychange', updateTitleBarGeometry)
          
          // Set initial height
          updateTitleBarGeometry()

          return () => {
            try {
              navigator.windowControlsOverlay.removeEventListener('geometrychange', updateTitleBarGeometry)
            } catch {
              // Silent fail
            }
          }
        } catch {
          updateTitleBarGeometry() // Still try to get initial geometry
        }
      }
    } catch {
      setIsSupported(false)
    }
  }, [])

  return {
    titleBarHeight: titleBarHeight || 32,
    isSupported,
    isPWA,
    titleBarStyle: (isSupported && isPWA) ? { paddingTop: `${titleBarHeight || 32}px` } : {}
  }
} 