import { useState, useEffect } from 'react'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { useUserPreferences } from '../../../hooks/useUserPreferences'
import { Check, X } from 'lucide-react'

export const WeatherSettingsModal = ({ isOpen, onClose, clocks = [] }) => {
  const { preferences, updateWeatherLocations, loading } = useUserPreferences()
  const [selectedLocations, setSelectedLocations] = useState([])
  const [saving, setSaving] = useState(false)

  // Initialize selected locations from preferences
  useEffect(() => {
    if (!loading && preferences.weatherLocations) {
      setSelectedLocations(preferences.weatherLocations)
    }
  }, [preferences.weatherLocations, loading])

  // Reset selections when modal opens
  useEffect(() => {
    if (isOpen && !loading) {
      setSelectedLocations(preferences.weatherLocations || [])
    }
  }, [isOpen, preferences.weatherLocations, loading])

  const handleLocationToggle = (clockId) => {
    setSelectedLocations(prev => {
      if (prev.includes(clockId)) {
        return prev.filter(id => id !== clockId)
      } else {
        // Limit to 2 locations
        if (prev.length >= 2) {
          return prev.slice(1).concat(clockId)
        }
        return [...prev, clockId]
      }
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateWeatherLocations(selectedLocations)
      onClose()
    } catch (error) {
      // Silent fail
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setSelectedLocations(preferences.weatherLocations || [])
    onClose()
  }

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            <span>Loading preferences...</span>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Weather Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Select up to 2 locations to display weather for:
          </p>
          
          {clocks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No world clocks available
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Add world clocks to customize weather locations
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {clocks.map((clock) => {
                const isSelected = selectedLocations.includes(clock.id)
                return (
                  <div
                    key={clock.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                        : 'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => handleLocationToggle(clock.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'bg-red-500 border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {clock.city}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {clock.country}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || clocks.length === 0}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </Modal>
  )
} 