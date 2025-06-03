import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Home, House, User } from "lucide-react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default () => {
    const router = useRouter();
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: "#f7f7f7" }}
            edges={["top", "left", "right", "bottom"]}
        >
            <VStack className="flex-1 items-center justify-between px-4 pb-6">
                <VStack className="flex-1 items-center justify-center max-h-[600px]">
                    <Image
                        size="xl"
                        source={require("/assets/images/signin/logo-voluntariei.png")}
                        alt="Logo"
                    />

                    <Text
                        size="2xl"
                        className="font-PoppinsBold text-blue-dark text-center mt-10"
                    >
                        Crie sua Conta
                    </Text>

                    <Button
                        onPress={() => router.push("/signupInstitutionFirstStage")}
                        variant="outline"
                        className=" min-w-[300px] max-w-[350px] h-[44px] bg-blue-dark rounded-[12px] shadow-shadow flex-row items-center justify-center mt-10"
                    >
                        <ButtonIcon as={Home} className="text-white" />
                        <Text className="text-white font-semibold">
                            Instituição
                        </Text>
                    </Button>
                    <Button
                        onPress={() => router.push("/signupInstitutionFirstStage")}
                        variant="outline"
                        className="border-blue-dark min-w-[300px] max-w-[350px] h-[44px] bg-white rounded-[12px] shadow-shadow flex-row items-center justify-center mt-4"
                    >
                        <ButtonIcon as={User} className="text-blue-dark" />
                        <Text className="text-blue-dark font-semibold">
                            Voluntário
                        </Text>
                    </Button>
                    <VStack className="items-center justify-center">
                        <Text className="font-PoppinsRegular text-grey-light text-center mt-12">
                          
                            Já possui uma conta?
                        </Text>
                        <Button
                            variant="link"
                            size="lg"
                            className=""
                            onPress={() => router.push("/signin")}
                        >
                            <ButtonText className="font-PoppinsBold text-blue-dark text-md font-light">
                                Faça Login
                            </ButtonText>
                        </Button>
                    </VStack>
                </VStack>

            </VStack>
        </SafeAreaView>
    );
};
