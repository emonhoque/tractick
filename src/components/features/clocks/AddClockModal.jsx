import { useState, useEffect } from 'react'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { useAuth } from '../../../context/AuthContext'
import { db } from '../../../lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { TimezoneService } from '../../../utils/timezone'
import { LoadingSpinner } from '../../common/LoadingSpinner'
import { Search, MapPin } from 'lucide-react'

export const AddClockModal = ({ isOpen, onClose }) => {
  const [label, setLabel] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const { user, firebaseAvailable } = useAuth()

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 2) {
        searchCities(searchQuery)
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const searchCities = async (query) => {
    setSearching(true)
    try {
      const results = await TimezoneService.searchCities(query)
      setSearchResults(results)
    } catch (error) {
      setError('Failed to search cities')
    } finally {
      setSearching(false)
    }
  }

  const handleCitySelect = (city) => {
    setSelectedCity(city)
    setSearchQuery(city.name)
    setSearchResults([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !firebaseAvailable) {
      setError('Firebase not available')
      return
    }

    if (!selectedCity) {
      setError('Please select a city')
      return
    }

    setLoading(true)
    setError('')

    try {
      await addDoc(collection(db, `users/${user.uid}/clocks`), {
        label: label.trim() || selectedCity.name,
        place: selectedCity.name,
        country: selectedCity.country,
        timezoneId: selectedCity.timezone,
        offset: selectedCity.offset,
        createdAt: new Date()
      })

      setLabel('')
      setSearchQuery('')
      setSelectedCity(null)
      setSearchResults([])
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setLabel('')
    setSearchQuery('')
    setSelectedCity(null)
    setSearchResults([])
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
                      <div className="p-4 text-sm text-[#b91c1c] bg-[#fef2f2] dark:bg-[#450a0a] rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search City
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="city"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a city..."
              className="pl-10"
              disabled={loading || !firebaseAvailable}
            />
          </div>
          
          {/* Search Results */}
          {searching && (
            <div className="mt-2 flex items-center justify-center py-2">
              <LoadingSpinner size="sm" text="Searching..." />
            </div>
          )}
          
          {searchResults.length > 0 && !searching && (
            <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              {searchResults.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-[#0a0a0a] border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {city.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {city.country} • {TimezoneService.formatOffset(city.offset)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedCity && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <div>
                <div className="font-medium text-green-900 dark:text-green-100">
                  {selectedCity.name}, {selectedCity.country}
                </div>
                <div className="text-sm text-green-700 dark:text-green-200">
                  {TimezoneService.formatOffset(selectedCity.offset)}
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="label" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Custom Label (Optional)
          </label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g., Home, Office"
            disabled={loading || !firebaseAvailable}
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={loading || !firebaseAvailable || !selectedCity}
          >
            {loading ? 'Adding...' : 'Add Clock'}
          </Button>
        </div>
      </form>
    </Modal>
  )
} 