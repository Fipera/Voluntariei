import { FastifyReply, FastifyRequest } from "fastify";
import { createCard, findCardsByOwner, findCardsForVoluntary, findCardByIdForOwner, findCardById, cancelCard, searchCardsByTitle, findAllActiveCards, finalizeExpiredCards } from "../services/card.service";
import { createCardSchema, createCardInput } from "../schemas/card.schema";

// Helper function to calculate dynamic status
function getCardStatus(card: any): 'ACTIVE' | 'PENDING' | 'FINALIZED' | 'CANCELED' {
  // If card is already CANCELED or FINALIZED, keep that status
  if (card.status === 'CANCELED' || card.status === 'FINALIZED') {
    return card.status;
  }
  
  // If card is ACTIVE and has pending participants, show as PENDING
  if (card.status === 'ACTIVE' && card.participants?.some((p: any) => p.status === 'PENDING')) {
    return 'PENDING';
  }
  
  // Otherwise return the original status
  return card.status;
}

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
      duration: card.duration,
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
  // Finaliza cards expirados antes de listar
  await finalizeExpiredCards();
  
  const cards = await findCardsByOwner(request.user.id);
  return cards.map((c)=> ({
    id: c.id,
    title: c.title,
    description: c.description ?? undefined,
    banner: c.banner ?? undefined,
    startAt: c.startAt,
    duration: c.duration,
    isOnline: c.isOnline,
    city: c.city ?? undefined,
    state: c.state ?? undefined,
    maxVolunteers: c.maxVolunteers,
    status: getCardStatus(c),
    skills: c.skills.map(s=>s.name),
    participantsCount: c.participants.filter(p => p.status === 'CONFIRMED' || p.status === 'PENDING').length
  }))
}

export async function getFeedCardsHandler(request: any){
  // Finaliza cards expirados antes de listar
  await finalizeExpiredCards();
  
  const cards = await findCardsForVoluntary(request.user.id);
  
  // Filtra oportunidades com vagas cheias (conta CONFIRMED + PENDING)
  const availableCards = cards.filter((c) => {
    const occupiedSlots = (c as any).participants?.filter((p: any) => p.status === 'CONFIRMED' || p.status === 'PENDING').length ?? 0;
    return occupiedSlots < c.maxVolunteers;
  });
  
  return availableCards.map((c)=> ({
    id: c.id,
    title: c.title,
    description: c.description ?? undefined,
    banner: c.banner ?? undefined,
    startAt: c.startAt,
    duration: c.duration,
    isOnline: c.isOnline,
    city: c.city ?? c.owner?.city ?? undefined,
    state: c.state ?? c.owner?.state ?? undefined,
    maxVolunteers: c.maxVolunteers,
    status: c.status,
    skills: c.skills.map(s=>s.name),
    participantsCount: (c as any).participants?.filter((p: any) => p.status === 'CONFIRMED' || p.status === 'PENDING').length ?? 0,
    institution: c.owner?.name
  }))
}

export async function getMyCardDetailHandler(request: any, reply: FastifyReply){
  // Finaliza cards expirados antes de exibir detalhes
  await finalizeExpiredCards();
  
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
    duration: c.duration,
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
    status: getCardStatus(c),
    skills: c.skills.map(s=>s.name),
    participantsCount: c.participants.filter(p => p.status !== 'REJECTED').length,
    participants: c.participants.map(p=>({
      id: p.id,
      status: p.status,
      observation: p.observation ?? undefined,
      voluntary: {
        id: p.voluntary.id,
        name: p.voluntary.name,
        city: p.voluntary.city,
        state: p.voluntary.state,
        skills: p.voluntary.skills.map(s=>({ skill: s.name }))
      }
    }))
  }
}

