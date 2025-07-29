import { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { usePlatform } from '../../hooks/usePlatform'

export const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const { isAndroid, isWindows, isIOS, isStandalone } = usePlatform()

  useEffect(() => {
    // Check if already installed
    if (isStandalone) {
      setIsInstalled(true)
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    
    // Check on load
    checkIfInstalled()

    // Check periodically
    const interval = setInterval(checkIfInstalled, 1000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      clearInterval(interval)
    }
  }, [isStandalone])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Fallback for platforms without beforeinstallprompt
      if (isIOS) {
        showIOSInstructions()
      } else if (isAndroid) {
        showAndroidInstructions()
      } else if (isWindows) {
        showWindowsInstructions()
      }
      return
    }

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        // User accepted the install prompt
      } else {
        // User dismissed the install prompt
      }
      
      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch {
      // Fallback to platform-specific instructions
      if (isIOS) {
        showIOSInstructions()
      } else if (isAndroid) {
        showAndroidInstructions()
      } else if (isWindows) {
        showWindowsInstructions()
      }
    }
  }

  const showIOSInstructions = () => {
    const instructions = document.createElement('div')
    instructions.className = 'ios-install-instructions'
    instructions.innerHTML = `
      <div class="ios-install-content">
        <h3>Install tractick on iOS</h3>
        <div class="ios-steps">
          <div class="step">
            <span class="step-number">1</span>
            <p>Tap the share button <span class="ios-share-icon">⎋</span> in Safari</p>
          </div>
          <div class="step">
            <span class="step-number">2</span>
            <p>Scroll down and tap "Add to Home Screen"</p>
          </div>
          <div class="step">
            <span class="step-number">3</span>
            <p>Tap "Add" to install</p>
          </div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()">Got it!</button>
      </div>
    `
    
    const style = document.createElement('style')
    style.textContent = `
      .ios-install-instructions {
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
        padding: 24px;
        border-radius: 12px;
        margin: 20px;
        text-align: center;
        max-width: 400px;
      }
      .ios-steps {
        margin: 20px 0;
        text-align: left;
      }
      .step {
        display: flex;
        align-items: center;
        margin: 12px 0;
        gap: 12px;
      }
      .step-number {
        background: #007AFF;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
      }
      .ios-share-icon {
        font-size: 20px;
        color: #007AFF;
      }
    `
    
    document.head.appendChild(style)
    document.body.appendChild(instructions)
  }

  const showAndroidInstructions = () => {
    const instructions = document.createElement('div')
    instructions.className = 'android-install-instructions'
    instructions.innerHTML = `
      <div class="android-install-content">
        <h3>Install tractick on Android</h3>
        <div class="android-steps">
          <div class="step">
            <span class="step-number">1</span>
            <p>Tap the menu button <span class="android-menu-icon">⋮</span></p>
          </div>
          <div class="step">
            <span class="step-number">2</span>
            <p>Tap "Add to Home screen"</p>
          </div>
          <div class="step">
            <span class="step-number">3</span>
            <p>Tap "Add" to install</p>
          </div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()">Got it!</button>
      </div>
    `
    
    const style = document.createElement('style')
    style.textContent = `
      .android-install-instructions {
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
        padding: 24px;
        border-radius: 12px;
        margin: 20px;
        text-align: center;
        max-width: 400px;
      }
      .android-steps {
        margin: 20px 0;
        text-align: left;
      }
      .step {
        display: flex;
        align-items: center;
        margin: 12px 0;
        gap: 12px;
      }
      .step-number {
        background: #4285f4;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
      }
      .android-menu-icon {
        font-size: 20px;
        color: #4285f4;
      }
    `
    
    document.head.appendChild(style)
    document.body.appendChild(instructions)
  }

  const showWindowsInstructions = () => {
    const instructions = document.createElement('div')
    instructions.className = 'windows-install-instructions'
    instructions.innerHTML = `
      <div class="windows-install-content">
        <h3>Install tractick on Windows</h3>
        <div class="windows-steps">
          <div class="step">
            <span class="step-number">1</span>
            <p>Click the install button <span class="windows-install-icon">⬇</span> in the address bar</p>
          </div>
          <div class="step">
            <span class="step-number">2</span>
            <p>Click "Install" in the dialog</p>
          </div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()">Got it!</button>
      </div>
    `
    
    const style = document.createElement('style')
    style.textContent = `
      .windows-install-instructions {
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
        padding: 24px;
        border-radius: 12px;
        margin: 20px;
        text-align: center;
        max-width: 400px;
      }
      .windows-steps {
        margin: 20px 0;
        text-align: left;
      }
      .step {
        display: flex;
        align-items: center;
        margin: 12px 0;
        gap: 12px;
      }
      .step-number {
        background: #0078d4;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
      }
      .windows-install-icon {
        font-size: 20px;
        color: #0078d4;
      }
    `
    
    document.head.appendChild(style)
    document.body.appendChild(instructions)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDeferredPrompt(null)
  }

  // Don't show if already installed
  if (isInstalled || !showPrompt) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📱</span>
            Install tractick
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Install tractick for a better experience with offline support and quick access.
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Works offline
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Quick access from home screen
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Native app experience
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleInstall}
              className="flex-1"
              variant="default"
            >
              Install Now
            </Button>
            <Button 
              onClick={handleDismiss}
              variant="outline"
            >
              Maybe Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 