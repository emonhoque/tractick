import { createContext, useContext, useState } from 'react'

const EditModeContext = createContext(null)

export const EditModeProvider = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false)

  const toggleEditMode = () => {
    setIsEditMode(prev => !prev)
  }

  const enterEditMode = () => {
    setIsEditMode(true)
  }

  const exitEditMode = () => {
    setIsEditMode(false)
  }

  const value = {
    isEditMode,
    setIsEditMode,
    toggleEditMode,
    enterEditMode,
    exitEditMode
  }

  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  )
}

export const useEditMode = () => {
  const context = useContext(EditModeContext)
  if (!context) {
    throw new Error('useEditMode must be used within an EditModeProvider')
  }
  return context
} 