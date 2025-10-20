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
      useNextNotificationsApi: true,
      googleServicesFile: "./google-services.json"
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
          image: "./assets/images/signin/logo-voluntariei.png",
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
          sounds: [],
          mode: "production"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      eas: {
        projectId: "7eb71a26-8b6f-472c-bbc5-93ccafbe7e63"
      }
    }
  }
};
