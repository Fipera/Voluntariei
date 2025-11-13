import prisma from "../../utils/prisma";
import { applyToCardInput } from "../schemas/participation.schema";
import { 
  notifyInstitutionAboutNewApplication,
  notifyVoluntaryAboutApproval,
  notifyVoluntaryAboutRejection 
} from "./notification.service";

export async function applyToCard(voluntaryId: number, cardId: number, data: applyToCardInput) {
  
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: { participants: true }
  });

  if (!card) {
    throw new Error("Demanda não encontrada");
  }

  if (card.status !== "ACTIVE") {
    throw new Error("Esta demanda não está mais ativa");
  }

  
  const endTime = new Date(card.startAt.getTime() + card.duration * 60000);
  if (endTime < new Date()) {
    throw new Error("Esta demanda já expirou");
  }

  
  const occupiedSlots = card.participants.filter(p => p.status === "CONFIRMED" || p.status === "PENDING").length;
  if (occupiedSlots >= card.maxVolunteers) {
    throw new Error("Esta demanda não possui mais demandas disponíveis");
  }

  
  const existing = await prisma.participation.findUnique({
    where: {
      voluntaryId_cardId: {
        voluntaryId,
        cardId
      }
    }
  });

  if (existing) {
    throw new Error("Você já se candidatou a esta demanda");
  }

  
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

  
  if (status === "CONFIRMED") {
    const card = await prisma.card.findUnique({
      where: { id: participation.cardId },
      include: { participants: true }
    });

    const confirmedCount = card!.participants.filter(p => p.status === "CONFIRMED").length;
    if (confirmedCount >= card!.maxVolunteers) {
      throw new Error("Esta demanda já atingiu o número máximo de voluntários confirmados");
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


export async function getVoluntaryUpcomingCommitments(voluntaryId: number) {
  
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
