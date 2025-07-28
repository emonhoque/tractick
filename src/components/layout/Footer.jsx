import { Heart } from 'lucide-react'
import { ApiStatus } from '../common/ApiStatus'

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-[#0e0d0d] border-t border-gray-200 dark:border-gray-700">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-[#b91c1c] fill-current" />
            <span>by <a href="https://emontofazzal.com" target="_blank" rel="noopener noreferrer" className="text-[#b91c1c] dark:text-white hover:underline">Emon</a></span>
            
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <span><ApiStatus /></span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <span>© 2025 traktick. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  )
} 