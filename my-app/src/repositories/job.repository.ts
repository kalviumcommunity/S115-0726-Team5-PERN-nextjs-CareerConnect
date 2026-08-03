import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateJobInput, JobQueryInput, UpdateJobInput } from "@/lib/validations";

const jobInclude = {
  employer: {
    select: { id: true, name: true, email: true },
  },
  companyRef: {
    select: { id: true, name: true, logo: true, industry: true },
  },
  _count: {
    select: { applications: true },
  },
} satisfies Prisma.JobInclude;

export const jobRepository = {
  create(data: CreateJobInput & { employerId: string }) {
    return prisma.job.create({
      data,
      include: jobInclude,
    });
  },

  findById(id: string) {
    return prisma.job.findUnique({
      where: { id },
      include: jobInclude,
    });
  },

  update(id: string, data: UpdateJobInput) {
    return prisma.job.update({
      where: { id },
      data,
      include: jobInclude,
    });
  },

  delete(id: string) {
    return prisma.job.delete({ where: { id } });
  },

  async findMany(query: JobQueryInput) {
    const {
      page,
      limit,
      search,
      location,
      jobType,
      experienceLevel,
      category,
      isActive,
      sort,
      order,
      employerId,
    } = query;

    const where: Prisma.JobWhereInput = {
      ...(employerId ? { employerId } : {}),
      ...(isActive !== undefined ? { isActive } : { isActive: true }),
      ...(jobType ? { jobType } : {}),
      ...(experienceLevel ? { experienceLevel } : {}),
      ...(category ? { category } : {}),
      ...(location
        ? { location: { contains: location, mode: "insensitive" } }
        : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { company: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { location: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: jobInclude,
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.job.count({ where }),
    ]);

    return { items, total, page, limit };
  },

  countByEmployer(employerId: string) {
    return prisma.job.count({ where: { employerId } });
  },

  countActiveByEmployer(employerId: string) {
    return prisma.job.count({ where: { employerId, isActive: true } });
  },
};
