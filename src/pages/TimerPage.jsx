import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useActiveTimer } from '../context/ActiveTimerContext'
import { TimerDisplay } from '../components/features/timer/TimerDisplay'
import { TimerInput } from '../components/features/timer/TimerInput'
import { TimerControls } from '../components/features/timer/TimerControls'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { playNotificationSound } from '../utils/timer'

export const TimerPage = ({ initialDuration = null }) => {
  const { user, firebaseAvailable } = useAuth()
  const [showInput, setShowInput] = useState(true)
  const {
    activeTimer,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer
  } = useActiveTimer()

  // Handle initial duration from protocol handler
  useEffect(() => {
    if (initialDuration && !activeTimer) {
      handleTimeSet(initialDuration)
    }
  }, [initialDuration, activeTimer])

  // Handle timer completion
  useEffect(() => {
    if (activeTimer?.isCompleted) {
      // Play notification sound
      playNotificationSound()
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification('Timer Complete!', {
          body: 'Your countdown timer has finished.',
          icon: '/assets/favicon.png'
        })
      }
    }
  }, [activeTimer?.isCompleted])

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const handleTimeSet = (duration) => {
    startTimer(duration, duration)
    setShowInput(false)
  }

  const handleStart = () => {
    if (activeTimer) {
      resumeTimer()
    }
    setShowInput(false)
  }

  const handleStop = () => {
    stopTimer()
    setShowInput(true)
  }

  const handleReset = () => {
    stopTimer()
    setShowInput(true)
  }

  // Calculate progress for timer display
  const progress = activeTimer 
    ? ((activeTimer.duration - activeTimer.currentTime) / activeTimer.duration) * 100
    : 0

  if (!user || !firebaseAvailable) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {!firebaseAvailable ? 'Firebase not configured' : 'Sign in to use the timer'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {!firebaseAvailable ? 'Please configure Firebase to use this feature.' : 'Please sign in to access this feature.'}
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Timer
        </h1>
        
        <TimerDisplay 
          time={activeTimer?.currentTime || 0} 
          progress={progress}
          isCompleted={activeTimer?.isCompleted || false}
          totalDuration={activeTimer?.duration || 0}
        />
        
        <div className="mt-8">
          <TimerControls
            isRunning={activeTimer?.isRunning || false}
            isPaused={activeTimer?.isPaused || false}
            isCompleted={activeTimer?.isCompleted || false}
            onStart={handleStart}
            onPause={pauseTimer}
            onStop={handleStop}
            onReset={handleReset}
            disabled={!activeTimer && !activeTimer?.isPaused && !activeTimer?.isCompleted}
          />
        </div>
      </div>

      {/* Timer Input/Setup */}
      <div className="space-y-6">
        {showInput ? (
          <Card>
            <CardHeader>
              <CardTitle>Set Timer</CardTitle>
            </CardHeader>
            <CardContent>
              <TimerInput 
                onTimeSet={handleTimeSet}
                disabled={activeTimer?.isRunning || false}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center">
            <Button
              variant="outline"
              onClick={() => setShowInput(true)}
              disabled={activeTimer?.isRunning || false}
            >
              Change Timer
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 