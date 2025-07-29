import { useContext } from 'react'
import { TimeFormatContext } from '../context/TimeFormatContext'

export const useTimeFormat = () => {
  const context = useContext(TimeFormatContext)
  if (!context) {
    throw new Error('useTimeFormat must be used within a TimeFormatProvider')
  }
  return context
} 