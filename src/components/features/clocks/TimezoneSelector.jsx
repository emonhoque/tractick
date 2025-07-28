import { useState, useEffect, useRef } from 'react'
import { Search, Globe, Clock } from 'lucide-react'
import { TimezoneService } from '../../../utils/timezone'

export const TimezoneSelector = ({ 
  onTimezoneSelect, 
  selectedTimezone = null, 
  placeholder = "Search timezones...",
  className = "" 
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef(null)

  // Search timezones when query changes
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    
    // Use database search as primary method
    const results = TimezoneService.searchTimezonesInDatabase(searchQuery)
    setSearchResults(results)
    setIsLoading(false)
  }, [searchQuery])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleTimezoneSelect = (timezone) => {
    onTimezoneSelect(timezone)
    setSearchQuery('')
    setSearchResults([])
    setIsOpen(false)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value)
    setIsOpen(true)
  }

  const getSelectedTimezoneInfo = () => {
    if (!selectedTimezone) return null
    return TimezoneService.getTimezoneFromDatabase(selectedTimezone)
  }

  const selectedInfo = getSelectedTimezoneInfo()

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected timezone display */}
      {selectedTimezone && selectedInfo && (
        <div className="mb-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-gray-500" />
            <div className="flex-1">
              <div className="font-medium text-sm">
                {selectedInfo.name}
              </div>
              <div className="text-xs text-gray-500">
                {selectedInfo.country} • {selectedInfo.offsetFormatted} • {selectedInfo.abbreviation}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      {/* Dropdown results */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4 mx-auto mb-2 animate-spin" />
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-1">
              {searchResults.map((timezone) => (
                <button
                  key={timezone.id}
                  onClick={() => handleTimezoneSelect(timezone)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {timezone.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {timezone.country}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {timezone.offsetFormatted}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {timezone.abbreviation}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery.length >= 2 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No timezones found for "{searchQuery}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

// Popular timezones component for quick selection
export const PopularTimezones = ({ onTimezoneSelect }) => {
  const popularTimezones = [
    { id: 'UTC', name: 'UTC', country: 'International', offset: '+00:00', abbreviation: 'UTC' },
    { id: 'America/New_York', name: 'Eastern Time', country: 'United States', offset: '-05:00', abbreviation: 'EST' },
    { id: 'America/Los_Angeles', name: 'Pacific Time', country: 'United States', offset: '-08:00', abbreviation: 'PST' },
    { id: 'Europe/London', name: 'British Time', country: 'United Kingdom', offset: '+00:00', abbreviation: 'GMT' },
    { id: 'Europe/Paris', name: 'Central European Time', country: 'France', offset: '+01:00', abbreviation: 'CET' },
    { id: 'Asia/Tokyo', name: 'Japan Standard Time', country: 'Japan', offset: '+09:00', abbreviation: 'JST' },
    { id: 'Asia/Shanghai', name: 'China Standard Time', country: 'China', offset: '+08:00', abbreviation: 'CST' },
    { id: 'Australia/Sydney', name: 'Australian Eastern Time', country: 'Australia', offset: '+10:00', abbreviation: 'AEST' }
  ]

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Popular Timezones
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {popularTimezones.map((timezone) => (
          <button
            key={timezone.id}
            onClick={() => onTimezoneSelect(timezone)}
            className="text-left p-2 text-sm border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {timezone.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {timezone.country} • {timezone.offset} • {timezone.abbreviation}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
} 