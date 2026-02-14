# Deployment Checklist

Use this checklist to ensure your app is ready for production and store submission.

## ✅ Pre-Development Setup

- [ ] Node.js installed (v18+)
- [ ] VS Code installed
- [ ] Android Studio installed (for Android)
- [ ] Xcode installed (for iOS, Mac only)
- [ ] EAS CLI installed (`npm install -g eas-cli`)
- [ ] Git installed

---

## ✅ AdMob Setup

- [ ] Created Google AdMob account
- [ ] Created app in AdMob console
- [ ] Created Banner Ad unit for iOS
- [ ] Created Banner Ad unit for Android
- [ ] Created Interstitial Ad unit for iOS
- [ ] Created Interstitial Ad unit for Android
- [ ] Copied iOS App ID
- [ ] Copied Android App ID
- [ ] Updated `app.json` with App IDs
- [ ] Updated `AdBanner.jsx` with Banner Ad IDs
- [ ] Updated `scanner.jsx` with Interstitial Ad IDs
- [ ] Tested ads in development mode (test ads showing)

---

## ✅ Code Updates

- [ ] Copied fixed `index.jsx` to project
- [ ] Copied fixed `_layout.jsx` to project
- [ ] Copied new `scanner.jsx` to project
- [ ] Copied new `storage.js` to project
- [ ] Updated app name in `app.json`
- [ ] Updated package name in `app.json`
- [ ] Updated package name in `android/app/build.gradle`
- [ ] Updated package name in `AndroidManifest.xml`
- [ ] Updated bundle identifier for iOS (if building iOS)
- [ ] Replaced app icon (`icon.png`, `adaptive-icon.png`)
- [ ] Replaced splash screen icon (`splash-icon.png`)

---

## ✅ Testing

- [ ] Ran `npm install` successfully
- [ ] Tested app on Android device/emulator
- [ ] Camera permission working
- [ ] QR scanner scanning codes correctly
- [ ] QR generator creating codes
- [ ] Puzzle screen showing daily puzzle
- [ ] Archive showing solved puzzles
- [ ] Profile showing stats correctly
- [ ] Banner ads visible (test ads)
- [ ] Interstitial ads showing after 3 scans (test ads)
- [ ] All tabs navigation working
- [ ] No console errors
- [ ] App doesn't crash

---

## ✅ Privacy & Legal

- [ ] Updated `PRIVACY_POLICY.md` with your details
- [ ] Privacy policy mentions AdMob data collection
- [ ] Privacy policy mentions WiFi credential handling
- [ ] Privacy policy mentions camera usage
- [ ] Added privacy policy URL to app (in Profile tab)
- [ ] Created support email address
- [ ] Updated support email in app

---

## ✅ Build Preparation

### Android
- [ ] Generated release keystore
- [ ] Saved keystore password securely
- [ ] Updated `build.gradle` with signing config
- [ ] Version code set in `app.json`
- [ ] Version name set in `app.json`

### iOS (if applicable)
- [ ] Apple Developer account active ($99/year)
- [ ] Bundle identifier registered in Apple Developer
- [ ] Provisioning profile created
- [ ] App icons in all required sizes

---

## ✅ Build & Test Production

### Android APK
- [ ] Built APK using `eas build --platform android --profile preview`
- [ ] Downloaded APK
- [ ] Installed APK on test device
- [ ] Real ads showing (not test ads)
- [ ] All features working in release build
- [ ] No crashes in release build

### iOS IPA (if applicable)
- [ ] Built IPA using `eas build --platform ios --profile preview`
- [ ] Downloaded IPA
- [ ] Tested on iOS device
- [ ] Real ads showing
- [ ] All features working

---

## ✅ Google Play Store Preparation

- [ ] Created Google Play Developer account ($25)
- [ ] Created app listing
- [ ] Added app title
- [ ] Added short description
- [ ] Added full description
- [ ] Added app icon (512x512)
- [ ] Added feature graphic (1024x500)
- [ ] Added screenshots (at least 2)
- [ ] Added privacy policy URL
- [ ] Set content rating
- [ ] Set app category
- [ ] Added contact email
- [ ] Created App Content questionnaire
- [ ] Uploaded signed APK/AAB
- [ ] Set pricing (Free/Paid)

---

## ✅ Apple App Store Preparation (if applicable)

- [ ] Created App Store Connect listing
- [ ] Added app name
- [ ] Added subtitle
- [ ] Added description
- [ ] Added keywords
- [ ] Added app icon (1024x1024)
- [ ] Added screenshots for all required device sizes
- [ ] Added privacy policy URL
- [ ] Set age rating
- [ ] Set app category
- [ ] Added contact information
- [ ] Uploaded IPA
- [ ] Completed App Privacy section
- [ ] Set pricing

---

## ✅ Post-Launch

- [ ] Monitor AdMob dashboard for ad performance
- [ ] Monitor crash reports
- [ ] Monitor user reviews
- [ ] Respond to user feedback
- [ ] Track download numbers
- [ ] Monitor revenue (if applicable)

---

## ⚠️ Common Issues & Solutions

### Ads not showing
- Wait 24-48 hours after creating ad units
- Verify AdMob account is approved
- Check ad unit IDs are correct
- Test on real device, not simulator

### Build fails
```bash
rm -rf node_modules
npm install
cd android && ./gradlew clean
```

### Camera not working
- Check camera permissions granted
- Test on real device
- Verify AndroidManifest.xml has camera permission

### App crashes on launch
- Check logs: `npx react-native log-android`
- Verify all dependencies installed
- Clear Metro cache: `npx expo start --clear`

---

## 📞 Support Resources

- **Expo Docs**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/
- **AdMob Help**: https://support.google.com/admob/
- **Google Play Console**: https://play.google.com/console/
- **App Store Connect**: https://appstoreconnect.apple.com/

---

## 🎯 Success Criteria

Before submitting to stores, ensure:
- ✅ App builds successfully
- ✅ All features work as expected
- ✅ Ads display correctly
- ✅ No crashes or major bugs
- ✅ Privacy policy accessible
- ✅ All store assets ready (icons, screenshots, descriptions)
- ✅ Test version shared with beta testers (optional but recommended)

---

**Last Updated**: [Current Date]
**App Version**: 1.0.0
**Build Number**: 1