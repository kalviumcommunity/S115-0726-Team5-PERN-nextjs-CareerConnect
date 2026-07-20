import bcrypt from "bcrypt";
import { userRepository } from "@/repositories/user.repository";
import { ApiError } from "@/lib/api-response";
import type { RegisterInput } from "@/lib/validations";

const SALT_ROUNDS = 10;

export const authService = {
  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw ApiError.conflict("An account with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role,
    });

    // Never return the password hash to the client.
    const { password: _password, ...safeUser } = user;
    return safeUser;
  },

  /**
   * Used by the NextAuth Credentials provider. Returns the safe user
   * object on success, or null on invalid credentials (NextAuth expects
   * null rather than a thrown error for "authorize" failures).
   */
  async validateCredentials(email: string, password: string) {
    const user = await userRepository.findByEmail(email.toLowerCase());
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _password, ...safeUser } = user;
    return safeUser;
  },
};
