import { useApiKeys } from '../../hooks/useApiKeys'
import { CheckCircle, XCircle, Info } from 'lucide-react'

export const ApiStatus = () => {
  const { isFirebaseConfigured, isGoogleMapsAvailable, isOpenWeatherAvailable } = useApiKeys()

  const getStatusDot = (isAvailable) => {
    if (isAvailable) {
      return <CheckCircle className="h-3 w-3 text-green-500 dark:text-green-400 flex-shrink-0" />
    }
    return <XCircle className="h-3 w-3 text-red-500 dark:text-red-400 flex-shrink-0" />
  }

  return (
    <div 
      className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 group relative cursor-help"
      title="API Status"
    >
      <span>API Status</span>
      <span className="flex items-center gap-1">
        {getStatusDot(isFirebaseConfigured && isGoogleMapsAvailable && isOpenWeatherAvailable)}
      </span>
      
      {/* Custom tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-3 w-3" />
          <span className="font-medium">API Status</span>
        </div>
        <div className="space-y-1 text-gray-300">
          <div className="flex items-center gap-2">
            {isFirebaseConfigured ? (
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            )}
            <span>Firebase - {isFirebaseConfigured ? 'Configured' : 'Not configured'}</span>
          </div>
          <div className="flex items-center gap-2">
            {isGoogleMapsAvailable ? (
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            )}
            <span>Google Places - {isGoogleMapsAvailable ? 'Configured' : 'Not configured'}</span>
          </div>
          <div className="flex items-center gap-2">
            {isOpenWeatherAvailable ? (
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            )}
            <span>OpenWeather - {isOpenWeatherAvailable ? 'Configured' : 'Not configured'}</span>
          </div>
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  )
} 