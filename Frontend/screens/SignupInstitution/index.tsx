import { Button, ButtonIcon } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Input, InputField, InputIcon } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default () => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: "#f7f7f7" }}
            edges={["top", "left", "right", "bottom"]}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <VStack className="flex-1 items-center justify-between px-4 pb-6">
                    <VStack className="flex-1 items-start justify-start pt-8 max-h-[600px]">
                        <HStack className="w-full max-w-[280px] items-center gap-6">
                            <Image
                                size="lg"
                                source={require("/assets/images/signin/logo-voluntariei.png")}
                                alt="Logo"
                            />
                            <Text
                                size="lg"
                                className=" font-NunitoBold text-black"
                            >
                                Cadastro de Instituição
                            </Text>
                        </HStack>

                        <Text
                            size="lg"
                            className=" font-NunitoBold text-black mt-10"
                        >
                            Informações básicas:
                        </Text>

                        <Input
                            variant="rounded"
                            size="sm"
                            className="w-full max-w-[280px] h-12 bg-input-bg border border-input-border shadow-shadow rounded-[12px] mt-8"
                        >
                            <HStack className=" items-center justify-start ">
                                <InputField
                                    placeholder="Nome da Instituição"
                                    type="text"
                                    className="placeholder:text-grey-light"
                                />
                            </HStack>
                        </Input>

                        <Input
                            variant="rounded"
                            size="sm"
                            className="w-full max-w-[280px] h-12 bg-input-bg border border-input-border shadow-shadow rounded-[12px] mt-4"
                        >
                            <HStack className=" items-center justify-start">
                                <InputField
                                    placeholder="CNPJ"
                                    type="text"
                                    className="placeholder:text-grey-light"
                                />
                            </HStack>
                        </Input>

                        <Input
                            variant="rounded"
                            size="sm"
                            className="w-full max-w-[280px] h-12 bg-input-bg border border-input-border shadow-shadow rounded-[12px] mt-4"
                        >
                            <HStack className=" items-center justify-start ml-3">
                                <InputIcon
                                    as={Mail}
                                    className="w-6 h-6 text-grey-dark"
                                />
                                <InputField
                                    placeholder="E-mail"
                                    type="text"
                                    className="placeholder:text-grey-light"
                                />
                            </HStack>
                        </Input>

                        <Input
                            variant="rounded"
                            size="sm"
                            className="w-full max-w-[280px] h-12 bg-input-bg border border-input-border shadow-shadow rounded-[12px] mt-3"
                        >
                            <HStack className=" items-center justify-start ml-3">
                                <InputIcon
                                    as={Lock}
                                    className="w-6 h-6 text-grey-dark"
                                />
                                <InputField
                                    placeholder="Senha"
                                    type={showPassword ? "text" : "password"}
                                    className="placeholder:text-grey-light"
                                />
                                <Button
                                    variant="link"
                                    action="default"
                                    className="bg-transparent p-0 mr-2"
                                    onPress={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    <ButtonIcon
                                        as={showPassword ? EyeOff : Eye}
                                        className={`w-6 h-6 ${
                                            showPassword
                                                ? "text-blue-light"
                                                : "text-grey-dark"
                                        }`}
                                    />
                                </Button>
                            </HStack>
                        </Input>

                        <Input
                            variant="rounded"
                            size="sm"
                            className="w-full max-w-[280px] h-12 bg-input-bg border border-input-border shadow-shadow rounded-[12px] mt-4"
                        >
                            <HStack className=" items-center justify-start">
                                <InputField
                                    placeholder="Telefone"
                                    type="text"
                                    className="placeholder:text-grey-light"
                                />
                            </HStack>
                        </Input>
                        {/* 
                    <Text
                        size="lg"
                        className=" font-NunitoBold text-black mt-10"
                    >
                        Endereço:
                    </Text> */}
                    </VStack>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
};
