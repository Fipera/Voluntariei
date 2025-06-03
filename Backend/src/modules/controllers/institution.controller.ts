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
    createInstitutionSchema,
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
import { promisify } from "util";
import { pipeline } from "stream";
import multipart from "@fastify/multipart";
import path from "path";
import fs from "fs";

const pump = promisify(pipeline);

export async function registerInstitutionHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const body: Record<string, any> = {};
    let logoUrl = "";

    // Cria pasta de uploads se não existir
    const uploadsDir = path.join(__dirname, "..", "..", "uploads");
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    //  Processa multipart/form-data
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

        const parsed = createInstitutionSchema.parse({
            ...body,
            logoUrl,
        });

        const institution = await createInstitution(parsed);

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
