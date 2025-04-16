import { FastifyReply, FastifyRequest } from "fastify";
import {
    createVoluntary,
    findVoluntaryByEmail,
    findVoluntaryByPhone,
} from "../services/voluntary.service";
import {
    createVoluntaryInput,
    loginVoluntaryInput,
} from "../schemas/voluntary.schema";
import { PrismaClientKnownRequestError } from "../../generated/prisma/runtime/library";
import { AccountAlreadyExistsError } from "../../errors/email.already.exists";
import {
    findInstitutionByEmail,
    findInstitutionByPhone,
} from "../services/institution.service";
import { verifyPassword } from "../../utils/hash";
import { server } from "../../app";

export async function registerVoluntaryHandler(
    request: FastifyRequest<{ Body: createVoluntaryInput }>,
    reply: FastifyReply
) {
    const body = request.body;

    try {
        const voluntaryWithSameEmail = await findVoluntaryByEmail(body.email);
        const voluntaryWithSamePhone = await findVoluntaryByPhone(
            body.phoneNumber
        );

        const institutionWithSameEmail = await findInstitutionByEmail(
            body.email
        );
        const institutionWithSamePhone = await findInstitutionByPhone(
            body.phoneNumber
        );

        if (voluntaryWithSameEmail || institutionWithSameEmail) {
            return reply.status(400).send({ message: "Email já está em uso" });
        }

        if (voluntaryWithSamePhone || institutionWithSamePhone) {
            return reply
                .status(400)
                .send({ message: "Telefone já está em uso" });
        }

        const voluntary = await createVoluntary(body);

        return reply.code(201).send(voluntary);
    } catch (err) {
        if (
            err instanceof PrismaClientKnownRequestError &&
            err.code === "P2002"
        ) {
            const meta = err.meta as { target?: string[] };

            const field = meta?.target?.[0] || "Campo";

            throw new AccountAlreadyExistsError(field);
        }
    }
}

export async function loginVoluntaryHandler(
    request: FastifyRequest<{
        Body: loginVoluntaryInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;

    const { email, password } = body;

    const institution = await findInstitutionByEmail(email);
    if (institution) {
        const isCorrectPassword = await verifyPassword(
            password,
            institution.password
        );
        if (isCorrectPassword) {
            const { password: _, ...payload } = institution;

            const token = server.jwt.sign({ ...payload, type: "institution" });
            const decoded = server.jwt.decode<{ type: "institution" }>(token);

            return reply.send({
                accessToken: token,
                type: decoded?.type,
            });
        }
        return reply.code(401).send({ message: "E-mail ou senha incorreta" });
    }

    const voluntary = await findVoluntaryByEmail(email);
    if (voluntary) {
        const isCorrectPassword = await verifyPassword(
            password,
            voluntary.password
        );
        if (isCorrectPassword) {
            const { password: _, ...payload } = voluntary;

            const token = server.jwt.sign({ ...payload, type: "voluntary" });
            const decoded = server.jwt.decode<{ type: "voluntary" }>(token);

            return reply.send({
                accessToken: token,
                type: decoded?.type,
            });
        }
        return reply.code(401).send({ message: "E-mail ou senha incorreta" });
    }

    // Se não encontrou nenhum
    return reply.code(401).send({ message: "E-mail ou senha incorreta" });
}
