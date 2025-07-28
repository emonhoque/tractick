import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const TimeFormatContext = createContext(null)

export const TimeFormatProvider = ({ children }) => {
  const [use24Hour, setUse24Hour] = useLocalStorage('timeFormat24Hour', true)

  const toggleTimeFormat = () => {
    setUse24Hour(prev => !prev)
  }

  const value = {
    use24Hour,
    setUse24Hour,
    toggleTimeFormat
  }

  return (
    <TimeFormatContext.Provider value={value}>
      {children}
    </TimeFormatContext.Provider>
  )
}

export const useTimeFormat = () => {
  const context = useContext(TimeFormatContext)
  if (!context) {
    throw new Error('useTimeFormat must be used within a TimeFormatProvider')
  }
  return context
} 