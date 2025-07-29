import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import { doc, writeBatch } from 'firebase/firestore'
import { db } from '../lib/firebase'

export const useDragAndDrop = (items, onReorder) => {
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const { user, firebaseAvailable } = useAuth()

  const handleDragStart = useCallback((index) => {
    setDraggedIndex(index)
  }, [])

  const handleDragOver = useCallback((index) => {
    setDragOverIndex(index)
  }, [])

  const handleDrop = useCallback(async (dropIndex) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    // Create new array with reordered items
    const newItems = [...items]
    const draggedItem = newItems[draggedIndex]
    
    // Remove item from original position
    newItems.splice(draggedIndex, 1)
    
    // Insert item at new position
    newItems.splice(dropIndex, 0, draggedItem)

    // Update order in Firebase
    if (user && firebaseAvailable) {
      try {
        const batch = writeBatch(db)
        
        // Update order field for all affected items
        newItems.forEach((item, index) => {
          if (item.id) {
            const itemRef = doc(db, `users/${user.uid}/clocks/${item.id}`)
            batch.update(itemRef, { order: index })
          }
        })
        
        await batch.commit()
      } catch {
        // Revert to original order on error
        return
      }
    }

    // Call the onReorder callback with new items
    onReorder(newItems)
    
    setDraggedIndex(null)
    setDragOverIndex(null)
  }, [draggedIndex, items, onReorder, user, firebaseAvailable])

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }, [])

  return {
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  }
} 