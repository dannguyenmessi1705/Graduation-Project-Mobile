// app.config.js - Expo configuration file
module.exports = {
  name: "ZForum",
  slug: "zforum",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.zforum.app",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.zforum.app",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    // Environment variables
    EXPO_PUBLIC_GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
    EXPO_PUBLIC_API_GEMINI_URL: process.env.EXPO_PUBLIC_API_GEMINI_URL,
    EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
    EXPO_PUBLIC_USE_MOCK_API: process.env.EXPO_PUBLIC_USE_MOCK_API,
    // eas: {
    //   projectId: "your-project-id",
    // },
  },
  newArchEnabled: true,
};
