import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseProtocolUrl, parseDuration } from '../utils/protocol'

/**
 * Custom hook to handle protocol registration and navigation
 * @param {Function} onTimerSet - Callback to set timer duration when protocol includes timer params
 */
export function useProtocolHandler(onTimerSet) {
  const navigate = useNavigate()

  const handleProtocolNavigation = useCallback((protocolUrl) => {
    const { route, params } = parseProtocolUrl(protocolUrl)
    
    // Navigate to the route
    navigate(route)
    
    // Handle timer parameters
    if (route === '/timer' && params?.duration) {
      const seconds = parseDuration(params.duration)
      if (seconds && onTimerSet) {
        // Small delay to ensure the timer page is loaded
        setTimeout(() => {
          onTimerSet(seconds)
        }, 100)
      }
    }
    
    // Handle world clock parameters
    if (route === '/world-clock' && params?.timezone) {
      // You can add timezone handling here if needed
      // Navigating to world clock with timezone
    }
  }, [navigate, onTimerSet])

  useEffect(() => {
    // Check if the app was launched via protocol
    const urlParams = new URLSearchParams(window.location.search)
    const protocolParam = urlParams.get('protocol')
    
    if (protocolParam) {
      handleProtocolNavigation(protocolParam)
      // Clean up the URL
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }

    // Register protocol handler for future launches
    if ('launchQueue' in window) {
      window.launchQueue.setConsumer(async (launchParams) => {
        if (launchParams.files.length > 0) {
          // Handle file launch if needed
          // App launched with files
        }
      })
    }

    // Listen for protocol launches (for when app is already running)
    const handleBeforeUnload = () => {
      // This is a fallback for when the app is already running
      // The main protocol handling happens in the manifest
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [handleProtocolNavigation])

  return { handleProtocolNavigation }
} 