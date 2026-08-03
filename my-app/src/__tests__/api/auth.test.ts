import { authService } from "@/services/auth.service";
import { prisma } from "@/lib/prisma";
import { clearDatabase, disconnectDatabase } from "../helpers/setup";

describe("Auth Service", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await disconnectDatabase();
  });

  describe("register", () => {
    it("should register a new candidate", async () => {
      const input = {
        name: "Test User",
        email: "test@example.com",
        password: "Password123!",
        role: "CANDIDATE" as const,
      };

      const user = await authService.register(input);

      expect(user).toBeDefined();
      expect(user.email).toBe(input.email);
      expect(user.name).toBe(input.name);
      expect(user.role).toBe("CANDIDATE");
      expect((user as any).password).toBeUndefined();
    });

    it("should not allow duplicate emails", async () => {
      const input = {
        name: "Test User",
        email: "test@example.com",
        password: "Password123!",
        role: "CANDIDATE" as const,
      };

      await authService.register(input);

      await expect(authService.register(input)).rejects.toThrow(
        "Email is already registered"
      );
    });
  });

  describe("validateCredentials", () => {
    it("should validate correct credentials", async () => {
      const input = {
        name: "Test User",
        email: "test@example.com",
        password: "Password123!",
        role: "CANDIDATE" as const,
      };

      await authService.register(input);

      const user = await authService.validateCredentials({
        email: input.email,
        password: input.password,
      });

      expect(user).toBeDefined();
      expect(user?.email).toBe(input.email);
    });

    it("should return null for invalid credentials", async () => {
      const user = await authService.validateCredentials({
        email: "nonexistent@example.com",
        password: "WrongPassword123!",
      });

      expect(user).toBeNull();
    });
  });
});
