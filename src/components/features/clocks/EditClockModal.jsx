import { useState, useEffect } from 'react'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { useAuth } from '../../../context/AuthContext'
import { db } from '../../../lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { LoadingSpinner } from '../../common/LoadingSpinner'

export const EditClockModal = ({ isOpen, onClose, clock }) => {
  const [label, setLabel] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user, firebaseAvailable } = useAuth()

  // Initialize form with clock data when modal opens
  useEffect(() => {
    if (clock && isOpen) {
      setLabel(clock.label || '')
      setError('')
    }
  }, [clock, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !firebaseAvailable || !clock) {
      setError('Unable to edit clock')
      return
    }

    setLoading(true)
    setError('')

    try {
      await updateDoc(doc(db, `users/${user.uid}/clocks/${clock.id}`), {
        label: label.trim() || clock.place
      })

      setLabel('')
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setLabel('')
    setError('')
    onClose()
  }

  if (!clock) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit World Clock"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
                      <div className="p-3 text-sm text-[#b91c1c] bg-[#fef2f2] dark:bg-[#450a0a] rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
                        <div className="p-3 bg-gray-50 dark:bg-[#0a0a0a] rounded-lg text-sm text-gray-600 dark:text-gray-400">
            {clock.place}
            {clock.country && `, ${clock.country}`}
          </div>
        </div>

        <div>
          <label htmlFor="label" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Custom Label
          </label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g., Home, Office"
            disabled={loading || !firebaseAvailable}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Leave empty to use the location name
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={loading || !firebaseAvailable}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  )
} 