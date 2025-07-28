import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFirestore } from '../hooks/useFirestore'
import { useTimeFormat } from '../context/TimeFormatContext'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ActiveTimerIndicator } from '../components/features/ActiveTimerIndicator'
import { WorldClockCard } from '../components/features/clocks/WorldClockCard'
import { WeatherBlock } from '../components/features/weather/WeatherBlock'
import { RecentActivityBlock } from '../components/features/RecentActivityBlock'
import { ROUTES } from '../constants'
import { formatDuration } from '../utils/time'
import { formatTimerDisplay } from '../utils/timer'
import { 
  Clock, 
  Timer, 
  TimerOff, 
  Globe, 
  History,
  Cloud
} from 'lucide-react'
import { NotFoundPage } from './NotFoundPage'

export const HomePage = ({ onAuthModalOpen }) => {
  const { user, firebaseAvailable } = useAuth()
  const { use24Hour } = useTimeFormat()
  const [clocks, setClocks] = useState([])
  const [recentSessions, setRecentSessions] = useState([])
  const { getDocuments } = useFirestore()

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (user && firebaseAvailable) {
        try {
          const [clocksData, sessionsData] = await Promise.all([
            getDocuments('clocks', 'order', 'asc'),
            getDocuments('sessions', 'createdAt', 'desc', 5)
          ])
          setClocks(clocksData || [])
          setRecentSessions(sessionsData || [])
        } catch (error) {
          console.error('Error loading user data:', error)
        }
      }
    }

    loadUserData()
  }, [user, firebaseAvailable, getDocuments])

  const features = [
    {
      name: 'Screensaver',
      description: 'Full-screen time display',
      icon: Clock,
      href: ROUTES.SCREENSAVER,
      color: 'text-gray-600 dark:text-gray-400'
    },
    {
      name: 'Timer',
      description: 'Countdown timers with notifications',
      icon: Timer,
      href: ROUTES.TIMER,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      name: 'Stopwatch',
      description: 'Time measurement with lap tracking',
      icon: TimerOff,
      href: ROUTES.STOPWATCH,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      name: 'World Clock',
      description: 'Track time across different timezones',
      icon: Clock,
      href: ROUTES.WORLD_CLOCK,
      color: 'text-primary-600'
    },
    {
      name: 'Time Converter',
      description: 'Convert between time formats',
      icon: Globe,
      href: ROUTES.TIME_CONVERTER,
      color: 'text-cyan-600 dark:text-cyan-400'
    },
    {
      name: 'Weather',
      description: 'Weather conditions for your locations',
      icon: Cloud,
      href: ROUTES.WEATHER,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      name: 'History',
      description: 'View your time tracking history',
      icon: History,
      href: ROUTES.HISTORY,
      color: 'text-orange-600 dark:text-orange-400'
    }
  ]

  const getSessionLabel = (session) => {
    if (session.type === 'timer') {
      return 'Timer Session'
    }
    return 'Stopwatch Session'
  }

  const getSessionDuration = (session) => {
    if (session.type === 'timer' && session.elapsedTime !== null && session.originalDuration) {
      return formatTimerDisplay(session.elapsedTime, session.originalDuration)
    }
    return formatDuration(session.duration || 0)
  }

  const isTimerCompleted = (session) => {
    if (session.type !== 'timer') return false
    
    // If the completed flag is explicitly set to true, it's completed
    if (session.completed === true) return true
    
    // If we have elapsed time and original duration, check if they match
    if (session.elapsedTime !== null && session.originalDuration) {
      const elapsed = Number(session.elapsedTime)
      const original = Number(session.originalDuration)
      // Consider it completed if elapsed time is very close to or equal to original duration
      return Math.abs(elapsed - original) <= 1 // Allow 1 second tolerance
    }
    
    // Fallback to the original completed flag
    return session.completed === true
  }

  if (!user || !firebaseAvailable) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {!firebaseAvailable ? 'Firebase not configured' : 'Welcome to TrakTick'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {!firebaseAvailable ? 'Please configure Firebase to use this feature.' : 'Please sign in to access your time tracking dashboard.'}
        </p>
        
        {/* Login/Signup buttons */}
        {firebaseAvailable && (
          <div className="flex justify-center gap-4 mb-8">
            <Button 
              onClick={() => onAuthModalOpen('signin')}
              className="bg-accent hover:bg-accent-hover text-white px-6 py-2"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => onAuthModalOpen('signup')}
              variant="outline" 
              className="border-accent text-accent hover:bg-accent hover:text-white px-6 py-2"
            >
              Sign Up
            </Button>
          </div>
        )}
        
        {/* Feature grid with 4+3 layout on desktop, single column on mobile */}
        <div className="w-full space-y-6">
          {/* First row: 4 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.slice(0, 4).map((feature) => (
              <Card key={feature.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <feature.icon className={`h-8 w-8 mx-auto mb-4 ${feature.color}`} />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Second row: 3 cards centered */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {features.slice(4, 7).map((feature) => (
                <Card key={feature.name} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <feature.icon className={`h-8 w-8 mx-auto mb-4 ${feature.color}`} />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Active Timer Indicator */}
      <ActiveTimerIndicator />

      {/* Quick Access - Compact horizontal layout */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Quick Access
          </h2>
          <div className="flex items-center gap-1 md:hidden">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            <span className="text-xs text-gray-500 ml-2">Swipe</span>
          </div>
        </div>
        <div className="relative">
          <div className="flex gap-3 md:gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide md:justify-between">
            {features.map((feature) => (
              <Link key={feature.name} to={feature.href} className="flex-shrink-0 md:flex-1 block">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 md:p-3 flex items-center md:flex-col md:items-center gap-3 md:gap-2 md:text-center h-full justify-center min-h-[60px] md:min-h-[80px]">
                    <feature.icon className={`h-5 w-5 md:h-4 md:w-4 ${feature.color}`} />
                    <span className="text-sm md:text-xs font-medium text-gray-900 dark:text-white whitespace-nowrap md:whitespace-normal">
                      {feature.name}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {/* Gradient fade indicators for mobile */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-[#0a0a0a] to-transparent pointer-events-none md:hidden"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-[#0a0a0a] to-transparent pointer-events-none md:hidden"></div>
        </div>
      </section>

      {/* World Clocks - Show after Quick Access */}
      {clocks && clocks.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your World Clocks
            </h2>
            <Link to={ROUTES.WORLD_CLOCK}>
              <Button variant="default" size="sm">
                Manage Clocks
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clocks.slice(0, 3).map((clock) => (
              <WorldClockCard key={clock.id} clock={clock} />
            ))}
          </div>
        </section>
      )}

      {/* Weather and Recent Activity - 2 Block Layout on Desktop */}
      {user && firebaseAvailable && (
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weather Block */}
            <WeatherBlock 
              clocks={clocks} 
            />
            
            {/* Recent Activity Block */}
            <RecentActivityBlock 
              recentSessions={recentSessions} 
              use24Hour={use24Hour}
            />
          </div>
        </section>
      )}
    </div>
  )
} 