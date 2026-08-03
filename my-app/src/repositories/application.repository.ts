import { ApplicationStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ApplicationQueryInput } from "@/lib/validations";

const applicationInclude = {
  candidate: {
    select: { id: true, name: true, email: true },
  },
  job: {
    select: {
      id: true,
      title: true,
      company: true,
      location: true,
      employerId: true,
    },
  },
} satisfies Prisma.ApplicationInclude;

export const applicationRepository = {
  create(data: { candidateId: string; jobId: string; coverLetter?: string }) {
    return prisma.application.create({
      data,
      include: applicationInclude,
    });
  },

  findById(id: string) {
    return prisma.application.findUnique({
      where: { id },
      include: applicationInclude,
    });
  },

  findByCandidateAndJob(candidateId: string, jobId: string) {
    return prisma.application.findUnique({
      where: {
        candidateId_jobId: { candidateId, jobId },
      },
    });
  },

  updateStatus(id: string, status: ApplicationStatus) {
    return prisma.application.update({
      where: { id },
      data: { status },
      include: applicationInclude,
    });
  },

  batchUpdateStatus(ids: string[], status: ApplicationStatus) {
    return prisma.$transaction([
      prisma.application.updateMany({
        where: { id: { in: ids } },
        data: { status },
      }),
      prisma.application.findMany({
        where: { id: { in: ids } },
        include: applicationInclude,
      }),
    ]);
  },

  async findManyForCandidate(
    candidateId: string,
    query: ApplicationQueryInput,
  ) {
    const { page, limit, status, jobId } = query;
    const where: Prisma.ApplicationWhereInput = {
      candidateId,
      ...(status ? { status } : {}),
      ...(jobId ? { jobId } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: applicationInclude,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.application.count({ where }),
    ]);

    return { items, total, page, limit };
  },

  async findManyForEmployer(employerId: string, query: ApplicationQueryInput) {
    const { page, limit, status, jobId } = query;
    const where: Prisma.ApplicationWhereInput = {
      job: { employerId },
      ...(status ? { status } : {}),
      ...(jobId ? { jobId } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: applicationInclude,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.application.count({ where }),
    ]);

    return { items, total, page, limit };
  },

  findManyByIds(ids: string[]) {
    return prisma.application.findMany({
      where: { id: { in: ids } },
      include: applicationInclude,
    });
  },

  countByStatusForCandidate(candidateId: string) {
    return prisma.application.groupBy({
      by: ["status"],
      where: { candidateId },
      _count: true,
    });
  },

  countByStatusForEmployer(employerId: string) {
    return prisma.application.groupBy({
      by: ["status"],
      where: { job: { employerId } },
      _count: true,
    });
  },
};
