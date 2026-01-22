# Emotion Tracker Frontend

React Native mobile app for postpartum emotional wellbeing tracking.

## Features

- ✅ Daily emotion tracking
- ✅ ML-based risk assessment
- ✅ Personalized recommendations
- ✅ Mood trend visualization
- ✅ Statistics and insights
- ✅ User profile management
- ✅ Secure authentication

## Quick Start

### Prerequisites

- Node.js 16+ 
- Expo CLI
- Android Studio (for Android) or Xcode (for iOS)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm start
```

3. **Run on device/simulator:**
```bash
# Android
npm run android

# iOS
npm run ios

# Web (for testing)
npm run web
```

## Configuration

### API URL

Update the API base URL in `src/api/api.js`:

```javascript
const API_BASE_URL = 'http://YOUR_BACKEND_URL:8000/api';
```

For local development, use:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

For production, replace with your backend URL.

## App Structure

```
src/
├── api/
│   └── api.js          # API client and endpoints
├── screens/
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── HomeScreen.js
│   ├── EmotionEntryScreen.js
│   ├── StatsScreen.js
│   ├── ProfileScreen.js
│   └── LoadingScreen.js
└── components/
    └── (reusable components)
```

## Screen Flow

1. **Authentication**
   - Login / Register screens
   - JWT token management

2. **Main App**
   - Home: Dashboard with daily status
   - EmotionEntry: Daily check-in form
   - Stats: Charts and analytics
   - Profile: User settings

## Key Features

### Emotion Tracking
- Mood selection (Happy, Sad, Angry, Anxious, Neutral)
- Anxiety level (1-5 scale)
- Sleep hours tracking
- Energy level (1-5 scale)
- Appetite rating (1-5 scale)
- Optional journal entries

### ML Integration
- Real-time risk assessment
- Personalized recommendations
- Contributing factors analysis

### Data Visualization
- Mood distribution pie charts
- Risk trend line charts
- Statistical summaries
- Progress insights

## Security

- JWT authentication
- Secure token storage (AsyncStorage)
- API request interceptors
- Automatic token refresh

## Dependencies

### Core
- React Native & Expo
- React Navigation
- React Native Paper (UI components)

### Charts
- React Native Chart Kit
- React Native SVG

### Data
- Axios (HTTP client)
- AsyncStorage (local storage)

## Development Tips

### Testing on Physical Device

1. Install Expo Go app on your phone
2. Scan QR code from terminal
3. Ensure device and computer are on same WiFi

### Debugging

- Use Expo Dev Tools
- React Native Debugger
- Console logs in terminal

### Performance

- Use React.memo for expensive components
- Optimize re-renders
- Lazy load heavy components

## Build for Production

### Android

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build
eas build --platform android
```

### iOS

```bash
# Build (requires Apple Developer account)
eas build --platform ios
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues:**
   ```bash
   npx expo start --clear
   ```

2. **Node modules conflicts:**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **API connection issues:**
   - Check backend is running
   - Verify API URL
   - Check network connectivity

### Platform-Specific

**Android:**
- Enable USB debugging
- Install Android SDK
- Set up emulator

**iOS:**
- Install Xcode
- Set up simulator
- Configure Apple Developer account

## Contributing

1. Follow React Native best practices
2. Use TypeScript for new components
3. Write tests for new features
4. Follow the existing code style

## Support

For app support:
- Email: support@emotiontracker.app
- Helpline: 1-800-PPD-MOMS
