import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { usePWA } from '../../hooks/usePWA'

export const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const { isPWA } = usePWA()

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    const handleAppInstalled = () => {
      // Clear the deferredPrompt so it can be garbage collected
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
      // Optionally, send analytics event to track successful installs
      // PWA was installed
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
              // User accepted the install prompt
      } else {
        // User dismissed the install prompt
      }

    // Clear the deferredPrompt
    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    setDeferredPrompt(null)
  }

  // Don't show if already installed as PWA
  if (isPWA || !showInstallPrompt) {
    return null
  }

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm"
      data-install="true"
      role="dialog"
      aria-labelledby="install-title"
      aria-describedby="install-description"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Download className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 id="install-title" className="text-sm font-medium text-gray-900 dark:text-white">
            Install tractick
          </h3>
          <p id="install-description" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Get quick access to your time management tools
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <Button
          onClick={handleInstallClick}
          size="sm"
          className="flex-1"
        >
          Install
        </Button>
        <Button
          onClick={handleDismiss}
          variant="outline"
          size="sm"
        >
          Later
        </Button>
      </div>
    </div>
  )
} 