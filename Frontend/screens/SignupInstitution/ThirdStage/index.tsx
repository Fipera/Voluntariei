import Stepper from "@/components/custom/stepper";
import { Button, ButtonIcon } from "@/components/ui/button";
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import api from "@/services/api";
import { useSignupInstitutionStore } from "@/store/useSignupInstitutionStore";
import { AppError } from "@/utils/AppError";
import {
    SignupInstitutionThirdStageData,
    signupInstitutionThirdStageSchema,
} from "@/utils/schemas/signupInstitutionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { AlertCircle, Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Checkbox, CheckboxIcon, CheckboxIndicator } from "@/components/ui/checkbox";

export function SignupInstitutionThirdStage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { data, updateData, clearData } = useSignupInstitutionStore();
    const [termsAccepted, setTermsAccepted] = useState(false);

    const { control, handleSubmit, setError, formState: { errors } } = useForm<SignupInstitutionThirdStageData>({
        resolver: zodResolver(signupInstitutionThirdStageSchema),
    });

    const checkUniqueness = async (formData: SignupInstitutionThirdStageData) => {
        try {
            const response = await api.post("/institution/check-uniqueness", {
                email: formData.email,
            });
            return response.data;
        } catch (error) {
            setErrorMessage("Erro ao verificar dados. Tente novamente.");
            return null;
        }
    };

    const onSubmit = async (formData: SignupInstitutionThirdStageData) => {
        setIsLoading(true);
        setErrorMessage("");

        const result = await checkUniqueness(formData);
        if (!result) {
            setIsLoading(false);
            return;
        }

        const { email } = result;
        if (email) {
            setError("email", { type: "manual", message: "Email já cadastrado" });
            setIsLoading(false);
            return;
        }

        const fullData = { ...data, ...formData };

        try {
            setIsLoading(true);
            await api.post("/institution", fullData);
            setIsLoading(false);
            clearData();
            router.push("/(institution)");
        } catch (error) {
            console.log("Erro completo:", error);
            setIsLoading(false);
            const isAppError = error instanceof AppError;
            const messageError = isAppError ? error.message : "Não foi possível fazer cadastro. Tente novamente mais tarde.";
            setErrorMessage(messageError);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f7f7" }} edges={["top", "left", "right", "bottom"]}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <VStack style={{ flex: 1, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 24 }}>
                        {/* Top */}
                        <View style={{ width: "100%", alignItems: "center" }}>
                            <Stepper etapaAtual={3} />
                            <Text style={{ marginTop: 12, alignSelf: "center", fontFamily: "Nunito-Bold", fontSize: 16, lineHeight: 22, color: "#173663" }}>Etapa 3 de 3</Text>
                            <Text style={{ marginTop: 24, alignSelf: "center", fontFamily: "Nunito-Bold", fontSize: 28, lineHeight: 38, color: "#173663", textAlign: "center" }}>Dados de Acesso</Text>
                            <Text style={{ marginTop: 8, alignSelf: "center", fontFamily: "Nunito-Regular", fontSize: 16, lineHeight: 22, color: "#000", textAlign: "center", maxWidth: 350 }}>Crie seu login para acessar o sistema</Text>
                        </View>

                        {/* Form */}
                        <View style={{ marginTop: 16, width: "100%", maxWidth: 312, alignSelf: "center" }}>
                            <FormControl isInvalid={!!errors.email}>
                                <Text style={{ fontFamily: "Nunito-Bold", fontSize: 16, lineHeight: 22, color: "#173663", marginLeft: 4, marginBottom: 8 }}>E-mail</Text>
                                <Controller
                                    control={control}
                                    name="email"
                                    render={({ field: { onChange, value } }) => (
                                        <Input variant="rounded" size="sm" style={{ width: 310, height: 43, backgroundColor: "#FDFDFD", borderColor: "#B7B7B7", borderWidth: 1, borderRadius: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 2, elevation: 2, alignSelf: "center" }}>
                                            <HStack style={{ alignItems: "center", justifyContent: "flex-start", marginLeft: 12 }}>
                                                <InputField keyboardType="email-address" value={value} placeholder="ex: usuario@gmail.com" onChangeText={(text) => { onChange(text); setErrorMessage(""); }} />
                                            </HStack>
                                        </Input>
                                    )}
                                />
                                {errors.email && (
                                    <FormControlError>
                                        <FormControlErrorIcon as={AlertCircle} />
                                        <FormControlErrorText>{errors.email.message}</FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!errors.password} style={{ marginTop: 16 }}>
                                <Text style={{ fontFamily: "Nunito-Bold", fontSize: 16, lineHeight: 22, color: "#173663", marginLeft: 4, marginBottom: 8 }}>Senha</Text>
                                <Controller
                                    control={control}
                                    name="password"
                                    render={({ field: { onChange, value } }) => (
                                        <Input variant="rounded" size="sm" style={{ width: 310, height: 43, backgroundColor: "#FDFDFD", borderColor: "#B7B7B7", borderWidth: 1, borderRadius: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 2, elevation: 2, alignSelf: "center" }}>
                                            <HStack style={{ alignItems: "center", justifyContent: "flex-start", marginLeft: 12 }}>
                                                <InputField secureTextEntry={!showPassword} value={value} onChangeText={(text) => { onChange(text); setErrorMessage(""); }} />
                                                <Button variant="link" action="default" className="bg-transparent p-0 mr-2" onPress={() => setShowPassword(!showPassword)}>
                                                    <ButtonIcon as={showPassword ? EyeOff : Eye} className={`w-6 h-6 ${showPassword ? "text-blue-dark" : "text-grey-dark"}`} />
                                                </Button>
                                            </HStack>
                                        </Input>
                                    )}
                                />
                                <Text style={{ marginTop: 8, fontFamily: "Nunito-Regular", fontSize: 14, lineHeight: 20, color: "#5D667A", alignSelf: "flex-start", marginLeft: 4 }}>Use no mínimo 6 caracteres</Text>
                                {errors.password && (
                                    <FormControlError>
                                        <FormControlErrorIcon as={AlertCircle} />
                                        <FormControlErrorText>{errors.password.message}</FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!errors.passwordConfirm} style={{ marginTop: 16 }}>
                                <Text style={{ fontFamily: "Nunito-Bold", fontSize: 16, lineHeight: 22, color: "#173663", marginLeft: 4, marginBottom: 8 }}>Confirmar Senha</Text>
                                <Controller
                                    control={control}
                                    name="passwordConfirm"
                                    render={({ field: { onChange, value } }) => (
                                        <Input variant="rounded" size="sm" style={{ width: 310, height: 43, backgroundColor: "#FDFDFD", borderColor: "#B7B7B7", borderWidth: 1, borderRadius: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 2, elevation: 2, alignSelf: "center" }}>
                                            <HStack style={{ alignItems: "center", justifyContent: "flex-start", marginLeft: 12 }}>
                                                <InputField secureTextEntry={!showConfirmPassword} value={value} onChangeText={(text) => { onChange(text); setErrorMessage(""); }} />
                                                <Button variant="link" action="default" className="bg-transparent p-0 mr-2" onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                    <ButtonIcon as={showConfirmPassword ? EyeOff : Eye} className={`w-6 h-6 ${showConfirmPassword ? "text-blue-dark" : "text-grey-dark"}`} />
                                                </Button>
                                            </HStack>
                                        </Input>
                                    )}
                                />
                                {errors.passwordConfirm && (
                                    <FormControlError>
                                        <FormControlErrorIcon as={AlertCircle} />
                                        <FormControlErrorText>{errors.passwordConfirm.message}</FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>
                        </View>

                        {/* Bottom */}
                        <View style={{ width: "100%", alignItems: "center", paddingBottom: 8, gap: 12 }}>
                            <Text style={{ marginTop: 16, fontFamily: "Nunito-Regular", fontSize: 14, lineHeight: 20, color: "#000", width: 312, alignSelf: "center" }}>
                                Com sua conta, você poderá gerenciar sua instituição e acessar todas as funcionalidades do sistema.
                            </Text>
                            <HStack style={{ width: 312, height: 44, alignSelf: "center", marginTop: 12 }}>
                                <Checkbox value="terms" isChecked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} aria-label="terms">
                                    <CheckboxIndicator style={{ width: 16, height: 16 }}>
                                        <CheckboxIcon />
                                    </CheckboxIndicator>
                                </Checkbox>
                                <Text style={{ marginLeft: 12, flex: 1, fontFamily: "Nunito-Regular", fontSize: 14, lineHeight: 20, color: "#000" }}>
                                    Li e aceito os <Text style={{ color: "#173663", textDecorationLine: "underline", fontFamily: "Nunito-Bold" }}>Termos de Uso</Text> e a <Text style={{ color: "#173663", textDecorationLine: "underline", fontFamily: "Nunito-Bold" }}>Política de Privacidade</Text>
                                </Text>
                            </HStack>
                            <Button
                                onPress={handleSubmit(onSubmit)}
                                disabled={isLoading || !termsAccepted}
                                style={{
                                    width: 310,
                                    height: 44,
                                    borderRadius: 12,
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 10,
                                    marginTop: 16,
                                    alignSelf: "center",
                                    backgroundColor: !termsAccepted ? "#b7c4da" : "#173663",
                                }}
                            >
                                {isLoading ? <Spinner /> : <Text style={{ fontFamily: "Nunito-Bold", fontSize: 18, lineHeight: 25, color: "#FFFFFF" }}>Finalizar Cadastro</Text>}
                            </Button>
                        </View>
                    </VStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
