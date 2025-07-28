// Timezone Service using Google Time Zone API (Web Service) - v2.0
// This works with HTTP referrer restrictions by using direct API calls
// Updated: 2024-12-05 - Removed JavaScript API dependency

import { API_KEYS } from '../constants'

export class TimezoneJsApiService {
  static async getTimezoneFromCoordinates(lat, lng, timestamp = null) {
    try {
      if (!API_KEYS.GOOGLE_MAPS) {
        return null
      }

      // Use current timestamp if not provided
      const currentTimestamp = timestamp || Math.floor(Date.now() / 1000)
      
      // Use the Google Time Zone API web service directly
      // This is the correct approach according to Google's documentation
      const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${currentTimestamp}&key=${API_KEYS.GOOGLE_MAPS}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Time Zone API request failed: ${response.status}`)
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
          lastUpdated: new Date()
        }
        return timezoneData
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  }
  
  // Format UTC offset for display
  static formatUTCOffset(offsetSeconds) {
    if (offsetSeconds === null || offsetSeconds === undefined || isNaN(offsetSeconds)) {
      return '+00:00'
    }
    
    const hours = Math.floor(offsetSeconds / 3600)
    const minutes = Math.floor((offsetSeconds % 3600) / 60)
    const sign = hours >= 0 ? '+' : ''
    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
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
} 