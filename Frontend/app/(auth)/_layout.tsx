import { Stack } from "expo-router";

export default () => {
    return (
    <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="signin" />
        <Stack.Screen name="signupInstitutionFirstStage" />
        <Stack.Screen name="signupInstitutionSecondStage" />
        <Stack.Screen name="signupInstitutionThirdStage" />

    </Stack>
    )
}