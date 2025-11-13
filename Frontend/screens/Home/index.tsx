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
import { Dimensions } from "react-native";

export default () => {
    const router = useRouter();
    const { width: SCREEN_WIDTH } = Dimensions.get("window");
    const BUTTON_HORIZONTAL_MARGIN = 58; 
    const MAX_BUTTON_WIDTH = 317;
    const buttonWidth = Math.min(MAX_BUTTON_WIDTH, SCREEN_WIDTH - BUTTON_HORIZONTAL_MARGIN);
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: "#f7f7f7" }}
            edges={["top", "left", "right", "bottom"]}
        >
            <VStack
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 16, 
                    paddingBottom: 24, 
                }}
            >
                <VStack
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        maxHeight: 600,
                    }}
                >
                        <Image
                            size="xl"
                            source={require("/assets/images/signin/logo-voluntariei.png")}
                            alt="Logo"
                            style={{
                                width: 160,
                                height: 160,
                                marginTop: 60, 
                                marginBottom: 30,
                            }}
                        />

                        <Text
                            size="3xl"
                            style={{
                                fontFamily: "Nunito-Bold",
                                textAlign: "center",
                                color: "#173663",
                                fontSize: 28,
                                lineHeight: 38,
                                width: 190,
                                height: 38,
                                alignSelf: "center",
                                marginBottom: 20,
                            }}
                        >
                            Crie sua Conta
                        </Text>

                    <Button
                        onPress={() => router.push("/signupInstitutionFirstStage")}
                        variant="outline"
                        style={{
                            
                            width: buttonWidth,
                            height: 45,
                            backgroundColor: "#173663",
                            borderRadius: 12,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                            marginTop: 10,
                        }}
                    >
                        <Home color="#FFFFFF" size={20} style={{ marginRight: 8 }} />
                        <Text
                            style={{
                                fontFamily: "Nunito-Bold",
                                fontSize: 18,
                                lineHeight: 25,
                                color: "#FFFFFF",
                            }}
                        >
                            Instituição
                        </Text>
                    </Button>
                    <Button
                        onPress={() => router.push("/signupVoluntaryFirstStage")}
                        variant="outline"
                        style={{
                            
                            width: buttonWidth,
                            height: 45,
                            backgroundColor: "#FFFFFF",
                            borderColor: "#173663",
                            borderWidth: 1,
                            borderRadius: 12,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                            marginTop: 16,
                        }}
                    >
                        <User color="#173663" size={24} style={{ marginRight: 8 }} />
                        <Text
                            style={{
                                fontFamily: "Nunito-Bold",
                                fontSize: 18,
                                lineHeight: 25,
                                color: "#173663",
                            }}
                        >
                            Voluntário
                        </Text>
                    </Button>
                    <VStack style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text
                            style={{
                                marginTop: 48,
                                fontFamily: "Nunito",
                                fontWeight: "400",
                                fontSize: 14,
                                lineHeight: 19,
                                color: "#B7B7B7",
                                textAlign: "center",
                            }}
                        >
                            Já possui uma conta?
                        </Text>
                        <Button
                            variant="link"
                            size="lg"
                            onPress={() => router.push("/signin")}
                        >
                            <ButtonText
                                style={{
                                    fontFamily: "Nunito-Bold",
                                    fontSize: 16,
                                    lineHeight: 22,
                                    color: "#173663",
                                    textAlign: "center",
                                    textDecorationLine: "underline",
                                }}
                            >
                                Faça Login
                            </ButtonText>
                        </Button>
                    </VStack>
                </VStack>

            </VStack>
        </SafeAreaView>
    );
};
