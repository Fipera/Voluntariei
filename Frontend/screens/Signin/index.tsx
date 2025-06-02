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
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
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
import * as SecureStore from "expo-secure-store";

export default () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SigninFormData>({
        resolver: zodResolver(signinSchema),
    });

    const handleLogin = async (data: SigninFormData) => {
        try {
            setIsLoading(true);
            const response = await api.post("/institution/login", data);
            const token = response.data.accessToken;

            const decoded = jwtDecode<{ type: "institution" | "voluntary" }>(
                token
            );
            const type = decoded?.type;

            // 🔐 Armazena o token e tipo com segurança
            await SecureStore.setItemAsync("token", token);
            await SecureStore.setItemAsync("type", type);

            // 🔀 Redireciona com base no tipo
            if (type === "institution") {
                router.push("/(institution)");
            } else if (type === "voluntary") {
                router.push("/(voluntary)");
            } else {
                setErrorMessage("Tipo de conta desconhecido.");
            }
            console.log(type);

            setIsLoading(false);
            router.push("/(tabs)");
        } catch (error) {
            setIsLoading(false);

            const isAppError = error instanceof AppError;
            const messageError = isAppError
                ? error.message
                : "Não foi possível fazer login. Tente novamente mais tarde.";

            setErrorMessage(messageError);
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
                    <VStack className="flex-1 items-center justify-between px-4 pb-8">
                        <VStack className="flex-1 items-center justify-center">
                            <Image
                                size="xl"
                                source={require("/assets/images/signin/logo-voluntariei.png")}
                                alt="Logo"
                            />

                            <Text
                                size="2xl"
                                className="font-PoppinsBold text-blue-dark text-center mt-6"
                            >
                                Acesse sua Conta
                            </Text>

                            <FormControl isInvalid={!!errors.email}>
                                <Text className="text-sm text-blue-dark font-PoppinsBold mt-6 ml-1">
                                    Email
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
                                            className="w-full max-w-[280px] h-12 bg-white border border-input-border shadow-shadow rounded-[12px] mt-2"
                                        >
                                            <HStack className="items-center justify-start ml-3">
                                                <InputField
                                                    keyboardType="email-address"
                                                    className=""
                                                    value={value}
                                                    onChangeText={(text) => {
                                                        onChange(text);
                                                        setErrorMessage("");
                                                    }}
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

                            <FormControl
                                isInvalid={!!errors.password}
                                className="mt-3"
                            >
                                <Text className="text-sm text-blue-dark font-PoppinsBold mt- ml-1">
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
                                            className="w-full max-w-[280px] h-12 bg-white border border-input-border shadow-shadow rounded-[12px] mt-2"
                                        >
                                            <HStack className="items-center justify-start ml-3">
                                                <InputField
                                                    secureTextEntry={
                                                        !showPassword
                                                    }
                                                    className=""
                                                    value={value}
                                                    onChangeText={(text) => {
                                                        onChange(text);
                                                        setErrorMessage("");
                                                    }}
                                                />
                                                <Button
                                                    variant="link"
                                                    action="default"
                                                    className="bg-transparent p-0 mr-2"
                                                    onPress={() =>
                                                        setShowPassword(
                                                            !showPassword
                                                        )
                                                    }
                                                >
                                                    <ButtonIcon
                                                        as={
                                                            showPassword
                                                                ? EyeOff
                                                                : Eye
                                                        }
                                                        className={`w-6 h-6 ${
                                                            showPassword
                                                                ? "text-blue-dark"
                                                                : "text-grey-dark"
                                                        }`}
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

                            <HStack className="w-full max-w-[280px] items-center">
                                <HStack className="flex-1 items-center justify-start">
                                    <Checkbox value="invison">
                                        <CheckboxIndicator className="w-[12px] h-[12px]">
                                            <CheckboxIcon
                                                as={CheckIcon}
                                                size="sm"
                                            />
                                        </CheckboxIndicator>
                                        <CheckboxLabel className="text-sm font-PoppinsRegular">
                                            Lembrar de mim
                                        </CheckboxLabel>
                                    </Checkbox>
                                </HStack>

                                <Button
                                    variant="link"
                                    action="default"
                                    className="ml-auto p-0"
                                >
                                    <ButtonText className="text-blue-dark text-sm font-PoppinsRegular">
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
                                className="min-w-[300px] max-w-[350px] h-[44px] bg-blue-dark rounded-[12px] shadow-shadow flex-row items-center justify-center mt-4"
                            >
                                {isLoading ? (
                                    <Spinner />
                                ) : (
                                    <Text className="text-white font-InterBold">
                                        Entrar
                                    </Text>
                                )}
                            </Button>
                        </VStack>

                        <VStack className="items-center mt-2">
                            <Text
                                size="sm"
                                className="text-grey-light font-PoppinsRegular"
                            >
                                Não possui uma conta?
                            </Text>

                            <Button
                                variant="link"
                                action="default"
                                className="p-2 m-0"
                                onPress={() => router.push("/home")}
                            >
                                <ButtonText
                                    size="sm"
                                    className="text-blue-dark font-PoppinsMedium"
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
