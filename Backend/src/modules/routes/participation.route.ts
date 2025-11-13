import { FastifyInstance } from "fastify";
import {
  applyToCardHandler,
  approveParticipationHandler,
  rejectParticipationHandler,
  getMyParticipationsHandler,
  getMyCommitmentsHandler,
  getMyHistoryHandler,
} from "../controllers/participation.controller";
import { $ref } from "../schemas/participation.schema";

async function participationRoutes(server: FastifyInstance) {
  
  server.post(
    "/cards/:id/apply",
    {
      preHandler: [server.authenticate],
      schema: {
        tags: ['participation'],
        summary: 'Voluntário se candidata a um card',
        body: $ref("applyToCardSchema"),
      },
    },
    applyToCardHandler
  );

  
  server.post(
    "/participations/:id/approve",
    {
      preHandler: [server.authenticate],
      schema: { tags: ['participation'], summary: 'Instituição aprova inscrição' }
    },
    approveParticipationHandler
  );

  
  server.post(
    "/participations/:id/reject",
    {
      preHandler: [server.authenticate],
      schema: { tags: ['participation'], summary: 'Instituição rejeita inscrição' }
    },
    rejectParticipationHandler
  );

  
  server.get(
    "/participations/me",
    {
      preHandler: [server.authenticate],
      schema: { tags: ['participation'], summary: 'Minhas inscrições (voluntário)' }
    },
    getMyParticipationsHandler
  );

  
  server.get(
    "/participations/commitments",
    {
      preHandler: [server.authenticate],
      schema: { tags: ['participation'], summary: 'Compromissos futuros (agenda)' }
    },
    getMyCommitmentsHandler
  );

  
  server.get(
    "/participations/history",
    {
      preHandler: [server.authenticate],
      schema: { tags: ['participation'], summary: 'Histórico de participações' }
    },
    getMyHistoryHandler
  );
}

export default participationRoutes;
