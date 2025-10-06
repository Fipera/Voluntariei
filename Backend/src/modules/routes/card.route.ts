import { FastifyInstance } from "fastify";
import { createCardHandler, getMyCardsHandler, getFeedCardsHandler, getMyCardDetailHandler, cancelCardHandler } from "../controllers/card.controller";
import { $ref } from "../schemas/card.schema";

async function cardRoutes(server: FastifyInstance){
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("createCardSchema"),
        response: { 201: $ref("createCardResponseSchema") },
      },
      attachValidation: false,
    },
    createCardHandler
  );

  server.get(
    "/",
    { preHandler: [server.authenticate] },
    getMyCardsHandler
  )

  server.get(
    "/feed",
    { preHandler: [server.authenticate] },
    getFeedCardsHandler
  )

  server.get(
    "/:id",
    { preHandler: [server.authenticate] },
    getMyCardDetailHandler
  )

  server.post(
    "/:id/cancel",
    { preHandler: [server.authenticate] },
    cancelCardHandler
  )
}

export default cardRoutes;
