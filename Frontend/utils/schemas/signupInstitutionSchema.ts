import { z } from "zod";

export const signupInstitutionSchema = z.object({

  // Somente números

  cnpj: z.string({ required_error: "O CNPJ é obrigatório" })
    .regex(/^\d{14}$/, "CNPJ deve conter exatamente 14 números"),

  telefone: z.string({ required_error: "O telefone é obrigatório" })
    .regex(/^\d{10,11}$/, "Telefone deve conter 10 ou 11 números"),

  cep: z.string({ required_error: "O CEP é obrigatório" })
    .regex(/^\d{8}$/, "CEP deve conter exatamente 8 números"),

  numero: z.string({ required_error: "O número é obrigatório" })
    .regex(/^\d+$/, "Número deve conter apenas dígitos"),

  // Somente texto 
  nome: z.string({ required_error: "O nome é obrigatório" })
    .min(2, "Nome muito curto")
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, "O nome não pode conter números ou símbolos"),

  bairro: z.string({ required_error: "O bairro é obrigatório" })
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, "O bairro não pode conter números ou símbolos"),

  cidade: z.string({ required_error: "A cidade é obrigatória" })
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, "A cidade não pode conter números ou símbolos"),

  estado: z.string({ required_error: "O estado é obrigatório" })
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, "O estado não pode conter números ou símbolos"),

  // Texto livre
  razaoSocial: z.string({ required_error: "A razão social é obrigatória" })
    .min(3, "Razão social muito curta"),

  causa: z.string({ required_error: "A causa é obrigatória" })
    .min(3, "Causa muito curta"),

  rua: z.string({ required_error: "O endereço é obrigatório" }),

  email: z.string({ required_error: "O e-mail é obrigatório" })
    .email("E-mail inválido"),

  senha: z.string({ required_error: "A senha é obrigatória" })
    .min(6, "A senha deve ter pelo menos 6 caracteres"),

  confirmarSenha: z.string({ required_error: "A confirmação de senha é obrigatória" }),
});


export const signupInstitutionFirstStageSchema = signupInstitutionSchema.pick({
    cnpj: true,
    razaoSocial: true,
    nome: true,
    telefone: true,
    causa: true,
});

export const signupInstitutionSecondStageSchema = signupInstitutionSchema.pick({
    cep: true,
    rua: true,
    bairro: true,
    numero: true,
    cidade: true,
    estado: true,
});

export const signupInstitutionThirdStageSchema = signupInstitutionSchema
    .pick({
        email: true,
        senha: true,
        confirmarSenha: true,
    })
    .refine((data) => data.senha === data.confirmarSenha, {
        path: ["confirmarSenha"],
        message: "As senhas não coincidem",
    });

export type SignupInstitutionFirstStageData = z.infer<
    typeof signupInstitutionFirstStageSchema
>;

export type SignupInstitutionSecondStageData = z.infer<
    typeof signupInstitutionSecondStageSchema
>;

export type SignupInstitutionThirdStageData = z.infer<
    typeof signupInstitutionThirdStageSchema
>;
