#!/bin/bash

# Production Deployment Script for TrakTick
set -e

echo "🚀 Starting production deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist .vite

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Run linting
echo "🔍 Running linting..."
npm run lint

# Build for production
echo "🏗️ Building for production..."
npm run build:prod

# Verify build output
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully!"

# Check for critical files
echo "🔍 Verifying critical files..."
required_files=(
    "dist/index.html"
    "dist/assets"
    "dist/manifest.webmanifest"
    "dist/sw.js"
)

for file in "${required_files[@]}"; do
    if [ ! -e "$file" ]; then
        echo "❌ Error: Required file/directory missing: $file"
        exit 1
    fi
done

echo "✅ All critical files present!"

# Optional: Deploy to server (uncomment and configure as needed)
# echo "🚀 Deploying to server..."
# rsync -avz --delete dist/ user@your-server:/var/www/traktick/

echo "🎉 Production deployment completed successfully!"
echo "📁 Build output: ./dist/"
echo "🌐 Ready for deployment to your web server" 