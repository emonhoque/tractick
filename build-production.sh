#!/bin/bash

# Production Build Script for traktick
echo "🚀 Starting production build..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
npm run clean

# Install dependencies (ensure production dependencies only)
echo "📦 Installing dependencies..."
npm ci --only=production

# Lint the codebase
echo "🔍 Linting codebase..."
npm run lint

# Build for production
echo "🏗️ Building for production..."
npm run build:prod

# Check build output
if [ -d "dist" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output: dist/"
    echo "📊 Build size:"
    du -sh dist/
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Production build ready for deployment!" 