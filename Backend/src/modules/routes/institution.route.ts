import { FastifyInstance } from "fastify";
import {
    checkInstitutionUniquenessHandler,
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
                body: $ref("loginInstitutionSchema"),
                response: {
                    201: $ref("loginInstitutionResponseSchema"),
                },
            },
            attachValidation: false
        },
        loginInstitutionHandler
    );

    server.post(
        "/check-uniqueness",
        {
            schema: {
                body: $ref("checkUniquenessInstitutionSchema"),
                response: {
                    201: $ref("checkUniquenessInstitutionResponseSchema"),
                },
            },
            attachValidation: false
        },
        checkInstitutionUniquenessHandler
    );

    server.get("/", {
        preHandler: [server.authenticate],
    }, getInstitutionsHandler)
}

export default institutionRoutes;
