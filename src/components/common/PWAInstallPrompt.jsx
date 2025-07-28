import { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { Download } from 'lucide-react'

export const PWAInstallPrompt = ({ className = '', showText = false }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // For development/testing: show button after a delay if no prompt appears
    const timeoutId = setTimeout(() => {
      if (!showInstallPrompt && !isInstalled) {
        setShowInstallPrompt(true)
      }
    }, 3000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      clearTimeout(timeoutId)
    }
  }, [showInstallPrompt, isInstalled])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // For testing: show a message
      alert('PWA install prompt not available. This is normal if the app is already installed or the browser doesn\'t support PWA installation.')
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  if (isInstalled && !showInstallPrompt) {
    return null
  }

  return (
    <Button
      variant="ghost"
      onClick={handleInstallClick}
      className={`flex items-center gap-2 text-gray-900 dark:text-gray-100 hover:text-[#d90c00] hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors min-w-[44px] min-h-[44px] border border-gray-300 dark:border-gray-600 ${className}`}
      aria-label="Install app"
      title="Install traktick app"
    >
      <Download className="h-6 w-6" />
      {showText && <span>Install App</span>}
    </Button>
  )
} 