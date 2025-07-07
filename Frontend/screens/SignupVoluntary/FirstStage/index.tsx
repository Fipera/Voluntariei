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
import { useSignupVoluntaryStore } from "@/store/useSignupVoluntaryStore";
import { SigninFormData, signinSchema } from "@/utils/schemas/signinSchema";
import {
    SignupVoluntaryFirstStageData,
    signupVoluntaryFirstStageSchema,
} from "@/utils/schemas/signupVoluntarySchema";
import { formatarCEP } from "@/utils/formatters/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatarCNPJ, formatarTelefone } from "@/utils/formatters/format";
import api from "@/services/api";

export function SignupVoluntaryFirstStage() {
    const router = useRouter();
    const [formattedTelefone, setFormattedTelefone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { updateData } = useSignupVoluntaryStore();

     const [formattedCep, setFormattedCep] = useState("");

    const {
        control,
        handleSubmit,
        setValue,
        setError,
        formState: { errors },
    } = useForm<SignupVoluntaryFirstStageData>({
        resolver: zodResolver(signupVoluntaryFirstStageSchema),
    });

    const checkUniqueness = async (
        formData: SignupVoluntaryFirstStageData
    ) => {
        try {
            const response = await api.post("/voluntary/check-uniqueness", {
                phoneNumber: formData.phoneNumber,
            });

            return response.data;
        } catch (error) {
            setErrorMessage("Erro ao verificar dados. Tente novamente.");
            return null;
        }
    };

    const onSubmit = async (formData: SignupVoluntaryFirstStageData) => {
            setIsLoading(true);
            setErrorMessage("");
    
            const result = await checkUniqueness(formData);
    
            if (!result) {
                setIsLoading(false);
                return;
            }
    
            const { phoneNumber } = result;

            if (phoneNumber) {
                setError("phoneNumber", {
                    type: "manual",
                    message: "Telefone já cadastrado",
                });
                setIsLoading(false);
                return;
            }

               
            
            console.log("Form válido:", formData);
            updateData(formData);
            setIsLoading(false);
            router.push("/signupVoluntarySecondStage");
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
                        <VStack className="flex-1 items-center justify-start ">
                            <Text
                                size="3xl"
                                className="font-PoppinsBold text-blue-dark text-center mt-6"
                            >
                                Seja {"\n"} um Voluntário
                            </Text>

                            <Text
                                size="2xl"
                                className="font-PoppinsBold text-blue-dark text-center mt-10"
                            >
                                Dados Pessoais
                            </Text>

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
