import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useFirestoreCollection } from '../hooks/useFirestore'
import { useApiKeys } from '../hooks/useApiKeys'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { LoadingSkeleton } from '../components/common/LoadingSpinner'
import { getWeatherIcon, formatTemperature, formatHumidity, formatWindSpeed } from '../utils/weather'
import { useWeather } from '../context/WeatherContext'
import { 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  Cloudy, 
  Wind, 
  MapPin,
  Thermometer,
  Droplets,
  Gauge,
  Eye,
  Sunrise,
  Sunset
} from 'lucide-react'

export const WeatherPage = () => {
  const { user, firebaseAvailable } = useAuth()
  const { isOpenWeatherAvailable } = useApiKeys()
  const { data: clocks, loading } = useFirestoreCollection('clocks', 'order', 'asc')
  const { 
    fetchWeatherForLocations, 
    getWeatherData, 
    getForecastData,
    isLoading,
    getError 
  } = useWeather()

  // Fetch weather data for all clocks
  useEffect(() => {
    if (!clocks || clocks.length === 0 || !isOpenWeatherAvailable) return
    
    fetchWeatherForLocations(clocks, true) // Include forecast
  }, [clocks, isOpenWeatherAvailable, fetchWeatherForLocations])

  const getWeatherIcon = (weatherCode) => {
    // Map OpenWeather condition codes to Lucide icons
    const iconMap = {
      // Clear
      800: Sun,
      // Clouds
      801: Cloudy,
      802: Cloudy,
      803: Cloudy,
      804: Cloudy,
      // Rain
      200: CloudRain,
      201: CloudRain,
      202: CloudRain,
      210: CloudRain,
      211: CloudRain,
      212: CloudRain,
      221: CloudRain,
      230: CloudRain,
      231: CloudRain,
      232: CloudRain,
      300: CloudRain,
      301: CloudRain,
      302: CloudRain,
      310: CloudRain,
      311: CloudRain,
      312: CloudRain,
      313: CloudRain,
      314: CloudRain,
      321: CloudRain,
      500: CloudRain,
      501: CloudRain,
      502: CloudRain,
      503: CloudRain,
      504: CloudRain,
      511: CloudRain,
      520: CloudRain,
      521: CloudRain,
      522: CloudRain,
      531: CloudRain,
      // Snow
      600: CloudSnow,
      601: CloudSnow,
      602: CloudSnow,
      611: CloudSnow,
      612: CloudSnow,
      613: CloudSnow,
      615: CloudSnow,
      616: CloudSnow,
      620: CloudSnow,
      621: CloudSnow,
      622: CloudSnow,
      // Atmosphere
      701: Cloudy,
      711: Cloudy,
      721: Cloudy,
      731: Cloudy,
      741: Cloudy,
      751: Cloudy,
      761: Cloudy,
      762: Cloudy,
      771: Wind,
      781: Wind,
    }
    
    return iconMap[weatherCode] || Cloud
  }

  const formatPressure = (pressure) => {
    return `${pressure} hPa`
  }

  const formatVisibility = (visibility) => {
    return `${(visibility / 1000).toFixed(1)} km`
  }

  const formatSunTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  if (!user || !firebaseAvailable) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {!firebaseAvailable ? 'Firebase not configured' : 'Sign in to view weather'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {!firebaseAvailable ? 'Please configure Firebase to use this feature.' : 'Please sign in to access this feature.'}
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  if (clocks.length === 0) {
    return (
      <div className="text-center py-12">
        <Cloud className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No locations added yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Add world clocks to see weather information for those locations
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Weather Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Current weather conditions for your saved locations
          </p>
        </div>

      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clocks.map((clock) => {
          // Get weather data from global cache
          const locationKey = clock.geometry?.location ? clock.geometry.location : { lat: clock.place, lng: clock.country }
          const weather = getWeatherData(locationKey, clock.country)
          const forecast = getForecastData(clock.place, clock.country)
          const loading = isLoading(locationKey, clock.country)
          const error = getError(locationKey, clock.country)
          
          if (loading) {
            return (
              <Card key={clock.id} className="relative">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="h-5 w-5 text-[#b91c1c]" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {clock.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {clock.place}
                      </p>
                    </div>
                  </div>
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Loading weather...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          }

          if (!weather) {
            return (
              <Card key={clock.id} className="relative">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="h-5 w-5 text-[#b91c1c]" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {clock.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {clock.place}
                      </p>
                    </div>
                  </div>
                  <div className="text-center py-8">
                    <Cloud className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {error || 'Weather unavailable'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          }

          const WeatherIcon = getWeatherIcon(weather.weather[0]?.id)
          const currentTemp = formatTemperature(weather.main.temp)
          const feelsLike = formatTemperature(weather.main.feels_like)
          const humidity = formatHumidity(weather.main.humidity)
          const pressure = formatPressure(weather.main.pressure)
          const windSpeed = formatWindSpeed(weather.wind.speed)
          const visibility = formatVisibility(weather.visibility)

          return (
            <Card key={clock.id} className="relative overflow-hidden">
              <CardContent className="p-6">
                {/* Location Header */}
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="h-5 w-5 text-[#b91c1c]" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {clock.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {clock.place}
                    </p>
                  </div>
                </div>

                {/* Current Weather */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <WeatherIcon className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                    <div className="text-left">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {currentTemp}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Feels like {feelsLike}
                      </div>
                    </div>
                  </div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                    {weather.weather[0]?.description}
                  </p>
                </div>

                {/* Weather Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Humidity</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{humidity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Pressure</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{pressure}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Wind</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{windSpeed}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Visibility</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{visibility}</p>
                    </div>
                  </div>
                </div>

                {/* Sun Times */}
                {weather.sys && (
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Sunrise className="h-4 w-4 text-yellow-500" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Sunrise</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatSunTime(weather.sys.sunrise)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sunset className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Sunset</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatSunTime(weather.sys.sunset)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 