import { FastifyInstance } from "fastify";
import {
    checkInstitutionUniquenessHandler,
    loginInstitutionHandler,
    registerInstitutionHandler,
    updateInstitutionHandler,
    getInstitutionMeHandler
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

    server.get(
        "/me",
        { preHandler: [server.authenticate] },
        getInstitutionMeHandler
    )

    server.patch(
        "/update",
        {
            preHandler: [server.authenticate],
            schema: {
                body: $ref("updateInstitutionSchema"),
                response: { 200: $ref("updateInstitutionResponseSchema") }
            },
            attachValidation: false
        },
        updateInstitutionHandler
    )
}

export default institutionRoutes;
