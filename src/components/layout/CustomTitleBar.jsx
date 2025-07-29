import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { usePWA } from '../../hooks/usePWA'
import { Button } from '../ui/Button'

export const CustomTitleBar = () => {
  const { theme, toggleTheme } = useTheme()
  const { isPWA, isLoading } = usePWA()
  const [isMaximized, setIsMaximized] = useState(false)
  const [titleBarHeight, setTitleBarHeight] = useState(0)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if window controls overlay is supported with proper error handling
    try {
      const hasSupport = 'windowControlsOverlay' in navigator && navigator.windowControlsOverlay
      setIsSupported(hasSupport)
      
      if (hasSupport) {
        // Get the title bar area geometry with error handling
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

        // Listen for geometry changes with error handling
        try {
          navigator.windowControlsOverlay.addEventListener('geometrychange', updateTitleBarGeometry)
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

  const handleMinimize = () => {
    try {
      if (window.electronAPI) {
        window.electronAPI.minimize()
      } else {
        // No web fallback for minimize
      }
    } catch {
      // Silent fail
    }
  }

  const handleMaximize = () => {
    try {
      if (window.electronAPI) {
        window.electronAPI.maximize()
              } else {
          // Fallback for web
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {
              // Silent fail
            })
          } else {
            document.exitFullscreen().catch(() => {
              // Silent fail
            })
          }
        }
        setIsMaximized(!isMaximized)
      } catch {
        // Silent fail
      }
  }

  const handleClose = () => {
    try {
      if (window.electronAPI) {
        window.electronAPI.close()
      } else {
        // Fallback for web
        window.close()
      }
    } catch {
      // Silent fail
    }
  }

  // Don't show anything while loading PWA status
  if (isLoading) {
    return null
  }

  // Only show title bar if:
  // 1. Window controls overlay is supported
  // 2. We're in standalone mode (PWA installed)
  // 3. Not explicitly disabled via URL parameter
  if (!isSupported || !isPWA || document.location.search.includes('standalone=false')) {
    return null
  }

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4"
      style={{ 
        height: `${titleBarHeight || 32}px`,
        WebkitAppRegion: 'drag' // Makes the title bar draggable
      }}
    >
      {/* Left side - App branding */}
      <div className="flex items-center space-x-3" style={{ WebkitAppRegion: 'no-drag' }}>
        <div className="flex items-center space-x-2">
          <img 
            src="/assets/header-logo-1.svg" 
            alt="tractick" 
            className="h-6 w-6"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          <span className="font-semibold text-gray-900 dark:text-white">
            tractick
          </span>
        </div>
      </div>

      {/* Center - Current time (optional) */}
      <div className="flex-1 flex justify-center" style={{ WebkitAppRegion: 'no-drag' }}>
        <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Right side - Controls */}
      <div className="flex items-center space-x-2" style={{ WebkitAppRegion: 'no-drag' }}>
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="h-8 w-8 p-0"
        >
          {theme === 'dark' ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </Button>

        {/* Window controls */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMinimize}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleMaximize}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isMaximized ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
} 