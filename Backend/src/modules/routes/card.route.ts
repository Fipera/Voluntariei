import { FastifyInstance } from "fastify";
import { createCardHandler, getMyCardsHandler, getFeedCardsHandler, getMyCardDetailHandler, getCardDetailHandler, cancelCardHandler, searchCardsHandler, getAllCardsHandler } from "../controllers/card.controller";
import { $ref } from "../schemas/card.schema";

async function cardRoutes(server: FastifyInstance){
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        tags: ['cards'],
        summary: 'Criar demanda (card)',
        body: $ref("createCardSchema"),
        response: { 201: $ref("createCardResponseSchema") },
      },
      attachValidation: false,
    },
    createCardHandler
  );

  server.get(
    "/",
    { preHandler: [server.authenticate], schema: { tags: ['cards'], summary: 'Listar meus cards' } },
    getMyCardsHandler
  )

  server.get(
    "/feed",
    { preHandler: [server.authenticate], schema: { tags: ['cards'], summary: 'Feed de demanda' } },
    getFeedCardsHandler
  )

  server.get(
    "/search",
    { preHandler: [server.authenticate], schema: { tags: ['cards'], summary: 'Buscar cards (filtros)' } },
    searchCardsHandler
  )

  server.get(
    "/all",
    { preHandler: [server.authenticate], schema: { tags: ['cards'], summary: 'Listar todos os cards (admin?)' } },
    getAllCardsHandler
  )

  server.get(
    "/:id/detail",
    { preHandler: [server.authenticate], schema: { tags: ['cards'], summary: 'Detalhe público do card' } },
    getCardDetailHandler
  )

  server.get(
    "/:id",
    { preHandler: [server.authenticate], schema: { tags: ['cards'], summary: 'Meu card (instituição)' } },
    getMyCardDetailHandler
  )

  server.post(
    "/:id/cancel",
    { preHandler: [server.authenticate], schema: { tags: ['cards'], summary: 'Cancelar card' } },
    cancelCardHandler
  )
}

export default cardRoutes;
