import { z } from "zod";
import {buildJsonSchemas} from 'fastify-zod'

const InstitutionCore = {
    email: z
        .string({
            required_error: "email obrigatório",
            invalid_type_error: "email inválido",
        })
        .email(),
    name: z.string({
        required_error: "nome obrigatório",
        invalid_type_error: "nome inválido",
    }),
    cnpj: z.string({
        required_error: "CNPJ obrigatório",
        invalid_type_error: "CNPJ inválido",
    }),
    phoneNumber: z.string({
        required_error: "telefone obrigatório",
    }),
    address: z.object({
       cep: z.number({
        required_error: "cep obrigatório",
       }),
       state: z.string({
        required_error: "estado obrigatório",
       }),
       city: z.string({
        required_error: "cidade obrigatório",
       }),
       road: z.string({
        required_error: "rua obrigatório",
       }),
       neighborhood: z.string({
        required_error: "bairro obrigatório",
       }),
       number: z.number({
        required_error: "numero obrigatório",
       }),
    })
};

const createInstitutionSchema = z.object({
    ...InstitutionCore,
    password: z.string({
        required_error: "senha é obrigatória",
        invalid_type_error: "senha inválida",
    }),
});

const createInstitutionResponseSchema = z.object({
    id: z.number(),
    ...InstitutionCore
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
})



const loginInstitutionResponseSchema = z.object({
   accessToken: z.string()
})



export type createInstitutionInput = z.infer<typeof createInstitutionSchema>;

export type LoginInstitutionInput = z.infer<typeof loginInstitutionSchema>;

export const {schemas: institutionSchemas, $ref} = buildJsonSchemas({
    createInstitutionSchema,
    createInstitutionResponseSchema,
    loginInstitutionSchema,
    loginInstitutionResponseSchema
}, {
    $id: "institutionSchemas"
})