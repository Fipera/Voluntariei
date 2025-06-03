import { Button  } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";



import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/providers/AuthProvider";

export default () => {
    const router = useRouter();
    const { logout } = useAuth(); // 👈

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: "#f7f7f7" }}
            edges={["top", "left", "right", "bottom"]}
        >
            <VStack className="flex-1 items-center justify-between px-4 pb-8">
                <VStack className="flex-1 items-center justify-center max-h-[600px]">
                    <Text
                        size="4xl"
                        className="font-PoppinsBold text-blue-dark text-center mt-12"
                    >
                        LOGADO COMO INSTITUICAO
                    </Text>

                    <Button
                        onPress={logout}
                        className="min-w-[300px] max-w-[350px] h-[44px] bg-blue-dark rounded-[12px] shadow-shadow flex-row items-center justify-center mt-12"
                    >
                    </Button>
                </VStack>
            </VStack>
        </SafeAreaView>
    );
};
