import { useState, useEffect } from 'react'

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item === null) {
        return initialValue
      }
      
      // Try to parse as JSON, but fall back to string if it fails
      try {
        return JSON.parse(item)
      } catch {
        // If JSON parsing fails, return the raw string value
        return item
      }
    } catch {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      // Store as JSON if it's an object/array, otherwise as string
      if (typeof valueToStore === 'object' || Array.isArray(valueToStore)) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } else {
        window.localStorage.setItem(key, String(valueToStore))
      }
    } catch {
      // Silent fail
    }
  }

  return [storedValue, setValue]
} 