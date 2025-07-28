import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { getCurrentWeather, getWeatherForecast, getWeatherByCoordinates } from '../utils/weather'
import { useAuth } from './AuthContext'

const WeatherContext = createContext(null)

export const WeatherProvider = ({ children }) => {
  const { user } = useAuth()
  const [weatherCache, setWeatherCache] = useState(new Map())
  const [forecastCache, setForecastCache] = useState(new Map())
  const [loadingStates, setLoadingStates] = useState(new Map())
  const [errorStates, setErrorStates] = useState(new Map())
  const lastFetchTimes = useRef(new Map())
  const pendingRequests = useRef(new Map())

  // Cache duration: 1 hour for current weather, 3 hours for forecast
  const CACHE_DURATION = {
    current: 60 * 60 * 1000, // 1 hour
    forecast: 3 * 60 * 60 * 1000 // 3 hours
  }

  // Rate limiting: minimum 10 minutes between requests for same location
  const MIN_FETCH_INTERVAL = 10 * 60 * 1000 // 10 minutes

  // Error cache duration: 5 minutes for failed requests to prevent repeated failures
  const ERROR_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  // Track failed requests to prevent repeated attempts
  const failedRequests = useRef(new Map())

  // Generate cache key for location
  const getCacheKey = useCallback((type, location, country = '') => {
    const locationKey = typeof location === 'object' 
      ? `${location.lat}_${location.lng}` 
      : `${location}_${country}`
    return `${type}_${locationKey}`
  }, [])

  // Check if cache is valid
  const isCacheValid = useCallback((timestamp, type = 'current') => {
    const now = Date.now()
    const duration = CACHE_DURATION[type] || CACHE_DURATION.current
    return (now - timestamp) < duration
  }, [])

  // Check if a request recently failed
  const hasRecentlyFailed = useCallback((cacheKey) => {
    const failedTime = failedRequests.current.get(cacheKey)
    if (!failedTime) return false
    return (Date.now() - failedTime) < ERROR_CACHE_DURATION
  }, [])

  // Mark a request as failed
  const markRequestFailed = useCallback((cacheKey) => {
    failedRequests.current.set(cacheKey, Date.now())
  }, [])

  // Check if we should fetch (rate limiting)
  const shouldFetch = useCallback((cacheKey) => {
    const lastFetch = lastFetchTimes.current.get(cacheKey)
    if (!lastFetch) return true
    
    const now = Date.now()
    const timeSinceLastFetch = now - lastFetch
    
    // Don't fetch if we recently failed
    if (hasRecentlyFailed(cacheKey)) {
      return false
    }
    
    return timeSinceLastFetch >= MIN_FETCH_INTERVAL
  }, [hasRecentlyFailed])

  // Get or create pending request
  const getOrCreateRequest = useCallback((cacheKey, fetchFunction) => {
    if (pendingRequests.current.has(cacheKey)) {
      return pendingRequests.current.get(cacheKey)
    }

    const request = fetchFunction()
    pendingRequests.current.set(cacheKey, request)
    
    // Clean up pending request when it completes
    request.finally(() => {
      pendingRequests.current.delete(cacheKey)
    })

    return request
  }, [])

  // Fetch current weather
  const fetchCurrentWeather = useCallback(async (location, country = '', forceRefresh = false) => {
    const cacheKey = getCacheKey('current', location, country)
    
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = weatherCache.get(cacheKey)
      if (cached && isCacheValid(cached.timestamp, 'current')) {
        return cached.data
      }
    }

    // Check rate limiting
    if (!forceRefresh && !shouldFetch(cacheKey)) {
      const cached = weatherCache.get(cacheKey)
      return cached?.data || null
    }

    // Set loading state
    setLoadingStates(prev => new Map(prev).set(cacheKey, true))
    setErrorStates(prev => new Map(prev).set(cacheKey, null))

    try {
      const fetchFunction = async () => {
        let weatherData
        
        if (typeof location === 'object' && location.lat && location.lng) {
          // Use coordinates
          weatherData = await getWeatherByCoordinates(location.lat, location.lng)
        } else {
          // Use city name
          weatherData = await getCurrentWeather(location, country)
        }

        return weatherData
      }

      const weatherData = await getOrCreateRequest(cacheKey, fetchFunction)
      
      // Update cache
      const cacheEntry = {
        data: weatherData,
        timestamp: Date.now()
      }
      
      setWeatherCache(prev => new Map(prev).set(cacheKey, cacheEntry))
      lastFetchTimes.current.set(cacheKey, Date.now())
      
      return weatherData
    } catch (error) {
      
      // Mark this request as failed to prevent repeated attempts
      markRequestFailed(cacheKey)
      
      // Store error in cache to prevent flickering
      const errorEntry = {
        data: null,
        timestamp: Date.now(),
        error: error.message
      }
      setWeatherCache(prev => new Map(prev).set(cacheKey, errorEntry))
      
      setErrorStates(prev => new Map(prev).set(cacheKey, error.message))
      
      // Return null instead of throwing to prevent unhandled promise rejections
      return null
    } finally {
      setLoadingStates(prev => new Map(prev).set(cacheKey, false))
    }
  }, [weatherCache, getCacheKey, isCacheValid, shouldFetch, getOrCreateRequest, markRequestFailed])

  // Fetch weather forecast
  const fetchWeatherForecast = useCallback(async (location, country = '', forceRefresh = false) => {
    const cacheKey = getCacheKey('forecast', location, country)
    
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = forecastCache.get(cacheKey)
      if (cached && isCacheValid(cached.timestamp, 'forecast')) {
        return cached.data
      }
    }

    // Check rate limiting
    if (!forceRefresh && !shouldFetch(cacheKey)) {
      const cached = forecastCache.get(cacheKey)
      return cached?.data || null
    }

    // Set loading state
    setLoadingStates(prev => new Map(prev).set(cacheKey, true))
    setErrorStates(prev => new Map(prev).set(cacheKey, null))

    try {
      const fetchFunction = async () => {
        return await getWeatherForecast(location, country)
      }

      const forecastData = await getOrCreateRequest(cacheKey, fetchFunction)
      
      // Update cache
      const cacheEntry = {
        data: forecastData,
        timestamp: Date.now()
      }
      
      setForecastCache(prev => new Map(prev).set(cacheKey, cacheEntry))
      lastFetchTimes.current.set(cacheKey, Date.now())
      
      return forecastData
    } catch (error) {
      
      // Mark this request as failed to prevent repeated attempts
      markRequestFailed(cacheKey)
      
      // Store error in cache to prevent flickering
      const errorEntry = {
        data: null,
        timestamp: Date.now(),
        error: error.message
      }
      setForecastCache(prev => new Map(prev).set(cacheKey, errorEntry))
      
      setErrorStates(prev => new Map(prev).set(cacheKey, error.message))
      
      // Return null instead of throwing to prevent unhandled promise rejections
      return null
    } finally {
      setLoadingStates(prev => new Map(prev).set(cacheKey, false))
    }
  }, [forecastCache, getCacheKey, isCacheValid, shouldFetch, getOrCreateRequest, markRequestFailed])

  // Batch fetch weather for multiple locations
  const fetchWeatherForLocations = useCallback(async (locations, includeForecast = false, forceRefresh = false) => {
    const promises = locations.map(async (location) => {
      const { place, country, geometry } = location
      // Use place name for weather lookup since geometry might not be available
      const locationKey = geometry?.location ? geometry.location : place
      
      try {
        const currentWeather = await fetchCurrentWeather(locationKey, country, forceRefresh)
        let forecast = null
        
        if (includeForecast) {
          forecast = await fetchWeatherForecast(place, country, forceRefresh)
        }
        
        return {
          locationId: location.id || `${place}_${country}`,
          current: currentWeather,
          forecast
        }
      } catch (error) {
        // Error fetching weather for location
        return {
          locationId: location.id || `${place}_${country}`,
          error: error.message
        }
      }
    })

    return Promise.all(promises)
  }, [fetchCurrentWeather, fetchWeatherForecast])

  // Get weather data from cache
  const getWeatherData = useCallback((location, country = '') => {
    const cacheKey = getCacheKey('current', location, country)
    const cached = weatherCache.get(cacheKey)
    return cached?.data || null
  }, [weatherCache, getCacheKey])

  // Get forecast data from cache
  const getForecastData = useCallback((location, country = '') => {
    const cacheKey = getCacheKey('forecast', location, country)
    const cached = forecastCache.get(cacheKey)
    return cached?.data || null
  }, [forecastCache, getCacheKey])

  // Check loading state
  const isLoading = useCallback((location, country = '') => {
    const cacheKey = getCacheKey('current', location, country)
    return loadingStates.get(cacheKey) || false
  }, [loadingStates, getCacheKey])

  // Check error state
  const getError = useCallback((location, country = '') => {
    const cacheKey = getCacheKey('current', location, country)
    return errorStates.get(cacheKey) || null
  }, [errorStates, getCacheKey])

  // Clear cache
  const clearCache = useCallback(() => {
    setWeatherCache(new Map())
    setForecastCache(new Map())
    setLoadingStates(new Map())
    setErrorStates(new Map())
    lastFetchTimes.current.clear()
    pendingRequests.current.clear()
    failedRequests.current.clear()
  }, [])

  // Get cache stats
  const getCacheStats = useCallback(() => {
    return {
      currentWeather: weatherCache.size,
      forecasts: forecastCache.size,
      loading: loadingStates.size,
      errors: errorStates.size,
      pendingRequests: pendingRequests.current.size,
      failedRequests: failedRequests.current.size
    }
  }, [weatherCache.size, forecastCache.size, loadingStates.size, errorStates.size, failedRequests.current.size])

  // Clean up expired cache entries periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now()
      
      // Clean current weather cache
      setWeatherCache(prev => {
        const newCache = new Map()
        prev.forEach((value, key) => {
          if (isCacheValid(value.timestamp, 'current')) {
            newCache.set(key, value)
          }
        })
        return newCache
      })

      // Clean forecast cache
      setForecastCache(prev => {
        const newCache = new Map()
        prev.forEach((value, key) => {
          if (isCacheValid(value.timestamp, 'forecast')) {
            newCache.set(key, value)
          }
        })
        return newCache
      })

      // Clean loading and error states for non-existent cache entries
      setLoadingStates(prev => {
        const newStates = new Map()
        prev.forEach((value, key) => {
          if (weatherCache.has(key) || forecastCache.has(key)) {
            newStates.set(key, value)
          }
        })
        return newStates
      })

      setErrorStates(prev => {
        const newStates = new Map()
        prev.forEach((value, key) => {
          if (weatherCache.has(key) || forecastCache.has(key)) {
            newStates.set(key, value)
          }
        })
        return newStates
      })
    }, 5 * 60 * 1000) // Clean up every 5 minutes

    return () => clearInterval(cleanupInterval)
  }, [isCacheValid, weatherCache, forecastCache])

  const value = {
    // Fetch functions
    fetchCurrentWeather,
    fetchWeatherForecast,
    fetchWeatherForLocations,
    
    // Get cached data
    getWeatherData,
    getForecastData,
    
    // State checks
    isLoading,
    getError,
    
    // Cache management
    clearCache,
    getCacheStats,
    
    // Cache access
    weatherCache,
    forecastCache
  }

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  )
}

export const useWeather = () => {
  const context = useContext(WeatherContext)
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider')
  }
  return context
} 