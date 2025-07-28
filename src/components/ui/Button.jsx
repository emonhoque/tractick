import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

const buttonVariants = {
  default: 'bg-[#d90c00] text-white hover:bg-[#b91c1c] focus:ring-[#d90c00]',
  secondary: 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
  // Improved contrast for outline variant in dark mode
  outline: 'border border-[#d90c00] bg-transparent text-[#d90c00] hover:bg-[#fef2f2] focus:ring-[#d90c00] dark:border-[#ff4d4f] dark:text-[#ff4d4f] dark:hover:bg-[#2a0909]',
  ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500 dark:hover:bg-gray-900',
  destructive: 'bg-[#d90c00] text-white hover:bg-[#b91c1c] focus:ring-[#d90c00]'
}

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
}

export const Button = forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'md', 
  disabled = false,
  children,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button' 