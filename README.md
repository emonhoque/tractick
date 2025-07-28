# 🕐 tractick - Time Management App

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/yourusername/tractick)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/yourusername/tractick)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/yourusername/tractick/blob/main/LICENSE)
[![PWA](https://img.shields.io/badge/PWA-ready-orange)](https://web.dev/progressive-web-apps/)

A comprehensive time management and tracking solution built with React, Vite, and Firebase. tractick helps you keep track of time with ease through world clocks, timers, stopwatches, and productivity tracking.

## ✨ Features

### 🏠 **Home Dashboard**
- **Overview Dashboard**: Central hub showing all your time management tools
- **Quick Access Cards**: One-click access to all features (Screensaver, Timer, Stopwatch, World Clock, Time Converter, Weather, History)
- **Recent Activity**: View your latest timer and stopwatch sessions
- **Active Timer Indicator**: Real-time display of currently running timers
- **Weather Preview**: Quick weather overview for your saved locations
- **Responsive Grid Layout**: Optimized for desktop (4+3 layout) and mobile (single column)

### 🕐 **World Clock**
- **Multi-Timezone Display**: View multiple timezones simultaneously with real-time updates
- **12/24 Hour Format Toggle**: Click any time display to switch between formats
- **Drag & Drop Reordering**: Customize the order of your world clocks
- **Weather Integration**: See current weather conditions for each location
- **City Search**: Enhanced search with Google Places autocomplete
- **Timezone Detection**: Automatic timezone detection from coordinates
- **Clock Management**: Add, edit, and delete clocks with custom labels
- **Visual Indicators**: Hover effects and format indicators
- **Responsive Design**: Optimized for all screen sizes

### ⏱️ **Stopwatch**
- **Precise Timing**: High-accuracy stopwatch with millisecond precision
- **Lap Functionality**: Record multiple laps with individual timing
- **Lap History**: View all recorded laps with split times
- **Export Capabilities**: Export lap data for analysis
- **Pause & Resume**: Seamlessly pause and resume timing
- **Visual Controls**: Intuitive start, pause, lap, and reset buttons
- **Session Persistence**: Automatic saving of stopwatch sessions
- **Large Display**: Easy-to-read time display with large fonts
- **Mobile Optimized**: Touch-friendly controls for mobile devices

### ⏰ **Timer**
- **Custom Durations**: Set any countdown duration (seconds to hours)
- **Visual Countdown**: Progress bar showing remaining time
- **Sound Notifications**: Audio alerts when timer completes
- **Browser Notifications**: Desktop notifications for timer completion
- **Pause & Resume**: Pause and resume functionality
- **Timer Presets**: Quick access to common durations
- **Session Tracking**: Automatic saving of timer sessions
- **Completion Detection**: Smart detection of timer completion
- **Accessibility**: Keyboard shortcuts and screen reader support

### 🌤️ **Weather Integration**
- **Current Conditions**: Real-time weather for all your saved locations
- **Weather Icons**: Visual weather representation with Lucide icons
- **Detailed Metrics**: Temperature, humidity, pressure, wind speed, visibility
- **Sunrise/Sunset**: Daily sun timing information
- **Forecast Data**: 5-day weather forecast (when available)
- **Automatic Updates**: Weather data refreshes automatically
- **Offline Caching**: Weather data cached for offline viewing
- **Error Handling**: Graceful fallback when weather API is unavailable
- **Location-Based**: Weather tied to your world clock locations

### 📊 **History & Analytics**
- **Session History**: Complete record of all timer and stopwatch sessions
- **Filtering Options**: Filter by session type (timer/stopwatch)
- **Sorting Options**: Sort by date or duration
- **Session Details**: View detailed information for each session
- **Delete Functionality**: Remove unwanted sessions
- **Data Export**: Export session data for external analysis
- **Statistics**: View session statistics and trends
- **Responsive Table**: Mobile-friendly history display
- **Search & Filter**: Find specific sessions quickly

### 🖥️ **Screensaver Mode**
- **Full-Screen Display**: Immersive full-screen time display
- **Multiple Locations**: Cycle through all your saved world clocks
- **Weather Integration**: Display current weather conditions
- **Touch Navigation**: Swipe gestures for navigation (mobile)
- **Auto-Hide Controls**: Controls disappear after inactivity
- **Fullscreen Toggle**: Enter/exit fullscreen mode
- **Theme Integration**: Respects your light/dark theme preference
- **Responsive Design**: Adapts to any screen size
- **Activity Detection**: Automatically hides controls during inactivity

### 🔄 **Time Converter**
- **Multi-Timezone Conversion**: Convert times between different timezones
- **Interactive Slider**: Visual time selection with drag functionality
- **Real-Time Updates**: Instant conversion as you change time
- **Your Locations**: Convert between your saved world clock locations
- **Visual Interface**: Intuitive slider-based time selection
- **Mobile Optimized**: Touch-friendly interface for mobile devices
- **Copy Functionality**: Copy converted times to clipboard
- **12/24 Hour Support**: Works with both time formats

### 🔐 **Authentication & Security**
- **Firebase Authentication**: Secure user authentication system
- **Email/Password**: Traditional email and password signup/login
- **Google Sign-In**: One-click Google authentication
- **User Profiles**: Personalized user profiles with avatars
- **Data Privacy**: User data isolated and secure
- **Session Management**: Automatic session handling
- **Security Rules**: Firebase security rules for data protection
- **Error Handling**: Graceful error handling for auth issues

### 🎨 **User Experience**
- **Dark/Light Theme**: Toggle between dark and light themes
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **PWA Support**: Install as desktop/mobile app with offline functionality
- **Keyboard Shortcuts**: Power user keyboard navigation
- **Accessibility**: WCAG compliant with screen reader support
- **Loading States**: Smooth loading animations and skeletons
- **Error Boundaries**: Graceful error handling throughout the app
- **Toast Notifications**: User-friendly notification system
- **Smooth Animations**: CSS transitions and micro-interactions

### 🌍 **Advanced Features**
- **Real-Time Sync**: Data syncs across all devices in real-time
- **Offline Support**: Core functionality works without internet
- **Data Persistence**: All data saved to Firebase Firestore
- **API Integration**: Google Maps, OpenWeather, and Firebase APIs
- **Performance Optimized**: Fast loading with code splitting
- **SEO Optimized**: Search engine friendly with proper meta tags
- **Cross-Browser**: Works on Chrome, Firefox, Safari, Edge
- **Mobile First**: Designed with mobile users in mind

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase project** (for data persistence)
- **Google Maps API key** (optional, for enhanced city search)
- **OpenWeather API key** (optional, for weather data)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/tractick.git
   cd tractick
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Fill in your API keys in the `.env` file:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

   # Optional APIs
   VITE_GOOGLE_API_KEY=your_google_maps_api_key
   VITE_OPENWEATHER_API_KEY=your_openweather_api_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
tractick/
├── src/
│   ├── components/          # React components
│   │   ├── common/         # Shared components (LoadingSpinner, ErrorBoundary, etc.)
│   │   ├── features/       # Feature-specific components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── clocks/     # World clock components
│   │   │   ├── stopwatch/  # Stopwatch components
│   │   │   ├── timer/      # Timer components
│   │   │   ├── weather/    # Weather components
│   │   │   └── history/    # History components
│   │   ├── layout/         # Layout components (Header, Footer, Layout)
│   │   └── ui/             # UI components (Button, Card, Modal, Input)
│   ├── context/            # React context providers
│   │   ├── AuthContext.jsx     # User authentication state
│   │   ├── ThemeContext.jsx    # Dark/light theme state
│   │   ├── TimeFormatContext.jsx # 12/24 hour format preference
│   │   ├── EditModeContext.jsx # Edit mode for world clocks
│   │   ├── ActiveTimerContext.jsx # Active timer/stopwatch state
│   │   └── WeatherContext.jsx  # Weather data management
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.js          # Authentication hook
│   │   ├── useFirestore.js     # Firebase Firestore operations
│   │   ├── useTimer.js         # Timer functionality
│   │   ├── useCountdownTimer.js # Countdown timer logic
│   │   ├── useDragAndDrop.js   # Drag and drop functionality
│   │   ├── useLocalStorage.js  # Local storage operations
│   │   ├── usePageTitle.js     # Dynamic page titles
│   │   ├── useUserPreferences.js # User preferences
│   │   └── useApiKeys.js       # API key management
│   ├── lib/                # Third-party library configs
│   │   └── firebase.js     # Firebase configuration
│   ├── pages/              # Page components
│   │   ├── HomePage.jsx        # Dashboard/home page
│   │   ├── WorldClockPage.jsx  # World clock management
│   │   ├── StopwatchPage.jsx   # Stopwatch functionality
│   │   ├── TimerPage.jsx       # Timer functionality
│   │   ├── WeatherPage.jsx     # Weather display
│   │   ├── HistoryPage.jsx     # Session history
│   │   ├── TimeConverterPage.jsx # Time conversion
│   │   ├── ScreensaverPage.jsx # Full-screen display
│   │   └── NotFoundPage.jsx    # 404 page
│   ├── utils/              # Utility functions
│   │   ├── time.js             # Time formatting utilities
│   │   ├── timer.js            # Timer logic utilities
│   │   ├── timezone.js         # Timezone calculations
│   │   ├── weather.js          # Weather API utilities
│   │   ├── googleMaps.js       # Google Maps integration
│   │   ├── validation.js       # Form validation
│   │   ├── migration.js        # Data migration utilities
│   │   ├── export.js           # Data export functionality
│   │   └── cn.js               # Class name utilities
│   ├── constants/          # Application constants
│   │   └── index.js            # Route definitions and constants
│   └── main.jsx            # Application entry point
├── public/                 # Static assets
│   ├── favicon.png         # App icon
│   ├── manifest.webmanifest # PWA manifest
│   ├── android/            # Android app icons
│   ├── ios/                # iOS app icons
│   └── windows11/          # Windows app icons
├── dist/                   # Production build output
├── vite.config.js          # Vite configuration with PWA
├── tailwind.config.js      # Tailwind CSS configuration
├── firestore.rules         # Firebase security rules
├── wrangler.jsonc          # Cloudflare Pages configuration
├── docker-compose.yml      # Docker deployment
├── nginx.conf              # Nginx configuration
└── package.json            # Dependencies and scripts
```

## 🔧 Technical Architecture

### **Frontend Framework**
- **React 18** with functional components and hooks
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Tailwind CSS** for utility-first styling

### **State Management**
- **React Context** for global state management
- **Custom Hooks** for reusable logic
- **Local Storage** for persistent preferences
- **Session Storage** for temporary state

### **Backend Services**
- **Firebase Authentication** for user management
- **Firebase Firestore** for real-time database
- **Firebase Security Rules** for data protection

### **External APIs**
- **Google Maps API** for location search and geocoding
- **OpenWeather API** for weather data
- **Timezone API** for timezone calculations

### **Data Flow**

```
User Action → Component → Hook → Context → Firebase/API → UI Update
```

1. **User Interaction**: User clicks button or performs action
2. **Component Handler**: Component calls appropriate hook or context method
3. **State Update**: Context updates global state
4. **API Call**: Hook makes API call to Firebase or external service
5. **Data Persistence**: Data saved to Firestore or local storage
6. **UI Re-render**: Components re-render with updated data

### **Performance Optimizations**

- **Code Splitting**: Automatic bundle splitting by route
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo and useMemo for expensive calculations
- **Service Worker**: Caching for offline functionality
- **Image Optimization**: WebP format with fallbacks
- **Tree Shaking**: Unused code removal in production

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run build:analyze    # Analyze bundle size

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run clean            # Clean build artifacts

# Production
npm run start            # Start production server
```

### Development Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes and test:**
   ```bash
   npm run dev
   npm run lint
   ```

3. **Build and test production build:**
   ```bash
   npm run build
   npm run preview
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

## 🚀 Production Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deploy Options

**Vercel (Recommended):**
```bash
npm i -g vercel
vercel --prod
```

**Netlify:**
```bash
npm run build
# Drag dist folder to Netlify
```

**Firebase Hosting:**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

**Docker:**
```bash
docker-compose up -d
```

**Cloudflare Pages:**
```bash
npm run build
# Connect repository to Cloudflare Pages
```

## 🔧 Configuration

### API Setup

#### Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore
3. Add a web app to your project
4. Copy the configuration to your `.env` file

#### Google Maps API (Optional)

1. Create a Google Cloud project
2. Enable the following APIs:
   - Places API (New)
   - Places API (Legacy)
   - Maps JavaScript API
3. Create an API key with domain restrictions
4. Add to `.env` as `VITE_GOOGLE_API_KEY`

#### OpenWeather API (Optional)

1. Sign up at [OpenWeather](https://openweathermap.org/api)
2. Get your API key
3. Add to `.env` as `VITE_OPENWEATHER_API_KEY`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | Yes |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase measurement ID | No |
| `VITE_GOOGLE_API_KEY` | Google Maps API key | No |
| `VITE_OPENWEATHER_API_KEY` | OpenWeather API key | No |

## 📱 PWA Features

tractick is a Progressive Web App with the following features:

- **Installable** on desktop and mobile devices
- **Offline functionality** for basic features
- **Push notifications** (coming soon)
- **App-like experience** with full-screen mode
- **Automatic updates** when new versions are available

### Installing as PWA

1. Open tractick in Chrome/Edge
2. Click the install icon in the address bar
3. Or use the install button in the app header

## 📖 Detailed Usage Guide

### 🏠 **Getting Started with Home Dashboard**

1. **Sign In**: Create an account or sign in with Google
2. **Explore Features**: Use the feature cards to navigate to different tools
3. **View Recent Activity**: Check your latest timer and stopwatch sessions
4. **Monitor Active Timers**: See currently running timers in real-time
5. **Weather Overview**: Quick weather check for your saved locations

### 🕐 **Using World Clock**

1. **Add a Clock**:
   - Click the "+" button to add a new clock
   - Search for a city using the enhanced search
   - Select from autocomplete suggestions
   - Customize the clock label if desired

2. **Manage Clocks**:
   - **Edit Mode**: Click the edit button to enter edit mode
   - **Reorder**: Drag and drop clocks to change their order
   - **Edit**: Click the edit icon to modify clock details
   - **Delete**: Remove unwanted clocks

3. **Time Format**:
   - Click any time display to toggle between 12/24 hour format
   - Your preference is saved and applied globally
   - Hover over times to see format indicators

4. **Weather Integration**:
   - Weather data automatically loads for each location
   - View temperature, conditions, and other weather details
   - Weather updates automatically every 10 minutes

### ⏱️ **Using Stopwatch**

1. **Start Timing**:
   - Click "Start" to begin the stopwatch
   - The display shows elapsed time in real-time

2. **Record Laps**:
   - Click "Lap" to record a lap time
   - View all laps in the laps list below
   - Each lap shows split time and total time

3. **Pause & Resume**:
   - Click "Pause" to pause the stopwatch
   - Click "Resume" to continue from where you left off
   - The stopwatch maintains accuracy during pauses

4. **Stop & Save**:
   - Click "Stop" to end the session
   - Session is automatically saved to your history
   - Click "Reset" to clear the display

### ⏰ **Using Timer**

1. **Set Duration**:
   - Use the time input to set your desired duration
   - Choose from preset durations (5min, 10min, 15min, 30min, 1hr)
   - Or enter a custom time in hours:minutes:seconds format

2. **Start Countdown**:
   - Click "Start" to begin the countdown
   - Visual progress bar shows remaining time
   - Large display shows current time remaining

3. **Pause & Resume**:
   - Click "Pause" to pause the timer
   - Click "Resume" to continue the countdown
   - Timer maintains accuracy during pauses

4. **Notifications**:
   - Audio notification plays when timer completes
   - Browser notification appears (if permission granted)
   - Timer session is automatically saved

### 🌤️ **Using Weather Features**

1. **View Weather**:
   - Navigate to the Weather page
   - See current conditions for all your saved locations
   - View detailed metrics (temperature, humidity, pressure, wind)

2. **Weather Details**:
   - Click on any weather card for detailed information
   - View sunrise/sunset times
   - See 5-day forecast (when available)

3. **Automatic Updates**:
   - Weather data refreshes automatically
   - Cached data available offline
   - Graceful fallback when API is unavailable

### 🖥️ **Using Screensaver Mode**

1. **Enter Screensaver**:
   - Navigate to the Screensaver page
   - Click "Enter Fullscreen" for immersive experience
   - Or use the regular view for desktop use

2. **Navigation**:
   - **Desktop**: Use arrow buttons to cycle through locations
   - **Mobile**: Swipe left/right to navigate between clocks
   - **Auto-hide**: Controls disappear after 10 seconds of inactivity

3. **Features**:
   - View time, date, and weather for each location
   - Toggle between light and dark themes
   - Exit with the X button or ESC key

### 🔄 **Using Time Converter**

1. **Select Time**:
   - Use the interactive slider to set the time
   - Or click on the time display to enter manually
   - Time updates in real-time as you adjust

2. **View Conversions**:
   - See converted times for all your saved locations
   - Times update instantly as you change the source time
   - Copy any converted time to clipboard

3. **Mobile Usage**:
   - Touch-friendly slider interface
   - Swipe gestures for time adjustment
   - Responsive design for all screen sizes

### 📊 **Using History & Analytics**

1. **View Sessions**:
   - Navigate to the History page
   - See all your timer and stopwatch sessions
   - Sessions are sorted by date (newest first)

2. **Filter & Sort**:
   - Filter by session type (timer/stopwatch)
   - Sort by date or duration
   - Search for specific sessions

3. **Manage Data**:
   - Delete unwanted sessions
   - Export data for external analysis
   - View session statistics and trends

### 🎨 **Customization Options**

#### **Theme Settings**
- **Automatic**: Follows your system theme preference
- **Manual Toggle**: Use the theme button in the header
- **Persistent**: Your choice is saved and remembered

#### **Time Format Preferences**
- **Global Toggle**: Click any time display to change format
- **Persistent**: Format preference saved across sessions
- **Visual Indicators**: Hover effects show current format

#### **PWA Installation**
1. **Desktop**: Click the install icon in the browser address bar
2. **Mobile**: Use the install button in the app header
3. **Features**: Offline functionality, app-like experience, automatic updates

### ⌨️ **Keyboard Shortcuts**

- **Space**: Start/stop timer or stopwatch
- **L**: Record lap (stopwatch only)
- **R**: Reset timer or stopwatch
- **Escape**: Exit fullscreen or close modals
- **Tab**: Navigate between elements
- **Enter**: Activate buttons and form submissions

### 📱 **Mobile Features**

- **Touch Gestures**: Swipe navigation in screensaver and converter
- **Responsive Design**: Optimized for all screen sizes
- **Touch-Friendly Controls**: Large buttons and touch targets
- **PWA Support**: Install as a native app
- **Offline Functionality**: Core features work without internet

## 🔒 Security

### Firebase Security Rules

The app includes comprehensive Firestore security rules in `firestore.rules`:

- User authentication required for data access
- Users can only access their own data
- Rate limiting on write operations
- Input validation and sanitization

### API Security

- API keys are restricted to your domain
- CORS protection enabled
- HTTPS required in production
- Content Security Policy headers

## 📊 Performance

### Optimization Features

- **Code splitting** - Automatic bundle splitting for faster loading
- **Tree shaking** - Unused code removal
- **Lazy loading** - Components loaded on demand
- **Service worker** - Caching for offline functionality
- **Image optimization** - WebP format with fallbacks
- **Gzip compression** - Reduced file sizes

### Performance Metrics

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🐛 Troubleshooting

### Common Issues

#### API Errors

**Google Maps API:**
- Verify API key and domain restrictions
- Check that required APIs are enabled
- App falls back to basic search if unavailable

**OpenWeather API:**
- Verify API key is valid
- Check rate limits (1000 calls/day free tier)
- App continues without weather data if unavailable

**Firebase:**
- Verify project configuration
- Check security rules
- Ensure authentication is enabled

#### Build Issues

```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build
```

#### Development Issues

```bash
# Check for linting errors
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Getting Help

1. Check the [troubleshooting section](#troubleshooting) above
2. Review browser console for error messages
3. Verify all environment variables are configured
4. Check API key permissions and restrictions
5. Open an issue on GitHub with detailed error information

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

### Code Style

- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Firebase](https://firebase.google.com/) - Backend services
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons
- [Date-fns](https://date-fns.org/) - Date utilities

## 📞 Support

- **Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/tractick/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/tractick/discussions)

---

**Made with ❤️ by the tractick team**

## Features

- **World Clock**: View multiple timezones simultaneously with 12/24 hour format toggle
- **Stopwatch**: Precise timing with lap functionality
- **Timer**: Countdown timer with custom durations
- **History**: Track your time management activities
- **Dark/Light Theme**: Toggle between themes
- **PWA Support**: Install as a desktop/mobile app
- **Time Format Toggle**: Click on any time display to switch between 12-hour and 24-hour formats

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project
- Google Maps API key (optional)
- OpenWeather API key (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd time
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Copy the environment template and fill in your values:
```bash
cp env.example .env
```

4. Start the development server:
```bash
npm run dev
```

## Production Deployment

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Quick Deploy Options:

**Vercel (Recommended):**
```bash
npm i -g vercel
vercel --prod
```

**Docker:**
```bash
docker-compose up -d
```

**Manual Build:**
```bash
npm run build
npm run preview
```

## API Configuration

### Google Maps API (Optional)

The app uses Google Maps API for enhanced city search functionality. To enable this:

1. Create a Google Cloud project
2. Enable the following APIs:
   - Places API (New)
   - Places API (Legacy)
   - Maps JavaScript API
3. Create an API key with appropriate restrictions
4. Add the key to your `.env` file as `VITE_GOOGLE_API_KEY`

### World Time API

The app uses the free World Time API for timezone data. This API:
- Has rate limits (1 request per second)
- May experience occasional downtime
- Falls back to local calculations when unavailable

## Usage

### Time Format Toggle

The app supports both 12-hour and 24-hour time formats. You can toggle between formats by:

1. **World Clock Cards**: Click on any time display to switch between 12-hour and 24-hour formats
2. **History Page**: All timestamps automatically use your selected format
3. **Home Page**: Recent activity timestamps follow your format preference

The time format preference is saved in your browser's local storage and will persist across sessions.

### World Clock

- Add clocks for different cities and timezones
- Click on the time display to toggle between 12/24 hour format
- Hover over the time to see a visual indicator of the current format
- Each clock shows the current time, date, timezone offset, and abbreviation

## Troubleshooting

### API Issues

#### Google Maps API Errors

If you encounter Google Maps API errors:

1. **400 Bad Request**: Check your API key configuration and ensure the required APIs are enabled
2. **CORS Errors**: The app uses Vite proxy in development to avoid CORS issues
3. **Rate Limiting**: The app implements fallback mechanisms to handle rate limits

**Solutions:**
- Verify your API key is correct and has the necessary permissions
- Check that Places API (New) and Maps JavaScript API are enabled
- The app will automatically fall back to Timezone API mode if Google Maps fails

#### World Time API Connection Issues

If you encounter World Time API connection errors:

1. **Connection Reset**: The API may be temporarily unavailable
2. **Rate Limiting**: The app implements caching and rate limiting protection
3. **Timeout Errors**: The app uses retry mechanisms with exponential backoff

**Solutions:**
- The app automatically falls back to local timezone calculations
- Check your internet connection
- The app caches responses to reduce API calls

### Development Issues

#### CORS Errors in Development

The app includes Vite proxy configuration to handle CORS issues:

```javascript
// vite.config.js
server: {
  proxy: {
    '/api-proxy': {
      target: 'https://maps.googleapis.com',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api-proxy/, ''),
    },
    '/timezone-proxy': {
      target: 'https://worldtimeapi.org',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/timezone-proxy/, ''),
    }
  }
}
```

#### API Key Issues

If APIs are not working:

1. Check that all environment variables are set correctly
2. Verify API keys have the necessary permissions
3. Check browser console for specific error messages
4. The app will show helpful error messages in the UI

### Performance Optimization

The app implements several optimization strategies:

- **Caching**: API responses are cached for 5 minutes
- **Rate Limiting**: Prevents excessive API calls
- **Fallback Mechanisms**: Local calculations when APIs are unavailable
- **Debounced Search**: Reduces API calls during typing

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase:
```bash
firebase init hosting
```

4. Deploy:
```bash
firebase deploy
```

### Other Platforms

The app can be deployed to any static hosting platform:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Check that all environment variables are configured
4. Verify API keys have the necessary permissions

The app is designed to be resilient to API failures and will continue to function with local calculations when external APIs are unavailable.
