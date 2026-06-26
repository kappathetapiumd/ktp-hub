import { promisify } from 'util';
import crypto from 'crypto';

const scrypt = promisify(crypto.scrypt);

export async function hashPassword(password: string, salt: string) {
  const hash = await scrypt(password, salt, 64) as Buffer;

  return hash.toString('hex');
}

export function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

export async function comparePassword(
  password: string, hashedPassword: string, salt: string
) {
  const inputHashedPassword = await hashPassword(password, salt);
  
  return crypto.timingSafeEqual(
    Buffer.from(inputHashedPassword, 'hex'),
    Buffer.from(hashedPassword, 'hex')
  );
}
