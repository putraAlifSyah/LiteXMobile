# LiteX Mobile App

<div align="center">
  <img src="./assets/logo-LiteX.png" alt="LiteX Logo" width="300" />
</div>

<br />

LiteX Mobile is a modern news portal featuring a premium UI design, smooth interactions, and high performance. This application fetches data directly from the WordPress API (`litex.co.id`) in real-time.

## Key Features

- **Premium UI/UX:** Pixel-perfect design, modern card-style layout, with seamless interactions.
- **Dark Mode Support:** Supports light and dark modes configurable via Settings.
- **Real-Time News:** Direct integration with the WordPress REST API (`litex.co.id/wp-json/wp/v2`).
- **Categories & Search:** Filter by news category or search for specific articles.
- **Bookmarks (Saved):** Save favorite articles to read later.
- **Performance Optimization:** Highly efficient FlatList rendering with infinite scroll mechanisms and data-saving image loading.

## Technologies Used

This application is built using modern mobile frontend architecture:
- **[React Native](https://reactnative.dev/) & [Expo](https://expo.dev/)** - Mobile development framework.
- **[TanStack React Query](https://tanstack.com/query/latest)** - Data queue management (caching, fetching, and infinite scroll) from the server.
- **[Zustand](https://github.com/pmndrs/zustand)** - State management (for Dark Mode features & local Bookmark storage).
- **[React Navigation](https://reactnavigation.org/)** - Movement system (routing) between screens and Bottom Tab navigation.
- **[Axios](https://axios-http.com/)** - HTTP client for fetching the WordPress REST API.

## Getting Started (Local Installation)

Follow the steps below to run the LiteX Mobile source code on your computer for development purposes.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (LTS version recommended, v18 or v20+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/putraAlifSyah/LiteXMobile.git
   cd LiteXMobile
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Expo Development Server**
   ```bash
   npx expo start
   ```

4. **Open on Your Device**
   - **Android:** Download the **Expo Go** app from the Google Play Store, then scan the QR Code that appears in the terminal using the built-in Expo scanner.
   - **iOS:** Download the **Expo Go** app from the App Store, then scan the QR Code using your iPhone's Camera app.
   - Or press `a` in the terminal to open in the Android Emulator, and `i` for the iOS Simulator.

## Build Guide (Creating an APK)

This application has been configured to be easily built into an installable file using **EAS (Expo Application Services)**.

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Build the `.apk` file (Android) for direct testing:
   ```bash
   eas build -p android --profile preview
   ```
3. Build the `.aab` file (Android App Bundle) to upload to the Google Play Store:
   ```bash
   eas build -p android --profile production
   ```

Wait for the cloud process to finish, then download and install the application!

## License
Copyright 2026 LiteX. All rights reserved.
