# QR Scanner Pro

A mobile app built with React Native and Expo that combines a QR code scanner and generator with daily brain teaser puzzles.

## Features

- **QR Scanner** — Scan QR codes with your camera. Copy, share, or open URLs instantly. Scans are saved to history automatically.
- **QR Generator** — Create QR codes for text, URLs, or WiFi credentials. Share them directly from the app.
- **Daily Puzzles** — A new brain teaser every day across logic, math, and riddle categories. Includes hints, streak tracking, and achievement badges.
- **History / Archive** — Browse all past scans and solved puzzles.
- **Profile** — View your stats, streaks, and achievements.

## Tech Stack

- [Expo](https://expo.dev/) (React Native)
- [Expo Router](https://expo.github.io/router/) — file-based navigation
- TypeScript + JSX
- AsyncStorage for local persistence
- EAS Build for production builds

## Project Structure

```
_/apps/mobile/
├── src/
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── scanner.jsx       # QR scanner screen
│   │   │   ├── generate.jsx      # QR generator screen
│   │   │   ├── puzzle.jsx        # Daily puzzle screen
│   │   │   ├── history.jsx       # Scan & puzzle history
│   │   │   ├── profile.jsx       # User stats & settings
│   │   │   └── _layout.jsx       # Tab navigation layout
│   │   ├── index.jsx             # Entry redirect
│   │   ├── _layout.jsx           # Root layout
│   │   └── +not-found.tsx        # 404 screen
│   │
│   ├── components/
│   │   ├── AdBanner.jsx
│   │   └── KeyboardAvoidingAnimatedView.jsx
│   │
│   └── utils/
│       ├── auth/                 # Auth logic & hooks
│       ├── storage.js            # AsyncStorage helpers
│       ├── puzzleData.js         # Puzzle content
│       ├── puzzleStorage.js      # Puzzle state persistence
│       └── notifications.js     # Push notification helpers
│
├── assets/                       # Icons, images, fonts
├── app.json                      # Expo config
├── eas.json                      # EAS Build config
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- For Android: Android Studio + emulator or a physical device
- For iOS: Xcode (macOS only) or a physical device with Expo Go

### Installation

```bash
# Clone the repo
git clone https://github.com/Tapetal/QR-Scanner-Pro.git
cd QR-Scanner-Pro/_/apps/mobile

# Install dependencies
npm install

# Start the dev server
npx expo start
```

Then press `a` to open on Android or `i` for iOS.

### Environment Variables

Create a `.env` file in `_/apps/mobile/`:

```env
EXPO_PUBLIC_API_URL=your_value
```

> `.env` is gitignored and never committed.

## Building for Production

This project uses [EAS Build](https://docs.expo.dev/build/introduction/).

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to your Expo account
eas login

# Build for Android
eas build --platform android --profile preview

# Build for iOS
eas build --platform ios --profile preview
```

## Permissions

The app requires the following device permissions:

- **Camera** — for scanning QR codes
- **Notifications** — for daily puzzle reminders (optional)

## License

[MIT](./LICENSE)