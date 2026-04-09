import 'dotenv/config';

export default {
  expo: {
    name: 'matcha-app',
    slug: 'matcha-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './src/assets/icons/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    scheme: 'matcha',
    splash: {
      image: './src/assets/icons/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      package: 'com.matchagpe.app',
      adaptiveIcon: {
        foregroundImage: './src/assets/icons/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: './src/assets/icons/favicon.png',
      bundler: 'metro',
    },
    extra: {
      eas: {
        projectId: '8b62f242-c858-4afa-b38b-208fa92060e8',
      },
      API_URL: process.env.EXPO_PUBLIC_API_URL,
    },
  },
};
