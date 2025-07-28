import { useState, useEffect } from 'react'
import { Wifi, WifiOff } from 'lucide-react'

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div 
      className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 ${
        isOnline 
          ? 'bg-green-600 text-white opacity-0 pointer-events-none' 
          : 'bg-red-600 text-white opacity-100 animate-pulse'
      }`}
      data-offline={!isOnline}
      role="status"
      aria-live="polite"
      aria-label="Network status indicator"
    >
      {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
      <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
    </div>
  )
} 