import { FastifyInstance } from "fastify";
import {
    getInstitutionsHandler,
    loginInstitutionHandler,
    registerInstitutionHandler,
} from "../controllers/institution.controller";
import { $ref } from "../schemas/institution.schema";

async function institutionRoutes(server: FastifyInstance) {
    server.post(
        "/",
        {
            schema: {
                body: $ref("createInstitutionSchema"),
                response: {
                    201: $ref("createInstitutionResponseSchema"),
                },
            },
        },
        registerInstitutionHandler
    );

    server.post(
        "/login",
        {
            schema: {
               
                response: {
                    201: $ref("loginInstitutionResponseSchema"),
                },
            },
            attachValidation: false
        },
        loginInstitutionHandler
    );

    server.get("/", {
        preHandler: [server.authenticate],
    }, getInstitutionsHandler)
}

export default institutionRoutes;
