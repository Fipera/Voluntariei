import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { AuthProvider } from "@/providers/AuthProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreenCustom from "@/screens/SplashScreenCustom";
import { useAuth } from "@/providers/AuthProvider";
import { Redirect } from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AppRoutes() {
    const { isLoading, type } = useAuth();

    if (isLoading) {
        return <SplashScreenCustom />;
    }

    return (
        <Stack
            initialRouteName={
                type === "institution"
                    ? "(institution)"
                    : type === "voluntary"
                    ? "(voluntary)"
                    : "(auth)"
            }
        >
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen
                name="(institution)"
                options={{ headerShown: false }}
            />
            <Stack.Screen name="(voluntary)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
        </Stack>
    );
}

export default function RootLayout() {
    const [loaded] = useFonts({
        "Nunito-Regular": require("../assets/fonts/Nunito-Regular.ttf"),
        "Nunito-Italic": require("../assets/fonts/Nunito-Italic.ttf"),

        "Nunito-Light": require("../assets/fonts/Nunito-Light.ttf"),
        "Nunito-LightItalic": require("../assets/fonts/Nunito-LightItalic.ttf"),
        "Nunito-ExtraLight": require("../assets/fonts/Nunito-ExtraLight.ttf"),
        "Nunito-ExtraLightItalic": require("../assets/fonts/Nunito-ExtraLightItalic.ttf"),

        "Nunito-Medium": require("../assets/fonts/Nunito-Medium.ttf"),
        "Nunito-MediumItalic": require("../assets/fonts/Nunito-MediumItalic.ttf"),

        "Nunito-SemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
        "Nunito-SemiBoldItalic": require("../assets/fonts/Nunito-SemiBoldItalic.ttf"),

        "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
        "Nunito-BoldItalic": require("../assets/fonts/Nunito-BoldItalic.ttf"),

        "Nunito-ExtraBold": require("../assets/fonts/Nunito-ExtraBold.ttf"),
        "Nunito-ExtraBoldItalic": require("../assets/fonts/Nunito-ExtraBoldItalic.ttf"),

        "Nunito-Black": require("../assets/fonts/Nunito-Black.ttf"),
        "Nunito-BlackItalic": require("../assets/fonts/Nunito-BlackItalic.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return <SplashScreenCustom />;
    }

    return (
        <SafeAreaProvider>
            <GluestackUIProvider mode="light">
                <AuthProvider>
                    <StatusBar style="dark" />
                    <AppRoutes />
                </AuthProvider>
            </GluestackUIProvider>
        </SafeAreaProvider>
    );
}
