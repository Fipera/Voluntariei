import { FastifyReply, FastifyRequest } from "fastify";
import {
    createVoluntary,
    findVoluntaryByEmail,
    findVoluntaryByPhone,
} from "../services/voluntary.service";
import {
    checkUniquenessVoluntaryInput,
    createVoluntaryInput,
    createVoluntarySchema,
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
import path from "path";
import fs from "fs";
import { promisify } from "util";
import { pipeline } from "stream";

const pump = promisify(pipeline);

export async function registerVoluntaryHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    let body: Record<string, any> = {};
    let logoUrl = "";

    const contentType = request.headers["content-type"];

    // Se for multipart
    if (contentType?.includes("multipart/form-data")) {
        const uploadsDir = path.join(__dirname, "..", "..", "uploads");
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const parts = request.parts();
        for await (const part of parts) {
            if (part.type === "file" && part.fieldname === "logo") {
                const filename = `${Date.now()}-${part.filename}`;
                const filePath = path.join(uploadsDir, filename);

                await pump(part.file, fs.createWriteStream(filePath));
                logoUrl = `/uploads/${filename}`;
            } else if (part.type === "field") {
                body[part.fieldname] = part.value;
            }
        }
    } else {
        // Se for JSON puro
        body = request.body as Record<string, any>;
        logoUrl = body.logoUrl || "";
    }

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

        const parsed = createVoluntarySchema.parse({
            ...body,
            logoUrl,
        });

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
