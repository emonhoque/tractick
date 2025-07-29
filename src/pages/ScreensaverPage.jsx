import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTimeFormat } from '../hooks/useTimeFormat'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { useFirestore } from '../hooks/useFirestore'
import { usePageTitle } from '../hooks/usePageTitle'
import { ROUTES } from '../constants'
import { TimezoneService } from '../utils/timezone'
import { getWeatherIcon } from '../utils/weather'
import { useWeather } from '../hooks/useWeather'
import { useApiKeys } from '../hooks/useApiKeys'
import { ChevronLeft, ChevronRight, X, Clock, Globe, Settings, Sun, Moon, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '../components/ui/Button'

export const ScreensaverPage = () => {
  // Update page title
  usePageTitle()
  
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentDate, setCurrentDate] = useState('')
  const [currentClockIndex, setCurrentClockIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [buttonsVisible, setButtonsVisible] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showAllLocations, setShowAllLocations] = useState(false)
  
  const { use24Hour } = useTimeFormat()
  const { user, firebaseAvailable } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { getDocuments } = useFirestore()
  const { isOpenWeatherAvailable } = useApiKeys()
  const navigate = useNavigate()
  const [clocks, setClocks] = useState([])
  
  const inactivityTimeoutRef = useRef(null)
  const timeDisplayRef = useRef(null)
  const { 
    fetchWeatherForLocations, 
    getWeatherData 
  } = useWeather()

  // Calculate current display early to avoid reference errors
  const getCurrentDisplay = () => {
    // Show saved clock time
    const clock = clocks[currentClockIndex]
    if (!clock) return null

    try {
      const time = TimezoneService.getCurrentTime(clock.timezoneId, !use24Hour)
      const date = TimezoneService.getCurrentDate(clock.timezoneId)
      // Get weather data from global cache
      const locationKey = clock.geometry?.location ? clock.geometry.location : { lat: clock.place, lng: clock.country }
      const weather = getWeatherData(locationKey, clock.country)
      
      return {
        time,
        location: clock.label,
        date,
        weather
      }
    } catch {
      return null
    }
  }

  const currentDisplay = getCurrentDisplay()



  // Fetch user's saved clocks
  useEffect(() => {
    const loadClocks = async () => {
      if (user && firebaseAvailable) {
        try {
          const clocksData = await getDocuments('clocks', 'order', 'asc')
          setClocks(clocksData || [])
        } catch {
          // Silent fail
        }
      }
    }
    loadClocks()
  }, [user, firebaseAvailable, getDocuments])

  // Fetch weather data for all clocks
  useEffect(() => {
    if (clocks.length === 0 || !isOpenWeatherAvailable) return
    
    fetchWeatherForLocations(clocks, false) // Don't include forecast for screensaver
  }, [clocks, isOpenWeatherAvailable, fetchWeatherForLocations])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])



  // Auto-hide buttons after 10 seconds of inactivity
  useEffect(() => {
    const resetInactivityTimer = () => {
      setButtonsVisible(true)
      
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current)
      }
      
      inactivityTimeoutRef.current = setTimeout(() => {
        setButtonsVisible(false)
      }, 10000) // 10 seconds
    }

    const handleActivity = () => {
      resetInactivityTimer()
    }

    // Set up activity listeners
    document.addEventListener('mousemove', handleActivity)
    document.addEventListener('mousedown', handleActivity)
    document.addEventListener('keydown', handleActivity)
    document.addEventListener('touchstart', handleActivity)
    document.addEventListener('scroll', handleActivity)

    // Set up keyboard navigation
    document.addEventListener('keydown', handleKeyDown)

    // Initial timer
    resetInactivityTimer()

    return () => {
      document.removeEventListener('mousemove', handleActivity)
      document.removeEventListener('mousedown', handleActivity)
      document.removeEventListener('keydown', handleActivity)
      document.removeEventListener('touchstart', handleActivity)
      document.removeEventListener('scroll', handleActivity)
      document.removeEventListener('keydown', handleKeyDown)
      
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current)
      }
    }
  }, [handleKeyDown])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now)
      
      // Format the date
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }
      setCurrentDate(now.toLocaleDateString('en-US', options))
    }

    // Update immediately
    updateTime()
    
    // Update every second
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])



  const handleNext = useCallback(() => {
    if (clocks.length > 0) {
      setCurrentClockIndex((prev) => {
        const newIndex = (prev + 1) % clocks.length
        return newIndex
      })
    }
  }, [clocks.length])

  const handlePrevious = useCallback(() => {
    if (clocks.length > 0) {
      setCurrentClockIndex((prev) => {
        const newIndex = prev === 0 ? clocks.length - 1 : prev - 1
        return newIndex
      })
    }
  }, [clocks.length])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch(() => {
        // Silent fail
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      }).catch(() => {
        // Silent fail
      })
    }
  }



  // Keyboard navigation handler
  const handleKeyDown = useCallback((e) => {
    if (clocks.length === 0) return

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        setShowAllLocations(false)
        handlePrevious()
        break
      case 'ArrowRight':
        e.preventDefault()
        setShowAllLocations(false)
        handleNext()
        break
      case 'Escape':
        e.preventDefault()
        navigate(ROUTES.HOME)
        break
    }
  }, [clocks.length, handlePrevious, handleNext, navigate])

  // Touch handlers for swipe gestures
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      if (clocks.length > 0) {
        // Swipe to show individual location
        setShowAllLocations(false)
        handleNext()
      }
    } else if (isRightSwipe) {
      if (clocks.length > 0) {
        if (!showAllLocations) {
          handlePrevious()
        }
      }
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  const formatTime = (date = currentTime) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    
    if (use24Hour) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    } else {
      const period = hours >= 12 ? 'PM' : 'AM'
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
      return `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${period}`
    }
  }

  const totalClocks = clocks.length





  // Render main view (individual saved times)
  return (
    <div 
      className={`screensaver-fullscreen flex items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-white'}`}></div>
      

      {/* Exit Button - Top Left */}
      {buttonsVisible && (
        <Button
          onClick={(e) => {
            e.stopPropagation()
            navigate(ROUTES.HOME)
          }}
          variant="ghost"
          size="sm"
          className="absolute top-6 left-6 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
        >
          <X className="h-4 w-4 mr-2" />
          Exit
        </Button>
      )}

      {/* Fullscreen Toggle Button - Top Right */}
      {buttonsVisible && (
        <Button
          onClick={(e) => {
            e.stopPropagation()
            toggleFullscreen()
          }}
          variant="ghost"
          size="sm"
          className="absolute top-6 right-6 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 p-2"
        >
          {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </Button>
      )}

      {/* Dark Mode Toggle Button - Top Right */}
      {buttonsVisible && (
        <Button
          onClick={(e) => {
            e.stopPropagation()
            toggleTheme()
          }}
          variant="ghost"
          size="sm"
          className="absolute top-6 right-16 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 p-2"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      )}

      {/* Navigation Buttons */}
      {buttonsVisible && clocks.length > 0 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePrevious()
            }}
            className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 transition-colors backdrop-blur-sm border border-gray-200 dark:border-gray-700 z-20"
            aria-label="Previous time"
          >
            <ChevronLeft className="h-6 w-6 md:h-8 md:w-8 text-gray-700 dark:text-gray-300" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 transition-colors backdrop-blur-sm border border-gray-200 dark:border-gray-700 z-20"
            aria-label="Next time"
          >
            <ChevronRight className="h-6 w-6 md:h-8 md:w-8 text-gray-700 dark:text-gray-300" />
          </button>
        </>
      )}

      {/* Main Content Display - Simple Clean Design */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-5xl lg:max-w-[1280px] w-full px-4 relative z-10">
          <div className="text-center space-y-8">
            {/* Time Display - Large and prominent */}
            <div 
              ref={timeDisplayRef}
              className={`text-6xl sm:text-8xl md:text-9xl lg:text-[8rem] xl:text-[10rem] font-light tracking-wider leading-tight ${theme === 'dark' ? 'text-white' : 'text-black'} drop-shadow-lg`}
            >
              {currentDisplay?.time || formatTime()}
            </div>
            
            {/* Location */}
            {currentDisplay?.location && (
              <div className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-wide ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} drop-shadow-md`}>
                {currentDisplay.location}
              </div>
            )}
            
            {/* Weather and Date Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
              {/* Weather */}
              {currentDisplay?.weather && (
                <div className="flex items-center gap-4">
                  {currentDisplay.weather.weather?.[0]?.icon ? (
                    <img 
                      src={getWeatherIcon(currentDisplay.weather.weather[0].icon)} 
                      alt={currentDisplay.weather.weather[0]?.description || 'Weather'}
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 drop-shadow-lg"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <span className="text-5xl sm:text-6xl drop-shadow-lg">🌤️</span>
                  )}
                  <div className="text-center">
                    <div className={`font-light text-2xl sm:text-3xl md:text-4xl tracking-wide ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} drop-shadow-md`}>
                      {Math.round(currentDisplay.weather.main.temp)}°C
                    </div>
                    <div className={`text-sm sm:text-base md:text-lg capitalize tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} drop-shadow-sm`}>
                      {currentDisplay.weather.weather?.[0]?.description || 'Unknown'}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Date */}
              <div className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-light tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} drop-shadow-sm`}>
                {currentDisplay?.date || currentDate}
              </div>
            </div>
          </div>

          {/* Clock Indicator */}
          {clocks.length > 0 && (
            <div className="flex justify-center space-x-4 mt-12">
              {Array.from({ length: totalClocks }, (_, i) => {
                const clock = clocks[i]
                return (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentClockIndex(i)
                    }}
                    className={`w-5 h-5 rounded-full transition-all duration-300 hover:scale-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
                      i === currentClockIndex 
                        ? 'bg-red-500 shadow-lg shadow-red-500/50' 
                        : theme === 'dark' ? 'bg-gray-400/60 hover:bg-gray-300/80' : 'bg-gray-600/60 hover:bg-gray-500/80'
                    }`}
                    aria-label={`Go to ${clock?.label || 'clock'} ${i + 1}`}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Instructions */}
      {buttonsVisible && clocks.length > 0 && (
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm opacity-50 text-center tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} z-20`}>
          <div className="md:hidden">Swipe to navigate</div>
          <div className="hidden md:block">Use arrow buttons to navigate</div>
        </div>
      )}
    </div>
  )
} 