# Dynamic Page Titles

This document explains how the dynamic page title system works in the traktick application.

## Overview

The application uses a custom hook `usePageTitle` to automatically update the browser's title bar and meta tags based on the current route.

## How It Works

### 1. Page Title Mapping

The `usePageTitle` hook contains a mapping of routes to page names:

```javascript
const PAGE_TITLES = {
  '/': 'Home',
  '/world-clock': 'World Clock',
  '/time-converter': 'Time Converter',
  '/stopwatch': 'Stopwatch',
  '/timer': 'Timer',
  '/history': 'History',
  '/screensaver': 'Screensaver',
  '/weather': 'Weather'
}
```

### 2. Title Format

- **Home page**: `traktick - time zones made simple`
- **Other pages**: `{PageName} | traktick`

Examples:
- Home: `traktick - time zones made simple`
- Weather: `Weather | traktick`
- Stopwatch: `Stopwatch | traktick`
- World Clock: `World Clock | traktick`

### 3. Implementation

The hook is used in two places:

1. **Layout component** (`src/components/layout/Layout.jsx`) - for all pages that use the main layout
2. **Screensaver page** (`src/pages/ScreensaverPage.jsx`) - for the full-screen screensaver

### 4. Meta Tag Updates

The hook also updates the following meta tags for social sharing:
- `meta[name="title"]`
- `meta[property="og:title"]`
- `meta[name="twitter:title"]`

## Usage

To add the hook to a new page component:

```javascript
import { usePageTitle } from '../hooks/usePageTitle'

export const MyNewPage = () => {
  usePageTitle()
  
  // ... rest of component
}
```

## Adding New Routes

To add a new route with a custom page title:

1. Add the route to the `PAGE_TITLES` mapping in `src/hooks/usePageTitle.js`
2. The title will automatically be formatted as `{PageName} | traktick`

## Files Modified

- `src/hooks/usePageTitle.js` - New hook for managing page titles
- `src/hooks/index.js` - Export the new hook
- `src/components/layout/Layout.jsx` - Added hook to layout
- `src/pages/ScreensaverPage.jsx` - Added hook to screensaver
- `index.html` - Updated default titles and meta tags 