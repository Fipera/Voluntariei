import bcrypt from "bcrypt";

const SALT_ROUNDS = 12; 

export async function hashPassword(password: string): Promise<string> {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    return hashed;
  }


export async function verifyPassword(
    candidatePassword: string,
    hash: string
  ): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, hash);
  }