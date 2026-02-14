#!/bin/bash

echo "========================================"
echo "QR Scanner App - Quick Setup"
echo "========================================"
echo ""

echo "Step 1: Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "Node.js found: $(node --version)"
echo ""

echo "Step 2: Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo "Dependencies installed!"
echo ""

echo "Step 3: Checking for Android SDK..."
if [ -n "$ANDROID_HOME" ]; then
    echo "Android SDK found at $ANDROID_HOME"
else
    echo "WARNING: ANDROID_HOME not set. Install Android Studio for Android builds."
fi
echo ""

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next Steps:"
echo "1. Copy the fixed files from 'fixed-files' folder to your project"
echo "2. Update AdMob IDs in the files (see SETUP_GUIDE.md)"
echo "3. Run 'npm run android' to test on Android device"
echo ""
echo "For detailed instructions, read SETUP_GUIDE.md"
echo ""