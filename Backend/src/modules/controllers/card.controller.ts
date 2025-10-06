import { FastifyReply, FastifyRequest } from "fastify";
import { createCard } from "../services/card.service";
import { findCardsByOwner, findCardsForVoluntary, findCardByIdForOwner, cancelCard } from "../services/card.service";
import { createCardSchema, createCardInput } from "../schemas/card.schema";

export async function createCardHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body: Record<string, any> = request.body as Record<string, any>;

  try {
    if (typeof body.skills === "string") {
      try {
        body.skills = JSON.parse(body.skills);
      } catch {
        body.skills = [];
      }
    }

    const parsed: createCardInput = createCardSchema.parse(body);

    const card = await createCard((request as any).user.id, parsed);

    return reply.code(201).send({
      id: card.id,
      title: card.title,
      description: card.description ?? undefined,
      startAt: card.startAt,
      endAt: card.endAt,
      isOnline: card.isOnline,
      maxVolunteers: card.maxVolunteers,
      status: card.status,
      banner: card.banner ?? undefined,
      skills: card.skills.map((s) => s.name),
      city: card.city ?? undefined,
      state: card.state ?? undefined,
    });
  } catch (err) {
    return reply
      .status(400)
      .send({ error: "Erro ao criar oportunidade", details: err });
  }
}

export async function getMyCardsHandler(request: any){
  const cards = await findCardsByOwner(request.user.id);
  return cards.map((c)=> ({
    id: c.id,
    title: c.title,
    description: c.description ?? undefined,
    banner: c.banner ?? undefined,
    startAt: c.startAt,
    endAt: c.endAt,
    isOnline: c.isOnline,
    city: c.city ?? undefined,
    state: c.state ?? undefined,
    maxVolunteers: c.maxVolunteers,
    status: c.status,
    skills: c.skills.map(s=>s.name),
    participantsCount: c.participants.length
  }))
}

export async function getFeedCardsHandler(request: any){
  const cards = await findCardsForVoluntary(request.user.id);
  return cards.map((c)=> ({
    id: c.id,
    title: c.title,
    description: c.description ?? undefined,
    banner: c.banner ?? undefined,
    startAt: c.startAt,
    endAt: c.endAt,
    isOnline: c.isOnline,
    city: c.city ?? c.owner?.city ?? undefined,
    state: c.state ?? c.owner?.state ?? undefined,
    maxVolunteers: c.maxVolunteers,
    status: c.status,
    skills: c.skills.map(s=>s.name),
    institution: c.owner?.name
  }))
}

export async function getMyCardDetailHandler(request: any, reply: FastifyReply){
  const id = Number((request.params as any)?.id);
  if (!id) return reply.code(400).send({ message: 'id inválido' });
  const c = await findCardByIdForOwner(id, request.user.id);
  if (!c) return reply.code(404).send({ message: 'Card não encontrado' });
  return {
    id: c.id,
    title: c.title,
    description: c.description ?? undefined,
    banner: c.banner ?? undefined,
    startAt: c.startAt,
    endAt: c.endAt,
  createdAt: c.createAt,
    isOnline: c.isOnline,
    cep: c.cep ?? undefined,
    neighborhood: c.neighborhood ?? undefined,
    city: c.city ?? undefined,
    state: c.state ?? undefined,
    numberHouse: c.numberHouse ?? undefined,
    street: c.street ?? undefined,
    complement: c.complement ?? undefined,
    locationNote: c.locationNote ?? undefined,
    maxVolunteers: c.maxVolunteers,
    status: c.status,
    skills: c.skills.map(s=>s.name),
    participants: c.participants.map(p=>({
      id: p.id,
      status: p.status,
      observation: p.observation ?? undefined,
      voluntary: p.voluntary
    }))
  }
}

export async function cancelCardHandler(request: any, reply: FastifyReply){
  const id = Number((request.params as any)?.id);
  if (!id) return reply.code(400).send({ message: 'id inválido' });
  const updated = await cancelCard(id, request.user.id);
  if(!updated) return reply.code(404).send({ message: 'Card não encontrado' });
  return reply.send({ id: updated.id, status: updated.status });
}
