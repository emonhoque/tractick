@echo off
REM Production Build Script for traktick (Windows)

echo 🚀 Starting production build...

REM Clean previous builds
echo 🧹 Cleaning previous builds...
call npm run clean

REM Install dependencies (ensure production dependencies only)
echo 📦 Installing dependencies...
call npm ci --only=production

REM Lint the codebase
echo 🔍 Linting codebase...
call npm run lint

REM Build for production
echo 🏗️ Building for production...
call npm run build:prod

REM Check build output
if exist "dist" (
    echo ✅ Build completed successfully!
    echo 📁 Build output: dist/
    echo 📊 Build size:
    dir dist /s
) else (
    echo ❌ Build failed!
    exit /b 1
)

echo 🎉 Production build ready for deployment!
pause 