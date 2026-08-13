import 'dotenv/config';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const isEasBuild = process.env.EAS_BUILD === 'true';
const buildProfile = process.env.EAS_BUILD_PROFILE;
const isInstallableAndroidBuild =
  isEasBuild && ['preview', 'production'].includes(buildProfile);

if (
  isInstallableAndroidBuild &&
  (!apiUrl || /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(apiUrl))
) {
  throw new Error(
    'EXPO_PUBLIC_API_URL must be a reachable API URL for Android APK builds.',
  );
}

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
      usesCleartextTraffic: apiUrl?.startsWith('http://') ?? false,
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
      API_URL: apiUrl,
    },
  },
};
