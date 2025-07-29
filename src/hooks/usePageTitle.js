import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Page title mapping
const PAGE_TITLES = {
  '/': 'Home',
  '/world-clock': 'World Clock',
  '/time-converter': 'Time Converter',
  '/stopwatch': 'Stopwatch',
  '/timer': 'Timer',
  '/history': 'History',
  '/screensaver': 'Screensaver',
  '/weather': 'Weather'
}

export const usePageTitle = () => {
  const location = useLocation()

  useEffect(() => {
    const pageName = PAGE_TITLES[location.pathname] || 'Home'
    const title = pageName === 'Home' ? 'tractick - time zones made simple' : `${pageName} | tractick`
    
    document.title = title
    
    // Also update meta tags for social sharing
    const metaTitle = document.querySelector('meta[name="title"]')
    const ogTitle = document.querySelector('meta[property="og:title"]')
    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    
    if (metaTitle) metaTitle.setAttribute('content', title)
    if (ogTitle) ogTitle.setAttribute('content', title)
    if (twitterTitle) twitterTitle.setAttribute('content', title)
  }, [location.pathname])
} 