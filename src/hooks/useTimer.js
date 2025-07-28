import { useState, useRef, useCallback, useEffect } from 'react'

export const useTimer = () => {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)
  const pausedTimeRef = useRef(0)

  const start = useCallback(() => {
    if (isPaused) {
      startTimeRef.current = Date.now() - pausedTimeRef.current
      setIsPaused(false)
    } else {
      startTimeRef.current = Date.now()
      pausedTimeRef.current = 0
    }
    
    setIsRunning(true)
    
    intervalRef.current = setInterval(() => {
      setTime(Date.now() - startTimeRef.current)
    }, 10)
  }, [isPaused])

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    pausedTimeRef.current = time
    setIsRunning(false)
    setIsPaused(true)
  }, [time])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
    setIsPaused(false)
    return time
  }, [time])

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setTime(0)
    setIsRunning(false)
    setIsPaused(false)
    pausedTimeRef.current = 0
  }, [])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    time,
    isRunning,
    isPaused,
    start,
    pause,
    stop,
    reset
  }
} 