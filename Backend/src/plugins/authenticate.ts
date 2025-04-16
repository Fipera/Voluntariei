// plugins/authenticate.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import fp from "fastify-plugin";

export default fp(async function (
  server: FastifyInstance,
  opts: any
) {
  server.register(require("@fastify/jwt"), {
    secret: "nasdjsadasf7126439c2346tc23rf2"
  });

  server.decorate("authenticate", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});
