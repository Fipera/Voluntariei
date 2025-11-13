import prisma from "../../utils/prisma";
import {
  notifyVoluntariesPush,
  notifyInstitutionPush,
  notifyVoluntaryPush,
} from "../../services/push.service";

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


export async function createBulkNotifications(notifications: CreateNotificationInput[]) {
  return prisma.notification.createMany({
    data: notifications,
  });
}


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


export async function countUnreadNotifications(userId: number, userType: UserType) {
  return prisma.notification.count({
    where: {
      userId,
      userType,
      read: false,
    },
  });
}




export async function notifyVolunteersAboutNewOpportunity(cardId: number, skillNames: string[]) {
  
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

  const title = "Nova demanda disponível!";
  const message = `A demanda "${card.title}" foi criada e combina com suas habilidades.`;

  const notifications = volunteers.map((v) => ({
    userId: v.id,
    userType: "VOLUNTARY" as UserType,
    type: "NEW_OPPORTUNITY" as NotificationType,
    title,
    message,
    cardId,
  }));

  
  await createBulkNotifications(notifications);

  
  await notifyVoluntariesPush(
    volunteers.map((v) => v.id),
    title,
    message,
    { cardId, type: "NEW_OPPORTUNITY" }
  );
}


export async function notifyInstitutionAboutNewApplication(
  institutionId: number,
  voluntaryName: string,
  cardTitle: string,
  cardId: number
) {
  const title = "Nova inscrição recebida";
  const message = `${voluntaryName} se inscreveu em "${cardTitle}".`;

  
  await createNotification({
    userId: institutionId,
    userType: "INSTITUTION",
    type: "NEW_APPLICATION",
    title,
    message,
    cardId,
  });

  
  await notifyInstitutionPush(institutionId, title, message, {
    cardId,
    type: "NEW_APPLICATION",
  });
}


export async function notifyVoluntaryAboutApproval(
  voluntaryId: number,
  cardTitle: string,
  cardId: number
) {
  const title = "Inscrição aprovada! 🎉";
  const message = `Sua inscrição em "${cardTitle}" foi aprovada!`;

  
  await createNotification({
    userId: voluntaryId,
    userType: "VOLUNTARY",
    type: "APPLICATION_APPROVED",
    title,
    message,
    cardId,
  });

  
  await notifyVoluntaryPush(voluntaryId, title, message, {
    cardId,
    type: "APPLICATION_APPROVED",
  });
}


export async function notifyVoluntaryAboutRejection(
  voluntaryId: number,
  cardTitle: string,
  cardId: number
) {
  const title = "Inscrição não aprovada";
  const message = `Sua inscrição em "${cardTitle}" não foi aprovada desta vez.`;

  
  await createNotification({
    userId: voluntaryId,
    userType: "VOLUNTARY",
    type: "APPLICATION_REJECTED",
    title,
    message,
    cardId,
  });

  
  await notifyVoluntaryPush(voluntaryId, title, message, {
    cardId,
    type: "APPLICATION_REJECTED",
  });
}


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

  const title = "Demanda cancelada";
  const message = `A demanda "${participations[0].card.title}" foi cancelada pela instituição.`;

  const notifications = participations.map((p) => ({
    userId: p.voluntaryId,
    userType: "VOLUNTARY" as UserType,
    type: "OPPORTUNITY_CANCELED" as NotificationType,
    title,
    message,
    cardId,
  }));

  
  await createBulkNotifications(notifications);

  
  await notifyVoluntariesPush(
    participations.map((p) => p.voluntaryId),
    title,
    message,
    { cardId, type: "OPPORTUNITY_CANCELED" }
  );
}
