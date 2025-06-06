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
import api from "@/services/api";
import { useSignupInstitutionStore } from "@/store/useSignupInstitutionStore";
import { AppError } from "@/utils/AppError";
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
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
type PhotoFile = {
    uri: string;
    name: string;
    type: string;
};

export function SignupInstitutionThirdStage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { data, updateData, clearData } = useSignupInstitutionStore();
    const [userPhoto, setUserPhoto] = useState<PhotoFile | null>(null);

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<SignupInstitutionThirdStageData>({
        resolver: zodResolver(signupInstitutionThirdStageSchema),
    });

    const checkUniqueness = async (
        formData: SignupInstitutionThirdStageData
    ) => {
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

    const selectUserPhoto = async () => {
        const photoSelected = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 1,
            aspect: [4, 4],
            allowsEditing: true,
        });

        if (photoSelected.canceled) {
            return;
        }

        const photoURI = photoSelected.assets[0].uri;
        const timestamp = new Date().getTime();

        if (photoURI) {
            const photoInfo = (await FileSystem.getInfoAsync(photoURI)) as {
                size: number;
            };

            if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
                return Alert.alert("Imagem muito grande.");
            }

            const fileExtension = photoURI.split(".").pop();

            const photoFile = {
                uri: photoURI,
                name: `photo_${timestamp}.${fileExtension}`,
                type: `image/${fileExtension}`,
            };
            setUserPhoto(photoFile);
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
            setError("email", {
                type: "manual",
                message: "Email já cadastrado",
            });

            setIsLoading(false);
            return;
        }

        const fullData = { ...data, ...formData };
        const form = new FormData();
        if (userPhoto) {
            form.append("logo", userPhoto as any);
        }

        Object.entries(fullData).forEach(([key, value]) => {
            if (value !== undefined) {
                form.append(key, value);
            }
        });
        console.log(form);

        try {
            setIsLoading(true);
            const response = await api.post("/institution", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

           

            setIsLoading(false);
            clearData();
            router.push("/(institution)");
        } catch (error) {
            console.log("Erro completo:", error);
            setIsLoading(false);

            const isAppError = error instanceof AppError;
            const messageError = isAppError
                ? error.message
                : "Não foi possível fazer cadastro. Tente novamente mais tarde.";

            setErrorMessage(messageError);
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
                            <Stepper etapaAtual={3} />

                            <Text
                                size="xl"
                                className="font-PoppinsBold text-blue-dark text-center mt-6"
                            >
                                Etapa 3 de 3
                            </Text>

                            <Button
                                variant="link"
                                action="default"
                                className="bg-transparent p-0 mt-16 mb-16"
                                onPress={selectUserPhoto}
                            >
                                <Avatar
                                    size="2xl"
                                    className="bg-black overflow-hidden"
                                >
                                    {userPhoto ? (
                                        <Image
                                            source={{ uri: userPhoto.uri }}
                                            alt="Logo da instituição"
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <Icon
                                            as={AddIcon}
                                            size="xl2"
                                            className="stroke-white"
                                        />
                                    )}
                                </Avatar>
                            </Button>

                            <Text
                                size="md"
                                className="font-PoppinsBold text-blue-dark text-center mt-6"
                            >
                                {data.name}
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
                                isInvalid={!!errors.password}
                                className="mt-3"
                            >
                                <Text className="text-sm text-blue-dark font-PoppinsBold mt- ml-1">
                                    Senha
                                </Text>
                                <Controller
                                    control={control}
                                    name="password"
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
                                {errors.password && (
                                    <FormControlError>
                                        <FormControlErrorIcon
                                            as={AlertCircle}
                                        />
                                        <FormControlErrorText>
                                            {errors.password.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl
                                isInvalid={!!errors.passwordConfirm}
                                className="mt-3"
                            >
                                <Text className="text-sm text-blue-dark font-PoppinsBold mt- ml-1">
                                    Confirmar Senha
                                </Text>
                                <Controller
                                    control={control}
                                    name="passwordConfirm"
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
                                {errors.passwordConfirm && (
                                    <FormControlError>
                                        <FormControlErrorIcon
                                            as={AlertCircle}
                                        />
                                        <FormControlErrorText>
                                            {errors.passwordConfirm.message}
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
