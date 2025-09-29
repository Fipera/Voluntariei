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
import { KeyboardAvoidingView, Platform, ScrollView, View, Dimensions } from "react-native";
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

    // Layout sizing consistent with other stages
    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
    const H_PADDING = 24;
    const MAX_CONTENT_WIDTH = 310;
    const contentWidth = Math.min(MAX_CONTENT_WIDTH, SCREEN_WIDTH - H_PADDING * 2);

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
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <VStack
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingHorizontal: 16,
                            paddingBottom: 24,
                        }}
                    >
                        {/* Top Section */}
                        <View style={{ width: "100%", alignItems: "center" }}>
                            <Image
                                source={require("@/assets/images/signin/icone-voluntario.png")}
                                alt="icone-voluntario"
                                style={{ width: 108, height: 92, marginTop: SCREEN_HEIGHT * 0.08, alignSelf: "center", resizeMode: "contain" as const }}
                            />
                            <Text
                                style={{
                                    marginTop: 20,
                                    alignSelf: "center",
                                    fontFamily: "Nunito-Bold",
                                    fontSize: 28,
                                    lineHeight: 38,
                                    color: "#173663",
                                    textAlign: "center",
                                }}
                            >
                                Seja um Voluntário
                            </Text>
                            <Text
                                style={{
                                    marginTop: 8,
                                    alignSelf: "center",
                                    fontFamily: "Nunito-Regular",
                                    fontSize: 16,
                                    lineHeight: 22,
                                    color: "#000",
                                    textAlign: "center",
                                }}
                            >
                                Preencha seus dados para começar
                                {"\n"}a fazer a diferença.
                            </Text>
                        </View>

                        {/* Form Section */}
                        <View
                            style={{
                                marginTop: 16,
                                width: "100%",
                                maxWidth: 350,
                                alignSelf: "center",
                                gap: 16,
                            }}
                        >
                            <FormControl isInvalid={!!errors.name}>
                                <Text
                                    style={{
                                        fontFamily: "Nunito-Bold",
                                        fontSize: 16,
                                        lineHeight: 22,
                                        color: "#173663",
                                        marginLeft: 4,
                                        marginBottom: 8,
                                    }}
                                >
                                    Nome
                                </Text>
                                <Controller
                                    control={control}
                                    name="name"
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            variant="rounded"
                                            size="sm"
                                            style={{
                                                width: "100%",
                                                height: 43,
                                                backgroundColor: "#FDFDFD",
                                                borderColor: "#B7B7B7",
                                                borderWidth: 1,
                                                borderRadius: 8,
                                                shadowColor: "#000",
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 2,
                                                elevation: 2,
                                            }}
                                        >
                                            <HStack style={{ alignItems: "center", justifyContent: "flex-start", marginLeft: 12 }}>
                                                <InputField
                                                    keyboardType="default"
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
                                        <FormControlErrorIcon as={AlertCircle} />
                                        <FormControlErrorText>{errors.name.message}</FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!errors.phoneNumber}>
                                <Text
                                    style={{
                                        fontFamily: "Nunito-Bold",
                                        fontSize: 16,
                                        lineHeight: 22,
                                        color: "#173663",
                                        marginLeft: 4,
                                        marginBottom: 8,
                                    }}
                                >
                                    Telefone
                                </Text>
                                <Controller
                                    control={control}
                                    name="phoneNumber"
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            variant="rounded"
                                            size="sm"
                                            style={{
                                                width: "100%",
                                                height: 43,
                                                backgroundColor: "#FDFDFD",
                                                borderColor: "#B7B7B7",
                                                borderWidth: 1,
                                                borderRadius: 8,
                                                shadowColor: "#000",
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 2,
                                                elevation: 2,
                                            }}
                                        >
                                            <HStack style={{ alignItems: "center", justifyContent: "flex-start", marginLeft: 12 }}>
                                                <InputField
                                                    keyboardType="number-pad"
                                                    value={formattedTelefone}
                                                    onChangeText={(text) => {
                                                        const formatado = formatarTelefone(text);
                                                        setFormattedTelefone(formatado);
                                                        onChange(formatado.replace(/\D/g, ""));
                                                        setErrorMessage("");
                                                    }}
                                                />
                                            </HStack>
                                        </Input>
                                    )}
                                />
                                {errors.phoneNumber && (
                                    <FormControlError>
                                        <FormControlErrorIcon as={AlertCircle} />
                                        <FormControlErrorText>{errors.phoneNumber.message}</FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!errors.cep}>
                                <Text
                                    style={{
                                        fontFamily: "Nunito-Bold",
                                        fontSize: 16,
                                        lineHeight: 22,
                                        color: "#173663",
                                        marginLeft: 4,
                                        marginBottom: 8,
                                    }}
                                >
                                    CEP
                                </Text>
                                <Controller
                                    control={control}
                                    name="cep"
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            variant="rounded"
                                            size="sm"
                                            style={{
                                                width: "100%",
                                                height: 43,
                                                backgroundColor: "#FDFDFD",
                                                borderColor: "#B7B7B7",
                                                borderWidth: 1,
                                                borderRadius: 8,
                                                shadowColor: "#000",
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 2,
                                                elevation: 2,
                                            }}
                                        >
                                            <HStack style={{ alignItems: "center", justifyContent: "flex-start", marginLeft: 12 }}>
                                                <InputField
                                                    keyboardType="number-pad"
                                                    value={formattedCep}
                                                    onChangeText={(text) => {
                                                        const formatado = formatarCEP(text);
                                                        setFormattedCep(formatado);
                                                        const apenasNumeros = formatado.replace(/\D/g, "");
                                                        onChange(apenasNumeros);
                                                        setErrorMessage("");
                                                        if (apenasNumeros.length === 8) {
                                                            buscarEnderecoPorCep(apenasNumeros);
                                                        }
                                                    }}
                                                />
                                            </HStack>
                                        </Input>
                                    )}
                                />
                                {errors.cep && (
                                    <FormControlError>
                                        <FormControlErrorIcon as={AlertCircle} />
                                        <FormControlErrorText>{errors.cep.message}</FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!errors.city}>
                                <Text
                                    style={{
                                        fontFamily: "Nunito-Bold",
                                        fontSize: 16,
                                        lineHeight: 22,
                                        color: "#173663",
                                        marginLeft: 4,
                                        marginBottom: 8,
                                    }}
                                >
                                    Cidade
                                </Text>
                                <Controller
                                    control={control}
                                    name="city"
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            variant="rounded"
                                            size="sm"
                                            style={{
                                                width: "100%",
                                                height: 43,
                                                backgroundColor: "#FDFDFD",
                                                borderColor: "#B7B7B7",
                                                borderWidth: 1,
                                                borderRadius: 8,
                                                shadowColor: "#000",
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 2,
                                                elevation: 2,
                                            }}
                                        >
                                            <HStack style={{ alignItems: "center", justifyContent: "flex-start", marginLeft: 12 }}>
                                                <InputField
                                                    keyboardType="default"
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
                                        <FormControlErrorIcon as={AlertCircle} />
                                        <FormControlErrorText>{errors.city.message}</FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!errors.state}>
                                <Text
                                    style={{
                                        fontFamily: "Nunito-Bold",
                                        fontSize: 16,
                                        lineHeight: 22,
                                        color: "#173663",
                                        marginLeft: 4,
                                        marginBottom: 8,
                                    }}
                                >
                                    Estado
                                </Text>
                                <Controller
                                    control={control}
                                    name="state"
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            variant="rounded"
                                            size="sm"
                                            style={{
                                                width: "100%",
                                                height: 43,
                                                backgroundColor: "#FDFDFD",
                                                borderColor: "#B7B7B7",
                                                borderWidth: 1,
                                                borderRadius: 8,
                                                shadowColor: "#000",
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 2,
                                                elevation: 2,
                                            }}
                                        >
                                            <HStack style={{ alignItems: "center", justifyContent: "flex-start", marginLeft: 12 }}>
                                                <InputField
                                                    keyboardType="default"
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
                                        <FormControlErrorIcon as={AlertCircle} />
                                        <FormControlErrorText>{errors.state.message}</FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>
                        </View>

                        {/* Bottom Section */}
                        <View style={{ width: "100%", alignItems: "center", gap: 12 }}>
                            <Button
                                onPress={handleSubmit(onSubmit)}
                                disabled={isLoading}
                                style={{
                                    width: 310,
                                    height: 44,
                                    backgroundColor: "#173663",
                                    borderRadius: 12,
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 10,
                                }}
                            >
                                {isLoading ? (
                                    <Spinner />
                                ) : (
                                    <Text style={{ fontFamily: "Nunito-Bold", fontSize: 18, lineHeight: 25, color: "#FFFFFF" }}>
                                        Próximo
                                    </Text>
                                )}
                            </Button>
                            <Text
                                style={{
                                    fontFamily: "Nunito-Regular",
                                    fontSize: 14,
                                    lineHeight: 20,
                                    color: "#000",
                                    textAlign: "center",
                                    width: 312,
                                }}
                            >
                                {"Com seu cadastro, você poderá se conectar\na instituições que precisam da sua ajuda."}
                            </Text>
                        </View>
                    </VStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

