import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
    Checkbox,
    CheckboxIcon,
    CheckboxIndicator,
    CheckboxLabel,
} from "@/components/ui/checkbox";
import { HStack } from "@/components/ui/hstack";
import { CheckIcon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Input, InputField, InputIcon } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from "expo-router";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Dimensions } from "react-native";
import api from "@/services/api";
import { AppError } from "@/utils/AppError";
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
} from "@/components/ui/form-control";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, SigninFormData } from "@/utils/schemas/signinSchema";
import { Spinner } from "@/components/ui/spinner";
import { SafeAreaView } from "react-native-safe-area-context";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/providers/AuthProvider"; 

export default () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { width: SCREEN_WIDTH } = Dimensions.get("window");
    const H_PADDING = 24; // screen horizontal padding
    const MAX_CONTENT_WIDTH = 310; // as per design
    const contentWidth = Math.min(MAX_CONTENT_WIDTH, SCREEN_WIDTH - H_PADDING * 2);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SigninFormData>({
        resolver: zodResolver(signinSchema),
    });

    const { login } = useAuth();

    const handleLogin = async (data: SigninFormData) => {
        try {
            setIsLoading(true);
            setErrorMessage("");

            const response = await api.post("/institution/login", data);
            const token = response.data.accessToken;

            const decoded = jwtDecode<{ type: "institution" | "voluntary" }>(
                token
            );
            const type = decoded?.type;

            if (type === "institution" || type === "voluntary") {
                await login(token, type);
            } else {
                throw new Error("Tipo de conta desconhecido.");
            }

            console.log("Tipo de usuário:", type);
        } catch (error) {
            const isAppError = error instanceof AppError;
            const messageError = isAppError
                ? error.message
                : "Não foi possível fazer login. Tente novamente mais tarde.";
            setErrorMessage(messageError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: "#f7f7f7" }}
            edges={["top", "left", "right", "bottom"]}
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <VStack
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingHorizontal: 16,
                            paddingBottom: 32,
                        }}
                    >
                        <VStack style={{ flex: 1, alignItems: "center", justifyContent: "center", width: "100%" }}>
                            <Image
                                size="xl"
                                source={require("/assets/images/signin/logo-voluntariei.png")}
                                alt="Logo"
                                style={{ width: 162, height: 160, marginTop: 24, marginBottom: 16 }}
                            />

                            <Text
                                size="lg"
                                style={{
                                    width: Math.min(310, SCREEN_WIDTH - 32),
                                    height: 38,
                                    fontFamily: "Nunito-Bold",
                                    fontSize: 28,
                                    lineHeight: 38,
                                    textAlign: "center",
                                    color: "#173663",
                                    marginTop: 8,
                                }}
                            >
                                Acesse sua Conta
                            </Text>

                            <FormControl isInvalid={!!errors.email}>
                                <Text
                                    style={{
                                        marginTop: 16,
                                        marginLeft: 4,
                                        fontFamily: "Nunito-Bold",
                                        fontSize: 16,
                                        lineHeight: 22,
                                        color: "#173663",
                                    }}
                                >
                                    E-mail
                                </Text>

                                <Controller
                                    control={control}
                                    name="email"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <Input
                                            variant="rounded"
                                            size="sm"
                                            style={{
                                                width: contentWidth,
                                                height: 43,
                                                backgroundColor: "#FDFDFD",
                                                borderColor: "#B7B7B7",
                                                borderWidth: 1,
                                                borderRadius: 8,
                                                marginTop: 8,
                                                // shadow iOS
                                                shadowColor: "#000",
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 2,
                                                // elevation Android
                                                elevation: 2,
                                            }}
                                        >
                                            <HStack style={{ alignItems: "center", justifyContent: "flex-start", marginLeft: 12, width: "100%" }}>
                                                <InputField
                                                    keyboardType="email-address"
                                                    value={value}
                                                    onChangeText={(text) => {
                                                        onChange(text);
                                                        setErrorMessage("");
                                                    }}
                                                    style={{ width: "100%" }}
                                                />
                                            </HStack>
                                        </Input>
                                    )}
                                />
                                {errors.email && (
                                    <FormControlError>
                                        <FormControlErrorIcon
                                            as={AlertCircle}
                                        />
                                        <FormControlErrorText>
                                            {errors.email.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!errors.password} style={{ marginTop: 12 }}>
                                <Text
                                    style={{
                                        marginLeft: 4,
                                        fontFamily: "Nunito-Bold",
                                        fontSize: 16,
                                        lineHeight: 22,
                                        color: "#173663",
                                    }}
                                >
                                    Senha
                                </Text>
                                <Controller
                                    control={control}
                                    name="password"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <Input
                                            variant="rounded"
                                            size="sm"
                                            style={{
                                                width: contentWidth,
                                                height: 43,
                                                backgroundColor: "#FDFDFD",
                                                borderColor: "#B7B7B7",
                                                borderWidth: 1,
                                                borderRadius: 8,
                                                marginTop: 8,
                                                shadowColor: "#000",
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 2,
                                                elevation: 2,
                                            }}
                                        >
                                            <HStack style={{ alignItems: "center", justifyContent: "flex-start", marginLeft: 12, marginRight: 8, width: "100%" }}>
                                                <InputField
                                                    secureTextEntry={!showPassword}
                                                    value={value}
                                                    onChangeText={(text) => {
                                                        onChange(text);
                                                        setErrorMessage("");
                                                    }}
                                                    style={{ flex: 1 }}
                                                />
                                                <Button
                                                    variant="link"
                                                    action="default"
                                                    onPress={() => setShowPassword(!showPassword)}
                                                    style={{ backgroundColor: "transparent", padding: 0, marginRight: 0 }}
                                                >
                                                    <ButtonIcon
                                                        as={showPassword ? EyeOff : Eye}
                                                        color={showPassword ? "#173663" : "#6B7280"}
                                                        width={24}
                                                        height={24}
                                                    />
                                                </Button>
                                            </HStack>
                                        </Input>
                                    )}
                                />
                                {errors.password && (
                                    <FormControlError>
                                        <FormControlErrorIcon
                                            as={AlertCircle}
                                        />
                                        <FormControlErrorText>
                                            {errors.password.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <HStack style={{ width: contentWidth, alignItems: "center", marginTop: 8 }}>
                                <HStack style={{ flex: 1, alignItems: "center", justifyContent: "flex-start" }}>
                                    <Checkbox value="invison">
                                        <CheckboxIndicator style={{ width: 12, height: 12 }}>
                                            <CheckboxIcon
                                                as={CheckIcon}
                                                size="sm"
                                            />
                                        </CheckboxIndicator>
                                        <CheckboxLabel style={{ fontSize: 14, fontFamily: "Nunito" }}>
                                            Lembrar de mim
                                        </CheckboxLabel>
                                    </Checkbox>
                                </HStack>

                                <Button
                                    variant="link"
                                    action="default"
                                    style={{ marginLeft: "auto", padding: 0 }}
                                >
                                    <ButtonText style={{ color: "#173663", fontSize: 14, fontFamily: "Nunito" }}>
                                        Esqueci minha senha
                                    </ButtonText>
                                </Button>
                            </HStack>

                            {errorMessage !== "" && (
                                <Text style={{ color: "red", marginBottom: 8 }}>
                                    {errorMessage}
                                </Text>
                            )}

                            <Button
                                onPress={handleSubmit(handleLogin)}
                                disabled={isLoading}
                                style={{
                                    width: contentWidth,
                                    height: 45,
                                    backgroundColor: "#173663",
                                    borderRadius: 12,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: 20,
                                }}
                            >
                                {isLoading ? (
                                    <Spinner />
                                ) : (
                                    <Text style={{ color: "#FFFFFF", fontFamily: "Nunito-Bold", fontSize: 18, lineHeight: 25 }}>
                                        Entrar
                                    </Text>
                                )}
                            </Button>
                        </VStack>

                        <VStack style={{ alignItems: "center", marginTop: 8 }}>
                            <Text
                                size="sm"
                                style={{ color: "#B7B7B7", fontFamily: "Nunito", fontWeight: "500", fontSize: 14, lineHeight: 19 }}
                            >
                                Não possui uma conta?
                            </Text>

                            <Button
                                variant="link"
                                action="default"
                                style={{ padding: 8, margin: 0 }}
                                onPress={() => router.push("/home")}
                            >
                                <ButtonText
                                    size="sm"
                                    style={{ color: "#173663", fontFamily: "Nunito-Bold", fontSize: 16, lineHeight: 22, textDecorationLine: "underline", textAlign: "center" }}
                                >
                                    Cadastre-se
                                </ButtonText>
                            </Button>
                        </VStack>
                    </VStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
