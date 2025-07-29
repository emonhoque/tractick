import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useActiveTimer } from '../hooks/useActiveTimer'
import { StopwatchDisplay } from '../components/features/stopwatch/StopwatchDisplay'
import { StopwatchControls } from '../components/features/stopwatch/StopwatchControls'
import { LapsList } from '../components/features/stopwatch/LapsList'

export const StopwatchPage = () => {
  const { user, firebaseAvailable } = useAuth()
  const { 
    activeStopwatch, 
    stopwatchLaps,
    startStopwatch, 
    pauseStopwatch, 
    stopStopwatch,
    addLap
  } = useActiveTimer()

  const handleStart = () => {
    startStopwatch(activeStopwatch?.currentTime || 0)
  }

  const handlePause = () => {
    pauseStopwatch()
  }

  const handleStop = () => {
    stopStopwatch()
  }

  const handleReset = () => {
    stopStopwatch()
  }

  const handleLap = () => {
    addLap()
  }

  if (!user || !firebaseAvailable) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {!firebaseAvailable ? 'Firebase not configured' : 'Sign in to use the stopwatch'}
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
          Stopwatch
        </h1>
        
        <StopwatchDisplay time={activeStopwatch?.currentTime || 0} />
        
        <div className="mt-8">
          <StopwatchControls
            isRunning={activeStopwatch?.isRunning || false}
            isPaused={activeStopwatch?.isPaused || false}
            onStart={handleStart}
            onPause={handlePause}
            onStop={handleStop}
            onReset={handleReset}
            onLap={handleLap}
          />
        </div>
      </div>

      <LapsList laps={stopwatchLaps} />
    </div>
  )
} 