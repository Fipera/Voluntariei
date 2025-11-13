import { FastifyInstance } from "fastify";
import {
  getNotificationsHandler,
  getUnreadCountHandler,
  markAsReadHandler,
  markAllAsReadHandler,
  deleteNotificationHandler,
  testPushNotificationHandler,
} from "../controllers/notification.controller";

async function notificationRoutes(server: FastifyInstance) {
  
  server.get(
    "/notifications",
    {
      preHandler: [server.authenticate],
      schema: { tags: ['notification'], summary: 'Listar notificações' }
    },
    getNotificationsHandler
  );

  
  server.get(
    "/notifications/unread-count",
    {
      preHandler: [server.authenticate],
      schema: { tags: ['notification'], summary: 'Quantidade de não lidas' }
    },
    getUnreadCountHandler
  );

  
  server.patch(
    "/notifications/:id/read",
    {
      preHandler: [server.authenticate],
      schema: { tags: ['notification'], summary: 'Marcar uma como lida' }
    },
    markAsReadHandler
  );

  
  server.patch(
    "/notifications/mark-all-read",
    {
      preHandler: [server.authenticate],
      schema: { tags: ['notification'], summary: 'Marcar todas como lidas' }
    },
    markAllAsReadHandler
  );

  
  server.delete(
    "/notifications/:id",
    {
      preHandler: [server.authenticate],
      schema: { tags: ['notification'], summary: 'Deletar notificação' }
    },
    deleteNotificationHandler
  );

  
  server.post(
    "/notifications/test",
    {
      preHandler: [server.authenticate],
      schema: { tags: ['notification'], summary: 'Enviar push de teste' }
    },
    testPushNotificationHandler
  );
}

export default notificationRoutes;
