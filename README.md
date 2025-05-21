# OpenHands Mobile App

OpenHands is a platform that allows users to interact with AI agents to perform various tasks. This mobile application brings the power of OpenHands to your Android and iOS devices, enabling you to manage workspaces, chat with AI agents, browse files, and access a terminal, all optimized for a mobile experience. The primary goal is to provide a seamless interface for users to connect to an OpenHands server and utilize its features on the go.

## Features

*   **Server Connection**: Easily connect to your OpenHands server instance.
*   **Workspace Management**: List, search, select, and create new workspaces.
*   **Chat Functionality**: Engage in conversations with AI agents, send messages, and receive responses.
*   **File Browsing**:
    *   Navigate directory structures with a tree view.
    *   View file contents with syntax highlighting.
    *   User-friendly navigation with pinch-zoom and swipe gestures.
*   **Terminal Access**:
    *   Execute commands in a mobile-optimized terminal.
    *   Features a mobile-friendly keyboard layout and quick access buttons for common commands.
    *   Supports gesture-based operations and both portrait and landscape orientations.

## Tech Stack

*   **Framework**: React Native + Expo
*   **State Management**: Redux Toolkit
*   **API Communication**: Axios
*   **UI/UX Library**: React Native Paper
*   **Navigation**: React Navigation

## Getting Started (Development)

### Prerequisites

*   Node.js (v18 or higher)
*   npm (v8 or higher)
*   Expo CLI
*   Git

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/openhands-mobile.git # Replace with the actual repository URL
    cd openhands-mobile
    ```

2.  **Install dependencies:**
    ```bash
    npm install --legacy-peer-deps
    ```

3.  **Start the development server:**
    ```bash
    npx expo start
    ```
    This will provide options to open the app in:
    *   A development build on your device/emulator
    *   An Android emulator
    *   An iOS simulator
    *   The Expo Go app (for a limited sandbox experience)

## Project Structure

The project follows a standard React Native (Expo) structure:

```
openhands-mobile/
├── src/
│   ├── api/              # API communication logic (Axios configuration, endpoints)
│   ├── components/       # Reusable UI components
│   ├── navigation/       # Navigation setup (React Navigation)
│   ├── screens/          # Screen components (features like Chat, Workspace, etc.)
│   ├── store/            # Redux Toolkit store (slices, actions, reducers)
│   ├── theme/            # Application theme settings (React Native Paper)
│   ├── utils/            # Utility functions and helpers
│   └── App.tsx           # Root application component
├── assets/               # Static assets like images and fonts
└── ...                   # Other configuration files (babel.config.js, app.json, etc.)
```

## Deployment

Build your app for production using Expo Application Services (EAS).

1.  **Configure your project for EAS Build (if not already done):**
    ```bash
    eas build:configure
    ```

2.  **Build for Android:**
    ```bash
    eas build -p android
    ```

3.  **Build for iOS:**
    ```bash
    eas build -p ios
    ```

### App Store Submission

Once the builds are complete, you can submit them to the respective app stores:

1.  **Submit to Google Play Store:**
    ```bash
    eas submit -p android
    ```

2.  **Submit to Apple App Store:**
    ```bash
    eas submit -p ios
    ```
    (Ensure you have an Apple Developer Program membership and have set up your app on App Store Connect.)

## Customization

### Server URL

To change the default OpenHands server URL, edit the `DEFAULT_SERVER_URL` constant in `src/api/config.ts`.

### Theme

Customize the application's theme (colors, fonts, etc.) by modifying the theme object in `src/theme/theme.ts`.

### App Icon and Splash Screen

1.  Replace `assets/icon.png` with your desired app icon.
2.  Replace `assets/splash.png` with your desired splash screen image.
3.  After replacing the files, run the prebuild command to apply changes:
    ```bash
    npx expo prebuild
    ```

## Learn More / Resources

*   **Project Documentation**: For more detailed information on architecture, deployment, and validation, see the files in the `/docs` directory of this repository.
*   **Expo Documentation**: [https://docs.expo.dev/](https://docs.expo.dev/)
*   **React Native Documentation**: [https://reactnative.dev/docs/](https://reactnative.dev/docs/)

## Community

*   **Expo on GitHub**: [https://github.com/expo/expo](https://github.com/expo/expo)
*   **Discord community**: [https://chat.expo.dev](https://chat.expo.dev)
