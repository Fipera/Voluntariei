import { FastifyReply, FastifyRequest } from "fastify";
import {
    createInstitution,
    findInstitutionByCnpj,
    findInstitutionByEmail,
    findInstitutionByPhone,
    findInstitutions,
    updateInstitution,
    findInstitutionById,
} from "../services/institution.service";
import {
    checkUniquenessInstitutionInput,
    createInstitutionInput,
    createInstitutionSchema,
    LoginInstitutionInput,
    updateInstitutionInput,
} from "../schemas/institution.schema";
import { verifyPassword } from "../../utils/hash";
import { server } from "../../app";
import { AccountAlreadyExistsError } from "../../errors/email.already.exists";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
    findVoluntaryByEmail,
    findVoluntaryByPhone,
} from "../services/voluntary.service";

export async function registerInstitutionHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body: Record<string, any> = request.body as Record<string, any>;

  try {
    const voluntaryWithSameEmail = await findVoluntaryByEmail(body.email);
    const voluntaryWithSamePhone = await findVoluntaryByPhone(body.phoneNumber);
    const institutionWithSameEmail = await findInstitutionByEmail(body.email);
    const institutionWithSamePhone = await findInstitutionByPhone(body.phoneNumber);
    const institutionWithSameCnpj = await findInstitutionByCnpj(body.cnpj);

    if (voluntaryWithSameEmail || institutionWithSameEmail) {
      return reply.status(400).send({ message: "Email já está em uso" });
    }

    if (voluntaryWithSamePhone || institutionWithSamePhone) {
      return reply.status(400).send({ message: "Telefone já está em uso" });
    }

    if (institutionWithSameCnpj) {
      return reply.status(400).send({ message: "CNPJ já está em uso" });
    }

  const parsed = createInstitutionSchema.parse(body);

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

    return reply.status(500).send({
      error: "Erro ao criar instituição",
      details: err,
    });
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

export async function updateInstitutionHandler(
    request: any,
    reply: FastifyReply
){
    try {
        const updated = await updateInstitution(request.user.id, request.body);

        return reply.code(200).send({
            id: updated.id,
            email: updated.email,
            name: updated.name,
            phoneNumber: updated.phoneNumber,
            cnpj: updated.cnpj,
            city: updated.city,
            state: updated.state,
            reason: updated.reason
        })
    } catch(err){
        return reply.status(400).send({ error: "Erro ao atualizar", details: err })
    }
}

export async function getInstitutionMeHandler(request: any, reply: FastifyReply){
    const me = await findInstitutionById(request.user.id);
    if(!me){
        return reply.code(404).send({ message: "Not found" })
    }
    return reply.send({
        id: me.id,
        email: me.email,
        name: me.name,
        phoneNumber: me.phoneNumber,
        cnpj: me.cnpj,
        city: me.city,
        state: me.state,
        reason: me.reason
    })
}
