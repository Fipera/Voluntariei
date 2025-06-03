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
import { SigninFormData, signinSchema } from "@/utils/schemas/signinSchema";
import {
    SignupInstitutionFirstStageData,
    signupInstitutionFirstStageSchema,
} from "@/utils/schemas/signupInstitutionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatarCNPJ, formatarTelefone } from "@/utils/formatters/format";
import api from "@/services/api";

export function SignupInstitutionFirstStage() {
    const router = useRouter();
    const [formattedCnpj, setFormattedCnpj] = useState("");
    const [formattedTelefone, setFormattedTelefone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { updateData } = useSignupInstitutionStore();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<SignupInstitutionFirstStageData>({
        resolver: zodResolver(signupInstitutionFirstStageSchema),
    });

    const checkUniqueness = async (
        formData: SignupInstitutionFirstStageData
    ) => {
        try {
            const response = await api.post("/institution/check-uniqueness", {
                cnpj: formData.cnpj,
                phoneNumber: formData.phoneNumber,
            });

            return response.data;
        } catch (error) {
            setErrorMessage("Erro ao verificar dados. Tente novamente.");
            return null;
        }
    };

    const onSubmit = async (formData: SignupInstitutionFirstStageData) => {
        setIsLoading(true);
        setErrorMessage("");

        const result = await checkUniqueness(formData);

        if (!result) {
            setIsLoading(false);
            return;
        }

        const { cnpj, phoneNumber } = result;

        if (cnpj || phoneNumber) {
            if (cnpj) {
                setError("cnpj", {
                    type: "manual",
                    message: "CNPJ já cadastrado",
                });
            }

            if (phoneNumber) {
                setError("phoneNumber", {
                    type: "manual",
                    message: "Telefone já cadastrado",
                });
            }

            setIsLoading(false);
            return;
        }
        console.log("Form válido:", formData);
        updateData(formData);
        setIsLoading(false);
        router.push("/signupInstitutionSecondStage");
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
                        <VStack className="flex-1 items-center justify-start ">
                            <Text
                                size="3xl"
                                className="font-PoppinsBold text-blue-dark text-center mt-6"
                            >
                                Cadastre {"\n"} sua instituição
                            </Text>

                            <Text
                                size="2xl"
                                className="font-PoppinsBold text-blue-dark text-center mt-10"
                            >
                                Dados da Instituição
                            </Text>

                            <FormControl isInvalid={!!errors.cnpj}>
                                <Text className="text-sm text-blue-dark font-PoppinsBold mt-6 ml-1">
                                    CNPJ
                                </Text>

                                <Controller
                                    control={control}
                                    name="cnpj"
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
                                                    value={formattedCnpj}
                                                    onChangeText={(text) => {
                                                        const formatado =
                                                            formatarCNPJ(text);
                                                        setFormattedCnpj(
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
                                {errors.cnpj && (
                                    <FormControlError>
                                        <FormControlErrorIcon
                                            as={AlertCircle}
                                        />
                                        <FormControlErrorText>
                                            {errors.cnpj.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!errors.socialReason}>
                                <Text className="text-sm text-blue-dark font-PoppinsBold mt-6 ml-1">
                                    Razão Social
                                </Text>

                                <Controller
                                    control={control}
                                    name="socialReason"
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
                                {errors.socialReason && (
                                    <FormControlError>
                                        <FormControlErrorIcon
                                            as={AlertCircle}
                                        />
                                        <FormControlErrorText>
                                            {errors.socialReason.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!errors.name}>
                                <Text className="text-sm text-blue-dark font-PoppinsBold mt-6 ml-1">
                                    Nome
                                </Text>

                                <Controller
                                    control={control}
                                    name="name"
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
                                {errors.name && (
                                    <FormControlError>
                                        <FormControlErrorIcon
                                            as={AlertCircle}
                                        />
                                        <FormControlErrorText>
                                            {errors.name.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!errors.phoneNumber}>
                                <Text className="text-sm text-blue-dark font-PoppinsBold mt-6 ml-1">
                                    Telefone
                                </Text>

                                <Controller
                                    control={control}
                                    name="phoneNumber"
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
                                                    value={formattedTelefone}
                                                    onChangeText={(text) => {
                                                        const formatado =
                                                            formatarTelefone(
                                                                text
                                                            );
                                                        setFormattedTelefone(
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
                                {errors.phoneNumber && (
                                    <FormControlError>
                                        <FormControlErrorIcon
                                            as={AlertCircle}
                                        />
                                        <FormControlErrorText>
                                            {errors.phoneNumber.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!errors.reason}>
                                <Text className="text-sm text-blue-dark font-PoppinsBold mt-6 ml-1">
                                    Causa
                                </Text>

                                <Controller
                                    control={control}
                                    name="reason"
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
                                {errors.reason && (
                                    <FormControlError>
                                        <FormControlErrorIcon
                                            as={AlertCircle}
                                        />
                                        <FormControlErrorText>
                                            {errors.reason.message}
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
