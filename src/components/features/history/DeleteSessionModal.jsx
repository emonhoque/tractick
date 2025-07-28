import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { Trash2, AlertTriangle, TimerOff, Timer } from 'lucide-react'

export const DeleteSessionModal = ({ isOpen, onClose, session, onConfirm, loading = false }) => {
  if (!session) return null

  const getSessionIcon = () => {
    return session.type === 'stopwatch' ? (
      <TimerOff className="h-4 w-4 text-green-600 dark:text-green-400" />
    ) : (
      <Timer className="h-4 w-4 text-purple-600 dark:text-purple-400" />
    )
  }

  const getSessionType = () => {
    return session.type === 'stopwatch' ? 'Stopwatch Session' : 'Timer Session'
  }

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
          Delete Session
        </h3>

        {/* Message */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Are you sure you want to delete this session?
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            {getSessionIcon()}
            <span className="font-medium">{getSessionType()}</span>
            {session.label && (
              <>
                <span>•</span>
                <span className="font-medium text-gray-900 dark:text-white">"{session.label}"</span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            This action cannot be undone.
          </p>
        </div>

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