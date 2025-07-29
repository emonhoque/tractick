import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './useAuth'

export const useUserPreferences = () => {
  const { user, firebaseAvailable } = useAuth()
  const [preferences, setPreferences] = useState({
    weatherLocations: [] // Array of clock IDs to show weather for
  })
  const [loading, setLoading] = useState(true)

  // Load preferences from Firebase
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user || !firebaseAvailable || !db) {
        setLoading(false)
        return
      }

      try {
        const userPrefsRef = doc(db, 'users', user.uid, 'preferences', 'user')
        const userPrefsDoc = await getDoc(userPrefsRef)
        
        if (userPrefsDoc.exists()) {
          setPreferences(userPrefsDoc.data())
        } else {
          // Set default preferences
          setPreferences({
            weatherLocations: []
          })
        }
      } catch {
        setPreferences({
          weatherLocations: []
        })
      } finally {
        setLoading(false)
      }
    }

    loadPreferences()
  }, [user, firebaseAvailable])

  // Save preferences to Firebase
  const savePreferences = async (newPreferences) => {
    if (!user || !firebaseAvailable || !db) {
      return false
    }

    try {
      const userPrefsRef = doc(db, 'users', user.uid, 'preferences', 'user')
      await setDoc(userPrefsRef, newPreferences, { merge: true })
      setPreferences(newPreferences)
      return true
    } catch {
      return false
    }
  }

  // Update weather locations
  const updateWeatherLocations = async (locationIds) => {
    const newPreferences = {
      ...preferences,
      weatherLocations: locationIds
    }
    return await savePreferences(newPreferences)
  }

  return {
    preferences,
    loading,
    savePreferences,
    updateWeatherLocations
  }
} 