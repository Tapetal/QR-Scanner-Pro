# QR Scanner & Brain Teaser App - Setup Guide

## Overview
This app combines a QR Code Scanner with a Daily Brain Teaser puzzle game, monetized with Google AdMob ads.

## Features
- **QR Scanner**: Scan QR codes and barcodes with camera
- **QR Generator**: Create QR codes for text, URLs, and WiFi
- **Daily Puzzles**: Brain teaser puzzles with streak tracking
- **Archive**: View solved puzzles history
- **Profile**: Track stats and manage settings
- **AdMob Integration**: Banner ads and interstitial ads after every 3 scans

---

## Prerequisites

### Required Software
1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **Git** - [Download](https://git-scm.com/)
3. **VS Code** - [Download](https://code.visualstudio.com/)
4. **Android Studio** (for Android builds) - [Download](https://developer.android.com/studio)
5. **Xcode** (for iOS builds, Mac only) - App Store

### Install EAS CLI
```bash
npm install -g eas-cli
```

---

## Step 1: Setup Project in VS Code

### 1. Extract Your Project
Extract the downloaded ANYTHING folder to a location like:
```
C:\Projects\QRScannerApp
```

### 2. Open in VS Code
```bash
cd C:\Projects\QRScannerApp\_\apps\mobile
code .
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Apply the Fixed Files
Copy these fixed files from the output directory to your project:

**Copy these files:**
```
fixed-files/src/app/index.jsx → _/apps/mobile/src/app/index.jsx
fixed-files/src/app/(tabs)/_layout.jsx → _/apps/mobile/src/app/(tabs)/_layout.jsx
fixed-files/src/app/(tabs)/scanner.jsx → _/apps/mobile/src/app/(tabs)/scanner.jsx
fixed-files/src/utils/storage.js → _/apps/mobile/src/utils/storage.js
```

---

## Step 2: Configure AdMob (IMPORTANT!)

### Get Your AdMob IDs
1. Go to [Google AdMob](https://admob.google.com/)
2. Create an account if you don't have one
3. Create a new app
4. Create ad units:
   - **Banner Ad** (for bottom banners)
   - **Interstitial Ad** (for fullscreen ads after 3 scans)

### Update Ad Unit IDs
Replace the placeholder IDs in these files:

**File: `src/components/AdBanner.jsx`**
```javascript
const adUnitId = Platform.select({
  ios: "ca-app-pub-XXXXXXXX/XXXXXXXX",     // Your iOS Banner ID
  android: "ca-app-pub-XXXXXXXX/XXXXXXXX", // Your Android Banner ID
});
```

**File: `src/app/(tabs)/scanner.jsx`**
```javascript
const adUnitId = Platform.select({
  ios: "ca-app-pub-XXXXXXXX/XXXXXXXX",     // Your iOS Interstitial ID
  android: "ca-app-pub-XXXXXXXX/XXXXXXXX", // Your Android Interstitial ID
});
```

**File: `app.json`**
```json
"ios": {
  "infoPlist": {
    "GADApplicationIdentifier": "ca-app-pub-XXXXXXXX~XXXXXXXX"  // Your iOS App ID
  }
},
"android": {
  "permissions": [...],
},
"plugins": [
  [
    "react-native-google-mobile-ads",
    {
      "androidAppId": "ca-app-pub-XXXXXXXX~XXXXXXXX",  // Your Android App ID
      "iosAppId": "ca-app-pub-XXXXXXXX~XXXXXXXX"       // Your iOS App ID
    }
  ]
]
```

---

## Step 3: Test Locally

### For Android Development
```bash
npm run android
```

This will:
1. Start Metro bundler
2. Build the Android app
3. Install it on a connected Android device or emulator

### For iOS Development (Mac only)
```bash
npm run ios
```

### For Web Preview (Limited functionality)
```bash
npx expo start --web
```

**Note:** Camera features won't work on web, only on real devices.

---

## Step 4: Build Production APK/IPA

### Option A: Using EAS Build (Recommended)

#### 1. Login to Expo
```bash
eas login
```

#### 2. Configure Build
```bash
eas build:configure
```

#### 3. Build for Android (APK)
```bash
eas build --platform android --profile preview
```

This creates an APK you can install directly on Android devices.

#### 4. Build for iOS (IPA)
```bash
eas build --platform ios --profile preview
```

**Note:** You need an Apple Developer account ($99/year) for iOS builds.

#### 5. Download Your Builds
After the build completes, you'll get a download link in the terminal.

---

### Option B: Local Android Build

#### 1. Generate Android APK
```bash
cd android
./gradlew assembleRelease
```

#### 2. Find Your APK
```
android/app/build/outputs/apk/release/app-release.apk
```

#### 3. Sign Your APK (For Production)
You'll need to create a keystore:
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

Update `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        storeFile file('my-release-key.keystore')
        storePassword 'YOUR_PASSWORD'
        keyAlias 'my-key-alias'
        keyPassword 'YOUR_PASSWORD'
    }
}
```

---

## Step 5: Customize Your App

### Change App Name
**File: `app.json`**
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug"
  }
}
```

### Change App Icon
Replace these files:
```
assets/images/icon.png (1024x1024)
assets/images/adaptive-icon.png (1024x1024)
assets/images/splash-icon.png (1024x1024)
```

### Change Package Name
**File: `app.json`**
```json
"android": {
  "package": "com.tapetal.qrscannerappname"
},
"ios": {
  "bundleIdentifier": "com.tapetal.qrscannerappname"
}
```

Also update:
- `android/app/build.gradle` → `applicationId`
- `android/app/src/main/AndroidManifest.xml` → `package` attribute

---

## Step 6: Test Ads

### Test Mode
The app uses test ads in development mode (`__DEV__`). These are safe to click and won't violate AdMob policies.

### Production Mode
Once you build a release version, real ads will show using your AdMob IDs.

**IMPORTANT:** Never click your own ads in production! This can get your AdMob account banned.

---

## Troubleshooting

### Issue: Ads not showing
**Solution:**
1. Verify your AdMob IDs are correct
2. Check that your AdMob account is approved
3. Ensure you're testing on a real device (not simulator)
4. Wait 24-48 hours after creating ad units

### Issue: Camera not working
**Solution:**
1. Grant camera permissions when prompted
2. Test on a real device (camera doesn't work on simulators)
3. Check AndroidManifest.xml has camera permission

### Issue: Build fails
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install

# Clean Android build
cd android
./gradlew clean
cd ..
```

### Issue: Metro bundler errors
**Solution:**
```bash
# Reset Metro cache
npx expo start --clear
```

---

## Publishing to App Stores

### Google Play Store (Android)
1. Create a Google Play Developer account ($25 one-time fee)
2. Build a signed release APK or AAB (Android App Bundle)
3. Upload to Google Play Console
4. Fill in app details, screenshots, etc.
5. Submit for review

### Apple App Store (iOS)
1. Enroll in Apple Developer Program ($99/year)
2. Build a signed IPA
3. Upload to App Store Connect
4. Fill in app details, screenshots, etc.
5. Submit for review

---

## AdMob Best Practices

1. **Don't click your own ads** - Use test ads during development
2. **Ad placement** - Banner ads at bottom, interstitials between natural breaks
3. **Ad frequency** - Currently set to 1 interstitial per 3 scans (good balance)
4. **Privacy Policy** - Required for AdMob, update PRIVACY_POLICY.md
5. **GDPR Compliance** - For EU users, implement consent forms

---

## Support

### Common Commands
```bash
# Start development
npm run android  # or npm run ios

# Clear cache
npx expo start --clear

# Build APK
eas build --platform android --profile preview

# Check logs
npx react-native log-android
npx react-native log-ios
```

### File Structure
```
src/
├── app/
│   ├── (tabs)/
│   │   ├── scanner.jsx    # QR Scanner
│   │   ├── generate.jsx   # QR Generator
│   │   ├── puzzle.jsx     # Brain Teaser
│   │   ├── history.jsx    # Archive
│   │   └── profile.jsx    # Profile
│   ├── _layout.jsx
│   └── index.jsx
├── components/
│   └── AdBanner.jsx       # Banner ad component
└── utils/
    ├── storage.js         # QR history
    └── puzzleStorage.js   # Puzzle data
```

---

## Next Steps

1. ✅ Copy fixed files to your project
2. ✅ Update AdMob IDs
3. ✅ Test on a real Android device
4. ✅ Customize app name, icon, colors
5. ✅ Build APK and test
6. ✅ Submit to Google Play Store

Good luck with your app! 🚀