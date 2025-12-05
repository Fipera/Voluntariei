import { hashPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { createVoluntaryInput, updateVoluntaryInput } from "../schemas/voluntary.schema";

export async function createVoluntary(input: createVoluntaryInput) {
    const { password, skills, ...rest } = input;

    const hashedPassword = await hashPassword(password);

    const voluntary = await prisma.voluntary.create({
        data: {
            ...rest,
            password: hashedPassword,
            skills: {
                connectOrCreate: skills.map((name) => ({
                    where: { name },
                    create: { name },
                })),
            },
        },
        include: {
            skills: true,
        },
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

export async function updateVoluntary(id: number, data: updateVoluntaryInput) {
    const { skills, ...rest } = data;

    const updated = await prisma.voluntary.update({
        where: { id },
        data: {
            ...rest,
            ...(skills ? { skills: { set: skills.map((name) => ({ name })) } } : {}),
        },
        include: { skills: true },
    });

    return updated;
}

export async function findVoluntaryById(id: number) {
    return prisma.voluntary.findUnique({
        where: { id },
        include: { skills: true },
    });
}

export async function registerVoluntaryPushToken(id: number, pushToken: string) {
    return prisma.voluntary.update({
        where: { id },
        data: { pushToken },
    });
}

export async function unregisterVoluntaryPushToken(id: number) {
    return prisma.voluntary.update({
        where: { id },
        data: { pushToken: null },
    });
}
