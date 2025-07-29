import { useState, useEffect } from 'react'

/**
 * Hook to detect if the app is running as a PWA (standalone mode)
 * @returns {Object} PWA detection information
 */
export function usePWA() {
  const [isPWA, setIsPWA] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkPWAStatus = () => {
      try {
        // Check if running in standalone mode (PWA installed)
        const isStandalone = window.navigator.standalone || 
                           window.matchMedia('(display-mode: standalone)').matches ||
                           window.matchMedia('(display-mode: window-controls-overlay)').matches

        setIsPWA(isStandalone)
        setIsLoading(false)
      } catch {
        setIsPWA(false)
        setIsLoading(false)
      }
    }

    checkPWAStatus()

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const handleDisplayModeChange = () => {
      checkPWAStatus()
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleDisplayModeChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleDisplayModeChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleDisplayModeChange)
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleDisplayModeChange)
      }
    }
  }, [])

  return {
    isPWA,
    isLoading
  }
} 