import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const coreAddress = {
  cep: z.string().regex(/^\d{8}$/).optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  numberHouse: z.string().optional(),
  street: z.string().optional(),
  complement: z.string().optional(),
  locationNote: z.string().optional(),
};

export const createCardSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startAt: z.string().datetime(),
  duration: z.number().int().min(1).max(1439, "Duração não pode exceder 23h59m (1439 minutos)"),
  isOnline: z.boolean().default(false),
  maxVolunteers: z.number().int().min(1),
  skills: z.array(z.string()).min(1),
  useInstitutionAddress: z.boolean().optional(),
  banner: z.string().optional(),
  ...coreAddress,
});

const createCardResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable().optional(),
  startAt: z.string(),
  duration: z.number(),
  isOnline: z.boolean(),
  maxVolunteers: z.number(),
  status: z.string(),
  skills: z.array(z.string()),
  banner: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
});

export type createCardInput = z.infer<typeof createCardSchema>;

export const { schemas: cardSchemas, $ref } = buildJsonSchemas(
  { createCardSchema, createCardResponseSchema },
  { $id: "cardSchemas" }
);
