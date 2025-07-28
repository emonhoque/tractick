// Enhanced Timezone Service using Google's Time Zone API
import { API_KEYS } from '../constants'

// Cache for API responses to reduce rate limiting
const apiCache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Rate limiting protection
let lastApiCall = 0
const MIN_API_INTERVAL = 1000 // 1 second between API calls

// Network status tracking
let isGoogleApiAvailable = true
let consecutiveFailures = 0
const MAX_FAILURES = 3

// Retry configuration
const MAX_RETRIES = 2
const RETRY_DELAY = 1000 // 1 second

// Helper function to get the appropriate API base URL
const getGoogleApiUrl = (endpoint) => {
  const isDevelopment = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  
  if (isDevelopment) {
    return `/api-proxy/maps/api${endpoint}`
  }
  
  return `https://maps.googleapis.com/maps/api${endpoint}`
}

export class TimezoneService {
  // Check if Google Time Zone API is available
  static async checkApiAvailability() {
    if (!isGoogleApiAvailable) return false
    
    // Check if we have a Google API key
    if (!API_KEYS.GOOGLE_MAPS) {
      console.warn('Google Maps API key not configured')
      return false
    }
    
    return true
  }

  // Get timezone data from coordinates using Google Time Zone API
  static async getTimezoneFromCoordinates(lat, lng, timestamp = null) {
    try {
      // Use current timestamp if not provided
      const currentTimestamp = timestamp || Math.floor(Date.now() / 1000)
      
      const cacheKey = `timezone_${lat}_${lng}_${currentTimestamp}`
      const cached = apiCache.get(cacheKey)
      
      // Return cached data if still valid
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data
      }
      
      // Rate limiting protection
      const now = Date.now()
      if (now - lastApiCall < MIN_API_INTERVAL) {
        console.warn('Rate limiting: Using cached data')
        return cached?.data || null
      }
      lastApiCall = now
      
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
          
          const url = getGoogleApiUrl(`/timezone/json?location=${lat},${lng}&timestamp=${currentTimestamp}&key=${API_KEYS.GOOGLE_MAPS}`)
          
          const response = await fetch(url, {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json'
            }
          })
          
          clearTimeout(timeoutId)
          
          if (!response.ok) {
            throw new Error(`Google Time Zone API error: ${response.status}`)
          }
          
          const data = await response.json()
          
