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
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
        "Inter-Bold": require("../assets/fonts/Inter_18pt-Bold.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Italic": require("../assets/fonts/Poppins-Italic.ttf"),
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
