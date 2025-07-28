import { useState, useRef, useCallback, useEffect } from 'react'

export const useCountdownTimer = (initialTime = 0) => {
  const [time, setTime] = useState(initialTime)
  const [initialDuration, setInitialDuration] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)
  const pausedTimeRef = useRef(0)

  const start = useCallback((duration = time) => {
    if (duration <= 0) return

    if (!isPaused) {
      setTime(duration)
      setInitialDuration(duration)
      setIsCompleted(false)
    }

    if (isPaused) {
      startTimeRef.current = Date.now() - pausedTimeRef.current
      setIsPaused(false)
    } else {
      startTimeRef.current = Date.now()
      pausedTimeRef.current = 0
    }
    
    setIsRunning(true)
    
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const remaining = Math.max(0, duration - elapsed)
      
      setTime(remaining)
      
      if (remaining <= 0) {
        setIsRunning(false)
        setIsPaused(false)
        setIsCompleted(true)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    }, 100)
  }, [time, isPaused])

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    pausedTimeRef.current = Date.now() - startTimeRef.current
    setIsRunning(false)
    setIsPaused(true)
  }, [])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
    setIsPaused(false)
    setIsCompleted(false)
    const elapsedTime = initialDuration - time
    return elapsedTime
  }, [time, initialDuration])

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setTime(initialDuration)
    setIsRunning(false)
    setIsPaused(false)
    setIsCompleted(false)
    pausedTimeRef.current = 0
  }, [initialDuration])

  const setDuration = useCallback((duration) => {
    if (!isRunning && !isPaused) {
      setTime(duration)
      setInitialDuration(duration)
      setIsCompleted(false)
    }
  }, [isRunning, isPaused])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    time,
    initialDuration,
    isRunning,
    isPaused,
    isCompleted,
    start,
    pause,
    stop,
    reset,
    setDuration,
    progress: initialDuration > 0 ? ((initialDuration - time) / initialDuration) * 100 : 0
  }
} 