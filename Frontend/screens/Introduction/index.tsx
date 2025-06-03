import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ArrowRightIcon, Home, House, User } from "lucide-react-native";
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
            <VStack className="flex-1 items-center justify-between px-4 pb-8">
                <VStack className="flex-1 items-center justify-center max-h-[600px]">
                    <Image
                        size="3xl"
                        source={require("/assets/images/signin/Img-Voluntario.png")}
                        alt="Logo"
                    />

                    <Text
                        size="4xl"
                        className="font-PoppinsBold text-blue-dark text-center mt-12"
                    >
                        Faça a Diferença
                    </Text>

                    <Text
                        size="xl"
                        className="font-PoppinsRegular text-grey-light text-center mt-6"
                    >
                        Participe como voluntário ou {"\n"}
                        conecte sua instituição com {"\n"}
                        quem precisa.
                    </Text>
                     </VStack>

                    <Button
                        className="w-[62px] h-[62px] bg-blue-dark rounded-full p-[10px] justify-center items-center"
                        variant="solid"
                        size="lg"
                        onPress={() => router.push("/home")}
                    >
                        <ButtonIcon
                            as={ArrowRightIcon}
                            height={42}
                            width={42}
                            className="text-white"
                        />
                    </Button>
               
            </VStack>
        </SafeAreaView>
    );
};
