import { useEffect } from 'react'
import { Cloud, CloudRain, CloudSnow, Sun, Cloudy, Wind } from 'lucide-react'
import { formatTemperature, formatHumidity, formatWindSpeed } from '../../../utils/weather'
import { useApiKeys } from '../../../hooks/useApiKeys'
import { useWeather } from '../../../hooks/useWeather'

export const WeatherDisplay = ({ city, country }) => {
  const { isOpenWeatherAvailable } = useApiKeys()
  const { 
    fetchCurrentWeather, 
    getWeatherData, 
    isLoading, 
    getError 
  } = useWeather()
  
  // Get weather data from cache or fetch if needed
  const weather = getWeatherData(city, country)
  const loading = isLoading(city, country)
  const error = getError(city, country)

  // Fetch weather data when component mounts or city changes
  useEffect(() => {
    if (!city || !isOpenWeatherAvailable) return
    
    // Fetch weather data (will use cache if available)
    fetchCurrentWeather(city, country)
  }, [city, country, isOpenWeatherAvailable, fetchCurrentWeather])

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

  if (
    loading ||
    !city ||
    !isOpenWeatherAvailable
  ) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        <span>Loading weather...</span>
      </div>
    )
  }

  // Defensive: check for error, missing weather, or missing expected properties
  const isWeatherValid = weather &&
    typeof weather === 'object' &&
    Array.isArray(weather.weather) && weather.weather.length > 0 &&
    weather.main && typeof weather.main.temp !== 'undefined' &&
    weather.wind && typeof weather.wind.speed !== 'undefined';

  if (error || !isWeatherValid) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Cloud className="h-4 w-4" />
        <span>Weather unavailable</span>
      </div>
    )
  }

  const WeatherIcon = getWeatherIcon(weather.weather[0]?.id)
  const temperature = formatTemperature(weather.main.temp)
  const humidity = formatHumidity(weather.main.humidity)
  const windSpeed = formatWindSpeed(weather.wind.speed)

  return (
    <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center gap-2">
        <WeatherIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <span className="font-semibold text-gray-900 dark:text-white text-sm">
          {temperature}
        </span>
      </div>
      
      <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-1">
          <Cloud className="h-3 w-3" />
          <span>{humidity}</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="h-3 w-3" />
          <span>{windSpeed}</span>
        </div>
      </div>
    </div>
  )
} 