import { prisma } from "@/lib/prisma";
import { JobInput } from "@/lib/validations";

export async function createJob(
  employerId: string,
  data: JobInput
) {
  return prisma.job.create({
    data: {
      ...data,
      employerId,
    },
  });
}

export async function getEmployerJobs(
  employerId: string
) {
  return prisma.job.findMany({
    where: {
      employerId,
    },
    include: {
      applications: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getJobById(id: string) {
  return prisma.job.findUnique({
    where: {
      id,
    },
  });
}

export async function updateJob(
  id: string,
  data: JobInput
) {
  return prisma.job.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteJob(id: string) {
  return prisma.job.delete({
    where: {
      id,
    },
  });
}