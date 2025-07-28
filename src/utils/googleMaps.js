import { API_KEYS } from '../constants'

// Google Maps API utility functions - Updated to use Places API (New)
export const loadGoogleMapsAPI = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps)
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEYS.GOOGLE_MAPS}&libraries=places,geometry`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      resolve(window.google.maps)
    }
    
    script.onerror = () => {
      reject(new Error('Failed to load Google Maps API'))
    }
    
    document.head.appendChild(script)
  })
}

// Places API (New) - Text Search with proper error handling
export const searchPlaces = async (query) => {
  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places:searchText`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEYS.GOOGLE_MAPS,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location'
        },
        body: JSON.stringify({
          textQuery: query,
          maxResultCount: 10
        })
      }
    )
    
    if (!response.ok) {
      throw new Error(`Places API (New) request failed: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.places) {
      return data.places.map(place => ({
        place_id: place.id,
        name: place.displayName?.text || 'Unknown',
        formatted_address: place.formattedAddress || 'Unknown',
        geometry: place.location ? {
          location: {
            lat: place.location.latitude,
            lng: place.location.longitude
          }
        } : null
      }))
    } else {
      return []
    }
  } catch (error) {
    throw error
  }
}

// Places API (New) - Get Place Details
export const getPlaceDetails = async (placeId) => {
  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          'X-Goog-Api-Key': API_KEYS.GOOGLE_MAPS,
          'X-Goog-FieldMask': 'id,displayName,formattedAddress,location,types'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`Places API (New) details request failed: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      place_id: data.id,
      name: data.displayName?.text || 'Unknown',
      formatted_address: data.formattedAddress || 'Unknown',
      geometry: data.location ? {
        location: {
          lat: data.location.latitude,
          lng: data.location.longitude
        }
      } : null,
      types: data.types || []
    }
  } catch (error) {
    throw error
  }
}

// Enhanced Places API search with better error handling
export const searchPlacesAutocomplete = async (query) => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return []
    }

    // Check if API key is available
    if (!API_KEYS.GOOGLE_MAPS) {
      return []
    }

    // Try multiple search strategies for better city results
    const searchStrategies = [
      `${query} city`,
      `${query}`,
      `city of ${query}`,
      `${query} municipality`
    ]

    let allResults = []

    for (const searchQuery of searchStrategies) {
      try {
        const response = await fetch(
          `https://places.googleapis.com/v1/places:searchText`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': API_KEYS.GOOGLE_MAPS,
              'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.types'
            },
            body: JSON.stringify({
              textQuery: searchQuery,
              maxResultCount: 5
            })
          }
        )
        
        if (!response.ok) {
          continue // Try next strategy
        }
        
        const data = await response.json()
        
        if (data.places && data.places.length > 0) {
          const results = data.places.map(place => ({
            place_id: place.id,
            name: place.displayName?.text || 'Unknown',
            formatted_address: place.formattedAddress || 'Unknown',
            types: place.types || [],
            geometry: place.location ? {
              location: {
                lat: place.location.latitude,
                lng: place.location.longitude
              }
            } : null
          }))
          allResults.push(...results)
        }
      } catch (strategyError) {
        continue // Try next strategy
      }
    }
    
    // Remove duplicates based on place_id and return unique results
    const uniqueResults = allResults.filter((place, index, self) => 
      index === self.findIndex(p => p.place_id === place.place_id)
    )
    
    return uniqueResults.slice(0, 10) // Return max 10 results
  } catch (error) {
    // Return empty array instead of throwing error
    return []
  }
}

// Legacy fallback for backward compatibility
export const searchPlacesLegacy = async (query) => {
  try {
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
    
    // Try direct API first
    let url = `${baseUrl}?input=${encodeURIComponent(query + ' city')}&inputtype=textquery&fields=place_id,name,formatted_address,geometry&key=${API_KEYS.GOOGLE_MAPS}`
    
    let response
    try {
      response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      })
    } catch (corsError) {
      // If CORS fails, return empty results instead of trying proxy
      return []
    }
    
    if (!response.ok) {
      return []
    }
    
    const data = await response.json()
    
    if (data.status === 'OK' && data.candidates) {
      return data.candidates.map(place => ({
        place_id: place.place_id,
        name: place.name,
        formatted_address: place.formatted_address,
        geometry: place.geometry
      }))
    } else if (data.status === 'ZERO_RESULTS') {
      return []
    } else {
      return []
    }
  } catch (error) {
    return []
  }
}

// Alternative search using Google Maps JavaScript API (no CORS issues)
export const searchPlacesWithJSAPI = async (query) => {
  try {
    // Load Google Maps API if not already loaded
    if (!window.google || !window.google.maps) {
      await loadGoogleMapsAPI()
    }

    return new Promise((resolve, reject) => {
      try {
        const service = new window.google.maps.places.PlacesService(document.createElement('div'))
        
        const request = {
          query: `${query} city`,
          fields: ['place_id', 'name', 'formatted_address', 'geometry', 'types']
        }
        
        service.findPlaceFromQuery(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            const places = results.map(place => ({
              place_id: place.place_id,
              name: place.name,
              formatted_address: place.formatted_address,
              geometry: place.geometry,
              types: place.types
            }))
            resolve(places)
          } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            resolve([])
          } else {
            // Silently fail instead of throwing error
            resolve([])
          }
        })
      } catch (error) {
        // Silently fail instead of throwing error
        resolve([])
      }
    })
  } catch (error) {
    // Return empty array instead of throwing error
    return []
  }
} 