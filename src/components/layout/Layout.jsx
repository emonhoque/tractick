import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { usePageTitle } from '../../hooks/usePageTitle'
import { HomePage } from '../../pages/HomePage'

export const Layout = ({ onAuthModalOpen }) => {
  // Update page title based on current route
  usePageTitle()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col">
      <Header onAuthModalOpen={onAuthModalOpen} />
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