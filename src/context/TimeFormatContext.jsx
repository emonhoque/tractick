import { createContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const TimeFormatContext = createContext(null)

export { TimeFormatContext }

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

 