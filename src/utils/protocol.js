// Protocol handler utility for tractick:// URLs
import { ROUTES } from '../constants'

/**
 * Parse a tractick protocol URL and return navigation info
 * @param {string} protocolUrl - The full protocol URL (e.g., "web+tractick://timer/5min")
 * @returns {Object} Navigation object with route and params
 */
export function parseProtocolUrl(protocolUrl) {
  try {
    // Remove the protocol prefix
    const url = protocolUrl.replace('web+tractick://', '')
    
    // Split by '/' to get parts
    const parts = url.split('/').filter(Boolean)
    
    if (parts.length === 0) {
      return { route: ROUTES.HOME }
    }
    
    const action = parts[0].toLowerCase()
    const params = parts.slice(1)
    
    switch (action) {
      case 'timer':
        if (params.length > 0) {
          const duration = params[0]
          return {
            route: ROUTES.TIMER,
            params: { duration }
          }
        }
        return { route: ROUTES.TIMER }
        
      case 'stopwatch':
        return { route: ROUTES.STOPWATCH }
        
      case 'world-clock':
      case 'clock':
        if (params.length > 0) {
          const timezone = params[0]
          return {
            route: ROUTES.WORLD_CLOCK,
            params: { timezone }
          }
        }
        return { route: ROUTES.WORLD_CLOCK }
        
      case 'converter':
      case 'time-converter':
        return { route: ROUTES.TIME_CONVERTER }
        
      case 'history':
        return { route: ROUTES.HISTORY }
        
      case 'weather':
        return { route: ROUTES.WEATHER }
        
      case 'screensaver':
      case 'saver':
        return { route: ROUTES.SCREENSAVER }
        
      case 'home':
      case '':
        return { route: ROUTES.HOME }
        
      default:
        // Try to parse as a timer duration
        const duration = action
        if (isValidDuration(duration)) {
          return {
            route: ROUTES.TIMER,
            params: { duration }
          }
        }
        return { route: ROUTES.HOME }
    }
  } catch (error) {
    return { route: ROUTES.HOME }
  }
}

/**
 * Check if a string represents a valid duration
 * @param {string} duration - Duration string (e.g., "5min", "1h", "30s")
 * @returns {boolean}
 */
function isValidDuration(duration) {
  const durationRegex = /^(\d+)(s|m|min|h|hr|hours?|minutes?|seconds?)$/i
  return durationRegex.test(duration)
}

/**
 * Convert duration string to seconds
 * @param {string} duration - Duration string (e.g., "5min", "1h", "30s")
 * @returns {number} Duration in seconds
 */
export function parseDuration(duration) {
  const durationRegex = /^(\d+)(s|m|min|h|hr|hours?|minutes?|seconds?)$/i
  const match = duration.match(durationRegex)
  
  if (!match) return null
  
  const value = parseInt(match[1])
  const unit = match[2].toLowerCase()
  
  switch (unit) {
    case 's':
    case 'seconds':
      return value
    case 'm':
    case 'min':
    case 'minutes':
      return value * 60
    case 'h':
    case 'hr':
    case 'hours':
      return value * 3600
    default:
      return null
  }
}

/**
 * Generate protocol URL examples
 */
export const PROTOCOL_EXAMPLES = {
  timer: 'web+tractick://timer/5min',
  stopwatch: 'web+tractick://stopwatch',
  worldClock: 'web+tractick://world-clock/UTC',
  converter: 'web+tractick://converter',
  screensaver: 'web+tractick://screensaver',
  home: 'web+tractick://home'
} 