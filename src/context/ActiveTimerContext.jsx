import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'
import { db } from '../lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

const ActiveTimerContext = createContext(null)

export const ActiveTimerProvider = ({ children }) => {
  const { user, firebaseAvailable } = useAuth()
  const [activeStopwatch, setActiveStopwatch] = useState(null)
  const [activeTimer, setActiveTimer] = useState(null)
  const [stopwatchLaps, setStopwatchLaps] = useState([])
  const stopwatchIntervalRef = useRef(null)
  const timerIntervalRef = useRef(null)
  const isInitialized = useRef(false)
  const timerSessionSaved = useRef(false) // Flag to prevent duplicate saves

  // SessionStorage helpers
  const saveToSessionStorage = (key, data) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save to sessionStorage:', error)
    }
  }

  const loadFromSessionStorage = (key) => {
    try {
      const data = sessionStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.warn('Failed to load from sessionStorage:', error)
      return null
    }
  }

  // Initialize from sessionStorage
  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true

    // Load state from sessionStorage
    const savedStopwatch = loadFromSessionStorage('activeStopwatch')
    const savedTimer = loadFromSessionStorage('activeTimer')
    const savedLaps = loadFromSessionStorage('stopwatchLaps')

    if (savedStopwatch) {
      // Restore stopwatch with proper timing
      const now = Date.now()
      
      if (savedStopwatch.isRunning) {
        // Resume running stopwatch - currentTime is the elapsed time
        const newStartTime = now - savedStopwatch.currentTime
        setActiveStopwatch({
          ...savedStopwatch,
          startTime: newStartTime,
          currentTime: savedStopwatch.currentTime
        })
        
        stopwatchIntervalRef.current = setInterval(() => {
          setActiveStopwatch(prev => {
            if (!prev || !prev.isRunning) return prev
            return {
              ...prev,
              currentTime: Date.now() - prev.startTime
            }
          })
        }, 100)
      } else {
        // Restore paused stopwatch
        setActiveStopwatch(savedStopwatch)
      }
    }

    if (savedTimer) {
      // Restore timer with proper timing
      const now = Date.now()
      
      if (savedTimer.isRunning) {
        // Resume running timer
        const newStartTime = now - (savedTimer.duration - savedTimer.currentTime)
        setActiveTimer({
          ...savedTimer,
          startTime: newStartTime
        })
        
        timerIntervalRef.current = setInterval(() => {
          setActiveTimer(prev => {
            if (!prev || !prev.isRunning) return prev
            
            const elapsed = Date.now() - prev.startTime
            const remaining = Math.max(0, prev.duration - elapsed)
            
            if (remaining <= 0) {
              if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current)
                timerIntervalRef.current = null
              }
              
              // Don't save here - let the timer logic handle it
              // saveTimerSession(prev.duration, true)
              
              return {
                ...prev,
                currentTime: 0,
                isRunning: false,
                isCompleted: true
              }
            }
            
            return {
              ...prev,
              currentTime: remaining
            }
          })
        }, 100)
      } else {
        // Restore paused timer
        setActiveTimer(savedTimer)
      }
    }

    if (savedLaps) {
      setStopwatchLaps(savedLaps)
    }

  }, [])

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (stopwatchIntervalRef.current) {
        clearInterval(stopwatchIntervalRef.current)
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [])

  const saveStopwatchSession = async (finalTime, laps = []) => {
    if (user && firebaseAvailable && finalTime > 0) {
      try {
        await addDoc(collection(db, `users/${user.uid}/sessions`), {
          duration: Math.floor(finalTime / 1000),
          laps: laps.map(lap => Math.floor(lap)),
          createdAt: new Date(),
          type: 'stopwatch'
        })
      } catch {
        // Handle error silently
      }
    }
  }

  const saveTimerSession = async (duration, completed = false, elapsedTime = null) => {
    if (user && firebaseAvailable && !timerSessionSaved.current) {
      try {
        timerSessionSaved.current = true // Set flag to prevent duplicate saves
        
        await addDoc(collection(db, `users/${user.uid}/sessions`), {
          duration: Math.floor(duration / 1000),
          originalDuration: Math.floor(duration / 1000),
          elapsedTime: elapsedTime ? Math.floor(elapsedTime / 1000) : null,
          completed: completed,
          createdAt: new Date(),
          type: 'timer'
        })
      } catch {
        // Handle error silently
      }
    }
  }

  const startStopwatch = (initialTime = 0) => {
    // Clear any existing stopwatch
    if (stopwatchIntervalRef.current) {
      clearInterval(stopwatchIntervalRef.current)
    }

    const startTime = Date.now() - initialTime
    const newStopwatch = {
      startTime,
      currentTime: initialTime,
      isRunning: true,
      isPaused: false
    }
    
    setActiveStopwatch(newStopwatch)
    saveToSessionStorage('activeStopwatch', newStopwatch)

    stopwatchIntervalRef.current = setInterval(() => {
      setActiveStopwatch(prev => {
        if (!prev || !prev.isRunning) return prev
        const updated = {
          ...prev,
          currentTime: Date.now() - prev.startTime
        }
        // Only save to session storage occasionally, not on every tick
        if (Date.now() % 5000 < 10) { // Save roughly every 5 seconds
          saveToSessionStorage('activeStopwatch', updated)
        }
        return updated
      })
    }, 10) // Changed from 100ms to 10ms for smoother updates
  }

  const pauseStopwatch = () => {
    if (activeStopwatch && activeStopwatch.isRunning) {
      const pausedStopwatch = {
        ...activeStopwatch,
        isRunning: false,
        isPaused: true
      }
      setActiveStopwatch(pausedStopwatch)
      saveToSessionStorage('activeStopwatch', pausedStopwatch)
      
      if (stopwatchIntervalRef.current) {
        clearInterval(stopwatchIntervalRef.current)
        stopwatchIntervalRef.current = null
      }
    }
  }

  const resumeStopwatch = () => {
    if (activeStopwatch && activeStopwatch.isPaused) {
      const newStartTime = Date.now() - activeStopwatch.currentTime
      const resumedStopwatch = {
        ...activeStopwatch,
        startTime: newStartTime,
        isRunning: true,
        isPaused: false
      }
      
      setActiveStopwatch(resumedStopwatch)
      saveToSessionStorage('activeStopwatch', resumedStopwatch)

      stopwatchIntervalRef.current = setInterval(() => {
        setActiveStopwatch(prev => {
          if (!prev || !prev.isRunning) return prev
          const updated = {
            ...prev,
            currentTime: Date.now() - prev.startTime
          }
          // Only save to session storage occasionally, not on every tick
          if (Date.now() % 5000 < 10) { // Save roughly every 5 seconds
            saveToSessionStorage('activeStopwatch', updated)
          }
          return updated
        })
      }, 10) // Changed from 100ms to 10ms for smoother updates
    }
  }

  const stopStopwatch = async () => {
    const finalTime = activeStopwatch?.currentTime || 0
    const laps = [...stopwatchLaps]
    
    if (stopwatchIntervalRef.current) {
      clearInterval(stopwatchIntervalRef.current)
      stopwatchIntervalRef.current = null
    }
    setActiveStopwatch(null)
    setStopwatchLaps([])
    
    // Clear sessionStorage
    sessionStorage.removeItem('activeStopwatch')
    sessionStorage.removeItem('stopwatchLaps')
    
    // Save session to history
    await saveStopwatchSession(finalTime, laps)
  }

  const addLap = () => {
    if (activeStopwatch) {
      const newLaps = [...stopwatchLaps, activeStopwatch.currentTime]
      setStopwatchLaps(newLaps)
      saveToSessionStorage('stopwatchLaps', newLaps)
    }
  }

  const startTimer = (duration, initialTime = duration) => {
    // Clear any existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }

    // Reset the session saved flag for new timer
    timerSessionSaved.current = false

    const startTime = Date.now() - (duration - initialTime)
    const newTimer = {
      duration,
      startTime,
      currentTime: initialTime,
      isRunning: true,
      isPaused: false,
      isCompleted: false
    }
    
    setActiveTimer(newTimer)
    saveToSessionStorage('activeTimer', newTimer)

    timerIntervalRef.current = setInterval(() => {
      setActiveTimer(prev => {
        if (!prev || !prev.isRunning) return prev
        
        const elapsed = Date.now() - prev.startTime
        const remaining = Math.max(0, prev.duration - elapsed)
        
        if (remaining <= 0) {
          // Timer completed
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current)
            timerIntervalRef.current = null
          }
          
          // Save completed timer session - handled by flag to prevent duplicates
          
          const completed = {
            ...prev,
            currentTime: 0,
            isRunning: false,
            isCompleted: true
          }
          saveToSessionStorage('activeTimer', completed)
          return completed
        }
        
        const updated = {
          ...prev,
          currentTime: remaining
        }
        // Only save to session storage occasionally, not on every tick
        if (Date.now() % 3000 < 100) { // Save roughly every 3 seconds
          saveToSessionStorage('activeTimer', updated)
        }
        return updated
      })
    }, 100)
  }

  const pauseTimer = () => {
    if (activeTimer && activeTimer.isRunning) {
      const pausedTimer = {
        ...activeTimer,
        isRunning: false,
        isPaused: true
      }
      setActiveTimer(pausedTimer)
      saveToSessionStorage('activeTimer', pausedTimer)
      
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }
  }

  const resumeTimer = () => {
    if (activeTimer && activeTimer.isPaused) {
      const newStartTime = Date.now() - (activeTimer.duration - activeTimer.currentTime)
      const resumedTimer = {
        ...activeTimer,
        startTime: newStartTime,
        isRunning: true,
        isPaused: false
      }
      
      setActiveTimer(resumedTimer)
      saveToSessionStorage('activeTimer', resumedTimer)

      timerIntervalRef.current = setInterval(() => {
        setActiveTimer(prev => {
          if (!prev || !prev.isRunning) return prev
          
          const elapsed = Date.now() - prev.startTime
          const remaining = Math.max(0, prev.duration - elapsed)
          
          if (remaining <= 0) {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current)
              timerIntervalRef.current = null
            }
            
            // Save completed timer session - elapsed time equals duration when completed
            saveTimerSession(prev.duration, true, prev.duration)
            
            const completed = {
              ...prev,
              currentTime: 0,
              isRunning: false,
              isCompleted: true
            }
            saveToSessionStorage('activeTimer', completed)
            return completed
          }
          
          const updated = {
            ...prev,
            currentTime: remaining
          }
          // Only save to session storage occasionally, not on every tick
          if (Date.now() % 3000 < 100) { // Save roughly every 3 seconds
            saveToSessionStorage('activeTimer', updated)
          }
          return updated
        })
      }, 100)
    }
  }

  const stopTimer = async () => {
    const finalTime = activeTimer?.currentTime || 0
    const duration = activeTimer?.duration || 0
    const elapsedTime = duration - finalTime // Calculate elapsed time
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
    setActiveTimer(null)
    
    // Clear sessionStorage
    sessionStorage.removeItem('activeTimer')
    
    // Save session to history with elapsed time
    await saveTimerSession(duration, false, elapsedTime)
    
    // Reset the session saved flag for next timer
    timerSessionSaved.current = false
  }

  const value = {
    activeStopwatch,
    activeTimer,
    stopwatchLaps,
    startStopwatch,
    pauseStopwatch,
    resumeStopwatch,
    stopStopwatch,
    addLap,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer
  }

  return (
    <ActiveTimerContext.Provider value={value}>
      {children}
    </ActiveTimerContext.Provider>
  )
}

export const useActiveTimer = () => {
  const context = useContext(ActiveTimerContext)
  if (!context) {
    throw new Error('useActiveTimer must be used within an ActiveTimerProvider')
  }
  return context
} 