import { useState, useRef } from 'react'
import { GripVertical } from 'lucide-react'
import { WorldClockCard } from './WorldClockCard'
import { cn } from '../../../utils/cn'

export const DraggableClockCard = ({ 
  clock, 
  onEdit, 
  onDelete, 
  index, 
  isDragging, 
  onDragStart, 
  onDragOver, 
  onDrop,
  onDragEnd 
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const dragRef = useRef(null)

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target.outerHTML)
    onDragStart(index)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
    onDragOver(index)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    onDrop(index)
  }

  const handleDragEnd = () => {
    setIsDragOver(false)
    onDragEnd()
  }

  return (
    <div
      ref={dragRef}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      className={cn(
        'relative transition-all duration-200',
        isDragging && 'opacity-50 scale-95',
        isDragOver && 'border-2 border-dashed border-primary-500 bg-primary-50 dark:bg-primary-900/20'
      )}
    >
      {/* Drag Handle */}
      <div className="absolute top-2 left-2 z-20 cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
      </div>

      {/* Clock Card */}
      <div className={cn(
        'transition-transform duration-200',
        isDragging && 'rotate-2'
      )}>
        <WorldClockCard
          clock={clock}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  )
} 