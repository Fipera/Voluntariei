import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const VoluntaryCore = {
    email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email"),

    name: z.string({ required_error: "Name is required" }),

    phoneNumber: z
        .string({ required_error: "Phone number is required" })
        .regex(/^\d{10,11}$/, "Phone number must have 10 or 11 digits"),

    cep: z
        .string({ required_error: "Postal code is required" })
        .regex(/^\d{8}$/, "Postal code must have exactly 8 digits"),

    city: z
        .string({ required_error: "City is required" })
        .regex(/^[A-Za-zÀ-ÿ\s]+$/, "City cannot contain numbers or symbols"),

    state: z
        .string({ required_error: "State is required" })
        .regex(/^[A-Za-zÀ-ÿ\s]+$/, "State cannot contain numbers or symbols"),

    skills: z.array(z.string()).min(1, "Select at least one skill"),
};

export const createVoluntarySchema = z.object({
    ...VoluntaryCore,
    password: z.string({
        required_error: "senha é obrigatória",
        invalid_type_error: "senha inválida",
    }),
});

const createVoluntaryResponseSchema = z.object({
    id: z.number(),
    ...VoluntaryCore,
});

const loginVoluntarySchema = z.object({
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

const loginVoluntaryResponseSchema = z.object({
    accessToken: z.string(),
});

const checkUniquenessVoluntarySchema = z.object({
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
});

const checkUniquenessVoluntaryResponseSchema = z.object({
    email: z.boolean(),
    phoneNumber: z.boolean(),
});

const updateVoluntarySchema = z.object({
    phoneNumber: z.string().regex(/^\d{10,11}$/).optional(),
    city: z.string().regex(/^[A-Za-zÀ-ÿ\s]+$/).optional(),
    state: z.string().regex(/^[A-Za-zÀ-ÿ\s]+$/).optional(),
    skills: z.array(z.string()).optional()
});

const updateVoluntaryResponseSchema = z.object({
    id: z.number(),
    email: z.string(),
    name: z.string(),
    phoneNumber: z.string(),
    cep: z.string(),
    city: z.string(),
    state: z.string(),
    skills: z.array(z.string())
});

export type createVoluntaryInput = z.infer<typeof createVoluntarySchema>;
export type loginVoluntaryInput = z.infer<typeof loginVoluntarySchema>;
export type checkUniquenessVoluntaryInput = z.infer<
    typeof checkUniquenessVoluntarySchema
>;
export type updateVoluntaryInput = z.infer<typeof updateVoluntarySchema>;

export const { schemas: voluntarySchemas, $ref } = buildJsonSchemas(
    {
        createVoluntarySchema,
        createVoluntaryResponseSchema,
        loginVoluntarySchema,
        loginVoluntaryResponseSchema,
        checkUniquenessVoluntarySchema,
        checkUniquenessVoluntaryResponseSchema,
        updateVoluntarySchema,
        updateVoluntaryResponseSchema
    },
    {
        $id: "voluntarySchemas",
    }
);
