import { z } from 'zod';

export const signinSchema = z.object({
  email: z
    .string({ required_error: "O e-mail é obrigatório" })
    .email("E-mail inválido"),

  password: z
    .string({ required_error: "A senha é obrigatória" })
});

export type SigninFormData = z.infer<typeof signinSchema>;