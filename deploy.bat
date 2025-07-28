@echo off
setlocal enabledelayedexpansion

echo 🚀 Starting production deployment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    exit /b 1
)

REM Clean previous builds
echo 🧹 Cleaning previous builds...
if exist "dist" rmdir /s /q dist
if exist ".vite" rmdir /s /q .vite

REM Install dependencies
echo 📦 Installing dependencies...
call npm ci --production=false
if errorlevel 1 (
    echo ❌ Error: Failed to install dependencies
    exit /b 1
)

REM Run linting
echo 🔍 Running linting...
call npm run lint
if errorlevel 1 (
    echo ❌ Error: Linting failed
    exit /b 1
)

REM Build for production
echo 🏗️ Building for production...
call npm run build:prod
if errorlevel 1 (
    echo ❌ Error: Build failed
    exit /b 1
)

REM Verify build output
if not exist "dist" (
    echo ❌ Error: Build failed - dist directory not found
    exit /b 1
)

echo ✅ Build completed successfully!

REM Check for critical files
echo 🔍 Verifying critical files...
if not exist "dist\index.html" (
    echo ❌ Error: Required file missing: dist\index.html
    exit /b 1
)
if not exist "dist\assets" (
    echo ❌ Error: Required directory missing: dist\assets
    exit /b 1
)
if not exist "dist\manifest.webmanifest" (
    echo ❌ Error: Required file missing: dist\manifest.webmanifest
    exit /b 1
)

echo ✅ All critical files present!

echo 🎉 Production deployment completed successfully!
echo 📁 Build output: .\dist\
echo 🌐 Ready for deployment to your web server

pause 