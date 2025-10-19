export default {
  expo: {
    name: "Voluntariei",
    slug: "Voluntariei",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.voluntariei.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      permissions: [
        "android.permission.RECORD_AUDIO"
      ],
      package: "com.voluntariei.app",
      useNextNotificationsApi: true
    },
    notification: {
      icon: "./assets/images/notification-icon.png",
      color: "#173663"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "The app accesses your photos to let you share them with your friends."
        }
      ],
      "expo-font",
      "expo-web-browser",
      "expo-secure-store",
      [
        "expo-notifications",
        {
          icon: "./assets/images/notification-icon.png",
          color: "#173663",
          sounds: []
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      eas: {
        projectId: process.env.EAS_PROJECT_ID || "your-project-id-here"
      }
    }
  }
};
