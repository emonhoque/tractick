# TrakTick Production Deployment Guide

## Prerequisites

- Node.js 18+ installed
- All environment variables configured
- Firebase project set up
- Google Maps API key
- OpenWeather API key

## Environment Setup

1. Copy the environment template:
   ```bash
   cp env.example .env
   ```

2. Fill in your actual API keys and configuration values in `.env`

## Build for Production

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run linting to check for issues:
   ```bash
   npm run lint
   ```

3. Build the application:
   ```bash
   npm run build
   ```

4. Preview the production build:
   ```bash
   npm run preview
   ```

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. Set environment variables in Vercel dashboard

### Option 2: Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to Netlify

3. Set environment variables in Netlify dashboard

### Option 3: Firebase Hosting

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

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

### Option 4: Cloudflare Pages

1. Connect your repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output directory: `dist`
4. Configure environment variables

## Environment Variables

Make sure to set these in your hosting platform:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_GOOGLE_API_KEY`
- `VITE_OPENWEATHER_API_KEY`

## Performance Optimization

The build includes:
- Code splitting and lazy loading
- Tree shaking
- Minification and compression
- Service worker for caching
- Optimized bundle chunks

## Security Checklist

- [ ] Environment variables are set
- [ ] API keys are restricted to your domain
- [ ] Firebase security rules are configured
- [ ] HTTPS is enabled
- [ ] CSP headers are configured (if needed)

## Monitoring

- Set up error tracking (Sentry, LogRocket, etc.)
- Monitor Core Web Vitals
- Set up uptime monitoring
- Configure analytics (if needed)

## Troubleshooting

### Build Issues
- Check for linting errors: `npm run lint`
- Clear cache: `npm run clean`
- Check environment variables

### Runtime Issues
- Check browser console for errors
- Verify API keys are working
- Check Firebase configuration

### Performance Issues
- Run Lighthouse audit
- Check bundle size with `npm run build:analyze`
- Monitor Core Web Vitals 