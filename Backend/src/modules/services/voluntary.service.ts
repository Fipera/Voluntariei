import { hashPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { createVoluntaryInput } from "../schemas/voluntary.schema";

export async function createVoluntary(input: createVoluntaryInput) {
    const { password, ...rest } = input;

    const hashedPassword = await hashPassword(password);

    const voluntary = await prisma.voluntary.create({
        data: { ...rest, password: hashedPassword },
    });

    return voluntary;
}

export async function findVoluntaryByEmail(email: string) {
    return prisma.voluntary.findUnique({
        where: {
            email,
        },
    });
}

export async function findVoluntaryByPhone(phoneNumber: string) {
    return prisma.voluntary.findUnique({ where: { phoneNumber } });
}
