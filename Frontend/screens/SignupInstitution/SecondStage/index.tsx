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
import api from "@/services/api";
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
        setValue,
        formState: { errors },
    } = useForm<SignupInstitutionSecondStageData>({
        resolver: zodResolver(signupInstitutionSecondStageSchema),
    });

    const onSubmit = (formData: SignupInstitutionSecondStageData) => {
        console.log("Form válido:", formData);
        updateData(formData);
        router.push("/signupInstitutionThirdStage");
    };

    const buscarEnderecoPorCep = async (cep: string) => {
        try {
            const { data } = await api.get(
                `https://viacep.com.br/ws/${cep}/json/`
            );

            if (data.erro) {
                setErrorMessage("CEP não encontrado.");
                return;
            }

            setValue("street", data.logradouro || "");
            setValue("neighborhood", data.bairro || "");
            setValue("city", data.localidade || "");
            setValue("state", data.uf || "");
        } catch (error) {
            setErrorMessage("Erro ao buscar o CEP.");
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
                                                            formatarCEP(text);
                                                        setFormattedCep(
                                                            formatado
                                                        );
                                                        const apenasNumeros =
                                                            formatado.replace(
                                                                /\D/g,
                                                                ""
                                                            );

                                                        onChange(apenasNumeros);
                                                        setErrorMessage("");

                                                        if (
                                                            apenasNumeros.length ===
                                                            8
                                                        ) {
                                                            buscarEnderecoPorCep(
                                                                apenasNumeros
                                                            );
                                                        }
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

                            <FormControl isInvalid={!!errors.street}>
                                <Text className="text-sm text-blue-dark font-PoppinsBold mt-6 ml-1">
                                    Rua
                                </Text>

                                <Controller
                                    control={control}
                                    name="street"
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
                                {errors.street && (
                                    <FormControlError>
                                        <FormControlErrorIcon
                                            as={AlertCircle}
                                        />
                                        <FormControlErrorText>
                                            {errors.street.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <HStack className="flex-row gap-x-4">
                                {/* Bairro (maior) */}
                                <FormControl
                                    isInvalid={!!errors.neighborhood}
                                    className="w-[160px]"
                                >
                                    <Text className="text-sm text-blue-dark font-PoppinsBold mt-6 ml-1">
                                        Bairro
                                    </Text>
                                    <Controller
                                        control={control}
                                        name="neighborhood"
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
                                    {errors.neighborhood && (
                                        <FormControlError>
                                            <FormControlErrorIcon
                                                as={AlertCircle}
                                            />
                                            <FormControlErrorText>
                                                {errors.neighborhood.message}
                                            </FormControlErrorText>
                                        </FormControlError>
                                    )}
                                </FormControl>

                                {/* Telefone (menor) */}
                                <FormControl
                                    isInvalid={!!errors.numberHouse}
                                    className="w-[100px]"
                                >
                                    <Text className="text-sm text-blue-dark font-PoppinsBold mt-6 ml-1">
                                        numero
                                    </Text>
                                    <Controller
                                        control={control}
                                        name="numberHouse"
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
                                    {errors.numberHouse && (
                                        <FormControlError>
                                            <FormControlErrorIcon
                                                as={AlertCircle}
                                            />
                                            <FormControlErrorText>
                                                {errors.numberHouse.message}
                                            </FormControlErrorText>
                                        </FormControlError>
                                    )}
                                </FormControl>
                            </HStack>

                            <FormControl isInvalid={!!errors.city}>
                                <Text className="text-sm text-blue-dark font-PoppinsBold mt-6 ml-1">
                                    Cidade
                                </Text>

                                <Controller
                                    control={control}
                                    name="city"
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
                                {errors.city && (
                                    <FormControlError>
                                        <FormControlErrorIcon
                                            as={AlertCircle}
                                        />
                                        <FormControlErrorText>
                                            {errors.city.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!errors.state}>
                                <Text className="text-sm text-blue-dark font-PoppinsBold mt-6 ml-1">
                                    Estado
                                </Text>

                                <Controller
                                    control={control}
                                    name="state"
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
                                {errors.state && (
                                    <FormControlError>
                                        <FormControlErrorIcon
                                            as={AlertCircle}
                                        />
                                        <FormControlErrorText>
                                            {errors.state.message}
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
