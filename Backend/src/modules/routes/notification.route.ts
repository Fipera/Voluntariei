import { FastifyInstance } from "fastify";
import {
  getNotificationsHandler,
  getUnreadCountHandler,
  markAsReadHandler,
  markAllAsReadHandler,
  deleteNotificationHandler,
} from "../controllers/notification.controller";

async function notificationRoutes(server: FastifyInstance) {
  // Busca todas as notificações do usuário
  server.get(
    "/notifications",
    {
      preHandler: [server.authenticate],
    },
    getNotificationsHandler
  );

  // Conta notificações não lidas
  server.get(
    "/notifications/unread-count",
    {
      preHandler: [server.authenticate],
    },
    getUnreadCountHandler
  );

  // Marca uma notificação como lida
  server.patch(
    "/notifications/:id/read",
    {
      preHandler: [server.authenticate],
    },
    markAsReadHandler
  );

  // Marca todas as notificações como lidas
  server.patch(
    "/notifications/mark-all-read",
    {
      preHandler: [server.authenticate],
    },
    markAllAsReadHandler
  );

  // Deleta uma notificação
  server.delete(
    "/notifications/:id",
    {
      preHandler: [server.authenticate],
    },
    deleteNotificationHandler
  );
}

export default notificationRoutes;
