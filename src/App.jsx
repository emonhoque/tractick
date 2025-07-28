// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { TimeFormatProvider } from './context/TimeFormatContext'
import { EditModeProvider } from './context/EditModeContext'
import { ActiveTimerProvider } from './context/ActiveTimerContext'
import { WeatherProvider } from './context/WeatherContext'
import { Layout } from './components/layout/Layout'
import { AuthModal } from './components/features/auth/AuthModal'
import { HomePage } from './pages/HomePage'
import { WorldClockPage } from './pages/WorldClockPage'
import { TimeConverterPage } from './pages/TimeConverterPage'
import { StopwatchPage } from './pages/StopwatchPage'
import { TimerPage } from './pages/TimerPage'
import { HistoryPage } from './pages/HistoryPage'
import { WeatherPage } from './pages/WeatherPage'
import { ScreensaverPage } from './pages/ScreensaverPage'
import { ROUTES } from './constants'
import { useState } from 'react'
import ErrorBoundary from './components/common/ErrorBoundary'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('signin')

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <TimeFormatProvider>
            <EditModeProvider>
              <ActiveTimerProvider>
                <WeatherProvider>
                  <div className="App h-full">
                <Routes>
                  {/* Screensaver route - full screen, no layout */}
                  <Route path={ROUTES.SCREENSAVER} element={<ScreensaverPage />} />
                  
                  {/* Main app routes with layout */}
                  <Route path="/" element={<Layout onAuthModalOpen={(mode) => {
                    setAuthMode(mode)
                    setShowAuthModal(true)
                  }} />}>
                    <Route index element={<HomePage />} />
                    <Route path={ROUTES.WORLD_CLOCK} element={<WorldClockPage />} />
                    <Route path={ROUTES.TIME_CONVERTER} element={<TimeConverterPage />} />
                    <Route path={ROUTES.STOPWATCH} element={<StopwatchPage />} />
                    <Route path={ROUTES.TIMER} element={<TimerPage />} />
                    <Route path={ROUTES.HISTORY} element={<HistoryPage />} />
                    <Route path={ROUTES.WEATHER} element={<WeatherPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                
                <AuthModal 
                  isOpen={showAuthModal} 
                  onClose={() => setShowAuthModal(false)}
                  initialMode={authMode}
                />
                </div>
                </WeatherProvider>
              </ActiveTimerProvider>
            </EditModeProvider>
          </TimeFormatProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
