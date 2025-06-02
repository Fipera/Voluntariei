import { hashPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { createInstitutionInput } from "../schemas/institution.schema";

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