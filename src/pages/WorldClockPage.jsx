import { useState, useEffect } from 'react'
import { Plus, Clock, Edit3, Check, X, ArrowRight, Globe } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { useEditMode } from '../context/EditModeContext'
import { useFirestoreCollection } from '../hooks/useFirestore'
import { useDragAndDrop } from '../hooks/useDragAndDrop'
import { WorldClockCard } from '../components/features/clocks/WorldClockCard'
import { DraggableClockCard } from '../components/features/clocks/DraggableClockCard'
import { AddClockModalEnhanced } from '../components/features/clocks/AddClockModalEnhanced'
import { EditClockModal } from '../components/features/clocks/EditClockModal'
import { DeleteClockModal } from '../components/features/clocks/DeleteClockModal'
import { LoadingCard } from '../components/common/LoadingSpinner'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { migrateClockOrder } from '../utils/migration'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants'

export const WorldClockPage = () => {
  const navigate = useNavigate()
  const { user, firebaseAvailable } = useAuth()
  const { isEditMode, enterEditMode, exitEditMode } = useEditMode()
  const { data: clocks, loading } = useFirestoreCollection('clocks', 'order', 'asc')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedClock, setSelectedClock] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [orderedClocks, setOrderedClocks] = useState([])

  // Initialize ordered clocks when data changes
  useEffect(() => {
    if (clocks.length > 0) {
      setOrderedClocks(clocks)
    }
  }, [clocks])

  // Run migration for existing clocks
  useEffect(() => {
    if (user && firebaseAvailable && clocks.length > 0) {
      migrateClockOrder(user.uid)
    }
  }, [user, firebaseAvailable, clocks.length])

  const {
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  } = useDragAndDrop(orderedClocks, setOrderedClocks)

  const handleDeleteClock = (clock) => {
    setSelectedClock(clock)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!user || !firebaseAvailable || !selectedClock) return

    setDeleteLoading(true)
    try {
      await deleteDoc(doc(db, `users/${user.uid}/clocks/${selectedClock.id}`))
      setShowDeleteModal(false)
      setSelectedClock(null)
    } catch (error) {
      // Handle error silently
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setSelectedClock(null)
    setDeleteLoading(false)
  }

  const handleEditClock = (clock) => {
    setSelectedClock(clock)
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setSelectedClock(null)
  }

  if (!user || !firebaseAvailable) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {!firebaseAvailable ? 'Firebase not configured' : 'Sign in to manage your world clocks'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {!firebaseAvailable ? 'Please configure Firebase to use this feature.' : 'Please sign in to access this feature.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            World Clocks
          </h1>
          {isEditMode && (
            <span className="px-2 py-1 text-xs bg-[#fef2f2] text-[#991b1b] dark:bg-[#450a0a] dark:text-[#b91c1c] rounded-full">
              Edit Mode
            </span>
          )}
        </div>
        <div className="flex flex-row gap-2 sm:gap-0.5">
          {isEditMode ? (
            <>
              <Button onClick={() => setShowAddModal(true)} className="flex-1 whitespace-nowrap text-sm px-3 py-2 sm:px-2 sm:py-1">
                <Plus className="h-4 w-4 mr-1 text-white" />
                Add Clock
              </Button>
              <Button variant="secondary" onClick={exitEditMode} className="flex-1 text-sm px-3 py-2 sm:px-2 sm:py-1">
                <Check className="h-4 w-4 mr-1 text-white" />
                Done
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setShowAddModal(true)} className="flex-1 whitespace-nowrap text-sm px-4 py-3 sm:px-3 sm:py-2">
                <Plus className="h-5 w-5 mr-2 text-white" />
                Add Clock
              </Button>
              <Button variant="outline" onClick={enterEditMode} className="flex-1 text-sm px-4 py-3 sm:px-3 sm:py-2">
                <Edit3 className="h-5 w-5 mr-2 text-[#d90c00]" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate(ROUTES.TIME_CONVERTER)}
                disabled={clocks.length === 0}
                className="flex-1 text-sm px-4 py-3 sm:px-3 sm:py-2 whitespace-nowrap"
              >
                <Globe className="h-5 w-5 mr-2 text-[#d90c00]" />
                Time Converter
              </Button>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(2)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      ) : clocks.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No clocks added yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Add your first world clock to get started
          </p>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Clock
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(isEditMode ? orderedClocks : clocks).map((clock, index) => (
            isEditMode ? (
              <DraggableClockCard
                key={clock.id}
                clock={clock}
                onEdit={handleEditClock}
                onDelete={handleDeleteClock}
                index={index}
                isDragging={draggedIndex === index}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
              />
            ) : (
              <WorldClockCard
                key={clock.id}
                clock={clock}
                onEdit={handleEditClock}
                onDelete={handleDeleteClock}
              />
            )
          ))}
        </div>
      )}

      <AddClockModalEnhanced
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <EditClockModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        clock={selectedClock}
      />

      <DeleteClockModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        clock={selectedClock}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </div>
  )
} 