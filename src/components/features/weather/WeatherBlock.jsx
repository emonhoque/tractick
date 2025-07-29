import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Card, CardContent } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { useUserPreferences } from '../../../hooks/useUserPreferences'
import { useApiKeys } from '../../../hooks/useApiKeys'
import { useWeather } from '../../../context/WeatherContext'
import { WeatherSettingsModal } from './WeatherSettingsModal'
import { MapPin, Settings, Database, RefreshCw } from 'lucide-react'

export const WeatherBlock = ({ clocks = [] }) => {
  const [showSettings, setShowSettings] = useState(false)
  const { preferences } = useUserPreferences()
  const { isOpenWeatherAvailable } = useApiKeys()
  const { 
    fetchWeatherForLocations, 
    getCacheStats, 
    clearCache,
    getWeatherData,
    isLoading,
    getError
  } = useWeather()
  const { failedRequests } = getCacheStats()

  // Memoize the clocks to show to prevent unnecessary re-renders
  const clocksToShow = useMemo(() => {
    if (!clocks || clocks.length === 0) return []
    
    // Always show first 2 clocks for weather display
    const defaultClocks = clocks.slice(0, 2)
    return defaultClocks
  }, [clocks, preferences.weatherLocations])

  // Use a ref to store the current clocksToShow to avoid dependency issues
  const clocksToShowRef = useRef(clocksToShow)
  clocksToShowRef.current = clocksToShow

  // Fetch weather data for selected clock locations
  const fetchWeatherForClocks = useCallback(async (forceRefresh = false) => {
    if (clocksToShow.length === 0) return
    
    try {
      await fetchWeatherForLocations(clocksToShow, false, forceRefresh)
    } catch {
      // Silent fail
    }
  }, [clocksToShow, fetchWeatherForLocations])

  // Get weather for selected clock locations - only when clocks change
  useEffect(() => {
    // Check if OpenWeather API is available
    if (!isOpenWeatherAvailable) {
      return
    }
    
    // Only fetch if we have clocks
    if (clocksToShow.length > 0) {
      fetchWeatherForClocks()
    }
  }, [clocksToShow, isOpenWeatherAvailable, fetchWeatherForClocks])

  const getWeatherIcon = useCallback((weatherCode) => {
    const iconMap = {
      800: '☀️', // Clear
      801: '🌤️', // Few clouds
      802: '⛅', // Scattered clouds
      803: '☁️', // Broken clouds
      804: '☁️', // Overcast
      200: '⛈️', // Thunderstorm
      300: '🌧️', // Drizzle
      500: '🌧️', // Rain
      600: '🌨️', // Snow
      700: '🌫️', // Atmosphere
    }
    
    return iconMap[weatherCode] || '🌤️'
  }, [])

  const handleRefresh = () => {
    fetchWeatherForClocks(true) // Force refresh
  }

  // Removed unused function: handleClearCache

  // Show proper message if no clocks are available
  if (!clocks || clocks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weather</h3>
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No locations available</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Add world clocks to see weather</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show loading state if no clocks are selected for weather display
  if (clocksToShow.length === 0 && clocks && clocks.length > 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weather</h3>
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No weather locations selected</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Configure weather settings to display weather data</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="mt-3"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure Weather
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weather</h3>
          <div className="flex items-center gap-2">
            {/* Cache Stats */}
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Database className="h-3 w-3" />
              <span>Cache: {getCacheStats().currentWeather} locations{failedRequests > 0 && ` (${failedRequests} failed)`}</span>
            </div>
            
            {/* Refresh Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Refresh weather data"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            {/* Settings Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Open weather settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {clocksToShow.map((clock) => {
            // Get weather data from global cache
            // Use place name for weather lookup since geometry might not be available
            const locationKey = clock.geometry?.location ? clock.geometry.location : clock.place
            const weather = getWeatherData(locationKey, clock.country)
            const loading = isLoading(locationKey, clock.country)
            // Removed unused variable: error
            
            // If loading, show loading state
            if (loading) {
              return (
                <div key={clock.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{clock.label || clock.place || 'Unknown Location'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    <span className="text-gray-500">Loading weather...</span>
                  </div>
                </div>
              )
            }

            // If no weather data for this clock, show a placeholder
            if (!weather) {
              return (
                <div key={clock.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{clock.label || clock.place || 'Unknown Location'}</span>
                  </div>

                  {/* Weather Unavailable */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🌤️</span>
                      <div>
                        <div className="text-xl font-bold text-gray-400 dark:text-gray-500">
                          --°C
                        </div>
                        <div className="text-sm text-gray-400 dark:text-gray-500">
                          Weather unavailable
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weather Details */}
                  <div className="grid grid-cols-2 gap-4 pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm">
                      <div className="text-gray-600 dark:text-gray-400">Humidity</div>
                      <div className="font-medium text-gray-400 dark:text-gray-500">--%</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-600 dark:text-gray-400">Wind Speed</div>
                      <div className="font-medium text-gray-400 dark:text-gray-500">-- m/s</div>
                    </div>
                  </div>
                </div>
              )
            }
            
            const WeatherIcon = getWeatherIcon(weather.weather[0]?.id)
            const temperature = Math.round(weather.main.temp)
            const humidity = weather.main.humidity
            const windSpeed = Math.round(weather.wind.speed)

            return (
              <div key={clock.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <MapPin className="h-4 w-4" />
                  <span>{clock.label || clock.place || 'Unknown Location'}</span>
                </div>

                {/* Main Weather */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{WeatherIcon}</span>
                    <div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {temperature}°C
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {weather.weather[0]?.description}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weather Details */}
                <div className="grid grid-cols-2 gap-4 pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm">
                    <div className="text-gray-600 dark:text-gray-400">Humidity</div>
                    <div className="font-medium text-gray-900 dark:text-white">{humidity}%</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-gray-600 dark:text-gray-400">Wind Speed</div>
                    <div className="font-medium text-gray-900 dark:text-white">{windSpeed} m/s</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
      
      <WeatherSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        clocks={clocks}
      />
    </Card>
  )
} 