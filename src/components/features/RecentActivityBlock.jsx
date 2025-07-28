import { Link } from 'react-router-dom'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { ROUTES } from '../../constants'
import { Clock, Timer, TimerOff } from 'lucide-react'

export const RecentActivityBlock = ({ recentSessions = [], use24Hour = false }) => {
  const getSessionIcon = (session) => {
    switch (session.type) {
      case 'timer':
        return Timer
      case 'stopwatch':
        return TimerOff
      default:
        return Clock
    }
  }

  const getSessionLabel = (session) => {
    switch (session.type) {
      case 'timer':
        return 'Timer Session'
      case 'stopwatch':
        return 'Stopwatch Session'
      default:
        return 'Session'
    }
  }

  const getSessionDuration = (session) => {
    if (session.type === 'timer' && session.elapsedTime !== null && session.originalDuration) {
      const elapsed = session.elapsedTime
      const original = session.originalDuration
      const elapsedMinutes = Math.floor(elapsed / 60)
      const elapsedSeconds = elapsed % 60
      const originalMinutes = Math.floor(original / 60)
      const originalSeconds = original % 60
      
      return `${elapsedMinutes}:${elapsedSeconds.toString().padStart(2, '0')}/${originalMinutes}:${originalSeconds.toString().padStart(2, '0')}`
    } else if (session.type === 'timer') {
      const duration = session.duration || 0
      const minutes = Math.floor(duration / 60)
      const seconds = duration % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    } else {
      const duration = session.duration || 0
      const minutes = Math.floor(duration / 60)
      const seconds = duration % 60
      
      if (minutes > 0) {
        return `${minutes}m ${seconds}s`
      }
      return `${seconds}s`
    }
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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: !use24Hour
    })
  }

  if (!recentSessions || recentSessions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            <Link to={ROUTES.HISTORY}>
              <Button variant="outline" size="sm">
                View History
              </Button>
            </Link>
          </div>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Start using timers and stopwatches to see your activity here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          <Link to={ROUTES.HISTORY}>
            <Button variant="outline" size="sm">
              View History
            </Button>
          </Link>
        </div>
        
        <div className="space-y-3">
          {recentSessions.slice(0, 5).map((session) => {
            const SessionIcon = getSessionIcon(session)
            const isCompleted = isTimerCompleted(session)
            
            return (
              <div key={session.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className={`p-2 rounded-full ${
                  session.type === 'timer' 
                    ? 'bg-purple-100 dark:bg-purple-900/20' 
                    : 'bg-green-100 dark:bg-green-900/20'
                }`}>
                  <SessionIcon className={`h-4 w-4 ${
                    session.type === 'timer' 
                      ? 'text-purple-600 dark:text-purple-400' 
                      : 'text-green-600 dark:text-green-400'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {getSessionLabel(session)}
                    </p>
                    {session.type === 'timer' && (
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        isCompleted
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {isCompleted ? 'Completed' : 'Stopped Early'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(session.createdAt)}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                    {getSessionDuration(session)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} 