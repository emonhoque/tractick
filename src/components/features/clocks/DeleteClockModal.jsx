import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { Trash2, AlertTriangle } from 'lucide-react'

export const DeleteClockModal = ({ isOpen, onClose, clock, onConfirm, loading = false }) => {
  if (!clock) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-md"
    >
      <div className="text-center">
        {/* Warning Icon */}
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#fef2f2] dark:bg-[#450a0a] mb-4">
          <AlertTriangle className="h-6 w-6 text-[#b91c1c] dark:text-[#ef4444]" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Delete Clock
        </h3>

        {/* Message */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Are you sure you want to delete <span className="font-medium text-gray-900 dark:text-white">"{clock.label}"</span>? 
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
} 