import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTimeFormat } from '../context/TimeFormatContext'
import { useFirestoreCollection } from '../hooks/useFirestore'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { LoadingSkeleton } from '../components/common/LoadingSpinner'
import { DeleteSessionModal } from '../components/features/history/DeleteSessionModal'
import { formatDuration } from '../utils/time'
import { formatTimerDisplay } from '../utils/timer'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { 
  Clock, 
  Calendar, 
  Timer, 
  TimerOff, 
  Trash2, 
  TrendingUp,
  Target,
  BarChart3,
  Filter
} from 'lucide-react'

export const HistoryPage = () => {
  const { user, firebaseAvailable } = useAuth()
  const { use24Hour } = useTimeFormat()
  const { data: sessions, loading } = useFirestoreCollection('sessions', 'createdAt')
  const [filter, setFilter] = useState('all') // 'all', 'stopwatch', 'timer'
  const [sortBy, setSortBy] = useState('date') // 'date', 'duration'
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

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

  const filteredAndSortedSessions = useMemo(() => {
    let filtered = sessions

    // Apply filter
    if (filter !== 'all') {
      filtered = sessions.filter(session => session.type === filter)
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = a.createdAt?.seconds || 0
        const dateB = b.createdAt?.seconds || 0
        return dateB - dateA // Most recent first
      } else if (sortBy === 'duration') {
        return (b.duration || 0) - (a.duration || 0) // Longest first
      }
      return 0
    })
  }, [sessions, filter, sortBy])

  const stats = useMemo(() => {
    const stopwatchSessions = sessions.filter(s => s.type === 'stopwatch')
    const timerSessions = sessions.filter(s => s.type === 'timer')
    const completedTimers = timerSessions.filter(s => isTimerCompleted(s))

    // Calculate total time: use elapsedTime for incomplete timers, duration for completed ones and stopwatches
    const totalTime = sessions.reduce((sum, session) => {
      let sessionTime = 0
      
      if (session.type === 'timer' && !isTimerCompleted(session) && session.elapsedTime !== null && session.elapsedTime !== undefined) {
        // For incomplete timers, use the actual elapsed time
        sessionTime = Number(session.elapsedTime) || 0
      } else {
        // For completed timers and stopwatches, use the full duration
        sessionTime = Number(session.duration) || 0
      }
      
      return sum + sessionTime
    }, 0)

    return {
      totalSessions: sessions.length,
      stopwatchSessions: stopwatchSessions.length,
      timerSessions: timerSessions.length,
      completedTimers: completedTimers.length,
      totalTime: totalTime,
      averageSession: sessions.length > 0 
        ? Math.round(totalTime / sessions.length)
        : 0
    }
  }, [sessions])

  const handleDeleteSession = (session) => {
    setSelectedSession(session)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!user || !firebaseAvailable || !selectedSession) return

    setDeleteLoading(true)
    try {
      await deleteDoc(doc(db, `users/${user.uid}/sessions/${selectedSession.id}`))
      setShowDeleteModal(false)
      setSelectedSession(null)
    } catch (error) {
      // Handle error silently
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setSelectedSession(null)
    setDeleteLoading(false)
  }

  if (!user || !firebaseAvailable) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {!firebaseAvailable ? 'Firebase not configured' : 'Sign in to view your history'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {!firebaseAvailable ? 'Please configure Firebase to use this feature.' : 'Please sign in to access this feature.'}
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Session History
        </h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="md:hidden">
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col items-center text-center">
              <Calendar className="h-6 w-6 md:h-8 md:w-8 text-[#d90c00] mb-2" />
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">Total Sessions</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalSessions}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:hidden">
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col items-center text-center">
              <Clock className="h-6 w-6 md:h-8 md:w-8 text-green-500 mb-2" />
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">Total Time</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                {formatDuration(stats.totalTime)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:hidden">
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col items-center text-center">
              <Timer className="h-6 w-6 md:h-8 md:w-8 text-purple-500 mb-2" />
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Session</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                {formatDuration(stats.averageSession)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:hidden">
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col items-center text-center">
              <TimerOff className="h-6 w-6 md:h-8 md:w-8 text-orange-500 mb-2" />
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">Completed Timers</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                {stats.completedTimers}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Desktop version */}
        <Card className="hidden md:block">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalSessions}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-[#d90c00]" />
            </div>
          </CardContent>
        </Card>

        <Card className="hidden md:block">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatDuration(stats.totalTime)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hidden md:block">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Session</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatDuration(stats.averageSession)}
                </p>
              </div>
              <Timer className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hidden md:block">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed Timers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.completedTimers}
                </p>
              </div>
              <TimerOff className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Sorting */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4 md:space-y-0 md:flex md:flex-wrap md:gap-4 md:items-center">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filter:
                </span>
              </div>
              <div className="flex gap-1 md:gap-1">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'stopwatch', label: 'Stopwatch' },
                  { value: 'timer', label: 'Timer' }
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={filter === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(option.value)}
                    className="flex-1 md:flex-none"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort by:
              </span>
              <div className="flex gap-1">
                {[
                  { value: 'date', label: 'Date' },
                  { value: 'duration', label: 'Duration' }
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={sortBy === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy(option.value)}
                    className="flex-1 md:flex-none"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      {filteredAndSortedSessions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No sessions found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === 'all' 
                ? "Start using the stopwatch or timer to see your history here."
                : `No ${filter} sessions found. Try changing the filter.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredAndSortedSessions.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Session Type Icon */}
                    <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                      session.type === 'stopwatch' 
                        ? 'bg-green-100 dark:bg-green-900/20' 
                        : 'bg-purple-100 dark:bg-purple-900/20'
                    }`}>
                      {session.type === 'stopwatch' ? (
                        <TimerOff className={`h-4 w-4 ${
                          session.type === 'stopwatch' 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-purple-600 dark:text-purple-400'
                        }`} />
                      ) : (
                        <Timer className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>

                    {/* Session Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm">
                          {session.label || (session.type === 'stopwatch' ? 'Stopwatch Session' : 'Timer Session')}
                        </h3>
                        {session.type === 'timer' && (
                          <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                            isTimerCompleted(session)
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                          }`}>
                            {isTimerCompleted(session) ? 'Completed' : 'Stopped Early'}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="font-mono">{getSessionDuration(session)}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {session.createdAt?.seconds 
                              ? new Date(session.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: !use24Hour
                                })
                              : 'Unknown date'
                            }
                          </span>
                        </span>
                        {session.laps && session.laps.length > 0 && (
                          <span>{session.laps.length} laps</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSession(session)}
                    className="text-[#d90c00] hover:text-[#991b1b] hover:bg-[#fef2f2] dark:hover:bg-[#450a0a] p-1.5 flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Lap Details for Stopwatch Sessions */}
                {session.type === 'stopwatch' && session.laps && session.laps.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <details className="group">
                      <summary className="cursor-pointer text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
                        <span>View {session.laps.length} laps</span>
                        <svg className="w-3 h-3 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 text-xs">
                        {session.laps.map((lap, index) => (
                          <div key={index} className="flex justify-between bg-gray-50 dark:bg-[#0a0a0a] rounded px-1.5 py-0.5">
                            <span>Lap {index + 1}</span>
                            <span className="font-mono">{formatDuration(lap)}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DeleteSessionModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        session={selectedSession}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </div>
  )
} 