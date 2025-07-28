export const COLORS = {
  primary: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    900: '#7f1d1d'
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  }
}

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
}

export const ROUTES = {
  HOME: '/',
  WORLD_CLOCK: '/world-clock',
  TIME_CONVERTER: '/time-converter',
  STOPWATCH: '/stopwatch',
  TIMER: '/timer',
  HISTORY: '/history',
  SCREENSAVER: '/screensaver',
  WEATHER: '/weather'
}

export const API_KEYS = {
  FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  GOOGLE_MAPS: import.meta.env.VITE_GOOGLE_API_KEY,
  OPENWEATHER: import.meta.env.VITE_OPENWEATHER_API_KEY
}

export const API_ENDPOINTS = {
  GOOGLE_MAPS: 'https://maps.googleapis.com',
  OPENWEATHER: 'https://api.openweathermap.org/data/2.5'
} 