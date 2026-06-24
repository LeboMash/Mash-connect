# Mash Connect Mobile Release

This project is already configured as a Capacitor app for Android and iOS.

## Release Identity

- App name: Mash Connect
- Package / bundle ID: `com.thymashprojects.mashconnect`
- Android version: `1.0` (`versionCode` 1)
- iOS version: `1.0` (`CURRENT_PROJECT_VERSION` 1)

## Before Store Submission

1. Deploy the backend to a public HTTPS URL.
2. Create `frontend/.env.production` from `frontend/.env.production.example`.
3. Set `VITE_API_BASE_URL` to the deployed API URL, for example `https://api.yourdomain.com/api`.
4. Set `VITE_GOOGLE_CLIENT_ID` to the production OAuth client ID.
5. Confirm the hosted backend uses production secrets, a production database, durable upload storage, and a restricted `FRONTEND_URL`.
6. Prepare store assets: app icon, phone screenshots, support email, privacy policy URL, terms URL, short description, full description, and category.

## Android: Google Play

Google Play publishes Android App Bundles (`.aab`) for new apps. Mash Connect targets Android API 36, which is above the current new-app requirement.

1. Install Android Studio and the Android SDK.
2. Add `frontend/android/local.properties` with your SDK path:

   ```properties
   sdk.dir=C:\\Users\\YOUR_USER\\AppData\\Local\\Android\\Sdk
   ```

3. Generate an upload key:

   ```powershell
   keytool -genkeypair -v -keystore frontend/android/release/mash-connect-upload-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mash-connect
   ```

4. Copy `frontend/android/keystore.properties.example` to `frontend/android/keystore.properties` and enter the real passwords.
5. Build and sync the Capacitor app:

   ```powershell
   cd frontend
   npm.cmd run build
   npx.cmd cap sync android
   ```

6. Build the release bundle:

   ```powershell
   cd android
   .\gradlew.bat :app:bundleRelease
   ```

7. Upload `frontend/android/app/build/outputs/bundle/release/app-release.aab` to Play Console.
8. Start with Internal testing, then Closed testing, then Production.

## iOS: App Store

iOS release, signing, archive, TestFlight, and App Store upload must be done on macOS with Xcode and an Apple Developer Program account.

1. On a Mac, install Xcode.
2. Install dependencies and sync:

   ```bash
   cd frontend
   npm ci
   npm run build
   npx cap sync ios
   ```

3. Open `frontend/ios/App/App.xcodeproj`.
4. In Xcode, select the App target and set the Apple Team for automatic signing.
5. Confirm bundle ID `com.thymashprojects.mashconnect`.
6. Select Any iOS Device, then Product > Archive.
7. Upload the archive to App Store Connect.
8. Release through TestFlight first, then submit the App Store review.

## Current Local Limitation

This Windows machine can build/sync the Capacitor project, but it cannot archive iOS apps. Android release builds also require a configured local Android SDK path.
