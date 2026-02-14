@echo off
echo ========================================
echo QR Scanner App - Quick Setup
echo ========================================
echo.

echo Step 1: Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found!
echo.

echo Step 2: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed!
echo.

echo Step 3: Checking for Android SDK...
if exist "%ANDROID_HOME%\platform-tools\adb.exe" (
    echo Android SDK found at %ANDROID_HOME%
) else (
    echo WARNING: Android SDK not found. Install Android Studio for Android builds.
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Copy the fixed files from 'fixed-files' folder to your project
echo 2. Update AdMob IDs in the files (see SETUP_GUIDE.md)
echo 3. Run 'npm run android' to test on Android device
echo.
echo For detailed instructions, read SETUP_GUIDE.md
echo.
pause