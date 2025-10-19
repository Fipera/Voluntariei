import { FastifyReply } from "fastify";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  countUnreadNotifications,
} from "../services/notification.service";

// Busca todas as notificações do usuário
export async function getNotificationsHandler(request: any, reply: FastifyReply) {
  try {
    // request.user já contém id e type (VOLUNTARY ou INSTITUTION)
    const notifications = await getUserNotifications(request.user.id, request.user.type);

    return reply.send(
      notifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        cardId: n.cardId ?? undefined,
        read: n.read,
        createdAt: n.createdAt,
      }))
    );
  } catch (err: any) {
    return reply.code(400).send({ message: err.message || "Erro ao buscar notificações" });
  }
}

// Conta notificações não lidas
export async function getUnreadCountHandler(request: any, reply: FastifyReply) {
  try {
    const count = await countUnreadNotifications(request.user.id, request.user.type);
    return reply.send({ count });
  } catch (err: any) {
    return reply.code(400).send({ message: err.message || "Erro ao contar notificações" });
  }
}

// Marca uma notificação como lida
export async function markAsReadHandler(request: any, reply: FastifyReply) {
  const id = Number((request.params as any)?.id);

  if (!id) {
    return reply.code(400).send({ message: "ID inválido" });
  }

  try {
    const notification = await markNotificationAsRead(id, request.user.id);
    return reply.send({
      id: notification.id,
      read: notification.read,
    });
  } catch (err: any) {
    return reply.code(400).send({ message: err.message || "Erro ao marcar como lida" });
  }
}

// Marca todas como lidas
export async function markAllAsReadHandler(request: any, reply: FastifyReply) {
  try {
    await markAllAsRead(request.user.id, request.user.type);
    return reply.send({ message: "Todas as notificações foram marcadas como lidas" });
  } catch (err: any) {
    return reply.code(400).send({ message: err.message || "Erro ao marcar todas como lidas" });
  }
}

// Deleta uma notificação
export async function deleteNotificationHandler(request: any, reply: FastifyReply) {
  const id = Number((request.params as any)?.id);

  if (!id) {
    return reply.code(400).send({ message: "ID inválido" });
  }

  try {
    await deleteNotification(id, request.user.id);
    return reply.code(204).send();
  } catch (err: any) {
    return reply.code(400).send({ message: err.message || "Erro ao deletar notificação" });
  }
}
