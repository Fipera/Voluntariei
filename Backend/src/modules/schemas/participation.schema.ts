import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const applyToCardSchema = z.object({
  observation: z.string().max(500, "Mensagem muito longa").optional(),
});

const updateParticipationStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "REJECTED"], {
    required_error: "Status é obrigatório",
    invalid_type_error: "Status deve ser CONFIRMED ou REJECTED"
  }),
});

export type applyToCardInput = z.infer<typeof applyToCardSchema>;
export type updateParticipationStatusInput = z.infer<typeof updateParticipationStatusSchema>;

export const { schemas: participationSchemas, $ref } = buildJsonSchemas(
  {
    applyToCardSchema,
    updateParticipationStatusSchema,
  },
  { $id: "ParticipationSchema" }
);
