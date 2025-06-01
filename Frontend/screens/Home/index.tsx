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
            style={{ flex: 1, backgroundColor: "#f7f7f7"}}
            edges={["top", "left", "right", "bottom"]}
        >
            <VStack className="flex-1 items-center justify-between px-4 pb-6">
                <VStack className="flex-1 items-center justify-center max-h-[600px]">
                    <Image
                        size="lg2"
                        source={require("/assets/images/signin/logo-voluntariei.png")}
                        alt="Logo"
                    />

                    <Text
                        size="2xl"
                        className="font-NunitoBold text-black text-center mt-10"
                    >
                        Como você quer {"\n"}
                        transformar o {"\n"}
                        mundo hoje?
                    </Text>

                    <Text
                        size="md"
                        className="font-RobotoREgular text-black text-center mt-4"
                    >
                        Escolha seu papel e comece {"\n"}a fazer a diferença.
                    </Text>

                    <Button className=" min-w-[300px] max-w-[350px] h-[44px] bg-blue-light rounded-[12px] shadow-shadow flex-row items-center justify-center mt-8">
                        <ButtonIcon as={User} />
                        <Text className="text-white font-semibold">
                            Sou voluntário
                        </Text>
                    </Button>
                    <Button
                        onPress={() => router.push("/signupInstitution")}
                        variant="outline"
                        className="border-blue-light min-w-[300px] max-w-[350px] h-[44px] bg-white rounded-[12px] shadow-shadow flex-row items-center justify-center mt-4"
                    >
                        <ButtonIcon as={Home} className="text-blue-light" />
                        <Text className="text-blue-light font-semibold">
                            Sou instituição
                        </Text>
                    </Button>
                    <HStack className="items-center justify-center">
                        <Text> Já tem uma conta? </Text>
                        <Button
                            variant="link"
                            size="lg"
                            className=""
                            onPress={() => router.push("/signin")}
                        >
                            <ButtonText className="text-blue-light font-roboto text-md font-light">
                                Faça login
                            </ButtonText>
                        </Button>
                    </HStack>
                </VStack>

                <VStack className="w-full items-center justify-center">
                    <Image
                        className="w-full max-w-[280px] h-auto"
                        source={require("/assets/images/signin/horizontal-logo-voluntariei.png")}
                        alt="Logo"
                        resizeMode="contain"
                    />
                </VStack>
            </VStack>
        </SafeAreaView>
    );
};
