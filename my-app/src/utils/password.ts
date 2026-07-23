import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function sanitizeUser<T extends { password?: string }>(
  user: T,
): Omit<T, "password"> {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}
