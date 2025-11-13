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
import { StateSelect } from '@/components/custom/StateSelect';
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
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
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
                    <VStack
                        style={{
                            flex: 1,
                            alignItems: "center",
                            paddingHorizontal: 20,
                            paddingBottom: 24,
                            paddingTop: 8,
                            gap: 16,
                        }}
                    >
                        <View style={{ width: "100%", alignItems: "center" }}>
                            <Stepper etapaAtual={2} />

                            <Text
                                style={{
                                    marginTop: 12,
                                    alignSelf: "center",
                                    fontFamily: "Nunito-Bold",
                                    fontSize: 16,
                                    lineHeight: 22,
                                    color: "#173663",
                                }}
                            >
                                Etapa 2 de 3
                            </Text>
                            <Text
                                style={{
                                    marginTop: 12,
                                    alignSelf: "center",
                                    fontFamily: "Nunito-Bold",
                                    fontSize: 26,
                                    lineHeight: 32,
                                    color: "#173663",
                                    textAlign: "center",
                                }}
                            >
                                Endereço
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
                                Informe o endereço da sua instituição
                            </Text>
                        </View>

                        <View
                            style={{
                                width: "100%",
                                maxWidth: 360,
                                alignSelf: "center",
                                gap: 14,
                            }}
                        >
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
                                    render={({
                                        field: { onChange, value },
                                    }) => (
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

                            
                            <HStack
                                className="flex-row"
                                style={{ width: "100%", gap: 12 }}
                            >
                                <FormControl isInvalid={!!errors.street} style={{ flex: 1 }}>
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
                                        Endereço
                                    </Text>
                                    <Controller
                                        control={control}
                                        name="street"
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
                                            <FormControlErrorIcon as={AlertCircle} />
                                            <FormControlErrorText>
                                                {errors.street.message}
                                            </FormControlErrorText>
                                        </FormControlError>
                                    )}
                                </FormControl>

                                <FormControl isInvalid={!!errors.numberHouse} style={{ width: "30%" }}>
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
                                        Nº
                                    </Text>
                                    <Controller
                                        control={control}
                                        name="numberHouse"
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
                                                <HStack className="items-center justify-start ml-3">
                                                    <InputField
                                                        keyboardType="number-pad"
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
                                {errors.numberHouse && (
                                    <FormControlError>
                                        <FormControlErrorIcon as={AlertCircle} />
                                        <FormControlErrorText>
                                            {errors.numberHouse.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>
                            </HStack>

                            
                            <FormControl isInvalid={!!errors.neighborhood}>
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
                                    Bairro
                                </Text>
                                <Controller
                                    control={control}
                                    name="neighborhood"
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
                                {errors.neighborhood && (
                                    <FormControlError>
                                        <FormControlErrorIcon as={AlertCircle} />
                                        <FormControlErrorText>
                                            {errors.neighborhood.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            
                            <HStack
                                className="flex-row"
                                style={{ width: "100%", gap: 12, marginBottom: 8 }}
                            >
                                <FormControl isInvalid={!!errors.city} style={{ flex: 1 }}>
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
                                            <FormControlErrorIcon as={AlertCircle} />
                                            <FormControlErrorText>
                                                {errors.city.message}
                                            </FormControlErrorText>
                                        </FormControlError>
                                    )}
                                </FormControl>

                                <FormControl isInvalid={!!errors.state} style={{ width: 85 }}>
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
                                            <StateSelect value={value} onChange={(val)=>{ onChange(val); setErrorMessage(""); }} height={43} />
                                        )}
                                    />
                                    {errors.state && (
                                        <FormControlError>
                                            <FormControlErrorIcon as={AlertCircle} />
                                            <FormControlErrorText>
                                                {errors.state.message}
                                            </FormControlErrorText>
                                        </FormControlError>
                                    )}
                                </FormControl>
                            </HStack>

                        </View>

                        <View style={{ width: "100%", alignItems: "center", gap: 12, marginTop: 4 }}>
                            
                            <Button
                                onPress={handleSubmit(onSubmit)}
                                disabled={isLoading}
                                style={{
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
                                    <Text
                                        style={{
                                            fontFamily: "Nunito-Bold",
                                            fontSize: 18,
                                            lineHeight: 25,
                                            color: "#FFFFFF",
                                        }}
                                    >
                                        Próximo
                                    </Text>
                                )}
                            </Button>

                            
                            <View style={{ alignItems: "center", gap: 8 }}>
                                <Image
                                    alt="local"
                                    style={{ width: 74, height: 42 }}
                                    source={require("@/assets/images/signin/local.png")}
                                />
                                <Text
                                    style={{
                                        fontFamily: "Nunito-Regular",
                                        fontSize: 16,
                                        lineHeight: 22,
                                        color: "#000",
                                        textAlign: "center",
                                    }}
                                >
                                    {`Digite o CEP para preencher\nos campos automaticamente`}
                                </Text>
                            </View>
                        </View>
                    </VStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

