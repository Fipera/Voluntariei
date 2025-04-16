import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const voluntaryCore = {

    email: z.string({
        required_error: 'Email Obrigatório',
        invalid_type_error: 'Email Inválido'
    }),
    name: z.string({
        required_error: 'Email Obrigatório',
        invalid_type_error: 'Email Inválido'
    }),
    password: z.string({
        required_error: 'Email Obrigatório',
        invalid_type_error: 'Email Inválido'
    }),
    phoneNumber: z.string({
        required_error: 'Celular Obrigatório',
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
}

const createVoluntarySchema = z.object({
    ...voluntaryCore,
    password: z.string({
        required_error: "senha é obrigatória",
        invalid_type_error: "senha inválida",
    }),
});

const createVoluntaryResponseSchema = z.object({
    id: z.number(),
    ...voluntaryCore
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
})



const loginVoluntaryResponseSchema = z.object({
   accessToken: z.string()
})



export type createVoluntaryInput = z.infer<typeof createVoluntarySchema>;
export type loginVoluntaryInput = z.infer<typeof loginVoluntarySchema>;

export const {schemas: voluntarySchemas, $ref} = buildJsonSchemas({
    createVoluntarySchema,
    createVoluntaryResponseSchema,
    loginVoluntarySchema,
    loginVoluntaryResponseSchema,

}, {
     $id: "voluntarySchemas"
})