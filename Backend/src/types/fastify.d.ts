import "fastify";

declare module "fastify" {
    export interface FastifyInstance {
        authenticate: any
    }
}

declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: {
            id: number;
            type: "VOLUNTARY" | "INSTITUTION";
        }
    }
}
