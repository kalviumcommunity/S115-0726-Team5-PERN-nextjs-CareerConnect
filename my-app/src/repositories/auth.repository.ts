import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const authRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  create(data: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }) {
    return prisma.user.create({ data });
  },
};
