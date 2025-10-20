import { FastifyInstance } from "fastify";
import { checkVoluntaryUniquenessHandler, loginVoluntaryHandler, registerVoluntaryHandler, updateVoluntaryHandler, getVoluntaryMeHandler, registerVoluntaryPushTokenHandler, unregisterVoluntaryPushTokenHandler } from "../controllers/voluntary.controller";
import { $ref } from "../schemas/voluntary.schema";

async function voluntaryRoutes(server: FastifyInstance) {
    server.post(
        "/",
        {
            schema: {
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

    server.post(
            "/check-uniqueness",
            {
                schema: {
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
                body: $ref("updateVoluntarySchema"),
                response: { 200: $ref("updateVoluntaryResponseSchema") }
            },
            attachValidation: false
        },
        updateVoluntaryHandler
    );

    server.get(
        "/me",
        { preHandler: [server.authenticate] },
        getVoluntaryMeHandler
    )

    server.post(
        "/register-push-token",
        {
            preHandler: [server.authenticate],
            schema: {
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
                response: { 200: $ref("unregisterPushTokenResponseSchema") }
            }
        },
        unregisterVoluntaryPushTokenHandler
    );
}

export default voluntaryRoutes;
