import { useState, useRef } from 'react'
import { ArrowLeft, Copy, Clock, Globe } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { useAuth } from '../hooks/useAuth'
import { useFirestoreCollection } from '../hooks/useFirestore'

import { TimezoneService } from '../utils/timezone'
import { useNavigate } from 'react-router-dom'

export const TimeConverterPage = () => {
  const navigate = useNavigate()
  const { user, firebaseAvailable } = useAuth()
  const { data: clocks, loading } = useFirestoreCollection('clocks', 'order', 'asc')
  const [selectedTime, setSelectedTime] = useState(new Date())
  const [showCopyNotification, setShowCopyNotification] = useState(false)
  const sliderRef = useRef(null)

  // Handle slider change with 15-minute snapping
  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value)
    const newTime = new Date()
    newTime.setHours(Math.floor(value / 60), value % 60, 0, 0)
    setSelectedTime(newTime)
  }

  // Handle slider mouse up with snapping to 15-minute intervals
  const handleSliderMouseUp = () => {
    // Snap to nearest 15-minute interval
    const currentMinutes = selectedTime.getHours() * 60 + selectedTime.getMinutes()
    const snappedMinutes = Math.round(currentMinutes / 15) * 15
    
    // Ensure we don't go beyond 23:59
    const finalMinutes = Math.min(snappedMinutes, 1439)
    
    const snappedTime = new Date()
    snappedTime.setHours(Math.floor(finalMinutes / 60), finalMinutes % 60, 0, 0)
    setSelectedTime(snappedTime)
  }

  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).toUpperCase()
  }

  // Get converted time for a clock
  const getConvertedTime = (clock) => {
    try {
      if (!clock?.timezoneId) return null
      
      const convertedTime = new Date(selectedTime.toLocaleString('en-US', {
        timeZone: clock.timezoneId,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }))
      
      // Get current time in the target timezone for day comparison
      const currentTimeInTargetTZ = new Date(new Date().toLocaleString('en-US', {
        timeZone: clock.timezoneId,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }))
      
      // Compare with current time in that timezone
      const currentDate = currentTimeInTargetTZ.getDate()
      const convertedDate = convertedTime.getDate()
      
      return {
        time: formatTime(convertedTime),
        date: formatDate(convertedTime),
        isNextDay: convertedDate > currentDate,
        isPreviousDay: convertedDate < currentDate
      }
    } catch {
      return null
    }
  }

  // Copy time string to clipboard
  const copyTimeString = () => {
    const timeStrings = clocks.map((clock) => {
      const converted = getConvertedTime(clock)
      if (!converted) return null
      
      // Format the date more concisely
      const date = new Date(selectedTime.toLocaleString('en-US', {
        timeZone: clock.timezoneId,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }))
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
      const day = date.getDate()
      const month = date.toLocaleDateString('en-US', { month: 'short' })
      
      // Format time in 12-hour format with AM/PM
      const time12Hour = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
      
      return `${dayName}, ${day} ${month} ${time12Hour} in ${clock.label}`
    }).filter(Boolean)
    
    const timeString = `The time is:\n${timeStrings.join('\n')}`
    navigator.clipboard.writeText(timeString)
    
    // Show notification
    setShowCopyNotification(true)
    setTimeout(() => setShowCopyNotification(false), 2000)
  }

  // Calculate slider value (minutes since midnight)
  const sliderValue = selectedTime.getHours() * 60 + selectedTime.getMinutes()

  if (!user || !firebaseAvailable) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {!firebaseAvailable ? 'Firebase not configured' : 'Sign in to use the time converter'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {!firebaseAvailable ? 'Please configure Firebase to use this feature.' : 'Please sign in to access this feature.'}
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
        <p className="text-gray-600 dark:text-gray-400 mt-4">Loading your clocks...</p>
      </div>
    )
  }

  if (clocks.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No clocks added yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Add some world clocks to use the time converter
        </p>
        <Button onClick={() => navigate('/world-clock')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to World Clocks
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => navigate('/world-clock')}
          className="flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to World Clocks
        </Button>
        
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Globe className="h-8 w-8 text-red-600 dark:text-red-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Time Converter
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Drag the slider to see what time it will be at your saved locations
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Time Selection Card */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            {/* Current Time Display */}
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-red-100 dark:border-red-800/50">
                <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white mb-2 tracking-wider">
                  {formatTime(selectedTime)}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                  {formatDate(selectedTime)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Local time
                </div>
              </div>
            </div>

            {/* Time Slider */}
            <div className="space-y-6">
              {/* Time labels */}
              <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400 px-1">
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">12:00 AM</span>
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">6:00 AM</span>
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">12:00 PM</span>
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">6:00 PM</span>
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">11:59 PM</span>
              </div>
              
              {/* Slider */}
              <div className="relative">
                <input
                  ref={sliderRef}
                  type="range"
                  min="0"
                  max="1439"
                  value={sliderValue}
                  onChange={handleSliderChange}
                  onMouseUp={handleSliderMouseUp}
                  onTouchEnd={handleSliderMouseUp}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${(sliderValue / 1439) * 100}%, #e5e7eb ${(sliderValue / 1439) * 100}%, #e5e7eb 100%)`
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Converted Times */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-600 dark:text-red-400" />
              Converted Times
            </h2>
            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-medium rounded-full">
              {clocks.length} locations
            </span>
          </div>

          <div className="grid gap-4">
            {clocks.map((clock) => {
              const converted = getConvertedTime(clock)
              if (!converted) return null

              return (
                <Card 
                  key={clock.id} 
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                          <Globe className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {clock.label}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {clock.place}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {converted.time}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {converted.date}
                          {converted.isNextDay && (
                            <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                              +1 day
                            </span>
                          )}
                          {converted.isPreviousDay && (
                            <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                              -1 day
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Copy Button */}
        <div className="flex flex-col items-center pt-4 space-y-4">
          <Button
            onClick={copyTimeString}
            className="px-8 py-3 text-lg font-semibold bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Copy className="h-5 w-5 mr-2" />
            Copy All Times
          </Button>
          
          {/* Copy Notification */}
          {showCopyNotification && (
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                <span className="font-medium">Times copied to clipboard!</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 