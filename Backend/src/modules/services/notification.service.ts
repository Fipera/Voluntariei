import prisma from "../../utils/prisma";

type UserType = "VOLUNTARY" | "INSTITUTION";
type NotificationType =
  | "NEW_OPPORTUNITY"
  | "NEW_APPLICATION"
  | "APPLICATION_APPROVED"
  | "APPLICATION_REJECTED"
  | "OPPORTUNITY_CANCELED"
  | "OPPORTUNITY_STARTING";

interface CreateNotificationInput {
  userId: number;
  userType: UserType;
  type: NotificationType;
  title: string;
  message: string;
  cardId?: number;
}

// Cria uma notificação
export async function createNotification(data: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      userId: data.userId,
      userType: data.userType,
      type: data.type,
      title: data.title,
      message: data.message,
      cardId: data.cardId,
    },
  });
}

// Cria notificações em massa (para múltiplos voluntários)
export async function createBulkNotifications(notifications: CreateNotificationInput[]) {
  return prisma.notification.createMany({
    data: notifications,
  });
}

// Busca notificações do usuário
export async function getUserNotifications(userId: number, userType: UserType) {
  return prisma.notification.findMany({
    where: {
      userId,
      userType,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// Marca notificação como lida
export async function markNotificationAsRead(id: number, userId: number) {
  const notification = await prisma.notification.findUnique({
    where: { id },
  });

  if (!notification || notification.userId !== userId) {
    throw new Error("Notificação não encontrada");
  }

  return prisma.notification.update({
    where: { id },
    data: { read: true },
  });
}

// Marca todas como lidas
export async function markAllAsRead(userId: number, userType: UserType) {
  return prisma.notification.updateMany({
    where: {
      userId,
      userType,
      read: false,
    },
    data: {
      read: true,
    },
  });
}

// Deleta notificação
export async function deleteNotification(id: number, userId: number) {
  const notification = await prisma.notification.findUnique({
    where: { id },
  });

  if (!notification || notification.userId !== userId) {
    throw new Error("Notificação não encontrada");
  }

  return prisma.notification.delete({
    where: { id },
  });
}

// Conta notificações não lidas
export async function countUnreadNotifications(userId: number, userType: UserType) {
  return prisma.notification.count({
    where: {
      userId,
      userType,
      read: false,
    },
  });
}

// ========== FUNÇÕES ESPECÍFICAS DE NEGÓCIO ==========

// Notifica voluntários quando nova oportunidade é criada
export async function notifyVolunteersAboutNewOpportunity(cardId: number, skillNames: string[]) {
  // Busca voluntários que têm pelo menos uma das habilidades
  const volunteers = await prisma.voluntary.findMany({
    where: {
      skills: {
        some: {
          name: { in: skillNames },
        },
      },
    },
    select: { id: true },
  });

  const card = await prisma.card.findUnique({
    where: { id: cardId },
    select: { title: true },
  });

  if (!card || volunteers.length === 0) return;

  const notifications = volunteers.map((v) => ({
    userId: v.id,
    userType: "VOLUNTARY" as UserType,
    type: "NEW_OPPORTUNITY" as NotificationType,
    title: "Nova oportunidade disponível!",
    message: `A oportunidade "${card.title}" foi criada e combina com suas habilidades.`,
    cardId,
  }));

  await createBulkNotifications(notifications);
}

// Notifica instituição sobre nova inscrição
export async function notifyInstitutionAboutNewApplication(
  institutionId: number,
  voluntaryName: string,
  cardTitle: string,
  cardId: number
) {
  await createNotification({
    userId: institutionId,
    userType: "INSTITUTION",
    type: "NEW_APPLICATION",
    title: "Nova inscrição recebida",
    message: `${voluntaryName} se inscreveu em "${cardTitle}".`,
    cardId,
  });
}

// Notifica voluntário sobre aprovação
export async function notifyVoluntaryAboutApproval(
  voluntaryId: number,
  cardTitle: string,
  cardId: number
) {
  await createNotification({
    userId: voluntaryId,
    userType: "VOLUNTARY",
    type: "APPLICATION_APPROVED",
    title: "Inscrição aprovada! 🎉",
    message: `Sua inscrição em "${cardTitle}" foi aprovada!`,
    cardId,
  });
}

// Notifica voluntário sobre rejeição
export async function notifyVoluntaryAboutRejection(
  voluntaryId: number,
  cardTitle: string,
  cardId: number
) {
  await createNotification({
    userId: voluntaryId,
    userType: "VOLUNTARY",
    type: "APPLICATION_REJECTED",
    title: "Inscrição não aprovada",
    message: `Sua inscrição em "${cardTitle}" não foi aprovada desta vez.`,
    cardId,
  });
}

// Notifica voluntários sobre cancelamento
export async function notifyVolunteersAboutCancellation(cardId: number) {
  const participations = await prisma.participation.findMany({
    where: {
      cardId,
      status: "CONFIRMED",
    },
    include: {
      card: { select: { title: true } },
    },
  });

  if (participations.length === 0) return;

  const notifications = participations.map((p) => ({
    userId: p.voluntaryId,
    userType: "VOLUNTARY" as UserType,
    type: "OPPORTUNITY_CANCELED" as NotificationType,
    title: "Oportunidade cancelada",
    message: `A oportunidade "${p.card.title}" foi cancelada pela instituição.`,
    cardId,
  }));

  await createBulkNotifications(notifications);
}
