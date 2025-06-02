import Stepper from "@/components/custom/stepper";
import {
    Avatar,
    AvatarBadge,
    AvatarFallbackText,
    AvatarGroup,
} from "@/components/ui/avatar";
import { Button, ButtonIcon } from "@/components/ui/button";
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { AddIcon, Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Input, InputField, InputIcon } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useSignupInstitutionStore } from "@/store/useSignupInstitutionStore";
import { SigninFormData, signinSchema } from "@/utils/schemas/signinSchema";
import {
    SignupInstitutionThirdStageData,
    signupInstitutionThirdStageSchema,
} from "@/utils/schemas/signupInstitutionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function SignupInstitutionThirdStage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { data, updateData, clearData } = useSignupInstitutionStore();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupInstitutionThirdStageData>({
        resolver: zodResolver(signupInstitutionThirdStageSchema),
    });

    const onSubmit = (formData: SignupInstitutionThirdStageData) => {
        const fullData = { ...data, ...formData };
        console.log("Dados completos para envio:", fullData);

        clearData();
        router.push("/home");
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
                    <VStack className="flex-1 items-center justify-between px-4 pb-6">
                        <VStack className="flex-1 items-center justify-start">
                            <Stepper etapaAtual={3} />

                            <Text
                                size="xl"
                                className="font-PoppinsBold text-blue-dark text-center mt-6"
                            >
                                Etapa 3 de 3
                            </Text>

                            <Avatar size="2xl" className="bg-black mt-16">
                                <Icon
                                    as={AddIcon}
                                    size="xl2"
                                    className="stroke-white"
                                />
                            </Avatar>

                            <Text
                                size="md"
                                className="font-PoppinsBold text-blue-dark text-center mt-6"
                            >
                                Nome da Instituição
                            </Text>

                            <Text
                                size="xl"
                                className="font-PoppinsBold text-blue-dark text-center mt-6"
                            >
                                Acesso
                            </Text>

                            <FormControl isInvalid={!!errors.email}>
                                <Text className="text-sm text-blue-dark font-PoppinsBold mt-6 ml-1">
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
                                isInvalid={!!errors.senha}
                                className="mt-3"
                            >
                                <Text className="text-sm text-blue-dark font-PoppinsBold mt- ml-1">
                                    Senha
                                </Text>
                                <Controller
                                    control={control}
                                    name="senha"
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
                                {errors.senha && (
                                    <FormControlError>
                                        <FormControlErrorIcon
                                            as={AlertCircle}
                                        />
                                        <FormControlErrorText>
                                            {errors.senha.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl
                                isInvalid={!!errors.confirmarSenha}
                                className="mt-3"
                            >
                                <Text className="text-sm text-blue-dark font-PoppinsBold mt- ml-1">
                                    Confirmar Senha
                                </Text>
                                <Controller
                                    control={control}
                                    name="confirmarSenha"
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
                                                        !showConfirmPassword
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
                                                        setShowConfirmPassword(
                                                            !showConfirmPassword
                                                        )
                                                    }
                                                >
                                                    <ButtonIcon
                                                        as={
                                                            showConfirmPassword
                                                                ? EyeOff
                                                                : Eye
                                                        }
                                                        className={`w-6 h-6 ${
                                                            showConfirmPassword
                                                                ? "text-blue-dark"
                                                                : "text-grey-dark"
                                                        }`}
                                                    />
                                                </Button>
                                            </HStack>
                                        </Input>
                                    )}
                                />
                                {errors.confirmarSenha && (
                                    <FormControlError>
                                        <FormControlErrorIcon
                                            as={AlertCircle}
                                        />
                                        <FormControlErrorText>
                                            {errors.confirmarSenha.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <Button
                                onPress={handleSubmit(onSubmit)}
                                disabled={isLoading}
                                className="min-w-[300px] max-w-[350px] h-[44px] bg-blue-dark rounded-[12px] shadow-shadow flex-row items-center justify-center mt-12"
                            >
                                {isLoading ? (
                                    <Spinner />
                                ) : (
                                    <Text className="text-white font-InterBold">
                                        Cadastrar
                                    </Text>
                                )}
                            </Button>
                        </VStack>
                    </VStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
