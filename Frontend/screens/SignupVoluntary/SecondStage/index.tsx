import Stepper from "@/components/custom/stepper";
import { SkillGroupAccordion } from "@/components/custom/voluntaryskills/skillgroupdropdown";
import { Accordion } from "@/components/ui/accordion";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import {
    Checkbox,
    CheckboxIcon,
    CheckboxIndicator,
    CheckboxLabel,
} from "@/components/ui/checkbox";
import { Divider } from "@/components/ui/divider";
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
import { useSignupVoluntaryStore } from "@/store/useSignupVoluntaryStore";
import { formatarCEP } from "@/utils/formatters/format";
import { SigninFormData, signinSchema } from "@/utils/schemas/signinSchema";
import {
    SignupVoluntarySecondStageData,
    signupVoluntarySecondStageSchema,
} from "@/utils/schemas/signupVoluntarySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import {
    AlertCircle,
    ArrowDown,
    ArrowRight,
    CheckIcon,
    Eye,
    EyeOff,
    Lock,
    Mail,
    MinusIcon,
    PlusIcon,
} from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function SignupVoluntarySecondStage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const { updateData } = useSignupVoluntaryStore();
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<SignupVoluntarySecondStageData>({
        resolver: zodResolver(signupVoluntarySecondStageSchema),
    });

    setValue("skills", selectedSkills);

    const onSubmit = (formData: SignupVoluntarySecondStageData) => {
        console.log("Form válido:", formData);
        updateData(formData);
        router.push("/signupVoluntaryThirdStage");
    };

    const toggleSkill = (option: string) => {
        setSelectedSkills((prev) =>
            prev.includes(option)
                ? prev.filter((item) => item !== option)
                : [...prev, option]
        );
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
                                Habilidades
                            </Text>
                            <Text
                                size="md"
                                className="font-PoppinsBold text-grey-light text-center mt-10"
                            >
                                Conte com o que você pode contribuir e {"\n"}{" "}
                                nós conectamos você com a causa certa.
                            </Text>

                            <Accordion className="m-10 bg-transparent">
                                {/* 📘 EDUCAÇÃO */}
                                <SkillGroupAccordion
                                    title="📘 Educação"
                                    value="item-1"
                                    selectedSkills={selectedSkills}
                                    toggleSkill={toggleSkill}
                                    skills={[
                                        {
                                            value: "educacao-reforco-escolar",
                                            label: "Reforço escolar",
                                        },
                                        {
                                            value: "educacao-alfabetizacao-adultos",
                                            label: "Alfabetização de adultos",
                                        },
                                        {
                                            value: "educacao-informatica-basica",
                                            label: "Aulas de informática básica",
                                        },
                                        {
                                            value: "educacao-idiomas",
                                            label: "Ensino de idiomas",
                                        },
                                        {
                                            value: "educacao-orientacao-profissional",
                                            label: "Orientação profissional",
                                        },
                                    ]}
                                />

                                {/* ❤ SAÚDE */}
                                <SkillGroupAccordion
                                    title="❤ Saúde"
                                    value="item-2"
                                    selectedSkills={selectedSkills}
                                    toggleSkill={toggleSkill}
                                    skills={[
                                        {
                                            value: "saude-primeiros-socorros",
                                            label: "Primeiros socorros",
                                        },
                                        {
                                            value: "saude-cuidados-idosos",
                                            label: "Cuidados com idosos",
                                        },
                                        {
                                            value: "saude-pessoas-deficiencia",
                                            label: "Apoio a pessoas com deficiência",
                                        },
                                        {
                                            value: "saude-educacao-nutricional",
                                            label: "Educação nutricional",
                                        },
                                        {
                                            value: "saude-campanha-sangue",
                                            label: "Campanhas de doação de sangue",
                                        },
                                    ]}
                                />

                                {/* 🎭 CULTURA E ARTE */}
                                <SkillGroupAccordion
                                    title="🎭 Cultura e Arte"
                                    value="item-3"
                                    selectedSkills={selectedSkills}
                                    toggleSkill={toggleSkill}
                                    skills={[
                                        {
                                            value: "arte-musica",
                                            label: "Música (instrumental ou canto)",
                                        },
                                        {
                                            value: "arte-teatro-danca",
                                            label: "Teatro e dança",
                                        },
                                        {
                                            value: "arte-foto-video",
                                            label: "Fotografia e vídeo",
                                        },
                                        {
                                            value: "arte-artes-plasticas",
                                            label: "Artes plásticas e artesanato",
                                        },
                                        {
                                            value: "arte-producao-eventos",
                                            label: "Produção cultural em eventos",
                                        },
                                    ]}
                                />

                                {/* 🛠 CONSTRUÇÃO */}
                                <SkillGroupAccordion
                                    title="🛠 Construção"
                                    value="item-4"
                                    selectedSkills={selectedSkills}
                                    toggleSkill={toggleSkill}
                                    skills={[
                                        {
                                            value: "construcao-pintura",
                                            label: "Pintura e acabamento",
                                        },
                                        {
                                            value: "construcao-marcenaria",
                                            label: "Marcenaria / carpintaria",
                                        },
                                        {
                                            value: "construcao-eletrica",
                                            label: "Reparos elétricos",
                                        },
                                        {
                                            value: "construcao-alvenaria",
                                            label: "Alvenaria e manutenção geral",
                                        },
                                        {
                                            value: "construcao-jardinagem",
                                            label: "Jardinagem e paisagismo",
                                        },
                                    ]}
                                />

                                {/* 🤝 APOIO SOCIAL */}
                                <SkillGroupAccordion
                                    title="🤝 Apoio Social"
                                    value="item-5"
                                    selectedSkills={selectedSkills}
                                    toggleSkill={toggleSkill}
                                    skills={[
                                        {
                                            value: "social-distribuicao-alimentos",
                                            label: "Distribuição de alimentos/roupas",
                                        },
                                        {
                                            value: "social-logistica-eventos",
                                            label: "Organização logística de eventos",
                                        },
                                        {
                                            value: "social-recepcao-acolhimento",
                                            label: "Recepção e acolhimento ao público",
                                        },
                                        {
                                            value: "social-fundraising",
                                            label: "Captação de recursos",
                                        },
                                        {
                                            value: "social-midias-sociais",
                                            label: "Gestão de mídias sociais",
                                        },
                                    ]}
                                />
                            </Accordion>
                            <Button
                                onPress={handleSubmit(onSubmit)}
                                disabled={selectedSkills.length === 0}
                                className={`min-w-[300px] max-w-[350px] h-[44px] rounded-[12px] shadow-shadow flex-row items-center justify-center mt-12 ${
                                    selectedSkills.length === 0
                                        ? "bg-gray-300"
                                        : "bg-blue-dark"
                                }`}
                            >
                                {isLoading ? (
                                    <Spinner />
                                ) : (
                                    <Text
                                        className={`font-InterBold ${
                                            selectedSkills.length === 0
                                                ? "text-gray-500"
                                                : "text-white"
                                        }`}
                                    >
                                        Próximo
                                    </Text>
                                )}
                            </Button>

                            {selectedSkills.length > 0 && (
                                <Text className="text-blue-dark mt-4">
                                    Selected: {selectedSkills.join(", ")}
                                </Text>
                            )}
                        </VStack>
                    </VStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
