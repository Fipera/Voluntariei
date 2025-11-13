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
import { KeyboardAvoidingView, Platform, ScrollView, Dimensions, View } from "react-native";
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
    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
    const H_PADDING = 24;
    const MAX_CONTENT_WIDTH = 310;
    const contentWidth = Math.min(MAX_CONTENT_WIDTH, SCREEN_WIDTH - H_PADDING * 2);

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
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <VStack style={{ flex: 1, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 24 }}>
                        
                        <VStack style={{ alignItems: "center", width: "100%" }}>
                            <Image
                                source={require("/assets/images/signin/icone-instituicao.png")}
                                alt="icone-instituicao"
                                style={{ width: 108, height: 92, marginTop: SCREEN_HEIGHT * 0.08, alignSelf: "center", resizeMode: "contain" as const }}
                            />
                            <Text size="xs" style={{ marginTop: SCREEN_HEIGHT * 0.025, width: Math.min(312, SCREEN_WIDTH - 32), fontFamily: "Nunito-Bold", fontSize: 28, lineHeight: 38, textAlign: "center", color: "#173663" }}>
                                Cadastre sua Instituição
                            </Text>
                            <Text size="2xl" style={{ marginTop: SCREEN_HEIGHT * 0.015, width: Math.min(300, SCREEN_WIDTH - 32), fontFamily: "Nunito", fontWeight: "400", fontSize: 16, lineHeight: 22, textAlign: "center", color: "#000000" }}>
                                Preencha os dados básicos para continuar
                            </Text>
                        </VStack>

                        
                        <VStack style={{ width: "100%", alignItems: "center" }}>
                            <FormControl isInvalid={!!errors.cnpj}>
                                <Text style={{ marginTop: SCREEN_HEIGHT * 0.03, marginLeft: 4, fontFamily: "Nunito-Bold", fontSize: 16, lineHeight: 22, color: "#173663" }}>
                                    CNPJ
                                </Text>
                                <Controller
                                    control={control}
                                    name="cnpj"
                                    render={({ field: { onChange, value } }) => (
                                        <Input variant="rounded" size="sm" style={{ width: contentWidth, height: 43, backgroundColor: "#FDFDFD", borderColor: "#B7B7B7", borderWidth: 1, borderRadius: 8, marginTop: SCREEN_HEIGHT * 0.01, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 2, elevation: 2 }}>
                                            <HStack style={{ alignItems: "center", justifyContent: "flex-start", marginLeft: 12 }}>
                                                <InputField
                                                    keyboardType="number-pad"
                                                    value={formattedCnpj}
                                                    onChangeText={(text) => {
                                                        const formatado = formatarCNPJ(text);
                                                        setFormattedCnpj(formatado);
                                                        onChange(formatado.replace(/\D/g, ""));
                                                        setErrorMessage("");
                                                    }}
                                                />
                                            </HStack>
                                        </Input>
                                    )}
                                />
                                {errors.cnpj && (
                                    <FormControlError>
                                        <FormControlErrorIcon as={AlertCircle} />
                                        <FormControlErrorText>{errors.cnpj.message}</FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!errors.socialReason}>
                                <Text style={{ marginTop: SCREEN_HEIGHT * 0.025, marginLeft: 4, fontFamily: "Nunito-Bold", fontSize: 16, lineHeight: 22, color: "#173663" }}>
                                    Razão Social
                                </Text>
                                <Controller
                                    control={control}
                                    name="socialReason"
                                    render={({ field: { onChange, value } }) => (
                                        <Input variant="rounded" size="sm" style={{ width: contentWidth, height: 43, backgroundColor: "#FDFDFD", borderColor: "#B7B7B7", borderWidth: 1, borderRadius: 8, marginTop: SCREEN_HEIGHT * 0.01, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 2, elevation: 2 }}>
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
                                {errors.socialReason && (
                                    <FormControlError>
                                        <FormControlErrorIcon as={AlertCircle} />
                                        <FormControlErrorText>{errors.socialReason.message}</FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!errors.name}>
                                <Text style={{ marginTop: SCREEN_HEIGHT * 0.025, marginLeft: 4, fontFamily: "Nunito-Bold", fontSize: 16, lineHeight: 22, color: "#173663" }}>
                                    Nome Fantasia
                                </Text>
                                <Controller
                                    control={control}
                                    name="name"
                                    render={({ field: { onChange, value } }) => (
                                        <Input variant="rounded" size="sm" style={{ width: contentWidth, height: 43, backgroundColor: "#FDFDFD", borderColor: "#B7B7B7", borderWidth: 1, borderRadius: 8, marginTop: SCREEN_HEIGHT * 0.01, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 2, elevation: 2 }}>
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
                                <Text style={{ marginTop: SCREEN_HEIGHT * 0.025, marginLeft: 4, fontFamily: "Nunito-Bold", fontSize: 16, lineHeight: 22, color: "#173663" }}>
                                    Telefone
                                </Text>
                                <Controller
                                    control={control}
                                    name="phoneNumber"
                                    render={({ field: { onChange, value } }) => (
                                        <Input variant="rounded" size="sm" style={{ width: contentWidth, height: 43, backgroundColor: "#FDFDFD", borderColor: "#B7B7B7", borderWidth: 1, borderRadius: 8, marginTop: SCREEN_HEIGHT * 0.01, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 2, elevation: 2 }}>
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

                            <FormControl isInvalid={!!errors.reason}>
                                <Text style={{ marginTop: SCREEN_HEIGHT * 0.025, marginLeft: 4, fontFamily: "Nunito-Bold", fontSize: 16, lineHeight: 22, color: "#173663" }}>
                                    Causa
                                </Text>
                                <Controller
                                    control={control}
                                    name="reason"
                                    render={({ field: { onChange, value } }) => (
                                        <Input variant="rounded" size="sm" style={{ width: contentWidth, height: 43, backgroundColor: "#FDFDFD", borderColor: "#B7B7B7", borderWidth: 1, borderRadius: 8, marginTop: SCREEN_HEIGHT * 0.01, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 2, elevation: 2 }}>
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
                                {errors.reason && (
                                    <FormControlError>
                                        <FormControlErrorIcon as={AlertCircle} />
                                        <FormControlErrorText>{errors.reason.message}</FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>
                        </VStack>

                        
                        <VStack style={{ width: "100%", alignItems: "center" }}>
                            <Button onPress={handleSubmit(onSubmit)} disabled={isLoading} style={{ width: contentWidth, height: 44, backgroundColor: "#173663", borderRadius: 12, flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: SCREEN_HEIGHT * 0.025 }}>
                                {isLoading ? <Spinner /> : <Text style={{ color: "#FFFFFF", fontFamily: "Nunito-Bold", fontSize: 18, lineHeight: 25 }}>Próximo</Text>}
                            </Button>
                        </VStack>
                    </VStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
