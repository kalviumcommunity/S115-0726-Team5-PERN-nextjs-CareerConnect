import { prisma } from "@/lib/prisma";

export interface UpdateUserProfileData {
  name?: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  resumeUrl?: string;
  resumeUpdatedAt?: Date;
}

export const userRepository = {
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  update(id: string, data: UpdateUserProfileData) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },
};
