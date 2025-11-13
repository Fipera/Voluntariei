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
import { Dimensions, View } from "react-native";

export default () => {
    const router = useRouter();
    const { width: SCREEN_WIDTH } = Dimensions.get("window");
    
    const HORIZONTAL_PADDING = 16; 
    const maxImgWidth = 374;
    const desiredImgWidth = Math.min(maxImgWidth, SCREEN_WIDTH - HORIZONTAL_PADDING * 2);
    const imgAspect = 389.29 / 374; 
    const desiredImgHeight = desiredImgWidth * imgAspect;
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
                    paddingHorizontal: HORIZONTAL_PADDING,
                    paddingBottom: 32, 
                }}
            >
                <VStack
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        maxHeight: 600,
                        width: "100%",
                    }}
                >
                    <Image
                        size="3xl"
                        source={require("/assets/images/signin/Img-Voluntario.png")}
                        alt="img-onboarding"
                        style={{
                            width: desiredImgWidth,
                            height: desiredImgHeight,
                            alignSelf: "stretch",
                        }}
                    />

                    <Text
                        size="4xl"
                        style={{
                            marginTop: 24,
                            width: "100%",
                            maxWidth: 374,
                            height: 38,
                            fontFamily: "Nunito-Bold",
                            fontSize: 28,
                            lineHeight: 38,
                            textAlign: "center",
                            color: "#173663",
                            alignSelf: "stretch",
                        }}
                    >
                        Faça a Diferença
                    </Text>

                    <Text
                        size="xl"
                        style={{
                            marginTop: 16,
                            width: "100%",
                            maxWidth: 374,
                            height: 44,
                            fontFamily: "Nunito-SemiBold",
                            fontSize: 16,
                            lineHeight: 22,
                            color: "#080808",
                            textAlign: "center",
                            alignSelf: "stretch",
                        }}
                    >
                        Participe como voluntário ou conecte sua instituição com quem precisa.
                    </Text>
                </VStack>

                <Button
                    variant="solid"
                    size="lg"
                    style={{
                        width: 64,
                        height: 64,
                        backgroundColor: "#173663",
                        borderRadius: 16,
                        padding: 0,
                        justifyContent: "center",
                        alignItems: "center",
                        
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.15,
                        shadowRadius: 8,
                        
                        elevation: 6,
                    }}
                    onPress={() => router.push("/home")}
                >
                    <View style={{ padding: 16 }}>
                        <ButtonIcon as={ArrowRightIcon} color="#FFFFFF" width={24} height={24} />
                    </View>
                </Button>

            </VStack>
        </SafeAreaView>
    );
};
