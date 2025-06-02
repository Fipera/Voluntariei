import Stepper from "@/components/custom/stepper";
import { Button, ButtonIcon } from "@/components/ui/button";
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Input, InputField, InputIcon } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useSignupInstitutionStore } from "@/store/useSignupInstitutionStore";
import { formatarCEP } from "@/utils/formatters/format";
import { SigninFormData, signinSchema } from "@/utils/schemas/signinSchema";
import {
    SignupInstitutionSecondStageData,
    signupInstitutionSecondStageSchema,
} from "@/utils/schemas/signupInstitutionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function SignupInstitutionSecondStage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formattedCep, setFormattedCep] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { updateData } = useSignupInstitutionStore();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupInstitutionSecondStageData>({
        resolver: zodResolver(signupInstitutionSecondStageSchema),
    });

    const onSubmit = (formData: SignupInstitutionSecondStageData) => {
        console.log("Form válido:", formData);
        updateData(formData);
        router.push("/signupInstitutionThirdStage");
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
                            <Stepper etapaAtual={2} />

                            <Text
                                size="xl"
                                className="font-PoppinsBold text-blue-dark text-center mt-6"
                            >
                                Etapa 2 de 3
                            </Text>

                            <Text
                                size="2xl"
                                className="font-PoppinsBold text-blue-dark text-center mt-10"
                            >
                                Endereço
                            </Text>

                            <FormControl isInvalid={!!errors.cep}>
                                <Text className="text-sm text-blue-dark font-PoppinsBold mt-6 ml-1">
                                    CEP
                                </Text>

                                <Controller
                                    control={control}
                                    name="cep"
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
                                                    keyboardType="number-pad"
                                                    className=""
                                                    value={formattedCep}
                                                    onChangeText={(text) => {
                                                        const formatado =
                                                            formatarCEP(
                                                                text
                                                            );
                                                        setFormattedCep(
                                                            formatado
                                                        );
                                                        onChange(
                                                            formatado.replace(
                                                                /\D/g,
                                                                ""
                                                            )
                                                        );
                                                        setErrorMessage("");
                                                    }}
                                                />
                                            </HStack>
                                        </Input>
                                    )}
                                />
                                {errors.cep && (
                                    <FormControlError>
                                        <FormControlErrorIcon
                                            as={AlertCircle}
                                        />
                                        <FormControlErrorText>
                                            {errors.cep.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!errors.rua}>
                                <Text className="text-sm text-blue-dark font-PoppinsBold mt-6 ml-1">
                                    Rua
                                </Text>

                                <Controller
                                    control={control}
                                    name="rua"
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
                                                    keyboardType="default"
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
                                {errors.rua && (
                                    <FormControlError>
                                        <FormControlErrorIcon
                                            as={AlertCircle}
                                        />
                                        <FormControlErrorText>
                                            {errors.rua.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <HStack className="flex-row gap-x-4">
                                {/* Bairro (maior) */}
                                <FormControl
                                    isInvalid={!!errors.bairro}
                                    className="w-[160px]"
                                >
                                    <Text className="text-sm text-blue-dark font-PoppinsBold mt-6 ml-1">
                                        Bairro
                                    </Text>
                                    <Controller
                                        control={control}
                                        name="bairro"
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <Input
                                                variant="rounded"
                                                size="sm"
                                                className="h-12 bg-white border border-input-border shadow-shadow rounded-[12px]"
                                            >
                                                <HStack className="items-center justify-start ml-3">
                                                    <InputField
                                                        keyboardType="default"
                                                        className=""
                                                        value={value}
                                                        onChangeText={(
                                                            text
                                                        ) => {
                                                            onChange(text);
                                                            setErrorMessage("");
                                                        }}
                                                    />
                                                </HStack>
                                            </Input>
                                        )}
                                    />
                                    {errors.bairro && (
                                        <FormControlError>
                                            <FormControlErrorIcon
                                                as={AlertCircle}
                                            />
                                            <FormControlErrorText>
                                                {errors.bairro.message}
                                            </FormControlErrorText>
                                        </FormControlError>
                                    )}
                                </FormControl>

                                {/* Telefone (menor) */}
                                <FormControl
                                    isInvalid={!!errors.numero}
                                    className="w-[100px]"
                                >
                                    <Text className="text-sm text-blue-dark font-PoppinsBold mt-6 ml-1">
                                        numero
                                    </Text>
                                    <Controller
                                        control={control}
                                        name="numero"
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <Input
                                                variant="rounded"
                                                size="sm"
                                                className="h-12 bg-white border border-input-border shadow-shadow rounded-[12px]"
                                            >
                                                <HStack className="items-center justify-start ml-3">
                                                    <InputField
                                                        keyboardType="number-pad"
                                                        className=""
                                                        value={value}
                                                        onChangeText={(
                                                            text
                                                        ) => {
                                                            onChange(text);
                                                            setErrorMessage("");
                                                        }}
                                                    />
                                                </HStack>
                                            </Input>
                                        )}
                                    />
                                    {errors.numero && (
                                        <FormControlError>
                                            <FormControlErrorIcon
                                                as={AlertCircle}
                                            />
                                            <FormControlErrorText>
                                                {errors.numero.message}
                                            </FormControlErrorText>
                                        </FormControlError>
                                    )}
                                </FormControl>
                            </HStack>

                            <FormControl isInvalid={!!errors.cidade}>
                                <Text className="text-sm text-blue-dark font-PoppinsBold mt-6 ml-1">
                                    Cidade
                                </Text>

                                <Controller
                                    control={control}
                                    name="cidade"
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
                                                    keyboardType="default"
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
                                {errors.cidade && (
                                    <FormControlError>
                                        <FormControlErrorIcon
                                            as={AlertCircle}
                                        />
                                        <FormControlErrorText>
                                            {errors.cidade.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!errors.estado}>
                                <Text className="text-sm text-blue-dark font-PoppinsBold mt-6 ml-1">
                                    Estado
                                </Text>

                                <Controller
                                    control={control}
                                    name="estado"
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
                                                    keyboardType="default"
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
                                {errors.estado && (
                                    <FormControlError>
                                        <FormControlErrorIcon
                                            as={AlertCircle}
                                        />
                                        <FormControlErrorText>
                                            {errors.estado.message}
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
                                        Próximo
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
