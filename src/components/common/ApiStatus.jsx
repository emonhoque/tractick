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
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-gray-900 text-white text-xs rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 min-w-[220px] border border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-blue-300" />
          <span className="font-semibold text-base text-white">API Status</span>
        </div>
        <ul className="space-y-2 text-gray-200">
          <li className="flex items-center gap-2">
            {isFirebaseConfigured ? (
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            )}
            <span>Firebase - <span className={isFirebaseConfigured ? 'text-green-300' : 'text-red-300'}>{isFirebaseConfigured ? 'Configured' : 'Not configured'}</span></span>
          </li>
          <li className="flex items-center gap-2">
            {isGoogleMapsAvailable ? (
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            )}
            <span>Google Places - <span className={isGoogleMapsAvailable ? 'text-green-300' : 'text-red-300'}>{isGoogleMapsAvailable ? 'Configured' : 'Not configured'}</span></span>
          </li>
          <li className="flex items-center gap-2">
            {isOpenWeatherAvailable ? (
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            )}
            <span>OpenWeather - <span className={isOpenWeatherAvailable ? 'text-green-300' : 'text-red-300'}>{isOpenWeatherAvailable ? 'Configured' : 'Not configured'}</span></span>
          </li>
        </ul>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  )
} 