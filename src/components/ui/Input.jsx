import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export const Input = forwardRef(({ 
  className, 
  type = 'text',
  error = false,
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
        'dark:border-gray-700 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-primary-500',
        error && 'border-red-500 focus:ring-red-500',
        className
      )}
      {...props}
    />
  )
})

Input.displayName = 'Input' 