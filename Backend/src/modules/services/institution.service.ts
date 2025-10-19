import { hashPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { createInstitutionInput, updateInstitutionInput } from "../schemas/institution.schema";

export async function createInstitution(input: createInstitutionInput) {

    const {password, ...rest} = input

    const hashedPassword = await hashPassword(password)

    const institution = await prisma.institution.create({
        data : {...rest, password: hashedPassword},
    })


    return institution
}


export async function findInstitutionByEmail(email: string) {
    return prisma.institution.findUnique({
        where: {
            email
        }
    })
}

export async function findInstitutionByPhone(phoneNumber: string) {
    return prisma.institution.findUnique({ where: { phoneNumber } });
}


export async function findInstitutionByCnpj(cnpj: string) {
    return prisma.institution.findUnique({ where: { cnpj } });
}



export async function findInstitutions(){
    return prisma.institution.findMany({
        select:{
            id: true,
            email: true,
            name: true,
            
        }
    })
}

export async function updateInstitution(id: number, data: updateInstitutionInput){
    return prisma.institution.update({
        where:{ id },
        data
    })
}

export async function findInstitutionById(id: number){
    return prisma.institution.findUnique({ where: { id } })
}

export async function registerInstitutionPushToken(id: number, pushToken: string) {
    return prisma.institution.update({
        where: { id },
        data: { pushToken },
    });
}
