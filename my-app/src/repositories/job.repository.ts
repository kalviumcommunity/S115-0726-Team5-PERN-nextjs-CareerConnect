import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { ListJobsQuery } from "@/lib/validations";

function buildOrderBy(sort: ListJobsQuery["sort"]): Prisma.JobOrderByWithRelationInput {
  switch (sort) {
    case "oldest":
      return { createdAt: "asc" };
    case "salary_asc":
      return { salary: "asc" };
    case "salary_desc":
      return { salary: "desc" };
    case "latest":
    default:
      return { createdAt: "desc" };
  }
}

export const jobRepository = {
  async findMany(query: ListJobsQuery) {
    const where: Prisma.JobWhereInput = {
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: "insensitive" } },
              { company: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(query.location
        ? { location: { contains: query.location, mode: "insensitive" } }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: buildOrderBy(query.sort),
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: { _count: { select: { applications: true } } },
      }),
      prisma.job.count({ where }),
    ]);

    return { items, total };
  },

  async findByEmployer(employerId: string, query: ListJobsQuery) {
    const where: Prisma.JobWhereInput = {
      employerId,
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: "insensitive" } },
              { company: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };
    const [items, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: buildOrderBy(query.sort),
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: { _count: { select: { applications: true } } },
      }),
      prisma.job.count({ where }),
    ]);
    return { items, total };
  },

  findById(id: string) {
    return prisma.job.findUnique({
      where: { id },
      include: { _count: { select: { applications: true } } },
    });
  },

  create(data: {
    title: string;
    description: string;
    company: string;
    location: string;
    salary: number;
    employerId: string;
  }) {
    return prisma.job.create({ data });
  },

  update(id: string, data: Partial<Prisma.JobUpdateInput>) {
    return prisma.job.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.job.delete({ where: { id } });
  },
};
