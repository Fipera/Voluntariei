import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
const InstitutionCore = {
    email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email"),
    cnpj: z.string({ required_error: "CNPJ is required" }),
    name: z.string({ required_error: "Name is required" }),
    reason: z.string({ required_error: "Reason is required" }),
    socialReason: z.string({ required_error: "Social reason is required" }),
    phoneNumber: z.string({ required_error: "Phone number is required" }),

    cep: z.string({ required_error: "Postal code is required" }),
    neighborhood: z.string({ required_error: "Neighborhood is required" }),
    city: z.string({ required_error: "City is required" }),
    state: z.string({ required_error: "State is required" }),
    numberHouse: z.string({ required_error: "House number is required" }),
    street: z.string({ required_error: "Street is required" }),
};

export const createInstitutionSchema = z.object({
    ...InstitutionCore,
    password: z.string({
        required_error: "senha é obrigatória",
        invalid_type_error: "senha inválida",
    }),
});

const createInstitutionResponseSchema = z.object({
    id: z.number(),
    ...InstitutionCore,
});

const loginInstitutionSchema = z.object({
    email: z
        .string({
            required_error: "email é obrigatório",
            invalid_type_error: "email inválido",
        })
        .email(),
    password: z.string({
        required_error: "senha é obrigatória",
        invalid_type_error: "senha inválida",
    }),
});

const loginInstitutionResponseSchema = z.object({
    accessToken: z.string(),
});


const checkUniquenessInstitutionSchema = z.object({
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  cnpj: z.string().optional(),
});

const checkUniquenessInstitutionResponseSchema = z.object({
  email: z.boolean(),
  phoneNumber: z.boolean(),
  cnpj: z.boolean(),
});

const updateInstitutionSchema = z.object({
    phoneNumber: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    reason: z.string().optional()
});

const updateInstitutionResponseSchema = z.object({
    id: z.number(),
    email: z.string(),
    name: z.string(),
    phoneNumber: z.string(),
    cnpj: z.string(),
    city: z.string(),
    state: z.string(),
    reason: z.string()
});

const registerPushTokenSchema = z.object({
    pushToken: z.string({ required_error: "Push token is required" })
});

const registerPushTokenResponseSchema = z.object({
    success: z.boolean(),
    message: z.string()
});

export type createInstitutionInput = z.infer<typeof createInstitutionSchema>;

export type LoginInstitutionInput = z.infer<typeof loginInstitutionSchema>;

export type checkUniquenessInstitutionInput = z.infer<typeof checkUniquenessInstitutionSchema>;
export type updateInstitutionInput = z.infer<typeof updateInstitutionSchema>;
export type registerPushTokenInput = z.infer<typeof registerPushTokenSchema>;

export const { schemas: institutionSchemas, $ref } = buildJsonSchemas(
    {
        createInstitutionSchema,
        createInstitutionResponseSchema,
        loginInstitutionSchema,
        loginInstitutionResponseSchema,
        checkUniquenessInstitutionSchema,
        checkUniquenessInstitutionResponseSchema,
        updateInstitutionSchema,
        updateInstitutionResponseSchema,
        registerPushTokenSchema,
        registerPushTokenResponseSchema
    },
    {
        $id: "institutionSchemas",
    }
);
