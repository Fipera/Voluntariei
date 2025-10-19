import prisma from "../../utils/prisma";
import { applyToCardInput } from "../schemas/participation.schema";
import { 
  notifyInstitutionAboutNewApplication,
  notifyVoluntaryAboutApproval,
  notifyVoluntaryAboutRejection 
} from "./notification.service";

export async function applyToCard(voluntaryId: number, cardId: number, data: applyToCardInput) {
  // Verifica se o card existe e está ativo
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: { participants: true }
  });

  if (!card) {
    throw new Error("Oportunidade não encontrada");
  }

  if (card.status !== "ACTIVE") {
    throw new Error("Esta oportunidade não está mais ativa");
  }

  // Calcula se a oportunidade já passou (startAt + duration)
  const endTime = new Date(card.startAt.getTime() + card.duration * 60000);
  if (endTime < new Date()) {
    throw new Error("Esta oportunidade já expirou");
  }

  // Verifica vagas disponíveis (conta CONFIRMED + PENDING)
  const occupiedSlots = card.participants.filter(p => p.status === "CONFIRMED" || p.status === "PENDING").length;
  if (occupiedSlots >= card.maxVolunteers) {
    throw new Error("Esta oportunidade não possui mais vagas disponíveis");
  }

  // Verifica se já existe uma participação
  const existing = await prisma.participation.findUnique({
    where: {
      voluntaryId_cardId: {
        voluntaryId,
        cardId
      }
    }
  });

  if (existing) {
    throw new Error("Você já se candidatou a esta oportunidade");
  }

  // Cria a participação
  const participation = await prisma.participation.create({
    data: {
      voluntaryId,
      cardId,
      observation: data.observation,
      status: "PENDING"
    },
    include: {
      voluntary: { select: { id: true, name: true, city: true, state: true } },
      card: { select: { id: true, title: true, ownerId: true } }
    }
  });

  // Notifica instituição sobre nova inscrição
  await notifyInstitutionAboutNewApplication(
    participation.card.ownerId,
    participation.voluntary.name,
    participation.card.title,
    cardId
  );

  return participation;
}

export async function updateParticipationStatus(
  participationId: number,
  institutionId: number,
  status: "CONFIRMED" | "REJECTED"
) {
  // Busca a participação com o card para verificar ownership
  const participation = await prisma.participation.findUnique({
    where: { id: participationId },
    include: { card: true }
  });

  if (!participation) {
    throw new Error("Inscrição não encontrada");
  }

  if (participation.card.ownerId !== institutionId) {
    throw new Error("Você não tem permissão para gerenciar esta inscrição");
  }

  // Se está confirmando, verifica se ainda tem vaga (apenas CONFIRMED conta aqui)
  if (status === "CONFIRMED") {
    const card = await prisma.card.findUnique({
      where: { id: participation.cardId },
      include: { participants: true }
    });

    const confirmedCount = card!.participants.filter(p => p.status === "CONFIRMED").length;
    if (confirmedCount >= card!.maxVolunteers) {
      throw new Error("Esta oportunidade já atingiu o número máximo de voluntários confirmados");
    }
  }

  const updated = await prisma.participation.update({
    where: { id: participationId },
    data: { status },
    include: {
      voluntary: { select: { id: true, name: true, city: true, state: true } },
      card: { select: { id: true, title: true } }
    }
  });

  // Notifica voluntário sobre aprovação ou rejeição
  if (status === "CONFIRMED") {
    await notifyVoluntaryAboutApproval(
      updated.voluntary.id,
      updated.card.title,
      participation.cardId
    );
  } else if (status === "REJECTED") {
    await notifyVoluntaryAboutRejection(
      updated.voluntary.id,
      updated.card.title,
      participation.cardId
    );
  }

  return updated;
}

export async function getVoluntaryParticipations(voluntaryId: number) {
  return prisma.participation.findMany({
    where: { voluntaryId },
    include: {
      card: {
        include: {
          owner: { select: { id: true, name: true } },
          skills: true
        }
      }
    },
    orderBy: { id: 'desc' }
  });
}

// Retorna apenas compromissos confirmados e ativos (para agenda)
export async function getVoluntaryUpcomingCommitments(voluntaryId: number) {
  // Primeiro, rejeita automaticamente participações PENDING que já passaram da data de início
  await prisma.participation.updateMany({
    where: {
      voluntaryId,
      status: 'PENDING',
      card: {
        startAt: { lt: new Date() }
      }
    },
    data: {
      status: 'REJECTED'
    }
  });

  // Depois retorna os compromissos válidos
  return prisma.participation.findMany({
    where: {
      voluntaryId,
      status: { in: ['PENDING', 'CONFIRMED'] },
      card: {
        status: 'ACTIVE'
      }
    },
    include: {
      card: {
        include: {
          owner: { select: { id: true, name: true } },
          skills: true
        }
      }
    },
    orderBy: { card: { startAt: 'asc' } }
  });
}

// Retorna histórico (finalizados, cancelados, rejeitados)
export async function getVoluntaryHistory(voluntaryId: number) {
  return prisma.participation.findMany({
    where: {
      voluntaryId,
      OR: [
        { status: 'REJECTED' },
        { card: { status: 'FINALIZED' } },
        { card: { status: 'CANCELED' } }
      ]
    },
    include: {
      card: {
        include: {
          owner: { select: { id: true, name: true } },
          skills: true
        }
      }
    },
    orderBy: { card: { startAt: 'desc' } }
  });
}
