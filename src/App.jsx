import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { TimeFormatProvider } from './context/TimeFormatContext'
import { EditModeProvider } from './context/EditModeContext'
import { ActiveTimerProvider } from './context/ActiveTimerContext'
import { WeatherProvider } from './context/WeatherContext'
import { Layout } from './components/layout/Layout'
import { AuthModal } from './components/features/auth/AuthModal'
import { OfflineIndicator } from './components/common/OfflineIndicator'
import { InstallButton } from './components/common/InstallButton'
import { LoadingSpinner } from './components/common/LoadingSpinner'

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const WorldClockPage = lazy(() => import('./pages/WorldClockPage'))
const TimeConverterPage = lazy(() => import('./pages/TimeConverterPage'))
const StopwatchPage = lazy(() => import('./pages/StopwatchPage'))
const TimerPage = lazy(() => import('./pages/TimerPage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
const WeatherPage = lazy(() => import('./pages/WeatherPage'))
const ScreensaverPage = lazy(() => import('./pages/ScreensaverPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

import { ROUTES } from './constants'
import { useState } from 'react'
import ErrorBoundary from './components/common/ErrorBoundary'
import { useProtocolHandler } from './hooks/useProtocolHandler'

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const [timerDuration, setTimerDuration] = useState(null)

  useProtocolHandler(setTimerDuration)

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <TimeFormatProvider>
            <EditModeProvider>
              <ActiveTimerProvider>
                <WeatherProvider>
                  <div className="App h-full">
                    <OfflineIndicator />
                    <InstallButton />
                    <Suspense fallback={<LoadingSpinner />}>
                      <Routes>
                        <Route path={ROUTES.SCREENSAVER} element={<ScreensaverPage />} />
                        
                        <Route path="/" element={<Layout onAuthModalOpen={(mode) => {
                          setAuthMode(mode)
                          setShowAuthModal(true)
                        }} />}>
                          <Route index element={<HomePage />} />
                          <Route path={ROUTES.WORLD_CLOCK} element={<WorldClockPage />} />
                          <Route path={ROUTES.TIME_CONVERTER} element={<TimeConverterPage />} />
                          <Route path={ROUTES.STOPWATCH} element={<StopwatchPage />} />
                          <Route path={ROUTES.TIMER} element={<TimerPage initialDuration={timerDuration} />} />
                          <Route path={ROUTES.HISTORY} element={<HistoryPage />} />
                          <Route path={ROUTES.WEATHER} element={<WeatherPage />} />
                          <Route path="*" element={<NotFoundPage />} />
                        </Route>
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </Suspense>
                    
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
