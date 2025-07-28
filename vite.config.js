// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'
  
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.webp', 'favicon.png', 'apple-touch-icon.png'],
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/maps\.googleapis\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'google-maps-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                }
              }
            },
            {
              urlPattern: /^https:\/\/api\.openweathermap\.org\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'weather-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 // 1 hour
                }
              }
            }
          ]
        },
        manifest: {
          name: 'traktick - time zones made simple',
          short_name: 'traktick',
          description: 'A straightforward clock app designed to help you keep track of time with ease.',
          theme_color: '#d90c00',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          orientation: 'portrait-primary',
          lang: 'en',
          categories: ['productivity', 'utilities'],
          icons: [
            {
              src: '/android/android-launchericon-192-192.webp',
              sizes: '192x192',
              type: 'image/webp',
              purpose: 'any maskable'
            },
            {
              src: '/android/android-launchericon-512-512.webp',
              sizes: '512x512',
              type: 'image/webp',
              purpose: 'any maskable'
            }
          ],
          shortcuts: [
            {
              name: 'Stopwatch',
              short_name: 'Stopwatch',
              description: 'Start the stopwatch',
              url: '/stopwatch',
              icons: [
                {
                  src: '/android/android-launchericon-96-96.webp',
                  sizes: '96x96'
                }
              ]
            },
            {
              name: 'Timer',
              short_name: 'Timer',
              description: 'Set a timer',
              url: '/timer',
              icons: [
                {
                  src: '/android/android-launchericon-96-96.webp',
                  sizes: '96x96'
                }
              ]
            },
            {
              name: 'World Clock',
              short_name: 'World Clock',
              description: 'View world clocks',
              url: '/world-clock',
              icons: [
                {
                  src: '/android/android-launchericon-96-96.webp',
                  sizes: '96x96'
                }
              ]
            }
          ]
        }
      })
    ],
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            utils: ['date-fns', 'date-fns-tz', 'uuid'],
            ui: ['lucide-react', '@radix-ui/react-dropdown-menu', '@radix-ui/react-icons']
          }
        }
      },
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction
        }
      }
    },
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/api-proxy': {
          target: 'https://maps.googleapis.com',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api-proxy/, ''),
        },
        '/weather-proxy': {
          target: 'https://api.openweathermap.org',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/weather-proxy/, ''),
        }
      }
    },
    define: {
      // Make environment variables available to the client
      'process.env.VITE_FIREBASE_API_KEY': JSON.stringify(env.VITE_FIREBASE_API_KEY),
      'process.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN),
      'process.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(env.VITE_FIREBASE_PROJECT_ID),
      'process.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(env.VITE_FIREBASE_STORAGE_BUCKET),
      'process.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(env.VITE_FIREBASE_MESSAGING_SENDER_ID),
      'process.env.VITE_FIREBASE_APP_ID': JSON.stringify(env.VITE_FIREBASE_APP_ID),
      'process.env.VITE_FIREBASE_MEASUREMENT_ID': JSON.stringify(env.VITE_FIREBASE_MEASUREMENT_ID),
      'process.env.VITE_GOOGLE_API_KEY': JSON.stringify(env.VITE_GOOGLE_API_KEY),
      'process.env.VITE_OPENWEATHER_API_KEY': JSON.stringify(env.VITE_OPENWEATHER_API_KEY)
    }
  }
})
