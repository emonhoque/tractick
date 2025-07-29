// Comprehensive Timezone Database with Fallback Data
// Based on tz database time zones from Wikipedia
// This provides offline fallback when API calls fail

export const TIMEZONE_DATABASE = {
  // Major timezones with detailed information
  'UTC': {
    name: 'Coordinated Universal Time',
    offset: 0,
    offsetFormatted: '+00:00',
    abbreviation: 'UTC',
    country: 'International',
    region: 'UTC',
    dst: false,
    dstOffset: 0
  },
  'America/New_York': {
    name: 'Eastern Time',
    offset: -18000,
    offsetFormatted: '-05:00',
    abbreviation: 'EST',
    country: 'United States',
    region: 'America',
    dst: true,
    dstOffset: 3600,
    dstAbbreviation: 'EDT'
  },
  'America/Chicago': {
    name: 'Central Time',
    offset: -21600,
    offsetFormatted: '-06:00',
    abbreviation: 'CST',
    country: 'United States',
    region: 'America',
    dst: true,
    dstOffset: 3600,
    dstAbbreviation: 'CDT'
  },
  'America/Denver': {
    name: 'Mountain Time',
    offset: -25200,
    offsetFormatted: '-07:00',
    abbreviation: 'MST',
    country: 'United States',
    region: 'America',
    dst: true,
    dstOffset: 3600,
    dstAbbreviation: 'MDT'
  },
  'America/Los_Angeles': {
    name: 'Pacific Time',
    offset: -28800,
    offsetFormatted: '-08:00',
    abbreviation: 'PST',
    country: 'United States',
    region: 'America',
    dst: true,
    dstOffset: 3600,
    dstAbbreviation: 'PDT'
  },
  'Europe/London': {
    name: 'British Time',
    offset: 0,
    offsetFormatted: '+00:00',
    abbreviation: 'GMT',
    country: 'United Kingdom',
    region: 'Europe',
    dst: true,
    dstOffset: 3600,
    dstAbbreviation: 'BST'
  },
  'Europe/Paris': {
    name: 'Central European Time',
    offset: 3600,
    offsetFormatted: '+01:00',
    abbreviation: 'CET',
    country: 'France',
    region: 'Europe',
    dst: true,
    dstOffset: 3600,
    dstAbbreviation: 'CEST'
  },
  'Europe/Berlin': {
    name: 'Central European Time',
    offset: 3600,
    offsetFormatted: '+01:00',
    abbreviation: 'CET',
    country: 'Germany',
    region: 'Europe',
    dst: true,
    dstOffset: 3600,
    dstAbbreviation: 'CEST'
  },
  'Asia/Tokyo': {
    name: 'Japan Standard Time',
    offset: 32400,
    offsetFormatted: '+09:00',
    abbreviation: 'JST',
    country: 'Japan',
    region: 'Asia',
    dst: false,
    dstOffset: 0
  },
  'Asia/Shanghai': {
    name: 'China Standard Time',
    offset: 28800,
    offsetFormatted: '+08:00',
    abbreviation: 'CST',
    country: 'China',
    region: 'Asia',
    dst: false,
    dstOffset: 0
  },
  'Asia/Kolkata': {
    name: 'India Standard Time',
    offset: 19800,
    offsetFormatted: '+05:30',
    abbreviation: 'IST',
    country: 'India',
    region: 'Asia',
    dst: false,
    dstOffset: 0
  },
  'Australia/Sydney': {
    name: 'Australian Eastern Time',
    offset: 36000,
    offsetFormatted: '+10:00',
    abbreviation: 'AEST',
    country: 'Australia',
    region: 'Australia',
    dst: true,
    dstOffset: 3600,
    dstAbbreviation: 'AEDT'
  },
  'Pacific/Auckland': {
    name: 'New Zealand Standard Time',
    offset: 43200,
    offsetFormatted: '+12:00',
    abbreviation: 'NZST',
    country: 'New Zealand',
    region: 'Pacific',
    dst: true,
    dstOffset: 3600,
    dstAbbreviation: 'NZDT'
  }
}

