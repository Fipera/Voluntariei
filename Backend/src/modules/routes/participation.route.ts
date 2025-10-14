import { FastifyInstance } from "fastify";
import {
  applyToCardHandler,
  approveParticipationHandler,
  rejectParticipationHandler,
  getMyParticipationsHandler,
} from "../controllers/participation.controller";
import { $ref } from "../schemas/participation.schema";

async function participationRoutes(server: FastifyInstance) {
  // Voluntário se candidata a uma oportunidade
  server.post(
    "/cards/:id/apply",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("applyToCardSchema"),
      },
    },
    applyToCardHandler
  );

  // Instituição aprova uma inscrição
  server.post(
    "/participations/:id/approve",
    {
      preHandler: [server.authenticate],
    },
    approveParticipationHandler
  );

  // Instituição recusa uma inscrição
  server.post(
    "/participations/:id/reject",
    {
      preHandler: [server.authenticate],
    },
    rejectParticipationHandler
  );

  // Voluntário visualiza seu histórico de inscrições
  server.get(
    "/participations/me",
    {
      preHandler: [server.authenticate],
    },
    getMyParticipationsHandler
  );
}

export default participationRoutes;
