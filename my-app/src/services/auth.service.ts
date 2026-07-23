import { Role } from "@prisma/client";
import { authRepository } from "@/repositories/auth.repository";
import { ConflictError } from "@/lib/errors";
import { hashPassword, verifyPassword, sanitizeUser } from "@/utils/password";
import type { LoginInput, RegisterInput } from "@/lib/validations";

export const authService = {
  async register(input: RegisterInput) {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError("Email is already registered");
    }

    const hashedPassword = await hashPassword(input.password);
    const user = await authRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role as Role,
    });

    return sanitizeUser(user);
  },

  async validateCredentials(input: LoginInput) {
    const user = await authRepository.findByEmail(input.email);
    if (!user) {
      return null;
    }

    const isValid = await verifyPassword(input.password, user.password);
    if (!isValid) {
      return null;
    }

    return sanitizeUser(user);
  },
};
