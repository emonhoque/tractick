import { useContext } from 'react'
import { ActiveTimerContext } from '../context/ActiveTimerContext'

export const useActiveTimer = () => {
  const context = useContext(ActiveTimerContext)
  if (!context) {
    throw new Error('useActiveTimer must be used within an ActiveTimerProvider')
  }
  return context
} 