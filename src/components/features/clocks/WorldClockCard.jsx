import { useState, useEffect } from 'react'
import { MoreVertical, Edit, Trash2, MapPin } from 'lucide-react'
import { Card, CardContent } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { TimezoneService } from '../../../utils/timezone'
import { useTimeFormat } from '../../../context/TimeFormatContext'
import { WeatherDisplay } from '../weather/WeatherDisplay'

export const WorldClockCard = ({ clock, onEdit, onDelete }) => {
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const { use24Hour, toggleTimeFormat } = useTimeFormat()

  useEffect(() => {
    const updateTime = () => {
      try {
        // Check if we have a valid timezone
        if (!clock.timezoneId) {
          console.warn('No timezone ID found for clock:', clock)
          setCurrentTime('Invalid timezone')
          setCurrentDate('Invalid timezone')
          return
        }

        // Use ONLY local timezone calculations - no API calls
        const time = TimezoneService.getCurrentTime(clock.timezoneId, !use24Hour)
        const date = TimezoneService.getCurrentDate(clock.timezoneId)
        
        setCurrentTime(time)
        setCurrentDate(date)
      } catch (err) {
        console.error('Error updating time:', err)
        // Fallback to current time if timezone is invalid
        setCurrentTime(new Date().toLocaleTimeString('en-US', { 
          hour12: !use24Hour, 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        }))
        setCurrentDate(new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'short', 
          day: 'numeric' 
        }))
      }
    }

    // Update time immediately and then every second
    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [clock.timezoneId, use24Hour])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu) {
        // Check if the click is outside the dropdown menu and button
        const dropdownElement = event.target.closest('.dropdown-menu')
        const buttonElement = event.target.closest('.dropdown-button')
        
        if (!dropdownElement && !buttonElement) {
          setShowMenu(false)
        }
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const getOffsetDisplay = () => {
    // Use cached UTC offset from Firebase if available
    if (clock.utc_offset) {
      return `UTC${clock.utc_offset}`
    }
    
    // Fallback to calculated offset if not cached
    if (clock.offset !== undefined) {
      return TimezoneService.formatOffset(clock.offset)
    }
    
    // Calculate offset locally as last resort
    try {
      if (!clock.timezoneId) {
        return null
      }
      const offset = TimezoneService.getTimezoneOffset(clock.timezoneId)
      return TimezoneService.formatOffset(offset)
    } catch (error) {
      console.error('Error calculating offset:', error)
      return null
    }
  }

  return (
            <Card className="relative group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-[#0a0a0a] dark:to-gray-900 border-0 overflow-hidden h-full flex flex-col">
      {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#b91c1c]/5 to-transparent dark:from-[#b91c1c]/10"></div>
      
      <CardContent className="p-0 relative flex flex-col h-full">
        {/* Header with location and menu */}
        <div className="flex justify-between items-start p-6 pb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-gradient-to-r from-[#b91c1c] to-[#991b1b] rounded-full"></div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                {clock.label}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="h-3.5 w-3.5 text-[#b91c1c]" />
              <span className="font-medium">{clock.place}</span>
              {clock.country && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500 dark:text-gray-400">{clock.country}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="opacity-0 group-hover:opacity-100 transition-all duration-200 dropdown-button hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2"
              aria-label="Open clock menu"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            
            {showMenu && (
                              <div className="absolute right-0 mt-2 w-36 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 z-10 dropdown-menu">
                <button
                  onClick={() => {
                    onEdit?.(clock)
                    setShowMenu(false)
                  }}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-lg mx-1 my-1"
                >
                  <Edit className="h-4 w-4 mr-3" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete?.(clock)
                    setShowMenu(false)
                  }}
                  className="flex items-center w-full px-4 py-3 text-sm text-[#b91c1c] hover:bg-[#fef2f2] dark:hover:bg-[#450a0a] transition-colors rounded-lg mx-1 my-1"
                >
                  <Trash2 className="h-4 w-4 mr-3" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Time display section */}
        <div className="px-6 pb-6 flex-1 flex flex-col justify-center">
          <div className="relative">
            {/* Background time for depth effect */}
            <div className="absolute inset-0 text-6xl font-black text-gray-100 dark:text-gray-800/30 select-none pointer-events-none tracking-tighter">
              {currentTime.split(':').slice(0, 2).join(':')}
            </div>
            
            {/* Main time display */}
            <div 
              className="relative text-5xl font-black text-gray-900 dark:text-white cursor-pointer hover:text-[#b91c1c] transition-all duration-300 select-none tracking-tight leading-none"
              onClick={toggleTimeFormat}
              title={`Click to switch to ${use24Hour ? '12-hour' : '24-hour'} format`}
            >
              {currentTime}
            </div>
          </div>
          
          {/* Date and timezone info */}
          <div className="mt-4 flex items-end justify-between">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300 flex-1">
              {currentDate}
            </div>
            
            {getOffsetDisplay() && (
              <div className="px-3 py-1.5 bg-gray-100 dark:bg-[#450a0a] dark:border dark:border-[#991b1b] rounded-full text-xs font-semibold text-gray-700 dark:text-white flex-shrink-0">
                {getOffsetDisplay()}
              </div>
            )}
          </div>

          {/* Weather display */}
          <div className="mt-4">
            <WeatherDisplay 
              city={clock.place} 
              country={clock.country} 
              timezoneId={clock.timezoneId}
            />
          </div>
        </div>

        {/* Subtle bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#b91c1c] to-[#991b1b]"></div>
      </CardContent>
    </Card>
  )
} 