import { prisma } from "@/lib/prisma";
import type { ApplicationStatus, Prisma } from "@prisma/client";
import type { ListApplicationsQuery } from "@/lib/validations";

export const applicationRepository = {
  findExisting(candidateId: string, jobId: string) {
    return prisma.application.findUnique({
      where: { candidateId_jobId: { candidateId, jobId } },
    });
  },

  create(data: { candidateId: string; jobId: string }) {
    return prisma.application.create({
      data,
      include: { job: true },
    });
  },

  findById(id: string) {
    return prisma.application.findUnique({
      where: { id },
      include: { job: true, candidate: { select: { id: true, name: true, email: true } } },
    });
  },

  // Applications submitted BY a candidate.
  findByCandidate(candidateId: string, query: ListApplicationsQuery) {
    const where: Prisma.ApplicationWhereInput = {
      candidateId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.jobId ? { jobId: query.jobId } : {}),
    };
    return this.paginate(where, query);
  },

  // Applications received FOR jobs owned by an employer.
  findByEmployer(employerId: string, query: ListApplicationsQuery) {
    const where: Prisma.ApplicationWhereInput = {
      job: { employerId },
      ...(query.status ? { status: query.status } : {}),
      ...(query.jobId ? { jobId: query.jobId } : {}),
    };
    return this.paginate(where, query);
  },

  async paginate(where: Prisma.ApplicationWhereInput, query: ListApplicationsQuery) {
    const [items, total] = await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: {
          job: { select: { id: true, title: true, company: true, employerId: true } },
          candidate: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.application.count({ where }),
    ]);
    return { items, total };
  },

  updateStatus(id: string, status: ApplicationStatus) {
    return prisma.application.update({
      where: { id },
      data: { status },
      include: { job: true, candidate: { select: { id: true, name: true, email: true } } },
    });
  },

  // Batch update returns the count updated; caller must re-fetch rows if it
  // needs full records for socket emission.
  async batchUpdateStatus(ids: string[], status: ApplicationStatus) {
    const result = await prisma.application.updateMany({
      where: { id: { in: ids } },
      data: { status },
    });
    return result.count;
  },

  findManyByIds(ids: string[]) {
    return prisma.application.findMany({
      where: { id: { in: ids } },
      include: { job: true, candidate: { select: { id: true, name: true, email: true } } },
    });
  },
};
