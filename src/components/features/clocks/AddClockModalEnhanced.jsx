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
            // First try the new Places API
            const googleResults = await searchPlacesAutocomplete(searchQuery)
            results = googleResults?.map(place => ({
              id: place.place_id,
              name: place.name,
              country: place.formatted_address,
              timezone: null,
              formatted_address: place.formatted_address,
              geometry: place.geometry
            })) || []
          } catch (newApiError) {
            
            try {
              // Fallback to JavaScript API (no CORS issues)
              const jsApiResults = await searchPlacesWithJSAPI(searchQuery)
              results = jsApiResults?.map(place => ({
                id: place.place_id,
                name: place.name,
                country: place.formatted_address,
                timezone: null,
                formatted_address: place.formatted_address,
                geometry: place.geometry
              })) || []
            } catch (jsApiError) {
              
              
              try {
                // Final fallback to legacy API with CORS proxy
                const legacyResults = await searchPlacesLegacy(searchQuery)
                results = legacyResults?.map(place => ({
                  id: place.place_id,
                  name: place.name,
                  country: place.formatted_address,
                  timezone: null,
                  formatted_address: place.formatted_address,
                  geometry: place.geometry
                })) || []
              } catch (legacyError) {
                setError('Google Maps search failed. Please try again.')
                results = []
              }
            }
          }
        } else {
          setError('Google Maps API not configured. Please check your API key.')
          results = []
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
    
    // If this is a Google Maps result with coordinates, get timezone info
    if (place.geometry && place.geometry.location) {
      try {
        const { lat, lng } = place.geometry.location
        const timezoneInfo = await TimezoneService.getTimezoneFromCoordinates(lat, lng)
        
        if (timezoneInfo) {
          setSelectedCity({
            ...place,
            timezone: timezoneInfo.timezone,
            offset: timezoneInfo.raw_offset,
            utc_offset: timezoneInfo.utc_offset,
            abbreviation: timezoneInfo.abbreviation,
            timezone_name: timezoneInfo.timezone_name
          })
        } else {
          // Could not get timezone info for selected place
        }
      } catch (error) {
        // Keep the place selected but without timezone - it will be resolved during submission
      }
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
          lastUpdated: new Date(),
          dataSource: 'google_timezone_api'
        }
      }
      
      // If we have coordinates but no timezone, get timezone from coordinates
      if (cityData.geometry && cityData.geometry.location) {
        const { lat, lng } = cityData.geometry.location
        const timezoneInfo = await TimezoneService.getTimezoneFromCoordinates(lat, lng)
        
        if (timezoneInfo) {
          return {
            timezone: timezoneInfo.timezone,
            offset: timezoneInfo.raw_offset,
            utc_offset: timezoneInfo.utc_offset,
            abbreviation: timezoneInfo.abbreviation,
            country_name: cityData.country || 'Unknown',
            timezone_name: timezoneInfo.timezone_name,
            dst: timezoneInfo.dst,
            dst_from: null,
            dst_until: null,
            dst_offset: timezoneInfo.dst_offset,
            lastUpdated: new Date(),
            dataSource: 'google_timezone_api'
          }
        }
      }
      
      // Fallback to basic data if no timezone can be determined
      return {
        timezone: cityData.timezone || 'UTC',
        offset: cityData.offset || 0,
        utc_offset: cityData.utc_offset || '+00:00',
        abbreviation: cityData.abbreviation || 'UTC',
        country_name: cityData.country || 'Unknown',
        timezone_name: cityData.timezone_name || cityData.timezone || 'UTC',
        dst: false,
        dst_from: null,
        dst_until: null,
        dst_offset: cityData.offset || 0,
        lastUpdated: new Date(),
        dataSource: 'fallback'
      }
    } catch (error) {
      // Fallback to basic data if API fails
      return {
        timezone: cityData.timezone || 'UTC',
        offset: cityData.offset || 0,
        utc_offset: cityData.utc_offset || '+00:00',
        abbreviation: cityData.abbreviation || 'UTC',
        country_name: cityData.country || 'Unknown',
        timezone_name: cityData.timezone_name || cityData.timezone || 'UTC',
        dst: false,
        dst_from: null,
        dst_until: null,
        dst_offset: cityData.offset || 0,
        lastUpdated: new Date(),
        dataSource: 'fallback'
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !selectedCity) return

    setLoading(true)
    setError('')

    try {
      // Get complete timezone data for caching in Firebase
      const timezoneData = await getCompleteTimezoneData(selectedCity)
      
      // Ensure we have a valid timezone
      if (!timezoneData.timezone || timezoneData.timezone === 'UTC') {
        setError('Could not determine timezone for this location. Please try a different city.')
        setLoading(false)
        return
      }
      
      await addDoc(collection(db, `users/${user.uid}/clocks`), {
        label: label.trim() || selectedCity.name,
        place: selectedCity.name,
        country: selectedCity.country,
        timezoneId: timezoneData.timezone, // Use the resolved timezone
        // Cache all timezone data for local calculations
        ...timezoneData,
        // Save geometry data for weather API calls
        geometry: selectedCity.geometry,
        // Additional metadata
        order: Date.now(), // Use timestamp as initial order
        createdAt: new Date()
      })

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

        {/* Selected City Display */}
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
                  {selectedCity.timezone}
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