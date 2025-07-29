import { API_KEYS, API_ENDPOINTS } from '../constants'

// Weather cache system
const weatherCache = new Map()
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

// Global fetch coordination to prevent duplicate requests
const pendingRequests = new Map()
const lastFetchTimes = new Map()

// Load cache from localStorage on startup
const loadCacheFromStorage = () => {
  try {
    const cached = localStorage.getItem('weatherCache')
    if (cached) {
      const parsed = JSON.parse(cached)
      const now = Date.now()
      
      // Only load non-expired cache entries
      Object.entries(parsed).forEach(([key, value]) => {
        if (now - value.timestamp < CACHE_DURATION) {
          weatherCache.set(key, value)
        }
      })
    }
  } catch (error) {
    // Silent fail in production
  }
}

// Save cache to localStorage
const saveCacheToStorage = () => {
  try {
    const cacheObject = {}
    weatherCache.forEach((value, key) => {
      cacheObject[key] = value
    })
    localStorage.setItem('weatherCache', JSON.stringify(cacheObject))
  } catch (error) {
    // Silent fail in production
  }
}

// Initialize cache on module load
loadCacheFromStorage()

// Cache management functions
const getCacheKey = (type, location) => {
  return `${type}_${location}`
}

const getFromCache = (key) => {
  const cached = weatherCache.get(key)
  if (!cached) return null
  
  const now = Date.now()
  if (now - cached.timestamp > CACHE_DURATION) {
    weatherCache.delete(key)
    return null
  }
  
  return cached.data
}

const setCache = (key, data) => {
  weatherCache.set(key, {
    data,
    timestamp: Date.now()
  })
  saveCacheToStorage()
}

// Global fetch coordination
const shouldFetch = (key, minInterval = 10 * 60 * 1000) => {
  const lastFetch = lastFetchTimes.get(key)
  if (!lastFetch) return true
  
  const now = Date.now()
  return (now - lastFetch) >= minInterval
}

const getOrCreateRequest = (key, fetchFunction) => {
  // If there's already a pending request, return it
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)
  }
  
  // If we have recent data, return it immediately
  const cached = getFromCache(key)
  if (cached) {
    return Promise.resolve(cached)
  }
  
  // If we shouldn't fetch yet, return cached data or null
  if (!shouldFetch(key)) {
    return Promise.resolve(cached || null)
  }
  
  // Create new request
  const request = fetchFunction().then(data => {
    if (data) {
      setCache(key, data)
      lastFetchTimes.set(key, Date.now())
    }
    pendingRequests.delete(key)
    return data
  }).catch(error => {
    pendingRequests.delete(key)
    throw error
  })
  
  pendingRequests.set(key, request)
  return request
}

// Check if OpenWeather API key is available
const checkApiKey = () => {
  if (!API_KEYS.OPENWEATHER) {
    throw new Error('Weather service not configured')
  }
  if (API_KEYS.OPENWEATHER === 'your_openweather_api_key' || API_KEYS.OPENWEATHER === '') {
    throw new Error('Weather service not configured')
  }
}

// OpenWeather API utility functions
export const getCurrentWeather = async (city, countryCode = '') => {
  try {
    const location = countryCode ? `${city},${countryCode}` : city
    const cacheKey = getCacheKey('current', location)
    
    return await getOrCreateRequest(cacheKey, async () => {
      checkApiKey()
      
      const url = `${API_ENDPOINTS.OPENWEATHER}/weather?q=${encodeURIComponent(location)}&appid=${API_KEYS.OPENWEATHER}&units=metric`
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      try {
        const response = await fetch(url, { signal: controller.signal })
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error(`Weather service error: ${response.status}`)
        }
        
        const data = await response.json()
        
        return data
      } catch (fetchError) {
        clearTimeout(timeoutId)
        if (fetchError.name === 'AbortError') {
          throw new Error('Weather request timed out')
        }
        throw fetchError
      }
    })
  } catch (error) {
    throw error
  }
}

export const getWeatherForecast = async (city, countryCode = '') => {
  try {
    const location = countryCode ? `${city},${countryCode}` : city
    const cacheKey = getCacheKey('forecast', location)
    
    return await getOrCreateRequest(cacheKey, async () => {
      checkApiKey()
      
      const url = `${API_ENDPOINTS.OPENWEATHER}/forecast?q=${encodeURIComponent(location)}&appid=${API_KEYS.OPENWEATHER}&units=metric`
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      try {
        const response = await fetch(url, { signal: controller.signal })
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error(`Weather service error: ${response.status}`)
        }
        
        const data = await response.json()
        
        return data
      } catch (fetchError) {
        clearTimeout(timeoutId)
        if (fetchError.name === 'AbortError') {
          throw new Error('Weather forecast request timed out')
        }
        throw fetchError
      }
    })
  } catch (error) {
    throw error
  }
}

export const getWeatherByCoordinates = async (lat, lon) => {
  try {
    const location = `${lat},${lon}`
    const cacheKey = getCacheKey('coords', location)
    
    return await getOrCreateRequest(cacheKey, async () => {
      checkApiKey()
      
      const url = `${API_ENDPOINTS.OPENWEATHER}/weather?lat=${lat}&lon=${lon}&appid=${API_KEYS.OPENWEATHER}&units=metric`
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      try {
        const response = await fetch(url, { signal: controller.signal })
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error(`Weather service error: ${response.status}`)
        }
        
        const data = await response.json()
        
        return data
      } catch (fetchError) {
        clearTimeout(timeoutId)
        if (fetchError.name === 'AbortError') {
          throw new Error('Weather request timed out')
        }
        throw fetchError
      }
    })
  } catch (error) {
    throw error
  }
}

// Cache management utilities
export const clearWeatherCache = () => {
  weatherCache.clear()
  localStorage.removeItem('weatherCache')
}

export const getCacheStats = () => {
  const now = Date.now()
  let validEntries = 0
  let expiredEntries = 0
  
  weatherCache.forEach((value) => {
    if (now - value.timestamp < CACHE_DURATION) {
      validEntries++
    } else {
      expiredEntries++
    }
  })
  
  return {
    totalEntries: weatherCache.size,
    validEntries,
    expiredEntries,
    cacheSize: JSON.stringify(weatherCache).length
  }
}

export const getWeatherIcon = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}

export const formatTemperature = (temp) => {
  return `${Math.round(temp)}°C`
}

export const formatHumidity = (humidity) => {
  return `${humidity}%`
}

export const formatWindSpeed = (speed) => {
  return `${Math.round(speed)} m/s`
} 