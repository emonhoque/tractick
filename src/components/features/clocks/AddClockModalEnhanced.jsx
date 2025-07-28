import { useState, useEffect } from 'react'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { useAuth } from '../../../context/AuthContext'
import { useApiKeys } from '../../../hooks/useApiKeys'
import { searchPlacesAutocomplete, searchPlacesLegacy, searchPlacesWithJSAPI } from '../../../utils/googleMaps'
import { TimezoneService } from '../../../utils/timezone'
import { db } from '../../../lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { Search, MapPin, Globe, Clock } from 'lucide-react'

export const AddClockModalEnhanced = ({ isOpen, onClose }) => {
  const [label, setLabel] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [selectedCity, setSelectedCity] = useState(null)

  const { user } = useAuth()
  const { isGoogleMapsAvailable } = useApiKeys()



  // Debounced search using Google Maps API
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setSearching(true)
      setError('') // Clear previous errors
      try {
        let results = []
        
        if (isGoogleMapsAvailable) {
          // Try multiple Google Maps API methods with fallbacks
          try {
            // Use the enhanced Places API search
            const googleResults = await searchPlacesAutocomplete(searchQuery)
            results = googleResults?.filter(place => {
              // Enhanced filtering for cities only
              const name = place.name.toLowerCase()
              const address = (place.formatted_address || '').toLowerCase()
              
              // Business keywords that indicate this is NOT a city
              const businessKeywords = [
                'inc', 'llc', 'corp', 'company', 'restaurant', 'store', 'shop', 'market', 
                'grocery', 'bank', 'hospital', 'school', 'university', 'college', 'hotel', 
                'motel', 'gas', 'station', 'pharmacy', 'clinic', 'office', 'building', 
                'center', 'mall', 'plaza', 'hardware', 'garden', 'rental', 'auto', 'car',
                'dealership', 'pizza', 'burger', 'cafe', 'coffee', 'bar', 'pub', 'grill',
                'diner', 'bakery', 'salon', 'spa', 'gym', 'fitness', 'dentist', 'doctor',
                'lawyer', 'attorney', 'real estate', 'insurance', 'travel', 'agency'
              ]
              
              // Check if name contains business keywords
              const hasBusinessKeyword = businessKeywords.some(keyword => name.includes(keyword))
              
              // Check for business patterns in name
              const businessPatterns = [
                /(inc|llc|corp|co\.|company|store|shop|center|hardware|garden|rental)/i,
                /(restaurant|cafe|bar|grill|diner|bakery)/i,
                /(auto|car|dealership)/i,
                /(pizza|burger|coffee)/i,
                /(salon|spa|gym|fitness)/i,
                /(dentist|doctor|lawyer|attorney)/i,
                /(real estate|insurance|travel|agency)/i
              ]
              const hasBusinessPattern = businessPatterns.some(pattern => pattern.test(name))
              
              // Check if address contains business indicators
              const addressHasBusiness = businessKeywords.some(keyword => address.includes(keyword))
              
              // Check for possessive names (like "Jed's Hardware") which are usually businesses
              const hasPossessive = /'s\s/.test(name)
              
              // Check if it looks like a street address (contains numbers)
              const hasStreetNumber = /\d+/.test(name)
              
              // If it has business indicators, exclude it
              if (hasBusinessKeyword || hasBusinessPattern || addressHasBusiness || hasPossessive || hasStreetNumber) {
                return false
              }
              
              // If we have types from the API, use them for additional filtering
              if (place.types && place.types.length > 0) {
                const cityTypes = ['locality', 'administrative_area_level_1', 'administrative_area_level_2', 'country']
                const isCityType = place.types.some(type => cityTypes.includes(type))
                return isCityType
              }
              
              // If no types available, rely on name/address filtering only
              // Prefer results that look like city names (no business indicators)
              return true
            }).map(place => ({
              id: place.place_id,
              name: place.name,
              country: place.formatted_address,
              timezone: null,
              formatted_address: place.formatted_address,
              geometry: place.geometry
            })) || []
            
            // If filtering removed all results, show all results
            if (results.length === 0 && googleResults && googleResults.length > 0) {
              results = googleResults.map(place => ({
                id: place.place_id,
                name: place.name,
                country: place.formatted_address,
                timezone: null,
                formatted_address: place.formatted_address,
                geometry: place.geometry
              }))
            }
          } catch (newApiError) {
            
            try {
              // Fallback to JavaScript API (no CORS issues)
              const jsApiResults = await searchPlacesWithJSAPI(searchQuery)
              results = jsApiResults?.filter(place => {
                // Enhanced filtering for cities only
                const name = place.name.toLowerCase()
                const address = (place.formatted_address || '').toLowerCase()
                
                // Business keywords that indicate this is NOT a city
                const businessKeywords = [
                  'inc', 'llc', 'corp', 'company', 'restaurant', 'store', 'shop', 'market', 
                  'grocery', 'bank', 'hospital', 'school', 'university', 'college', 'hotel', 
                  'motel', 'gas', 'station', 'pharmacy', 'clinic', 'office', 'building', 
                  'center', 'mall', 'plaza', 'hardware', 'garden', 'rental', 'auto', 'car',
                  'dealership', 'pizza', 'burger', 'cafe', 'coffee', 'bar', 'pub', 'grill',
                  'diner', 'bakery', 'salon', 'spa', 'gym', 'fitness', 'dentist', 'doctor',
                  'lawyer', 'attorney', 'real estate', 'insurance', 'travel', 'agency'
                ]
                
                // Check if name contains business keywords
                const hasBusinessKeyword = businessKeywords.some(keyword => name.includes(keyword))
                
                // Check for business patterns in name
                const businessPatterns = [
                  /(inc|llc|corp|co\.|company|store|shop|center|hardware|garden|rental)/i,
                  /(restaurant|cafe|bar|grill|diner|bakery)/i,
                  /(auto|car|dealership)/i,
                  /(pizza|burger|coffee)/i,
                  /(salon|spa|gym|fitness)/i,
                  /(dentist|doctor|lawyer|attorney)/i,
                  /(real estate|insurance|travel|agency)/i
                ]
                const hasBusinessPattern = businessPatterns.some(pattern => pattern.test(name))
                
                // Check if address contains business indicators
                const addressHasBusiness = businessKeywords.some(keyword => address.includes(keyword))
                
                // Check for possessive names (like "Jed's Hardware") which are usually businesses
                const hasPossessive = /'s\s/.test(name)
                
                // Check if it looks like a street address (contains numbers)
                const hasStreetNumber = /\d+/.test(name)
                
                // If it has business indicators, exclude it
                if (hasBusinessKeyword || hasBusinessPattern || addressHasBusiness || hasPossessive || hasStreetNumber) {
                  return false
                }
                
                // If we have types from the API, use them for additional filtering
                if (place.types && place.types.length > 0) {
                  const cityTypes = ['locality', 'administrative_area_level_1', 'administrative_area_level_2', 'country']
                  const isCityType = place.types.some(type => cityTypes.includes(type))
                  return isCityType
                }
                
                // If no types available, rely on name/address filtering only
                // Prefer results that look like city names (no business indicators)
                return true
              }).map(place => ({
                id: place.place_id,
                name: place.name,
                country: place.formatted_address,
                timezone: null,
                formatted_address: place.formatted_address,
                geometry: place.geometry
              })) || []
            
            // If filtering removed all results, show all results
            if (results.length === 0 && jsApiResults && jsApiResults.length > 0) {
              results = jsApiResults.map(place => ({
                id: place.place_id,
                name: place.name,
                country: place.formatted_address,
                timezone: null,
                formatted_address: place.formatted_address,
                geometry: place.geometry
              }))
            }
            } catch (jsApiError) {
              
              try {
                // Final fallback to legacy API with CORS proxy
                const legacyResults = await searchPlacesLegacy(searchQuery)
                results = legacyResults?.filter(place => {
                  // Enhanced filtering for cities only
                  const name = place.name.toLowerCase()
                  const address = (place.formatted_address || '').toLowerCase()
                  
                  // Business keywords that indicate this is NOT a city
                  const businessKeywords = [
                    'inc', 'llc', 'corp', 'company', 'restaurant', 'store', 'shop', 'market', 
                    'grocery', 'bank', 'hospital', 'school', 'university', 'college', 'hotel', 
                    'motel', 'gas', 'station', 'pharmacy', 'clinic', 'office', 'building', 
                    'center', 'mall', 'plaza', 'hardware', 'garden', 'rental', 'auto', 'car',
                    'dealership', 'pizza', 'burger', 'cafe', 'coffee', 'bar', 'pub', 'grill',
                    'diner', 'bakery', 'salon', 'spa', 'gym', 'fitness', 'dentist', 'doctor',
                    'lawyer', 'attorney', 'real estate', 'insurance', 'travel', 'agency'
                  ]
                  
                  // Check if name contains business keywords
                  const hasBusinessKeyword = businessKeywords.some(keyword => name.includes(keyword))
                  
                  // Check for business patterns in name
                  const businessPatterns = [
                    /(inc|llc|corp|co\.|company|store|shop|center|hardware|garden|rental)/i,
                    /(restaurant|cafe|bar|grill|diner|bakery)/i,
                    /(auto|car|dealership)/i,
                    /(pizza|burger|coffee)/i,
                    /(salon|spa|gym|fitness)/i,
                    /(dentist|doctor|lawyer|attorney)/i,
                    /(real estate|insurance|travel|agency)/i
                  ]
                  const hasBusinessPattern = businessPatterns.some(pattern => pattern.test(name))
                  
                  // Check if address contains business indicators
                  const addressHasBusiness = businessKeywords.some(keyword => address.includes(keyword))
                  
                  // Check for possessive names (like "Jed's Hardware") which are usually businesses
                  const hasPossessive = /'s\s/.test(name)
                  
                  // Check if it looks like a street address (contains numbers)
                  const hasStreetNumber = /\d+/.test(name)
                  
                  // If it has business indicators, exclude it
                  if (hasBusinessKeyword || hasBusinessPattern || addressHasBusiness || hasPossessive || hasStreetNumber) {
                    return false
                  }
                  
                  // If we have types from the API, use them for additional filtering
                  if (place.types && place.types.length > 0) {
                    const cityTypes = ['locality', 'administrative_area_level_1', 'administrative_area_level_2', 'country']
                    const isCityType = place.types.some(type => cityTypes.includes(type))
                    return isCityType
                  }
                  
                  // If no types available, rely on name/address filtering only
                  // Prefer results that look like city names (no business indicators)
                  return true
                }).map(place => ({
                  id: place.place_id,
                  name: place.name,
                  country: place.formatted_address,
                  timezone: null,
                  formatted_address: place.formatted_address,
                  geometry: place.geometry
                })) || []
                
                // If filtering removed all results, show all results
                if (results.length === 0 && legacyResults && legacyResults.length > 0) {
                  results = legacyResults.map(place => ({
                    id: place.place_id,
                    name: place.name,
                    country: place.formatted_address,
                    timezone: null,
                    formatted_address: place.formatted_address,
                    geometry: place.geometry
                  }))
                }
              } catch (legacyError) {
                // All APIs failed, no results
                results = []
              }
            }
          }
        } else {
          // No API available, no results
          results = []
        }
        
        // If no results from APIs, provide a simple fallback
        if (results.length === 0 && searchQuery.length >= 2) {
          // Simple fallback - create a basic city entry
          results = [{
            id: `fallback_${Date.now()}`,
            name: searchQuery,
            country: 'Unknown',
            timezone: null,
            formatted_address: searchQuery,
            geometry: null
          }]
          
          // Show a helpful message about ad blockers
          if (searchQuery.length >= 3) {
            setError('Search results may be limited. If you have an ad blocker enabled, try disabling it for this site to get better search results.')
          }
        }
        
        setSearchResults(results.slice(0, 10)) // Limit to 10 results
      } catch (err) {
        setError('Search failed. Please try again.')
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    }, 500) // Debounce time for API calls

    return () => clearTimeout(timeoutId)
  }, [searchQuery, isGoogleMapsAvailable])

  const handlePlaceSelect = async (place) => {
    setSelectedCity(place)
    setSearchQuery(place.name || place.formatted_address)
    setSearchResults([])
    
    // Get timezone data for the selected place
    if (place.geometry?.location) {
      try {
        const timezoneData = await TimezoneService.getTimezoneFromCoordinates(
          place.geometry.location.lat,
          place.geometry.location.lng
        )
        
        setSelectedCity({
          ...place,
          timezone: timezoneData?.timezone || null,
          offset: timezoneData?.raw_offset || null,
          utc_offset: timezoneData?.utc_offset || null,
          abbreviation: timezoneData?.abbreviation || null,
          timezone_name: timezoneData?.timezone_name || null
        })
      } catch (error) {
        // Try fallback by city name
        const fallbackTimezoneData = TimezoneService.getTimezoneByCityName(place.name)
        
        setSelectedCity({
          ...place,
          timezone: fallbackTimezoneData?.timezone || null,
          offset: fallbackTimezoneData?.raw_offset || null,
          utc_offset: fallbackTimezoneData?.utc_offset || null,
          abbreviation: fallbackTimezoneData?.abbreviation || null,
          timezone_name: fallbackTimezoneData?.timezone_name || null
        })
      }
    } else {
      setSelectedCity({
        ...place,
        timezone: null,
        offset: null,
        utc_offset: null,
        abbreviation: null,
        timezone_name: null
      })
    }
  }

  // Enhanced function to get complete timezone data for caching
  const getCompleteTimezoneData = async (cityData) => {
    try {
      // If we have a timezone, use it directly
      if (cityData.timezone) {
        return {
          timezone: cityData.timezone,
          offset: cityData.offset || 0,
          utc_offset: cityData.utc_offset || '+00:00',
          abbreviation: cityData.abbreviation || 'UTC',
          country_name: cityData.country || 'Unknown',
          timezone_name: cityData.timezone_name || cityData.timezone,
          dst: cityData.dst || false,
          dst_from: null,
          dst_until: null,
          dst_offset: cityData.dst_offset || cityData.offset || 0,
          lastUpdated: new Date()
        }
      }
      
      // Try to get timezone data from coordinates if available
      if (cityData.geometry?.location) {
        const timezoneData = await TimezoneService.getTimezoneFromCoordinates(
          cityData.geometry.location.lat,
          cityData.geometry.location.lng
        )
        
        if (timezoneData) {
          return {
            timezone: timezoneData.timezone,
            offset: timezoneData.raw_offset || 0,
            utc_offset: timezoneData.utc_offset || '+00:00',
            abbreviation: timezoneData.abbreviation || 'UTC',
            country_name: cityData.country || 'Unknown',
            timezone_name: timezoneData.timezone_name || timezoneData.timezone,
            dst: timezoneData.dst || false,
            dst_from: null,
            dst_until: null,
            dst_offset: timezoneData.dst_offset || timezoneData.raw_offset || 0,
            lastUpdated: new Date()
          }
        }
      }
      
      // Try to get timezone data by city name as fallback
      if (cityData.name) {
        const timezoneData = TimezoneService.getTimezoneByCityName(cityData.name)
        
        if (timezoneData) {
          return {
            timezone: timezoneData.timezone,
            offset: timezoneData.raw_offset || 0,
            utc_offset: timezoneData.utc_offset || '+00:00',
            abbreviation: timezoneData.abbreviation || 'UTC',
            country_name: cityData.country || 'Unknown',
            timezone_name: timezoneData.timezone_name || timezoneData.timezone,
            dst: timezoneData.dst || false,
            dst_from: null,
            dst_until: null,
            dst_offset: timezoneData.dst_offset || timezoneData.raw_offset || 0,
            lastUpdated: new Date()
          }
        }
      }
      
      // Return null if no timezone data available
      return null
    } catch (error) {
      // API failed, return null
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !selectedCity) return

    setLoading(true)
    setError('')

    try {
      const timezoneData = await getCompleteTimezoneData(selectedCity)
      
      // Create clock data with fallback timezone if needed
      const clockData = {
        label: label.trim() || selectedCity.name,
        place: selectedCity.name,
        country: selectedCity.country,
        timezoneId: timezoneData?.timezone || 'UTC',
        offset: timezoneData?.offset || 0,
        utc_offset: timezoneData?.utc_offset || '+00:00',
        abbreviation: timezoneData?.abbreviation || 'UTC',
        timezone_name: timezoneData?.timezone_name || 'UTC',
        dst: timezoneData?.dst || false,
        geometry: selectedCity.geometry,
        order: Date.now(),
        createdAt: new Date()
      }
      
      await addDoc(collection(db, `users/${user.uid}/clocks`), clockData)

      setLabel('')
      setSearchQuery('')
      setSearchResults([])
      setSelectedCity(null)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to add clock. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setLabel('')
    setSearchQuery('')
    setSearchResults([])
    setSelectedCity(null)
    setError('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add World Clock"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-[#b91c1c] bg-[#fef2f2] dark:bg-[#450a0a] rounded-lg">
            {error}
          </div>
        )}

        {/* City Search */}
        <div className="relative">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search City
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="city"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for any city..."
              required
              disabled={loading}
              className="pl-10"
            />
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((place, index) => (
                <button
                  key={place.id || index}
                  type="button"
                  onClick={() => handlePlaceSelect(place)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {place.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {place.country}
                      {place.utc_offset && ` • ${place.utc_offset}`}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {searching && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg p-4 text-center">
              <div className="text-gray-500 dark:text-gray-400">Searching...</div>
            </div>
          )}
        </div>

        {/* Selected Display */}
        {selectedCity && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <div>
                <div className="font-medium text-green-900 dark:text-green-100">
                  {selectedCity.name}
                  {selectedCity.country && `, ${selectedCity.country}`}
                </div>
                <div className="text-sm text-green-700 dark:text-green-200">
                  {selectedCity.timezone || 'Timezone not available'}
                  {selectedCity.utc_offset && ` • ${selectedCity.utc_offset}`}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Label */}
        <div>
          <label htmlFor="label" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Custom Label (Optional)
          </label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g., Home, Office"
            disabled={loading}
          />
        </div>

        {/* API Status */}
        {!isGoogleMapsAvailable && (
          <div className="p-3 text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            Google Maps API not configured. Please add your API key to use city search.
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !selectedCity}
            className="flex-1"
          >
            {loading ? 'Adding...' : 'Add Clock'}
          </Button>
        </div>
      </form>
    </Modal>
  )
} 