import prisma from "../../utils/prisma";
import { createCardInput } from "../schemas/card.schema";
import { notifyVolunteersAboutNewOpportunity, notifyVolunteersAboutCancellation } from "./notification.service";

export async function createCard(ownerId: number, input: createCardInput) {
  const { skills, banner, useInstitutionAddress, ...rest } = input;

  let address: Record<string, string | undefined> = {};
  if (!rest.isOnline) {
    if (useInstitutionAddress) {
      const inst = await prisma.institution.findUnique({ where: { id: ownerId } });
      if (inst) {
        address = {
          cep: inst.cep,
          neighborhood: inst.neighborhood,
          city: inst.city,
          state: inst.state,
          numberHouse: inst.numberHouse,
          street: inst.street,
        };
      }
    } else {
      address = {
        cep: rest.cep,
        neighborhood: rest.neighborhood,
        city: rest.city,
        state: rest.state,
        numberHouse: rest.numberHouse,
        street: rest.street,
        complement: rest.complement,
        locationNote: rest.locationNote,
      };
    }
  }

  const card = await prisma.card.create({
    data: {
      title: rest.title,
      description: rest.description,
      startAt: new Date(rest.startAt),
      duration: rest.duration,
      isOnline: rest.isOnline,
      maxVolunteers: rest.maxVolunteers,
      ownerId,
      banner,
      ...address,
      skills: { connect: skills.map((name) => ({ name })) },
    },
    include: { skills: true },
  });

  
  await notifyVolunteersAboutNewOpportunity(card.id, skills);

  return card;
}

export async function findCardsByOwner(ownerId: number){
  return prisma.card.findMany({
    where: { ownerId },
    include: { skills: true, participants: true },
    orderBy: { createAt: 'desc' }
  })
}

export async function findCardsForVoluntary(voluntaryId: number){
  const volunteer = await prisma.voluntary.findUnique({
    where: { id: voluntaryId },
    include: { skills: true }
  });
  const skillNames = volunteer?.skills.map(s=>s.name) ?? [];

  return prisma.card.findMany({
    where: {
      status: 'ACTIVE',
      skills: { some: { name: { in: skillNames } } },
      startAt: { gte: new Date() } 
    },
    include: { skills: true, owner: { select: { id: true, name: true, city: true, state: true } }, participants: true },
    orderBy: { startAt: 'asc' }
  })
}

export async function searchCardsByTitle(searchQuery: string){
  return prisma.card.findMany({
    where: {
      status: 'ACTIVE',
      title: { contains: searchQuery, mode: 'insensitive' },
      startAt: { gte: new Date() } 
    },
    include: { skills: true, owner: { select: { id: true, name: true, city: true, state: true } }, participants: true },
    orderBy: { startAt: 'asc' }
  })
}

export async function findAllActiveCards(){
  return prisma.card.findMany({
    where: {
      status: 'ACTIVE',
      startAt: { gte: new Date() } 
    },
    include: { skills: true, owner: { select: { id: true, name: true, city: true, state: true } }, participants: true },
    orderBy: { startAt: 'asc' }
  })
}

export async function findCardByIdForOwner(id: number, ownerId: number){
  return prisma.card.findFirst({
    where: { id, ownerId },
    include: {
      skills: true,
      participants: {
        include: {
          voluntary: { 
            select: { 
              id: true, 
              name: true, 
              city: true, 
              state: true,
              skills: true
            } 
          }
        }
      }
    }
  })
}

export async function findCardById(id: number){
  return prisma.card.findUnique({
    where: { id },
    include: {
      skills: true,
      owner: { select: { id: true, name: true, city: true, state: true } },
      participants: true
    }
  })
}

export async function cancelCard(id: number, ownerId: number){
  const exists = await prisma.card.findFirst({ where: { id, ownerId } });
  if (!exists) return null;
  
  const updated = await prisma.card.update({
    where: { id },
    data: { status: 'CANCELED' },
  });

  
  await notifyVolunteersAboutCancellation(id);

  return updated;
}


export async function finalizeExpiredCards(){
  const now = new Date();
  
  
  const activeCards = await prisma.card.findMany({
    where: {
      status: { in: ['ACTIVE', 'PENDING'] }
    }
  });

  
  const expiredCards = activeCards.filter(card => {
    const endTime = new Date(card.startAt.getTime() + card.duration * 60000);
    return endTime < now;
  });

  
  if (expiredCards.length > 0) {
    await prisma.card.updateMany({
      where: {
        id: { in: expiredCards.map(c => c.id) }
      },
      data: {
        status: 'FINALIZED'
      }
    });
  }

  return expiredCards.length;
}
