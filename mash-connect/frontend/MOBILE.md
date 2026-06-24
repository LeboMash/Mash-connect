# Mash Connect Mobile App

Mash Connect is configured as a Capacitor mobile app for Android and iOS.

## App Identity

- App name: `Mash Connect`
- App ID: `com.thymashprojects.mashconnect`
- Owner: `Thy Mash Projects Pty Ltd`

## Commands

```bash
npm run mobile:build
```

Builds the Vite app and syncs it into the native mobile projects.

If the combined script has issues on Windows, run the same steps separately:

```bash
npm run build
npx cap sync
```

```bash
npm run mobile:android
```

Builds, syncs, and opens the Android project.

```bash
npm run mobile:ios
```

Builds, syncs, and opens the iOS project.

## Platform Notes

- Android can be opened and built with Android Studio.
- iOS requires macOS with Xcode for final build, signing, and App Store/TestFlight distribution.
- Mobile API calls should point to a deployed backend URL, not `127.0.0.1`, for real devices.
- Use `.env.mobile.example` as the template for a real-device backend URL.
