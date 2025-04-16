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
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    AlertCircle,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView } from "react-native";
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

            
            setIsLoading(false);
            router.push("/(tabs)")
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
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            <VStack className="flex-1 items-center justify-between px-4 pb-6">
                <VStack className="flex-1 items-center justify-center max-h-[600px]">
                    <Image
                        size="lg"
                        source={require("/assets/images/signin/logo-voluntariei.png")}
                        alt="Logo"
                    />

                    <Text
                        size="2xl"
                        className="font-NunitoBold text-black text-center mt-6"
                    >
                        Bem-vindo(a) ao {"\n"} Voluntari-ei
                    </Text>

                    <Text
                        size="lg"
                        className="text-center font-RobotoRegular text-black mt-4"
                    >
                        Conectando você com quem{"\n"} mais precisa de ajuda.
                    </Text>

                    <FormControl isInvalid={!!errors.email}>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    variant="rounded"
                                    size="sm"
                                    className="w-full max-w-[280px] h-12 bg-input-bg border border-input-border shadow-shadow rounded-[12px] mt-3"
                                >
                                    <HStack className="items-center justify-start ml-3">
                                        <InputIcon
                                            as={Mail}
                                            className="w-6 h-6 text-grey-dark"
                                        />
                                        <InputField
                                            placeholder="E-mail"
                                            keyboardType="email-address"
                                            className="placeholder:text-grey-light"
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
                                <FormControlErrorIcon as={AlertCircle} />
                                <FormControlErrorText>
                                    {errors.email.message}
                                </FormControlErrorText>
                            </FormControlError>
                        )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.password} className="mt-3">
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    variant="rounded"
                                    size="sm"
                                    className="w-full max-w-[280px] h-12 bg-input-bg border border-input-border shadow-shadow rounded-[12px] mt-3"
                                >
                                    <HStack className="items-center justify-start ml-3">
                                        <InputIcon
                                            as={Lock}
                                            className="w-6 h-6 text-grey-dark"
                                        />
                                        <InputField
                                            placeholder="Senha"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className="placeholder:text-grey-light"
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
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            <ButtonIcon
                                                as={showPassword ? EyeOff : Eye}
                                                className={`w-6 h-6 ${
                                                    showPassword
                                                        ? "text-blue-light"
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
                                <FormControlErrorIcon as={AlertCircle} />
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
                                    <CheckboxIcon as={CheckIcon} size="sm" />
                                </CheckboxIndicator>
                                <CheckboxLabel className="text-sm font-light">
                                    Lembrar de mim
                                </CheckboxLabel>
                            </Checkbox>
                        </HStack>

                        <Button
                            variant="link"
                            action="default"
                            className="ml-auto p-0"
                        >
                            <ButtonText className="text-blue-light text-sm font-light">
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
                        className=" min-w-[300px] max-w-[350px] h-[44px] bg-blue-light rounded-[12px] shadow-shadow flex-row items-center justify-center mt-4"
                    >
                        {isLoading ? (
                            <Spinner />
                        ) : (
                            <Text className="text-white font-semibold">
                                Entrar
                            </Text>
                        )}
                    </Button>
                </VStack>

                <VStack className=" items-center">
                    <Text size="lg" className="text-blackfont-semibold">
                        Ainda não tem uma conta?
                    </Text>

                    <Button
                        variant="link"
                        action="default"
                        className="p-2 m-0"
                        onPress={() => router.push("/(auth)")}
                    >
                        <ButtonText
                            size="sm"
                            className="text-blue-light  font-semibold"
                        >
                            Cadastra-se
                        </ButtonText>
                    </Button>
                </VStack>
            </VStack>
        </ScrollView>
    );
};
