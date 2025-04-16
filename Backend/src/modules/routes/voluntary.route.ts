import { FastifyInstance } from "fastify";
import { loginVoluntaryHandler, registerVoluntaryHandler } from "../controllers/voluntary.controller";
import { $ref } from "../schemas/voluntary.schema";

async function voluntaryRoutes(server: FastifyInstance) {
    server.post(
        "/",
        {
            schema: {
                body: $ref("createVoluntarySchema"),
                response: { 201: $ref("createVoluntaryResponseSchema") },
            },
        },
        registerVoluntaryHandler
    );
     server.post(
            "/login",
            {
                schema: {
                    body: $ref("loginVoluntarySchema"),
                    response: {
                        201: $ref("loginVoluntaryResponseSchema"),
                    },
                },
                attachValidation: false
            },
            loginVoluntaryHandler
        );
}

export default voluntaryRoutes;
