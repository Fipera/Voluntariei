import { FastifyReply, FastifyRequest } from "fastify";
import {
    createVoluntary,
    findVoluntaryByEmail,
    findVoluntaryByPhone,
    updateVoluntary,
    findVoluntaryById,
} from "../services/voluntary.service";
import {
    checkUniquenessVoluntaryInput,
    createVoluntaryInput,
    createVoluntarySchema,
    loginVoluntaryInput,
    updateVoluntaryInput,
} from "../schemas/voluntary.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AccountAlreadyExistsError } from "../../errors/email.already.exists";
import {
    findInstitutionByEmail,
    findInstitutionByPhone,
} from "../services/institution.service";
import { verifyPassword } from "../../utils/hash";
import { server } from "../../app";


export async function registerVoluntaryHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const body: Record<string, any> = request.body as Record<string, any>;

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

        if (typeof body.skills === "string") {
            try {
                body.skills = JSON.parse(body.skills);
            } catch {
                body.skills = [];
            }
        }

    const parsed = createVoluntarySchema.parse(body);

        const voluntary = await createVoluntary(parsed);

        return reply.code(201).send({
            ...voluntary,
            skills: voluntary.skills.map((skill) => skill.name),
        });
    } catch (err) {
        console.error(err);
        return reply
            .status(400)
            .send({ error: "Erro ao criar voluntário", details: err });
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

            const token = server.jwt.sign({ ...payload, type: "INSTITUTION" });
            const decoded = server.jwt.decode<{ type: "INSTITUTION" }>(token);

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

            const token = server.jwt.sign({ ...payload, type: "VOLUNTARY" });
            const decoded = server.jwt.decode<{ type: "VOLUNTARY" }>(token);

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

export async function checkVoluntaryUniquenessHandler(
    request: FastifyRequest<{
        Body: checkUniquenessVoluntaryInput;
    }>,
    reply: FastifyReply
) {
    const { email, phoneNumber } = request.body;

    const [emailExists, phoneExists] = await Promise.all([
        email ? findVoluntaryByEmail(email) : null,
        phoneNumber ? findVoluntaryByPhone(phoneNumber) : null,
    ]);

    return reply.code(200).send({
        email: !!emailExists,
        phoneNumber: !!phoneExists,
    });
}

export async function updateVoluntaryHandler(
    request: any,
    reply: FastifyReply
) {
    const body: Record<string, any> = request.body as Record<string, any>;

    try {
        if (typeof body.skills === "string") {
            try {
                body.skills = JSON.parse(body.skills);
            } catch {
                body.skills = [];
            }
        }

        const parsed: updateVoluntaryInput = body;

        const updated = await updateVoluntary(request.user.id, parsed);

        return reply.code(200).send({
            id: updated.id,
            email: updated.email,
            name: updated.name,
            phoneNumber: updated.phoneNumber,
            cep: updated.cep,
            city: updated.city,
            state: updated.state,
            skills: updated.skills.map((s) => s.name),
        });
    } catch (err) {
        return reply.status(400).send({ error: "Erro ao atualizar", details: err });
    }
}

export async function getVoluntaryMeHandler(request: any, reply: FastifyReply){
    const me = await findVoluntaryById(request.user.id);
    if(!me){
        return reply.code(404).send({ message: "Not found" })
    }
    return reply.send({
        id: me.id,
        email: me.email,
        name: me.name,
        phoneNumber: me.phoneNumber,
        cep: me.cep,
        city: me.city,
        state: me.state,
        skills: me.skills.map(s=>s.name)
    })
}