// Extended timezone database with more regions
export const EXTENDED_TIMEZONE_DATABASE = {
  // Africa
  'Africa/Cairo': { name: 'Eastern European Time', offset: 7200, offsetFormatted: '+02:00', abbreviation: 'EET', country: 'Egypt', region: 'Africa', dst: true, dstOffset: 3600, dstAbbreviation: 'EEST' },
  'Africa/Johannesburg': { name: 'South Africa Standard Time', offset: 7200, offsetFormatted: '+02:00', abbreviation: 'SAST', country: 'South Africa', region: 'Africa', dst: false, dstOffset: 0 },
  'Africa/Lagos': { name: 'West Africa Time', offset: 3600, offsetFormatted: '+01:00', abbreviation: 'WAT', country: 'Nigeria', region: 'Africa', dst: false, dstOffset: 0 },
  
  // Asia
  'Asia/Dubai': { name: 'Gulf Standard Time', offset: 14400, offsetFormatted: '+04:00', abbreviation: 'GST', country: 'United Arab Emirates', region: 'Asia', dst: false, dstOffset: 0 },
  'Asia/Riyadh': { name: 'Arabia Standard Time', offset: 10800, offsetFormatted: '+03:00', abbreviation: 'AST', country: 'Saudi Arabia', region: 'Asia', dst: false, dstOffset: 0 },
  'Asia/Jeddah': { name: 'Arabia Standard Time', offset: 10800, offsetFormatted: '+03:00', abbreviation: 'AST', country: 'Saudi Arabia', region: 'Asia', dst: false, dstOffset: 0 },
  'Asia/Singapore': { name: 'Singapore Time', offset: 28800, offsetFormatted: '+08:00', abbreviation: 'SGT', country: 'Singapore', region: 'Asia', dst: false, dstOffset: 0 },
  'Asia/Seoul': { name: 'Korea Standard Time', offset: 32400, offsetFormatted: '+09:00', abbreviation: 'KST', country: 'South Korea', region: 'Asia', dst: false, dstOffset: 0 },
  'Asia/Bangkok': { name: 'Indochina Time', offset: 25200, offsetFormatted: '+07:00', abbreviation: 'ICT', country: 'Thailand', region: 'Asia', dst: false, dstOffset: 0 },
  
  // Europe
  'Europe/Moscow': { name: 'Moscow Time', offset: 10800, offsetFormatted: '+03:00', abbreviation: 'MSK', country: 'Russia', region: 'Europe', dst: false, dstOffset: 0 },
  'Europe/Rome': { name: 'Central European Time', offset: 3600, offsetFormatted: '+01:00', abbreviation: 'CET', country: 'Italy', region: 'Europe', dst: true, dstOffset: 3600, dstAbbreviation: 'CEST' },
  'Europe/Madrid': { name: 'Central European Time', offset: 3600, offsetFormatted: '+01:00', abbreviation: 'CET', country: 'Spain', region: 'Europe', dst: true, dstOffset: 3600, dstAbbreviation: 'CEST' },
  'Europe/Amsterdam': { name: 'Central European Time', offset: 3600, offsetFormatted: '+01:00', abbreviation: 'CET', country: 'Netherlands', region: 'Europe', dst: true, dstOffset: 3600, dstAbbreviation: 'CEST' },
  
  // America
  'America/Toronto': { name: 'Eastern Time', offset: -18000, offsetFormatted: '-05:00', abbreviation: 'EST', country: 'Canada', region: 'America', dst: true, dstOffset: 3600, dstAbbreviation: 'EDT' },
  'America/Vancouver': { name: 'Pacific Time', offset: -28800, offsetFormatted: '-08:00', abbreviation: 'PST', country: 'Canada', region: 'America', dst: true, dstOffset: 3600, dstAbbreviation: 'PDT' },
  'America/Mexico_City': { name: 'Central Time', offset: -21600, offsetFormatted: '-06:00', abbreviation: 'CST', country: 'Mexico', region: 'America', dst: true, dstOffset: 3600, dstAbbreviation: 'CDT' },
  'America/Sao_Paulo': { name: 'Brasília Time', offset: -10800, offsetFormatted: '-03:00', abbreviation: 'BRT', country: 'Brazil', region: 'America', dst: true, dstOffset: 3600, dstAbbreviation: 'BRST' },
  
  // Australia/Oceania
  'Australia/Melbourne': { name: 'Australian Eastern Time', offset: 36000, offsetFormatted: '+10:00', abbreviation: 'AEST', country: 'Australia', region: 'Australia', dst: true, dstOffset: 3600, dstAbbreviation: 'AEDT' },
  'Australia/Perth': { name: 'Australian Western Time', offset: 28800, offsetFormatted: '+08:00', abbreviation: 'AWST', country: 'Australia', region: 'Australia', dst: false, dstOffset: 0 },
  'Pacific/Honolulu': { name: 'Hawaii-Aleutian Time', offset: -36000, offsetFormatted: '-10:00', abbreviation: 'HST', country: 'United States', region: 'Pacific', dst: false, dstOffset: 0 }
}