export async function getCardDetailHandler(request: any, reply: FastifyReply){
  // Finaliza cards expirados antes de exibir detalhes
  await finalizeExpiredCards();
  
  const id = Number((request.params as any)?.id);
  const card = await findCardById(id);
  if (!card) {
    return reply.status(404).send({ message: "Card não encontrado" });
  }

  // Verifica se o usuário é voluntário e se já está inscrito
  let isApplied = false;
  let participationStatus: 'PENDING' | 'CONFIRMED' | 'REJECTED' | null = null;
  if(request.user.type === 'VOLUNTARY'){
    const userId = Number(request.user.id);
    const participation = card.participants.find(p => Number(p.voluntaryId) === userId);
    if (participation) {
      isApplied = true;
      participationStatus = participation.status;
    }
  }

  return {
    id: card.id,
    title: card.title,
    description: card.description ?? undefined,
    banner: card.banner ?? undefined,
    startAt: card.startAt,
    duration: card.duration,
    createdAt: card.createAt,
    isOnline: card.isOnline,
    cep: card.cep ?? undefined,
    neighborhood: card.neighborhood ?? undefined,
    city: card.city ?? undefined,
    state: card.state ?? undefined,
    numberHouse: card.numberHouse ?? undefined,
    street: card.street ?? undefined,
    complement: card.complement ?? undefined,
    locationNote: card.locationNote ?? undefined,
    maxVolunteers: card.maxVolunteers,
    status: getCardStatus(card),
    institution: card.owner?.name,
    skills: card.skills.map(s=>s.name),
    participantsCount: card.participants?.filter(p => p.status === 'CONFIRMED' || p.status === 'PENDING').length ?? 0,
    isApplied,
    participationStatus
  };
}

export async function cancelCardHandler(request: any, reply: FastifyReply){
  const id = Number((request.params as any)?.id);
  if (!id) return reply.code(400).send({ message: 'id inválido' });
  const updated = await cancelCard(id, request.user.id);
  if(!updated) return reply.code(404).send({ message: 'Card não encontrado' });
  return reply.send({ id: updated.id, status: updated.status });
}

export async function searchCardsHandler(request: any, reply: FastifyReply){
  const query = request.query as any;
  const searchQuery = query.q || '';
  
  if(!searchQuery || searchQuery.trim() === ''){
    return reply.code(400).send({ message: 'Informe um termo de busca (parâmetro q)' });
  }

  const cards = await searchCardsByTitle(searchQuery.trim());
  return cards.map((c)=> ({
    id: c.id,
    title: c.title,
    description: c.description ?? undefined,
    banner: c.banner ?? undefined,
    startAt: c.startAt,
    duration: c.duration,
    isOnline: c.isOnline,
    city: c.city ?? c.owner?.city ?? undefined,
    state: c.state ?? c.owner?.state ?? undefined,
    maxVolunteers: c.maxVolunteers,
    status: c.status,
    skills: c.skills.map(s=>s.name),
    participantsCount: (c as any).participants?.filter((p: any) => p.status !== 'REJECTED').length ?? 0,
    institution: c.owner?.name
  }))
}

export async function getAllCardsHandler(request: any){
  // Finaliza cards expirados antes de listar
  await finalizeExpiredCards();
  
  const cards = await findAllActiveCards();
  
  // Filtra oportunidades com vagas cheias (conta CONFIRMED + PENDING)
  const availableCards = cards.filter((c) => {
    const occupiedSlots = (c as any).participants?.filter((p: any) => p.status === 'CONFIRMED' || p.status === 'PENDING').length ?? 0;
    return occupiedSlots < c.maxVolunteers;
  });
  
  return availableCards.map((c)=> ({
    id: c.id,
    title: c.title,
    description: c.description ?? undefined,
    banner: c.banner ?? undefined,
    startAt: c.startAt,
    duration: c.duration,
    isOnline: c.isOnline,
    city: c.city ?? c.owner?.city ?? undefined,
    state: c.state ?? c.owner?.state ?? undefined,
    maxVolunteers: c.maxVolunteers,
    status: c.status,
    skills: c.skills.map(s=>s.name),
    participantsCount: (c as any).participants?.filter((p: any) => p.status === 'CONFIRMED' || p.status === 'PENDING').length ?? 0,
    institution: c.owner?.name
  }))
}
