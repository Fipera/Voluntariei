import Fastify from "fastify";
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import institutionRoutes from "./modules/routes/institution.route";
import { institutionSchemas } from "./modules/schemas/institution.schema";
import fjwt from "fastify-jwt";
import authenticate from "./plugins/authenticate";
import voluntaryRoutes from "./modules/routes/voluntary.route";
import { voluntarySchemas } from "./modules/schemas/voluntary.schema";
import multipart from "@fastify/multipart";
import cardRoutes from "./modules/routes/card.route";
import { cardSchemas } from "./modules/schemas/card.schema";
import participationRoutes from "./modules/routes/participation.route";
import { participationSchemas } from "./modules/schemas/participation.schema";
import notificationRoutes from "./modules/routes/notification.route";
export const server = Fastify();

server.get("/healthcheck", async function () {
    return { status: "OK" };
});

async function main() {
    server.register(multipart, {
        limits: {
            fileSize: 5 * 1024 * 1024, 
        },
    });

    
    server.register(swagger, {
        openapi: {
            info: {
                title: 'Voluntariei API',
                description: 'Documentação da API Voluntariei (Fastify + Prisma)',
                version: '1.0.0'
            },
            servers: [
                { url: 'http://localhost:3000', description: 'Local dev' }
            ],
            tags: [
                { name: 'institution', description: 'Rotas de Instituição' },
                { name: 'voluntary', description: 'Rotas de Voluntário' },
                { name: 'cards', description: 'Demandas (Cards)' },
                { name: 'participation', description: 'Participações' },
                { name: 'notification', description: 'Notificações' }
            ]
        }
    });
    server.register(swaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: true
        },
        staticCSP: true,
        transformSpecification: (swaggerObject) => swaggerObject,
        transformSpecificationClone: true
    });

    server.register(authenticate);

    for (const schema of institutionSchemas) {
        server.addSchema(schema);
    }

    for (const schema of voluntarySchemas) {
        server.addSchema(schema);
    }

    for (const schema of cardSchemas) {
        server.addSchema(schema);
    }

    for (const schema of participationSchemas) {
        server.addSchema(schema);
    }

    server.register(institutionRoutes, { prefix: "/institution" });
    server.register(voluntaryRoutes, { prefix: "/voluntary" });
    server.register(cardRoutes, { prefix: "/cards" });
    server.register(participationRoutes, { prefix: "/" });
    server.register(notificationRoutes, { prefix: "/" });

    try {
        await server.listen({ port: 3000, host: "0.0.0.0" });

    console.log("Server ready at http://localhost:3000");
    console.log("Swagger UI: http://localhost:3000/docs");
    console.log("OpenAPI JSON: http://localhost:3000/docs/json");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

main();
