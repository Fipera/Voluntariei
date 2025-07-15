import { z } from "zod";

export const signupVoluntarySchema = z.object({
    // Somente números

    phoneNumber: z
        .string({ required_error: "O telefone é obrigatório" })
        .regex(/^\d{10,11}$/, "Telefone deve conter 10 ou 11 números"),

    cep: z
        .string({ required_error: "O CEP é obrigatório" })
        .regex(/^\d{8}$/, "CEP deve conter exatamente 8 números"),

    // Somente texto
    name: z
        .string({ required_error: "O nome é obrigatório" })
        .min(2, "Nome muito curto")
        .regex(
            /^[A-Za-zÀ-ÿ\s]+$/,
            "O nome não pode conter números ou símbolos"
        ),

    city: z
        .string({ required_error: "A cidade é obrigatória" })
        .regex(
            /^[A-Za-zÀ-ÿ\s]+$/,
            "A cidade não pode conter números ou símbolos"
        ),

    state: z
        .string({ required_error: "O estado é obrigatório" })
        .regex(
            /^[A-Za-zÀ-ÿ\s]+$/,
            "O estado não pode conter números ou símbolos"
        ),

    email: z
        .string({ required_error: "O e-mail é obrigatório" })
        .email("E-mail inválido"),

    password: z
        .string({ required_error: "A senha é obrigatória" })
        .min(6, "A senha deve ter pelo menos 6 caracteres"),

    passwordConfirm: z.string({
        required_error: "A confirmação de senha é obrigatória",
    }),

    skills: z.array(z.string()).min(1, "Selecione pelo menos uma habilidade"),
});

export const signupVoluntaryFirstStageSchema = signupVoluntarySchema.pick({
    name: true,
    phoneNumber: true,
    cep: true,
    city: true,
    state: true,
});

export const signupVoluntarySecondStageSchema = signupVoluntarySchema.pick({
    skills: true,
});

export const signupVoluntaryThirdStageSchema = signupVoluntarySchema
    .pick({
        email: true,
        password: true,
        passwordConfirm: true,
    })
    .refine((data) => data.password === data.passwordConfirm, {
        path: ["passwordConfirm"],
        message: "As senhas não coincidem",
    });

export type SignupVoluntaryFirstStageData = z.infer<
    typeof signupVoluntaryFirstStageSchema
>;

export type SignupVoluntarySecondStageData = z.infer<
    typeof signupVoluntarySecondStageSchema
>;

export type SignupVoluntaryThirdStageData = z.infer<
    typeof signupVoluntaryThirdStageSchema
>;
