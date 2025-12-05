import Stepper from "@/components/custom/stepper";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";

import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useSignupVoluntaryStore } from "@/store/useSignupVoluntaryStore";
import { SignupVoluntarySecondStageData, signupVoluntarySecondStageSchema } from "@/utils/schemas/signupVoluntarySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { AlertCircle, Check } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SKILL_GROUPS } from '@/utils/constants/voluntarySkills';
import { SKILL_IMAGE_MAP, DEFAULT_SKILL_IMAGE } from '@/utils/constants/voluntarySkillImages';
import SkillIcon from '@/components/custom/voluntaryskills/SkillIcon';

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

    // Keep RHF value in sync with UI state
    useEffect(() => {
        setValue("skills", selectedSkills, { shouldValidate: true, shouldDirty: true });
    }, [selectedSkills, setValue]);

    const onSubmit = (formData: SignupVoluntarySecondStageData) => {
        const payload: SignupVoluntarySecondStageData = {
            ...formData,
            // Ensure we persist the latest UI state
            skills: selectedSkills,
        };
        console.log("Form válido:", payload);
        updateData(payload);
        router.push("/signupVoluntaryThirdStage");
    };

    const MAX_SKILLS = 5;

    const toggleSkill = (option: string) => {
        setSelectedSkills((prev) => {
            const exists = prev.includes(option);
            if (exists) return prev.filter((i) => i !== option);
            if (prev.length >= MAX_SKILLS) return prev;
            return [...prev, option];
        });
    };

    const skillGroups: { key: string; icon: string; title: string; skills: { value: string; label: string; image?: any }[] }[] = SKILL_GROUPS;

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
                    <VStack className="flex-1 items-center px-4 pb-6">
                        <Stepper etapaAtual={2} />
                        <Text className="font-NunitoBold text-[16px] leading-[22px] text-[#173663] mt-4">Etapa 2 de 3</Text>
                        <Text className="font-NunitoBold text-[28px] leading-[38px] text-[#173663] mt-6">Habilidades</Text>
                        <Text className="font-NunitoRegular text-[16px] leading-[22px] text-black text-center w-[310px] mt-4">
                            Selecione até 5 áreas em que deseja atuar. Assim poderemos indicar demanda de voluntariado alinhadas ao seu perfil.
                        </Text>
                        <View style={{ width: '100%', marginTop: 32, gap: 40 }}>
                            {skillGroups.map(group => (
                                <VStack key={group.key} className="w-full">
                                    <HStack className="items-center mb-4 px-1" style={{ gap: 8 }}>
                                        <Text className="text-[20px]">{group.icon}</Text>
                                        <Text className="font-NunitoBold text-[20px] leading-[27px] text-[#173663]">{group.title}</Text>
                                    </HStack>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
                                        <HStack style={{ gap: 20 }}>
                                            {group.skills.map(skill => {
                                                const active = selectedSkills.includes(skill.value);
                                                const imgSrc = SKILL_IMAGE_MAP[skill.value] || DEFAULT_SKILL_IMAGE;
                                                return (
                                                    <VStack key={skill.value} className="items-center" style={{ width: 82 }}>
                                                        <Pressable onPress={() => toggleSkill(skill.value)} style={{ alignItems: 'center' }}>
                                                            <View style={{ position: 'relative' }}>
                                                                <SkillIcon source={imgSrc} size={82} />
                                                                {active && (
                                                                    <View style={{ position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(23,54,99,0.55)', justifyContent:'center', alignItems:'center', borderRadius:41 }}>
                                                                        <Check size={32} color="#fff" strokeWidth={3} />
                                                                    </View>
                                                                )}
                                                            </View>
                                                        </Pressable>
                                                        <Text className="font-NunitoRegular text-[12px] leading-[16px] text-black text-center mt-1" numberOfLines={2}>
                                                            {skill.label}
                                                        </Text>
                                                    </VStack>
                                                );
                                            })}
                                        </HStack>
                                    </ScrollView>
                                </VStack>
                            ))}
                        </View>
                        <Text className="font-NunitoBold text-[14px] mt-8 text-[#173663]">{selectedSkills.length}/{5} selecionadas</Text>
                        <Button
                            onPress={handleSubmit(onSubmit)}
                            disabled={selectedSkills.length === 0}
                            className={`min-w-[300px] max-w-[350px] h-[44px] rounded-[12px] shadow-shadow flex-row items-center justify-center mt-4 ${selectedSkills.length === 0 ? 'bg-gray-300' : 'bg-blue-dark'}`}
                        >
                            {isLoading ? <Spinner /> : (
                                <Text className={`font-InterBold ${selectedSkills.length === 0 ? 'text-gray-500' : 'text-white'}`}>Próximo</Text>
                            )}
                        </Button>
                        {selectedSkills.length >= MAX_SKILLS && (
                            <Text className="text-red-500 text-[12px] mt-2">Limite máximo alcançado.</Text>
                        )}
                    </VStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
