import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

type UserType = "institution" | "voluntary" | null;

interface AuthContextProps {
    type: UserType;
    token: string | null;
    isLoading: boolean;
    login: (token: string, type: UserType) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
    type: null,
    token: null,
    isLoading: true,
    login: async () => {},
    logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [type, setType] = useState<UserType>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const storedToken = await SecureStore.getItemAsync("token");
            const storedType = await SecureStore.getItemAsync("type");

            if (storedToken && (storedType === "institution" || storedType === "voluntary")) {
                setToken(storedToken);
                setType(storedType as UserType);
            }

            setIsLoading(false);
        };

        loadUser();
    }, []);

    const login = async (token: string, userType: UserType) => {
        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("type", userType || "");

        setToken(token);
        setType(userType);

        router.replace(`/${userType === "institution" ? "(institution)" : "(voluntary)"}`);
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("type");

        setToken(null);
        setType(null);

        router.replace("/(auth)/home");
    };

    return (
        <AuthContext.Provider value={{ token, type, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
