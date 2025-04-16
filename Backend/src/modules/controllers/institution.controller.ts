import { FastifyReply, FastifyRequest } from "fastify";
import {
    createInstitution,
    findInstitutionByEmail,
    findInstitutions,
} from "../services/institution.service";
import {
    createInstitutionInput,
    LoginInstitutionInput,
} from "../schemas/institution.schema";
import { verifyPassword } from "../../utils/hash";
import { server } from "../../app";
import { InstitutionAlreadyExistsError } from "../../errors/email.already.exists";
import { PrismaClientKnownRequestError } from "../../generated/prisma/runtime/library";

export async function registerInstitutionHandler(
    request: FastifyRequest<{
        Body: createInstitutionInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;

    try {
        const institution = await createInstitution(body);

        return reply.code(201).send(institution);
    } catch (err) {
        if (
            err instanceof PrismaClientKnownRequestError &&
            err.code === "P2002"
        ) {
            const meta = err.meta as { target?: string[] };

            const field = meta?.target?.[0] || "Campo";

            throw new InstitutionAlreadyExistsError(field);
        }
    }
}

export async function loginInstitutionHandler(
    request: FastifyRequest<{
        Body: LoginInstitutionInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;

    // find a user by email

    const institution = await findInstitutionByEmail(body.email);

    if (!institution) {
        return reply.code(401).send({
            message: "E-mail ou senha incorreta",
        });
    }

    // verify password
    const correctPassword = await verifyPassword(
        body.password,
        institution.password
    );

    if (correctPassword) {
        const { password, ...rest } = institution;

        return { accessToken: server.jwt.sign(rest) };
    }

    return reply.code(401).send({
        message: "E-mail ou senha incorreta",
    });
    // generate access token

    // respond
}

export async function getInstitutionsHandler() {
    const institutions = await findInstitutions();

    return institutions;
}
