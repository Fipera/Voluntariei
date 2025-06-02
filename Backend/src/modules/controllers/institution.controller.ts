import { FastifyReply, FastifyRequest } from "fastify";
import {
    createInstitution,
    findInstitutionByCnpj,
    findInstitutionByEmail,
    findInstitutionByPhone,
    findInstitutions,
} from "../services/institution.service";
import {
    checkUniquenessInstitutionInput,
    createInstitutionInput,
    LoginInstitutionInput,
} from "../schemas/institution.schema";
import { verifyPassword } from "../../utils/hash";
import { server } from "../../app";
import { AccountAlreadyExistsError } from "../../errors/email.already.exists";
import { PrismaClientKnownRequestError } from "../../generated/prisma/runtime/library";
import {
    findVoluntaryByEmail,
    findVoluntaryByPhone,
} from "../services/voluntary.service";

export async function registerInstitutionHandler(
    request: FastifyRequest<{
        Body: createInstitutionInput;
    }>,
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
        const institutionWithSameCnpj = await findInstitutionByCnpj(body.cnpj);

        if (voluntaryWithSameEmail || institutionWithSameEmail) {
            return reply.status(400).send({ message: "Email já está em uso" });
        }

        if (voluntaryWithSamePhone || institutionWithSamePhone) {
            return reply
                .status(400)
                .send({ message: "Telefone já está em uso" });
        }

        if (institutionWithSameCnpj) {
            return reply.status(400).send({ message: "CNPJ já está em uso" });
        }

        const institution = await createInstitution(body);

        return reply.code(201).send(institution);
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

export async function loginInstitutionHandler(
    request: FastifyRequest<{
        Body: LoginInstitutionInput;
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

export async function getInstitutionsHandler() {
    const institutions = await findInstitutions();

    return institutions;
}

export async function checkInstitutionUniquenessHandler(
    request: FastifyRequest<{
        Body: checkUniquenessInstitutionInput;
    }>,
    reply: FastifyReply
) {
    const { email, phoneNumber, cnpj } = request.body;

    const [emailExists, phoneExists, cnpjExists] = await Promise.all([
        email ? findInstitutionByEmail(email) : null,
        phoneNumber ? findInstitutionByPhone(phoneNumber) : null,
        cnpj ? findInstitutionByCnpj(cnpj) : null,
    ]);

    return reply.code(200).send({
        email: !!emailExists,
        phoneNumber: !!phoneExists,
        cnpj: !!cnpjExists,
    });
}
