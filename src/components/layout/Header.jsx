import { useState, useCallback, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Sun, Moon, User, LogOut, ChevronDown, Clock, Globe, Cloud, Download } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { Button } from '../ui/Button'
import { PWAInstallPrompt } from '../common/PWAInstallPrompt'
import { ROUTES } from '../../constants'

const navigation = [
  { name: 'Home', href: ROUTES.HOME },
  { 
    name: 'Time Tools', 
    items: [
      { name: 'Stopwatch', href: ROUTES.STOPWATCH, icon: Clock },
      { name: 'Timer', href: ROUTES.TIMER, icon: Clock },
      { name: 'History', href: ROUTES.HISTORY, icon: Clock }
    ]
  },
  { 
    name: 'World Time', 
    items: [
      { name: 'World Clock', href: ROUTES.WORLD_CLOCK, icon: Globe },
      { name: 'Time Converter', href: ROUTES.TIME_CONVERTER, icon: Globe }
    ]
  },
  { name: 'Weather', href: ROUTES.WEATHER },
  { name: 'Screensaver', href: ROUTES.SCREENSAVER }
]

export const Header = ({ onAuthModalOpen }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileMenuClosing, setMobileMenuClosing] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  
  // Refs for hover timeout management
  const hoverTimeoutRef = useRef(null)
  const dropdownRefs = useRef({})

  // Clear any existing timeout
  const clearHoverTimeout = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
  }, [])

  // Handle dropdown hover with delay
  const handleDropdownHover = useCallback((dropdownName) => {
    clearHoverTimeout()
    setActiveDropdown(dropdownName)
  }, [clearHoverTimeout])

  // Handle dropdown leave with delay
  const handleDropdownLeave = useCallback(() => {
    clearHoverTimeout()
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150) // 150ms delay to prevent flickering
  }, [clearHoverTimeout])

  // Handle dropdown enter (when moving from button to dropdown menu)
  const handleDropdownMenuEnter = useCallback((dropdownName) => {
    clearHoverTimeout()
    setActiveDropdown(dropdownName)
  }, [clearHoverTimeout])

  // Handle dropdown menu leave
  const handleDropdownMenuLeave = useCallback(() => {
    clearHoverTimeout()
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 100) // Slightly shorter delay for menu
  }, [clearHoverTimeout])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearHoverTimeout()
    }
  }, [clearHoverTimeout])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown || profileDropdownOpen) {
        const isClickInsideDropdown = event.target.closest('[data-dropdown]')
        const isClickInsideProfile = event.target.closest('[data-profile-dropdown]')
        
        if (!isClickInsideDropdown && !isClickInsideProfile) {
          setActiveDropdown(null)
          setProfileDropdownOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [activeDropdown, profileDropdownOpen])

  const getUserDisplayName = () => {
    if (user?.displayName) {
      return user.displayName.split(' ')[0]
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'User'
  }

  const handleLogout = () => {
    logout()
    setProfileDropdownOpen(false)
  }

  const handleCloseMobileMenu = () => {
    setMobileMenuClosing(true)
    setTimeout(() => {
      setMobileMenuOpen(false)
      setMobileMenuClosing(false)
    }, 300)
  }

  // Flatten navigation for mobile menu and add PWA install button
  const getMobileNavigation = () => {
    const items = []
    navigation.forEach(item => {
      if (item.items) {
        items.push(...item.items)
      } else {
        items.push(item)
      }
    })
    // Add PWA install button only for mobile
    items.push({ name: 'Install App', href: '#', icon: Download, isPWAInstall: true })
    return items
  }

  return (
    <header className="bg-white dark:bg-[#0e0d0d] border-b border-gray-200 dark:border-gray-700">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-6 lg:px-8" style={{ maxWidth: '1152px' }}>
        <div className="flex lg:flex-1">
          <Link to={ROUTES.HOME} className="-m-1.5 p-1.5 flex items-center justify-start w-[160px] h-14">
            <img 
              src={theme === 'dark' ? '/assets/header-logo-2-dark.webp' : '/assets/header-logo-2-light.webp'} 
              alt="tractick" 
              className="h-12 w-auto object-contain max-w-full"
            />
          </Link>
        </div>

        <div className="flex lg:hidden items-center gap-1">
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className="p-2 text-gray-900 dark:text-gray-100 hover:text-[#d90c00] hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors min-w-[44px] min-h-[44px] border border-gray-300 dark:border-gray-600"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-gray-900 dark:text-gray-100 hover:text-[#d90c00] hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors min-w-[44px] min-h-[44px] border border-gray-300 dark:border-gray-600"
            aria-label="Open mobile menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        <div className="hidden lg:flex lg:gap-x-6 items-center">
          {navigation.map((item) => {
            if (item.items) {
              // Dropdown item
              const isActive = item.items.some(subItem => location.pathname === subItem.href)
              const isOpen = activeDropdown === item.name
              
              return (
                <div 
                  key={item.name} 
                  className="relative flex-shrink-0"
                  data-dropdown={item.name}
                  onMouseEnter={() => handleDropdownHover(item.name)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-1 text-sm font-semibold leading-6 transition-colors rounded-md px-3 py-2 ${
                      isActive || isOpen
                        ? 'text-[#d90c00] bg-[#fef2f2] dark:bg-[#450a0a] dark:text-white'
                        : 'text-gray-900 dark:text-gray-100 hover:text-[#ff4d4f] hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.name}
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </Button>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div 
                      className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50 animate-in fade-in-0 slide-in-from-top-1 duration-200"
                      data-dropdown={item.name}
                      onMouseEnter={() => handleDropdownMenuEnter(item.name)}
                      onMouseLeave={handleDropdownMenuLeave}
                    >
                      <div className="py-1">
                        {item.items.map((subItem) => {
                          const SubIcon = subItem.icon
                          return (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              onClick={() => {
                                setActiveDropdown(null)
                                clearHoverTimeout()
                              }}
                              className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors whitespace-nowrap ${
                                location.pathname === subItem.href
                                  ? 'bg-[#fef2f2] text-[#d90c00] dark:bg-[#450a0a] dark:text-[#d90c00]'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              <SubIcon className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{subItem.name}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            } else {
              // Regular link
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-semibold leading-6 transition-colors whitespace-nowrap flex-shrink-0 rounded-md px-3 py-2 ${
                    location.pathname === item.href
                      ? 'text-[#d90c00] bg-[#fef2f2] dark:bg-[#450a0a] dark:text-white hover:text-[#ff4d4f] dark:hover:text-[#ff4d4f]'
                      : 'text-gray-900 dark:text-gray-100 hover:text-[#ff4d4f] hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.name}
                </Link>
              )
            }
          })}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <div className="relative" data-profile-dropdown>
              <Button
                variant="ghost"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-2"
              >
                <div className="w-8 h-8 rounded-full bg-[#d90c00] flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {getUserDisplayName()}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </Button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50 animate-in fade-in-0 slide-in-from-top-1 duration-200" data-profile-dropdown>
                  <div className="py-1">
                    <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                      <div className="font-medium truncate" title={user.displayName || user.email}>
                        {user.displayName || user.email}
                      </div>
                      <div className="text-xs text-gray-500 truncate mt-1" title={user.email}>
                        {user.email}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start text-[#d90c00] hover:bg-[#fef2f2] dark:hover:bg-[#450a0a] px-4 py-2"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => onAuthModalOpen('signup')}
                className="border-accent text-accent hover:bg-accent hover:text-white px-4 py-2"
              >
                Sign Up
              </Button>
              <Button 
                onClick={() => onAuthModalOpen('signin')}
                className="bg-accent hover:bg-accent-hover text-white px-4 py-2"
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300" onClick={handleCloseMobileMenu} />
          <div className={`fixed top-0 left-0 right-0 bottom-0 z-50 w-full overflow-y-auto bg-white dark:bg-[#0a0a0a] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 transform transition-all duration-300 ease-in-out ${mobileMenuClosing ? 'animate-slide-up' : 'animate-slide-down'}`} style={{ zIndex: 51 }}>
            <div className="flex items-center justify-between">
              <Link to={ROUTES.HOME} className="-m-1.5 p-1.5 flex items-center justify-start w-[120px] h-8">
                <img 
                  src={theme === 'dark' ? '/assets/header-logo-2-dark.webp' : '/assets/header-logo-2-light.webp'} 
                  alt="tractick" 
                  className="h-8 w-auto object-contain max-w-full"
                />
              </Link>
              <Button
                variant="ghost"
                onClick={handleCloseMobileMenu}
                className="-m-2.5 p-2.5 text-gray-900 dark:text-gray-100 hover:text-[#d90c00] hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                aria-label="Close mobile menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {getMobileNavigation().map((item) => {
                    if (item.isPWAInstall) {
                      // Special handling for PWA install item (mobile only)
                      return (
                        <div key={item.name} className="-mx-3 block rounded-lg px-3 py-2">
                          <PWAInstallPrompt 
                            className="w-full text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#0a0a0a] border-0 min-w-0 min-h-0" 
                            showText={true}
                          />
                        </div>
                      )
                    }
                    
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={handleCloseMobileMenu}
                        className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                          location.pathname === item.href
                            ? 'bg-[#fef2f2] text-[#d90c00] dark:bg-[#450a0a] dark:text-[#d90c00]'
                            : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#0a0a0a]'
                        }`}
                      >
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
                <div className="py-6 space-y-4">
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-3 py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#d90c00] flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate" title={getUserDisplayName()}>
                              {getUserDisplayName()}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate" title={user.email}>
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            logout()
                            handleCloseMobileMenu()
                          }}
                          className="text-[#d90c00] hover:bg-[#fef2f2] dark:hover:bg-[#450a0a]"
                        >
                          <LogOut className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        onClick={() => {
                          handleCloseMobileMenu()
                          onAuthModalOpen('signin')
                        }}
                        className="w-full bg-accent hover:bg-accent-hover text-white"
                      >
                        Sign In
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleCloseMobileMenu()
                          onAuthModalOpen('signup')
                        }}
                        className="w-full border-accent text-accent hover:bg-accent hover:text-white"
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 