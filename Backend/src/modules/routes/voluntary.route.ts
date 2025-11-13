import { FastifyInstance } from "fastify";
import { checkVoluntaryUniquenessHandler, loginVoluntaryHandler, registerVoluntaryHandler, updateVoluntaryHandler, getVoluntaryMeHandler, registerVoluntaryPushTokenHandler, unregisterVoluntaryPushTokenHandler } from "../controllers/voluntary.controller";
import { $ref } from "../schemas/voluntary.schema";

async function voluntaryRoutes(server: FastifyInstance) {
    server.post(
        "/",
        {
            schema: {
                tags: ['voluntary'],
                summary: 'Registrar voluntário',
                response: { 201: $ref("createVoluntaryResponseSchema") },
            },
        },
        registerVoluntaryHandler
    );
    server.post(
            "/login",
            {
                schema: {
                    tags: ['voluntary'],
                    summary: 'Login voluntário',
                    body: $ref("loginVoluntarySchema"),
                    response: {
                        201: $ref("loginVoluntaryResponseSchema"),
                    },
                },
                attachValidation: false
            },
            loginVoluntaryHandler
        );

    server.post(
            "/check-uniqueness",
            {
                schema: {
                    tags: ['voluntary'],
                    summary: 'Checar unicidade (email/cpf)',
                    body: $ref("checkUniquenessVoluntarySchema"),
                    response: {
                        201: $ref("checkUniquenessVoluntaryResponseSchema"),
                    },
                },
                attachValidation: false
            },
            checkVoluntaryUniquenessHandler
        );
    
    server.patch(
        "/update",
        {
            preHandler: [server.authenticate],
            schema: {
                tags: ['voluntary'],
                summary: 'Atualizar dados do voluntário',
                body: $ref("updateVoluntarySchema"),
                response: { 200: $ref("updateVoluntaryResponseSchema") }
            },
            attachValidation: false
        },
        updateVoluntaryHandler
    );

    server.get(
        "/me",
        { preHandler: [server.authenticate], schema: { tags: ['voluntary'], summary: 'Dados do próprio voluntário' } },
        getVoluntaryMeHandler
    )

    server.post(
        "/register-push-token",
        {
            preHandler: [server.authenticate],
            schema: {
                tags: ['voluntary'],
                summary: 'Registrar push token',
                body: $ref("registerPushTokenSchema"),
                response: { 200: $ref("registerPushTokenResponseSchema") }
            }
        },
        registerVoluntaryPushTokenHandler
    );

    server.delete(
        "/unregister-push-token",
        {
            preHandler: [server.authenticate],
            schema: {
                tags: ['voluntary'],
                summary: 'Remover push token',
                response: { 200: $ref("unregisterPushTokenResponseSchema") }
            }
        },
        unregisterVoluntaryPushTokenHandler
    );
}

export default voluntaryRoutes;
