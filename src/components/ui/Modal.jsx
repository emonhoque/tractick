import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Button } from './Button'

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className,
  showCloseButton = true 
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      setIsAnimating(true)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with enhanced blur and animation */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300",
          isAnimating ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      
      {/* Modal container with modern styling */}
      <div
        className={cn(
          'relative w-full max-w-sm mx-auto',
          'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl',
          'border border-gray-200/50 dark:border-gray-700/50',
          'rounded-2xl shadow-2xl',
          'transform transition-all duration-300 ease-out',
          isAnimating 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with modern styling */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 pb-4">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        
        {/* Content with improved spacing */}
        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
} 