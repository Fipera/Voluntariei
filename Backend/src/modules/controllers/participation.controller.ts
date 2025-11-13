import { FastifyReply, FastifyRequest } from "fastify";
import { applyToCard, updateParticipationStatus, getVoluntaryParticipations, getVoluntaryUpcomingCommitments, getVoluntaryHistory } from "../services/participation.service";
import { applyToCardInput } from "../schemas/participation.schema";
import { finalizeExpiredCards } from "../services/card.service";

export async function applyToCardHandler(request: any, reply: FastifyReply) {
  const cardId = Number((request.params as any)?.id);
  const body = request.body as applyToCardInput;

  if (!cardId) {
    return reply.code(400).send({ message: "ID do card inválido" });
  }

  try {
    const participation = await applyToCard(request.user.id, cardId, body);

    return reply.code(201).send({
      id: participation.id,
      status: participation.status,
      observation: participation.observation ?? undefined,
      voluntary: participation.voluntary,
      card: participation.card,
    });
  } catch (err: any) {
    return reply.code(400).send({ message: err.message || "Erro ao se candidatar" });
  }
}

export async function approveParticipationHandler(request: any, reply: FastifyReply) {
  const participationId = Number((request.params as any)?.id);

  if (!participationId) {
    return reply.code(400).send({ message: "ID da inscrição inválido" });
  }

  try {
    const participation = await updateParticipationStatus(
      participationId,
      request.user.id,
      "CONFIRMED"
    );

    return reply.send({
      id: participation.id,
      status: participation.status,
      observation: participation.observation ?? undefined,
      voluntary: participation.voluntary,
      card: participation.card,
    });
  } catch (err: any) {
    return reply.code(400).send({ message: err.message || "Erro ao aprovar inscrição" });
  }
}

export async function rejectParticipationHandler(request: any, reply: FastifyReply) {
  const participationId = Number((request.params as any)?.id);

  if (!participationId) {
    return reply.code(400).send({ message: "ID da inscrição inválido" });
  }

  try {
    const participation = await updateParticipationStatus(
      participationId,
      request.user.id,
      "REJECTED"
    );

    return reply.send({
      id: participation.id,
      status: participation.status,
      observation: participation.observation ?? undefined,
      voluntary: participation.voluntary,
      card: participation.card,
    });
  } catch (err: any) {
    return reply.code(400).send({ message: err.message || "Erro ao recusar inscrição" });
  }
}

export async function getMyParticipationsHandler(request: any, reply: FastifyReply) {
  try {
    const participations = await getVoluntaryParticipations(request.user.id);

    return reply.send(
      participations.map((p) => ({
        id: p.id,
        status: p.status,
        observation: p.observation ?? undefined,
        card: {
          id: p.card.id,
          title: p.card.title,
          description: p.card.description ?? undefined,
          banner: p.card.banner ?? undefined,
          startAt: p.card.startAt,
          duration: p.card.duration,
          isOnline: p.card.isOnline,
          city: p.card.city ?? undefined,
          state: p.card.state ?? undefined,
          status: p.card.status,
          maxVolunteers: p.card.maxVolunteers,
          skills: p.card.skills.map((s) => s.name),
          institution: p.card.owner.name,
        },
      }))
    );
  } catch (err: any) {
    return reply.code(400).send({ message: err.message || "Erro ao buscar inscrições" });
  }
}

export async function getMyCommitmentsHandler(request: any, reply: FastifyReply) {
  try {
    
    await finalizeExpiredCards();
    
    const commitments = await getVoluntaryUpcomingCommitments(request.user.id);

    return reply.send(
      commitments.map((p) => ({
        id: p.id,
        status: p.status,
        observation: p.observation ?? undefined,
        card: {
          id: p.card.id,
          title: p.card.title,
          description: p.card.description ?? undefined,
          banner: p.card.banner ?? undefined,
          startAt: p.card.startAt,
          duration: p.card.duration,
          isOnline: p.card.isOnline,
          city: p.card.city ?? undefined,
          state: p.card.state ?? undefined,
          status: p.card.status,
          maxVolunteers: p.card.maxVolunteers,
          skills: p.card.skills.map((s) => s.name),
          institution: p.card.owner.name,
        },
      }))
    );
  } catch (err: any) {
    return reply.code(400).send({ message: err.message || "Erro ao buscar compromissos" });
  }
}

export async function getMyHistoryHandler(request: any, reply: FastifyReply) {
  try {
    
    await finalizeExpiredCards();
    
    const history = await getVoluntaryHistory(request.user.id);

    return reply.send(
      history.map((p) => ({
        id: p.id,
        status: p.status,
        observation: p.observation ?? undefined,
        card: {
          id: p.card.id,
          title: p.card.title,
          description: p.card.description ?? undefined,
          banner: p.card.banner ?? undefined,
          startAt: p.card.startAt,
          duration: p.card.duration,
          isOnline: p.card.isOnline,
          city: p.card.city ?? undefined,
          state: p.card.state ?? undefined,
          status: p.card.status,
          maxVolunteers: p.card.maxVolunteers,
          skills: p.card.skills.map((s) => s.name),
          institution: p.card.owner.name,
        },
      }))
    );
  } catch (err: any) {
    return reply.code(400).send({ message: err.message || "Erro ao buscar histórico" });
  }
}