// Complete timezone database combining both
export const COMPLETE_TIMEZONE_DATABASE = {
  ...TIMEZONE_DATABASE,
  ...EXTENDED_TIMEZONE_DATABASE
}

// Timezone lookup by country
export const TIMEZONE_BY_COUNTRY = {
  'United States': ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Pacific/Honolulu'],
  'Canada': ['America/Toronto', 'America/Vancouver'],
  'United Kingdom': ['Europe/London'],
  'France': ['Europe/Paris'],
  'Germany': ['Europe/Berlin'],
  'Italy': ['Europe/Rome'],
  'Spain': ['Europe/Madrid'],
  'Netherlands': ['Europe/Amsterdam'],
  'Russia': ['Europe/Moscow'],
  'Japan': ['Asia/Tokyo'],
  'China': ['Asia/Shanghai'],
  'India': ['Asia/Kolkata'],
  'South Korea': ['Asia/Seoul'],
  'Thailand': ['Asia/Bangkok'],
  'Singapore': ['Asia/Singapore'],
  'United Arab Emirates': ['Asia/Dubai'],
  'Saudi Arabia': ['Asia/Riyadh', 'Asia/Jeddah'],
  'Australia': ['Australia/Sydney', 'Australia/Melbourne', 'Australia/Perth'],
  'New Zealand': ['Pacific/Auckland'],
  'Brazil': ['America/Sao_Paulo'],
  'Mexico': ['America/Mexico_City'],
  'Egypt': ['Africa/Cairo'],
  'South Africa': ['Africa/Johannesburg'],
  'Nigeria': ['Africa/Lagos']
}

