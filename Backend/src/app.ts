import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import institutionRoutes from "./modules/routes/institution.route";
import { institutionSchemas } from "./modules/schemas/institution.schema";
import fjwt from "fastify-jwt";
import authenticate from "./plugins/authenticate";
import voluntaryRoutes from "./modules/routes/voluntary.route";
import { voluntarySchemas } from "./modules/schemas/voluntary.schema";
export const server = Fastify();





server.get("/healthcheck", async function () {
    return { status: "OK" };
});

async function main() {
    server.register(authenticate)

    for (const schema of institutionSchemas) {
        server.addSchema(schema);
    }

    for (const schema of voluntarySchemas) {
        server.addSchema(schema);
    }

    server.register(institutionRoutes, { prefix: "/institution" });
    server.register(voluntaryRoutes, { prefix: "/voluntary" });

    try {
        await server.listen({ port: 3000, host: "0.0.0.0" });

        console.log("Server ready at http://localhost:3000");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

main();