          if (data.status === 'OK') {
            const timezoneData = {
              timezone: data.timeZoneId,
              raw_offset: data.rawOffset,
              utc_offset: this.formatUTCOffset(data.rawOffset),
              abbreviation: this.getTimezoneAbbreviation(data.timeZoneId),
              dst_offset: data.dstOffset,
              timezone_name: data.timeZoneName,
              dst: data.dstOffset !== 0,
              lastUpdated: new Date(),
              dataSource: 'google_timezone_api'
            }
            
            // Cache the response
            apiCache.set(cacheKey, {
              data: timezoneData,
              timestamp: Date.now()
            })
            
            return timezoneData
          } else {
            throw new Error(`Google Time Zone API error: ${data.status}`)
          }
        } catch (error) {
          console.error(`Time Zone API attempt ${attempt + 1} failed:`, error)
          
          if (attempt < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
            continue
          }
          
          // Return cached data if available
          return cached?.data || null
        }
      }
      
      return null
    } catch (error) {
      console.error('Error getting timezone from coordinates:', error)
      return null
    }
  }

  // Search for cities using Google Places API (simplified - no timezone list needed)
  static async searchCities(query) {
    if (!query || query.length < 2) return []
    
    // Check cache first
    const cacheKey = `search_${query.toLowerCase()}`
    const cached = apiCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }
    
    // For now, return empty array - we'll rely on Google Places API for city search
    // This removes the dependency on the problematic World Time API
    return []
  }

  // Get timezone info for a specific city/region using coordinates
  static async getTimezoneInfo(location) {
    try {
      // Handle null or undefined location
      if (!location) {
        throw new Error('Location is required')
      }

      // If location is coordinates (lat,lng format)
      if (typeof location === 'string' && location.includes(',')) {
        const [lat, lng] = location.split(',').map(coord => parseFloat(coord.trim()))
        if (!isNaN(lat) && !isNaN(lng)) {
          const timezoneData = await this.getTimezoneFromCoordinates(lat, lng)
          if (timezoneData) {
            return timezoneData
          }
        }
      }
      
      // For city names, we'll need to geocode first (handled by Google Places API)
      // This is better handled in the AddClockModalEnhanced component
      throw new Error('Location format not supported. Use coordinates or city search.')
    } catch (error) {
      console.error('Error getting timezone info:', error)
      throw error
    }
  }

  // Get current time for a timezone (local calculation)
  static getCurrentTime(timezone, hour12 = false) {
    try {
      // Handle null or undefined timezone
      if (!timezone) {
        console.warn('Timezone is null or undefined, using UTC')
        timezone = 'UTC'
      }

      return new Date().toLocaleString('en-US', { 
        timeZone: timezone,
        hour12: hour12,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch (error) {
      console.error('Error getting current time:', error)
      return 'Invalid timezone'
    }
  }

  // Get current date for a timezone (local calculation)
  static getCurrentDate(timezone) {
    try {
      // Handle null or undefined timezone
      if (!timezone) {
        console.warn('Timezone is null or undefined, using UTC')
        timezone = 'UTC'
      }

      return new Date().toLocaleDateString('en-US', { 
        timeZone: timezone,
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      console.error('Error getting current date:', error)
      return 'Invalid timezone'
    }
  }

  // Get timezone offset for a timezone (local calculation)
  static getTimezoneOffset(timezone) {
    try {
      // Handle null or undefined timezone
      if (!timezone) {
        console.warn('Timezone is null or undefined, using UTC')
        return 0
      }

      const now = new Date()
      const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000))
      const targetTime = new Date(utc.toLocaleString('en-US', { timeZone: timezone }))
      const offset = (targetTime.getTime() - utc.getTime()) / 1000
      return offset
    } catch (error) {
      console.error('Error calculating timezone offset:', error)
      return 0
    }
  }

  // Get timezone abbreviation (local calculation)
  static getTimezoneAbbreviation(timezone) {
    try {
      // Handle null or undefined timezone
      if (!timezone) {
        console.warn('Timezone is null or undefined, using UTC')
        return 'UTC'
      }

      const date = new Date()
      const options = { timeZone: timezone, timeZoneName: 'short' }
      const timeString = date.toLocaleString('en-US', options)
      const match = timeString.match(/\s([A-Z]{3,4})\s*$/)
      return match ? match[1] : null
    } catch (error) {
      console.error('Error getting timezone abbreviation:', error)
      return null
    }
  }

  // Check if DST is currently active for a timezone
  static isDSTActive(timezone) {
    try {
      // Handle null or undefined timezone
      if (!timezone) {
        console.warn('Timezone is null or undefined, assuming no DST')
        return false
      }

      const now = new Date()
      const jan = new Date(now.getFullYear(), 0, 1)
      const jul = new Date(now.getFullYear(), 6, 1)
      
      const janOffset = jan.getTimezoneOffset()
      const julOffset = jul.getTimezoneOffset()
      
      // If the timezone has different offsets in January and July, it observes DST
      return janOffset !== julOffset
    } catch (error) {
      console.error('Error checking DST:', error)
      return false
    }
  }

  // Get effective offset considering DST
  static getEffectiveOffset(timezone, baseOffset = null) {
    try {
      // Handle null or undefined timezone
      if (!timezone) {
        console.warn('Timezone is null or undefined, using base offset')
        return baseOffset || 0
      }

      if (baseOffset !== null && this.isDSTActive(timezone)) {
        // Add 1 hour for DST if it's active
        return baseOffset + 3600
      }
      return baseOffset || this.getTimezoneOffset(timezone)
    } catch (error) {
      console.error('Error getting effective offset:', error)
      return baseOffset || 0
    }
  }

  // Fallback time data when API is unavailable
  static getFallbackTimeData(timezone) {
    // Handle null or undefined timezone
    if (!timezone) {
      console.warn('Timezone is null or undefined, using UTC fallback')
      timezone = 'UTC'
    }

    const offset = this.getTimezoneOffset(timezone)
    const abbreviation = this.getTimezoneAbbreviation(timezone)
    
    return {
      timezone: timezone,
      raw_offset: offset,
      utc_offset: this.formatUTCOffset(offset),
      abbreviation: abbreviation,
      country_name: this.extractCountry(timezone),
      dst: this.isDSTActive(timezone),
      dst_from: null,
      dst_until: null,
      dst_offset: this.getEffectiveOffset(timezone, offset)
    }
  }

  // Extract city name from timezone string
  static extractCityName(timezone) {
    // Handle null or undefined timezone
    if (!timezone) {
      return 'Unknown'
    }

    const parts = timezone.split('/')
    if (parts.length > 1) {
      return parts[parts.length - 1].replace(/_/g, ' ')
    }
    return timezone
  }

  // Extract country from timezone string
  static extractCountry(timezone) {
    // Handle null or undefined timezone
    if (!timezone) {
      return 'Unknown'
    }

    const parts = timezone.split('/')
    if (parts.length > 1) {
      return parts[0].replace(/_/g, ' ')
    }
    return 'Unknown'
  }

  // Format offset for display
  static formatOffset(offsetSeconds) {
    // Handle null, undefined, or NaN values
    if (offsetSeconds === null || offsetSeconds === undefined || isNaN(offsetSeconds)) {
      console.warn('Invalid offset value:', offsetSeconds)
      return 'GMT+00:00' // Default to UTC
    }
    
    const hours = Math.floor(offsetSeconds / 3600)
    const minutes = Math.floor((offsetSeconds % 3600) / 60)
    const sign = hours >= 0 ? '+' : ''
    return `GMT${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  // Format UTC offset for display
  static formatUTCOffset(offsetSeconds) {
    // Handle null, undefined, or NaN values
    if (offsetSeconds === null || offsetSeconds === undefined || isNaN(offsetSeconds)) {
      console.warn('Invalid offset value:', offsetSeconds)
      return '+00:00' // Default to UTC
    }
    
    const hours = Math.floor(offsetSeconds / 3600)
    const minutes = Math.floor((offsetSeconds % 3600) / 60)
    const sign = hours >= 0 ? '+' : ''
    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  // Convert time from one timezone to another
  static convertTime(sourceTime, targetTimezone) {
    try {
      // Handle null or undefined timezone
      if (!targetTimezone) {
        console.warn('Target timezone is null or undefined, returning source time')
        return sourceTime
      }

      // Create a new date object to avoid mutating the original
      const convertedTime = new Date(sourceTime)
      
      // Get the time in the target timezone
      const targetTimeString = convertedTime.toLocaleString('en-US', {
        timeZone: targetTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })

      // Parse the target time string back to a Date object
      const [datePart, timePart] = targetTimeString.split(', ')
      const [month, day, year] = datePart.split('/')
      const [hour, minute, second] = timePart.split(':')
      
      return new Date(year, month - 1, day, hour, minute, second)
    } catch (error) {
      console.error('Error converting time:', error)
      return sourceTime
    }
  }

  // Reset API availability (for testing)
  static resetApiAvailability() {
    isGoogleApiAvailable = true
    consecutiveFailures = 0
  }
} 