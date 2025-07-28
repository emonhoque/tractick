// Enhanced Timezone Service using Google's Time Zone API
import { API_KEYS } from '../constants'


// Cache for API responses to reduce rate limiting
const apiCache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Rate limiting protection
let lastApiCall = 0
const MIN_API_INTERVAL = 1000 // 1 second between API calls



// Helper function to get the appropriate API base URL
const getGoogleApiUrl = (endpoint) => {
  return `https://maps.googleapis.com/maps/api${endpoint}`
}

export class TimezoneService {



  // Get timezone data from coordinates using Google Time Zone API
  static async getTimezoneFromCoordinates(lat, lng, timestamp = null) {
    try {
      // Check if API key is available
      if (!API_KEYS.GOOGLE_MAPS) {
        return null
      }
      
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
        return cached?.data || null
      }
      lastApiCall = now
      
      // Try direct API call first
      try {
        const encodedLocation = encodeURIComponent(`${lat},${lng}`)
        const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${encodedLocation}&timestamp=${currentTimestamp}&key=${API_KEYS.GOOGLE_MAPS}`
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        })
        
        if (!response.ok) {
          return null
        }
        
        const data = await response.json()
        
        // If we get REQUEST_DENIED or any error, return null silently
        if (data.status !== 'OK') {
          return null
        }
        
        // If we get a successful response, process it
        const timezoneData = {
          timezone: data.timeZoneId,
          raw_offset: data.rawOffset,
          utc_offset: this.formatUTCOffset(data.rawOffset),
          abbreviation: this.getTimezoneAbbreviation(data.timeZoneId),
          dst_offset: data.dstOffset,
          timezone_name: data.timeZoneName,
          dst: data.dstOffset !== 0,
          lastUpdated: new Date()
        }
        
        // Cache the response
        apiCache.set(cacheKey, {
          data: timezoneData,
          timestamp: Date.now()
        })
        
        return timezoneData
        
      } catch (fetchError) {
        // API failed, return null silently
        return null
      }
    } catch (error) {
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
      throw error
    }
  }

  // Get current time for a timezone (local calculation)
  static getCurrentTime(timezone, hour12 = false) {
    try {
      // Handle null or undefined timezone
      if (!timezone) {
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
      return 'Invalid timezone'
    }
  }

  // Get current date for a timezone (local calculation)
  static getCurrentDate(timezone) {
    try {
      // Handle null or undefined timezone
      if (!timezone) {
        timezone = 'UTC'
      }

      return new Date().toLocaleDateString('en-US', { 
        timeZone: timezone,
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return 'Invalid timezone'
    }
  }

  // Get timezone offset for a timezone (local calculation)
  static getTimezoneOffset(timezone, date = null) {
    try {
      // Handle null or undefined timezone
      if (!timezone) {
        return 0
      }

      // Use provided date or current date
      const targetDate = date || new Date()
      
      // Get the time in the target timezone as a string
      const targetTimeString = targetDate.toLocaleString('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
      
      // Parse the target time string
      const [datePart, timePart] = targetTimeString.split(', ')
      const [month, day, year] = datePart.split('/')
      const [hour, minute, second] = timePart.split(':')
      
      // Create a Date object for the target timezone
      const parsedTargetDate = new Date(year, month - 1, day, hour, minute, second)
      
      // Calculate the difference between UTC and target timezone
      const offsetMs = parsedTargetDate.getTime() - targetDate.getTime()
      
      return Math.round(offsetMs / 1000) // Convert to seconds
    } catch (error) {
      return 0
    }
  }

  // Get timezone abbreviation
  static getTimezoneAbbreviation(timezone) {
    if (!timezone) return 'UTC'
    
    try {
      const date = new Date()
      const options = { timeZoneName: 'short' }
      const timeString = date.toLocaleString('en-US', { timeZone: timezone, ...options })
      const match = timeString.match(/\s([A-Z]{3,4})\s*$/)
      return match ? match[1] : 'UTC'
    } catch (error) {
      return 'UTC'
    }
  }

  // Check if DST is active for a timezone
  static isDSTActive(timezone) {
    try {
      // Handle null or undefined timezone
      if (!timezone) {
        return false
      }

      const now = new Date()
      
      // Get offsets for January and July in the target timezone
      const jan = new Date(now.getFullYear(), 0, 1)
      const jul = new Date(now.getFullYear(), 6, 1)
      
      const janOffset = this.getTimezoneOffset(timezone, jan)
      const julOffset = this.getTimezoneOffset(timezone, jul)
      const currentOffset = this.getTimezoneOffset(timezone, now)
      
      // DST is active if current offset is greater than the minimum offset
      return currentOffset > Math.min(janOffset, julOffset)
    } catch (error) {
      return false
    }
  }

  // Get effective offset for a timezone (including DST)
  static getEffectiveOffset(timezone, baseOffset = null) {
    try {
      // Handle null or undefined timezone
      if (!timezone) {
        return 0
      }

      const offset = this.getTimezoneOffset(timezone)
      const isDST = this.isDSTActive(timezone)
      
      // If DST is active, add 1 hour (3600 seconds)
      return isDST ? offset + 3600 : offset
    } catch (error) {
      return baseOffset || 0
    }
  }

  // Get fallback time data for a timezone
  static getFallbackTimeData(timezone) {
    try {
      // Handle null or undefined timezone
      if (!timezone) {
        return {
          time: 'Invalid timezone',
          date: 'Invalid timezone',
          offset: 0,
          abbreviation: 'UTC',
          isDST: false
        }
      }

      const time = this.getCurrentTime(timezone)
      const date = this.getCurrentDate(timezone)
      const offset = this.getTimezoneOffset(timezone)
      const abbreviation = this.getTimezoneAbbreviation(timezone)
      const isDST = this.isDSTActive(timezone)

      return {
        time,
        date,
        offset,
        abbreviation,
        isDST
      }
    } catch (error) {
      return {
        time: 'Error',
        date: 'Error',
        offset: 0,
        abbreviation: 'UTC',
        isDST: false
      }
    }
  }

  // Extract city name from timezone
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

  // Extract country from timezone
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
      return sourceTime
    }
  }




} 