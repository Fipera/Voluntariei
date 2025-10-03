import { Tabs, useRouter } from "expo-router";
import { House, Plus, User } from 'lucide-react-native';
import { useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const BASE_HEIGHT = 60;
  const extraBottom = useMemo(() => {
    if (insets.bottom >= 16) return insets.bottom;
    return insets.bottom + 16;
  }, [insets.bottom]);

  useEffect(() => {
    const checkAccess = async () => {
      const type = await SecureStore.getItemAsync("type");

      if (type !== "institution") {
        router.replace("/(auth)/signin");
      } else {
        setIsAuthorized(true);
      }

      setLoading(false);
    };

    checkAccess();
  }, []);

  if (loading) {
    return (
      <VStack style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </VStack>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          backgroundColor: '#0F3765',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
          height: BASE_HEIGHT + extraBottom,
          paddingTop: 8,
          paddingBottom: extraBottom - 4,
        },
        tabBarItemStyle: { paddingBottom: 0 },
        tabBarLabelStyle: { fontSize: 12, fontFamily: 'Nunito-SemiBold', marginBottom: 4 },
      }}
    >
      {/* Index is the Hub */}
      <Tabs.Screen name="index" options={{ title: 'Hub', tabBarIcon: ({color}) => <House size={22} color={color} /> }} />
      <Tabs.Screen name="create-opportunity" options={{ title: 'Criar Vaga', tabBarIcon: ({color}) => <Plus size={24} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: ({color}) => <User size={22} color={color} /> }} />
    </Tabs>
  );
};
