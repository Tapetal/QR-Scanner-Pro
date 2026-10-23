# Mobile app

This folder contains the QR Scanner Pro Expo / React Native application. For the feature overview, repository layout, and web app instructions, see the [repository README](../../../README.md).

## Requirements

- Node.js and npm
- Android Studio and Android SDK for local Android runs
- macOS and Xcode for local iOS native builds
- An Expo account with the project’s EAS build credentials for production cloud builds

## Install and run

```bash
npm ci
npx expo start
```

For a local native Android run, use `npm run android` after installing the Android tools.

## Tests

```bash
npx jest --runInBand
```

## Production Android build

The `production` EAS profile runs Expo prebuild and creates an Android App Bundle. Android compile and target SDK 36 are configured in `app.json`; the Android application ID is `com.tapetal.qrscannerapp`.

```bash
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile production
```

Retrieve the AAB from the completed EAS build page. The build does not publish to Google Play. Keep environment values and signing credentials in EAS or local ignored files; never commit secrets.
