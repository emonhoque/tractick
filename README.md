# 🕐 tractick - Time Management App

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/yourusername/tractick)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/yourusername/tractick)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/yourusername/tractick/blob/main/LICENSE)
[![PWA](https://img.shields.io/badge/PWA-ready-orange)](https://web.dev/progressive-web-apps/)

A comprehensive time management and tracking solution built with React, Vite, Firebase, and Tailwind CSS. tractick helps you keep track of time with ease through world clocks, timers, stopwatches, and productivity tracking.

## 🤖 AI-Assisted Development

This project was developed using "The Council of AI" - a collaborative approach combining human creativity with AI tools:

- **ClaudeAI** - Bulk code generation and architecture guidance
- **Cursor** - AI-powered IDE for intelligent code completion
- **ChatGPT** - Asset creation (icons, logos, splash screens, visual elements)

The development process evolved from simple coding to software architecture, with AI handling the heavy lifting while human judgment provided direction and quality assurance. This project demonstrates the evolving partnership between developers and AI - where AI accelerates development but human creativity and oversight remain essential.

*TL;DR: AI can't replace developers, at least not yet!*

## ✨ Features

### 🏠 **Home Dashboard**
- **Overview Dashboard**: Central hub showing all your time management tools
- **Quick Access Cards**: One-click access to all features
- **Recent Activity**: View your latest timer and stopwatch sessions
- **Active Timer Indicator**: Real-time display of currently running timers
- **Weather Preview**: Quick weather overview for your saved locations

### 🕐 **World Clock**
- **Multi-Timezone Display**: View multiple timezones simultaneously with real-time updates
- **12/24 Hour Format Toggle**: Click any time display to switch between formats
- **Drag & Drop Reordering**: Customize the order of your world clocks
- **Weather Integration**: See current weather conditions for each location
- **City Search**: Enhanced search with Google Places autocomplete

### ⏱️ **Stopwatch**
- **Precise Timing**: High-accuracy stopwatch with millisecond precision
- **Lap Functionality**: Record multiple laps with individual timing
- **Export Capabilities**: Export lap data for analysis
- **Session Persistence**: Automatic saving of stopwatch sessions

### ⏰ **Timer**
- **Custom Durations**: Set any countdown duration (seconds to hours)
- **Visual Countdown**: Progress bar showing remaining time
- **Sound Notifications**: Audio alerts when timer completes
- **Browser Notifications**: Desktop notifications for timer completion

### 🌤️ **Weather Integration**
- **Current Conditions**: Real-time weather for all your saved locations
- **Detailed Metrics**: Temperature, humidity, pressure, wind speed, visibility
- **Forecast Data**: 5-day weather forecast (when available)
- **Offline Caching**: Weather data cached for offline viewing

### 📊 **History & Analytics**
- **Session History**: Complete record of all timer and stopwatch sessions
- **Filtering Options**: Filter by session type (timer/stopwatch)
- **Data Export**: Export session data for external analysis

### 🖥️ **Screensaver Mode**
- **Full-Screen Display**: Immersive full-screen time display
- **Multiple Locations**: Cycle through all your saved world clocks
- **Touch Navigation**: Swipe gestures for navigation (mobile)

### 🔄 **Time Converter**
- **Multi-Timezone Conversion**: Convert times between different timezones
- **Interactive Slider**: Visual time selection with drag functionality
- **Real-Time Updates**: Instant conversion as you change time

### 🔐 **Authentication & Security**
- **Firebase Authentication**: Secure user authentication system
- **Email/Password**: Traditional email and password signup/login
- **Google Sign-In**: One-click Google authentication

### 🎨 **User Experience**
- **Dark/Light Theme**: Toggle between dark and light themes
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **PWA Support**: Install as desktop/mobile app with offline functionality
- **Keyboard Shortcuts**: Power user keyboard navigation

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
│   │   ├── common/         # Shared components
│   │   ├── features/       # Feature-specific components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # UI components
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Third-party library configs
│   ├── pages/              # Page components
│   ├── utils/              # Utility functions
│   ├── constants/          # Application constants
│   └── main.jsx            # Application entry point
├── public/                 # Static assets
├── dist/                   # Production build output
├── vite.config.js          # Vite configuration with PWA
├── tailwind.config.js      # Tailwind CSS configuration
├── firestore.rules         # Firebase security rules
├── wrangler.jsonc          # Cloudflare Pages configuration
└── package.json            # Dependencies and scripts
```

## 🔧 Technical Architecture

### **Frontend Framework**
- **React 18** with functional components and hooks
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Tailwind CSS** for utility-first styling

### **Backend Services**
- **Firebase Authentication** for user management
- **Firebase Firestore** for real-time database
- **Firebase Security Rules** for data protection

### **External APIs**
- **Google Maps API** for location search and geocoding
- **OpenWeather API** for weather data
- **Timezone API** for timezone calculations

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run clean            # Clean build artifacts
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

**Cloudflare Pages:**
```bash
npm run build
# Connect repository to Cloudflare Pages
```

## 📱 PWA Features

tractick is a Progressive Web App with the following features:

- **Installable** on desktop and mobile devices
- **Offline functionality** for basic features
- **App-like experience** with full-screen mode
- **Automatic updates** when new versions are available

### Installing as PWA

1. Open tractick in Chrome/Edge
2. Click the install icon in the address bar
3. Or use the install button in the app header

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
| `VITE_GOOGLE_API_KEY` | Google Maps API key | Yes |
| `VITE_OPENWEATHER_API_KEY` | OpenWeather API key | Yes |

## 📊 Performance & PWA Status

### PWA Score: 92/100 (A+)

The app achieves excellent PWA scores with:
- ✅ **Core PWA Features**: Complete manifest, service worker, offline support
- ✅ **Platform Support**: iOS, Android, and Windows optimizations
- ✅ **Performance**: Optimized bundle size and loading times
- ✅ **Security**: HTTPS required, comprehensive security headers

### Performance Optimizations

- **Code Splitting**: Automatic bundle splitting by route
- **Lazy Loading**: Components loaded on demand
- **Service Worker**: Caching for offline functionality
- **Image Optimization**: WebP format with fallbacks
- **Tree Shaking**: Unused code removal in production

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

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### AI Development Partners
- [ClaudeAI](https://claude.ai/) - Code generation and architecture guidance
- [Cursor](https://cursor.sh/) - AI-powered IDE
- [ChatGPT](https://chat.openai.com/) - Asset creation and visual elements

### Open Source Libraries
- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Firebase](https://firebase.google.com/) - Backend services
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons
- [Date-fns](https://date-fns.org/) - Date utilities

## 📞 Support

- **Documentation**: [README.md](./README.md)
- **Issues**: [GitHub Issues](https://github.com/emonhoque/tractick/issues)
- **Discussions**: [GitHub Discussions](https://github.com/emonhoque/tractick/discussions)

---

**Made with ❤️ by the tractick team**
