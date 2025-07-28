import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { CustomTitleBar } from './CustomTitleBar'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useTitleBarSpacing } from '../../hooks/useTitleBarSpacing'
import { HomePage } from '../../pages/HomePage'
import { ROUTES } from '../../constants'

export const Layout = ({ onAuthModalOpen }) => {
  // Update page title based on current route
  usePageTitle()
  const location = useLocation()
  const { titleBarStyle } = useTitleBarSpacing()
  
  // Check if we're on the screensaver page
  const isScreensaverPage = location.pathname === ROUTES.SCREENSAVER

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col" style={titleBarStyle}>
      {/* Custom title bar for window controls overlay */}
      <CustomTitleBar />
      
      {/* Header - sticky on mobile except for screensaver */}
      <div className={`${isScreensaverPage ? '' : 'lg:static sticky top-0 z-50'}`}>
        <Header onAuthModalOpen={onAuthModalOpen} />
      </div>
      
      <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: '1152px' }}>
        {location.pathname === '/' ? (
          <HomePage onAuthModalOpen={onAuthModalOpen} />
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
    </div>
  )
} 