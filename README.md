# QR Scanner Pro

QR Scanner Pro is a mobile QR utility and daily puzzle app. The repository also contains a companion web application with API routes.

## Mobile app

The mobile app is built with Expo, React Native, and Expo Router. It provides:

- **Scan:** Scan QR codes with the camera and keep a local scan history.
- **Generate:** Create QR codes for text, URLs, and Wi-Fi credentials. Wi-Fi data is sent to the QR image service only after the app asks for consent.
- **Daily puzzle:** Solve an offline daily riddle, use a hint, and track completed puzzles and streaks. Puzzle selection varies by installation and avoids recent repeats where possible.
- **Archive:** Review saved scan and puzzle history.
- **Profile and settings:** View puzzle stats, choose Light, Dark, or System appearance, and optionally schedule a daily 9 AM local-time puzzle reminder.
- **Advertising:** Google AdMob banner ads are integrated into the app.

Puzzle progress, scan history, and appearance and reminder preferences are stored locally on the device. Notification delivery depends on device permissions and operating-system settings. See the [Privacy Policy](./PRIVACY_POLICY.md) for details about data handling and third-party services.

## Repository structure

```text
QR-Scanner-Pro/
├── LICENSE
├── PRIVACY_POLICY.md
├── README.md
└── _/
    └── apps/
        ├── mobile/                  # Expo React Native app
        │   ├── assets/              # App icons, images, and fonts
        │   ├── src/
        │   │   ├── app/
        │   │   │   ├── (tabs)/      # Scanner, generator, puzzle, archive, profile
        │   │   │   ├── index.jsx    # Entry route
        │   │   │   └── _layout.jsx  # Root providers and app lifecycle
        │   │   ├── components/      # Shared UI components
        │   │   └── utils/           # Storage, puzzles, themes, notifications, auth
        │   ├── app.json             # Expo identity, plugins, Android SDK settings
        │   ├── eas.json             # EAS build profiles
        │   └── package.json
        └── web/                     # React Router/Vite companion web app and API routes
            ├── src/
            │   └── app/             # Web routes, layouts, and API endpoints
            ├── package.json
            └── bun.lock
```

## Technology

- **Mobile:** Expo SDK 54, React Native 0.81, Expo Router 6, JavaScript/JSX and TypeScript
- **Android:** Expo Build Properties configures compile SDK 36 and target SDK 36; the application ID is `com.tapetal.qrscannerapp`
- **Builds:** EAS Build; the production Android profile creates an Android App Bundle (AAB) and increments the remote Android version code
- **Web:** React Router 7, Vite, and TypeScript; Bun is used for its lockfile
- **Mobile persistence:** AsyncStorage

Android native project files are generated during Expo prebuild and are ignored by Git. Persistent Android SDK settings belong in `_/apps/mobile/app.json`.

## Develop the mobile app

Requirements: Node.js and npm. For local native Android or iOS runs, install the corresponding platform tools; iOS native builds require macOS and Xcode.

```bash
cd _/apps/mobile
npm ci
npx expo start
```

Use the Expo CLI prompts to open the app on a device or emulator. For a local native Android run, use `npm run android` after setting up Android Studio and the Android SDK.

### Mobile tests

```bash
cd _/apps/mobile
npx jest --runInBand
```

### Production Android AAB

The production EAS profile runs Expo prebuild, uses remote Android app-version management, and produces an AAB:

```bash
cd _/apps/mobile
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile production
```

Download the completed AAB from the EAS build page. Building does not upload or publish the app to Google Play. Before release, check the completed build and Play Console for the expected package name, version code, and target SDK.

### Build environment and secrets

EAS build-time environment values are configured in EAS and referenced by `eas.json`. Do not commit `.env` files, credentials, signing keys, or service secrets. Local environment files and generated Android/build output are ignored by Git.

## Develop the web app

The web application uses Bun and the committed `bun.lock`:

```bash
cd _/apps/web
bun install
bun run dev
```

To run its type check:

```bash
bun run typecheck
```

## More information

- [Mobile app development and build notes](./_/apps/mobile/README.md)
- [Privacy Policy](./PRIVACY_POLICY.md)
- [MIT License](./LICENSE)
