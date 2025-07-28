import { useMemo } from 'react'
import { API_KEYS } from '../constants'

export const useApiKeys = () => {
  const apiKeys = useMemo(() => ({
    firebase: {
      apiKey: API_KEYS.FIREBASE_API_KEY,
      authDomain: API_KEYS.FIREBASE_AUTH_DOMAIN,
      projectId: API_KEYS.FIREBASE_PROJECT_ID,
      storageBucket: API_KEYS.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: API_KEYS.FIREBASE_MESSAGING_SENDER_ID,
      appId: API_KEYS.FIREBASE_APP_ID,
      measurementId: API_KEYS.FIREBASE_MEASUREMENT_ID
    },
    googleMaps: API_KEYS.GOOGLE_MAPS,
    openWeather: API_KEYS.OPENWEATHER
  }), [])

  const isFirebaseConfigured = useMemo(() => {
    return apiKeys.firebase.apiKey && 
           apiKeys.firebase.authDomain && 
           apiKeys.firebase.projectId && 
           apiKeys.firebase.storageBucket && 
           apiKeys.firebase.messagingSenderId && 
           apiKeys.firebase.appId
  }, [apiKeys.firebase])

  const isGoogleMapsAvailable = useMemo(() => {
    return !!apiKeys.googleMaps
  }, [apiKeys.googleMaps])

  const isOpenWeatherAvailable = useMemo(() => {
    return !!apiKeys.openWeather
  }, [apiKeys.openWeather])

  return {
    apiKeys,
    isFirebaseConfigured,
    isGoogleMapsAvailable,
    isOpenWeatherAvailable
  }
} 