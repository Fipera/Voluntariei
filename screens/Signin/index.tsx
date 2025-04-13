import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { MaterialIcons } from '@expo/vector-icons';

export default () => {
    return (
        <VStack className="mt-16 items-center justify-center ">
            <Image
                size="xl"
                source={require("/assets/images/signin/logo-voluntariei.png")}
                alt="Logo"
            />

            <Text className="font-bold text-center mt-16">
                Acesse sua conta
            </Text>

            <Input
                variant="rounded"
                size="sm"
                className="w-full max-w-[280px] h-12 bg-input-bg border border-input-border shadow-shadow rounded-[12px] mt-4"
            >
                <InputField  className="px-4 py-3 placeholder:text-black" placeholder="e-mail:" type="text" />
            </Input>

            <Input
                variant="rounded"
                size="sm"
                className="w-full max-w-[280px] h-12 bg-input-bg border border-input-border shadow-shadow rounded-[12px] mt-3"
            >
                <InputField className="px-4 py-3 placeholder:text-black" placeholder="senha:" type="password" />
            </Input>

            <HStack className="w-full justify-end mr-16">
                <Button variant="link" action="default" size="xs">
                    <ButtonText className="text-black text-xs font-light">
                        Esqueceu a senha?
                    </ButtonText>
                </Button>
            </HStack>

            <Button variant="outline" className="min-w-[140px] max-w-[200px] h-[44px] bg-button-bg rounded-[20px] shadow-shadow flex-row items-center justify-center mt-4">
                <Text className="text-white font-semibold">Entrar</Text>
            </Button>

            <HStack className="items-center justify-center mt-8 ">
                <Text size="sm" className="text-button-bg font-semibold">
                    Ainda não possui uma conta?
                </Text>

                <Button variant="link" action="default" className="p-2 m-0">
                    <ButtonText
                        size="sm"
                        className="text-button-bg font-semibold underline"
                    >
                        Cadastra-se!
                    </ButtonText>
                </Button>
            </HStack>

            <HStack className="items-center justify-center mt-10">
                <MaterialIcons name="lightbulb" size={14} color="#FACC15" />
                <Text size="sm"> Que tal fazer a diferença hoje?</Text>
            </HStack>
        </VStack>
    );
};
