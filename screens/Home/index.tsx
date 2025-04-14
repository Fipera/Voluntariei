import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { House, User } from "lucide-react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { useRouter } from 'expo-router';

export default () => {
    const router = useRouter()
    return (
        <VStack className="flex-1 items-center justify-between px-4 py-12">
            <VStack className="items-center">
                <Image
                    size="lg2"
                    source={require("/assets/images/signin/logo-voluntariei.png")}
                    alt="Logo"
                />

                <Text size="3xl" className="font-NunitoBold text-center mt-10">
                    Bem-vindo(a){"\n"} ao Voluntari-ei!
                </Text>

                <Text
                    size="lg"
                    className="font-NunitoRegular text-center mt-10"
                >
                    Nosso propósito é aproximar quem quer {"\n"} fazer o bem de
                    quem mais precisa.
                </Text>

                <Text size="lg" className="font-NunitoBold text-center mt-10">
                    Como você quer fazer a diferença hoje?
                </Text>

                <HStack className="items-center justify-center mt-6 gap-4 w-full">
                    <Button
                        variant="outline"
                        className="flex-1 min-w-[140px] max-w-[200px] h-12 bg-button-bg rounded-[8px] shadow-shadow flex-row items-center justify-center  data-[active=true]:bg-primary-100"
                    >
                        <HStack className="items-center justify-center gap-2">
                            <ButtonIcon
                                as={House}
                                className="w-6 h-6 text-white"
                            />
                            <ButtonText className="text-white text-base">
                                Sou Instituição
                            </ButtonText>
                        </HStack>
                    </Button>

                    <Button
                        variant="outline"
                        className="flex-1 min-w-[140px] max-w-[200px] h-12 bg-transparent rounded-[8px] shadow-shadow flex-row items-center justify-center  data-[active=true]:bg-primary-100"
                    >
                        <ButtonIcon as={User} className="w-6 h-6 text-black" />
                        <ButtonText className="text-primary-600 text-base">
                            Sou Voluntário
                        </ButtonText>
                    </Button>
                </HStack>

                <Button variant="link" size="lg" className="mt-4" onPress={() => router.push("/signin")}>
                    <ButtonText className="text-black font-roboto text-md font-light">
                        Já tem uma conta? Faça login
                    </ButtonText>
                </Button>
            </VStack>

            <HStack className="items-center justify-center space-x-2">
            <MaterialIcons name="favorite" size={24} color="#2D543F" />
                <Text size="sm" className="font-NunitoItalic text-black">
                    Transforme empatia em ação. Faça parte.
                </Text>
            </HStack>

        </VStack>
    );
};