// Timezone lookup by offset (for coordinate-based estimation)
export const TIMEZONE_BY_OFFSET = {
  '-12:00': ['Pacific/Midway', 'Pacific/Niue'],
  '-11:00': ['Pacific/Pago_Pago', 'Pacific/Niue'],
  '-10:00': ['Pacific/Honolulu', 'Pacific/Rarotonga'],
  '-09:00': ['America/Anchorage', 'Pacific/Gambier'],
  '-08:00': ['America/Los_Angeles', 'America/Vancouver', 'America/Tijuana'],
  '-07:00': ['America/Denver', 'America/Phoenix', 'America/Edmonton'],
  '-06:00': ['America/Chicago', 'America/Mexico_City', 'America/Winnipeg'],
  '-05:00': ['America/New_York', 'America/Toronto', 'America/Bogota'],
  '-04:00': ['America/Sao_Paulo', 'America/Santiago', 'America/Caracas'],
  '-03:00': ['America/Argentina/Buenos_Aires', 'America/Montevideo'],
  '-02:00': ['America/Noronha', 'Atlantic/South_Georgia'],
  '-01:00': ['Atlantic/Azores', 'Atlantic/Cape_Verde'],
  '+00:00': ['UTC', 'Europe/London', 'Europe/Lisbon', 'Africa/Casablanca'],
  '+01:00': ['Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'Europe/Madrid', 'Europe/Amsterdam', 'Africa/Lagos'],
  '+02:00': ['Europe/Moscow', 'Africa/Cairo', 'Africa/Johannesburg', 'Asia/Jerusalem'],
  '+03:00': ['Asia/Baghdad', 'Asia/Riyadh', 'Europe/Minsk'],
  '+04:00': ['Asia/Dubai', 'Asia/Baku', 'Europe/Samara'],
  '+05:00': ['Asia/Tashkent', 'Asia/Karachi'],
  '+05:30': ['Asia/Kolkata'],
  '+06:00': ['Asia/Almaty', 'Asia/Dhaka'],
  '+07:00': ['Asia/Bangkok', 'Asia/Ho_Chi_Minh', 'Asia/Jakarta'],
  '+08:00': ['Asia/Shanghai', 'Asia/Singapore', 'Asia/Manila', 'Australia/Perth'],
  '+09:00': ['Asia/Tokyo', 'Asia/Seoul', 'Asia/Pyongyang'],
  '+10:00': ['Australia/Sydney', 'Australia/Melbourne', 'Asia/Vladivostok'],
  '+11:00': ['Pacific/Guadalcanal', 'Asia/Magadan'],
  '+12:00': ['Pacific/Auckland', 'Pacific/Fiji', 'Asia/Kamchatka']
}

// Helper functions for timezone database operations
export class TimezoneDatabase {
  // Get timezone info by timezone ID
  static getTimezoneInfo(timezoneId) {
    return COMPLETE_TIMEZONE_DATABASE[timezoneId] || null
  }

  // Get all timezones for a country
  static getTimezonesByCountry(country) {
    return TIMEZONE_BY_COUNTRY[country] || []
  }

  // Get timezones by UTC offset
  static getTimezonesByOffset(offset) {
    return TIMEZONE_BY_OFFSET[offset] || []
  }

  // Search timezones by name or country
  static searchTimezones(query) {
    if (!query || query.length < 2) return []
    
    const results = []
    const searchTerm = query.toLowerCase()
    
    Object.entries(COMPLETE_TIMEZONE_DATABASE).forEach(([id, info]) => {
      if (
        id.toLowerCase().includes(searchTerm) ||
        info.name.toLowerCase().includes(searchTerm) ||
        info.country.toLowerCase().includes(searchTerm) ||
        info.abbreviation.toLowerCase().includes(searchTerm)
      ) {
        // Calculate relevance score for better sorting
        let score = 0
        const cityName = info.name.toLowerCase()
        
        // Prioritize exact matches
        if (cityName === searchTerm) score += 100
        if (cityName.startsWith(searchTerm)) score += 50
        if (cityName.includes(searchTerm)) score += 25
        
        // Prioritize major cities (those with shorter timezone IDs)
        if (id.split('/').length === 2) score += 10
        
        // Prioritize cities over countries
        if (info.region !== 'UTC') score += 5
        
        results.push({
          id,
          ...info,
          relevanceScore: score
        })
      }
    })
    
    // Sort by relevance score and return top results
    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 20)
  }

  // Estimate timezone from coordinates (simplified)
  static estimateTimezoneFromCoordinates(lat, lng) {
    // Simple estimation based on longitude
    const hourOffset = Math.round(lng / 15)
    const offsetFormatted = hourOffset >= 0 ? `+${hourOffset.toString().padStart(2, '0')}:00` : `${hourOffset.toString().padStart(3, '0')}:00`
    
    // Get possible timezones for this offset
    const possibleTimezones = this.getTimezonesByOffset(offsetFormatted)
    
    if (possibleTimezones.length > 0) {
      const timezoneId = possibleTimezones[0]
      const timezoneInfo = this.getTimezoneInfo(timezoneId)
      
      if (timezoneInfo) {
        return {
          timezone: timezoneId,
          offset: timezoneInfo.offset,
          offsetFormatted: timezoneInfo.offsetFormatted,
          abbreviation: timezoneInfo.abbreviation,
          name: timezoneInfo.name,
          country: timezoneInfo.country
        }
      }
    }
    
    // Fallback to UTC
    return {
      timezone: 'UTC',
      offset: 0,
      offsetFormatted: '+00:00',
      abbreviation: 'UTC',
      name: 'Coordinated Universal Time',
      country: 'International'
    }
  }

  // Get all available timezones
  static getAllTimezones() {
    return Object.entries(COMPLETE_TIMEZONE_DATABASE).map(([id, info]) => ({
      id,
      ...info
    }))
  }

  // Check if timezone exists in database
  static hasTimezone(timezoneId) {
    return timezoneId in COMPLETE_TIMEZONE_DATABASE
  }
} 