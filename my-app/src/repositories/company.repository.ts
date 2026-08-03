import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateCompanyInput, CompanyQueryInput, UpdateCompanyInput } from "@/lib/validations";

const companyInclude = {
  employer: {
    select: { id: true, name: true, email: true },
  },
  _count: {
    select: { jobs: true },
  },
} satisfies Prisma.CompanyInclude;

export const companyRepository = {
  create(data: CreateCompanyInput & { employerId: string }) {
    return prisma.company.create({
      data,
      include: companyInclude,
    });
  },

  findById(id: string) {
    return prisma.company.findUnique({
      where: { id },
      include: companyInclude,
    });
  },

  findByEmployerId(employerId: string) {
    return prisma.company.findMany({
      where: { employerId },
      include: companyInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  findByEmployerIdAndName(employerId: string, name: string) {
    return prisma.company.findUnique({
      where: {
        employerId_name: {
          employerId,
          name,
        },
      },
    });
  },

  update(id: string, data: UpdateCompanyInput) {
    return prisma.company.update({
      where: { id },
      data,
      include: companyInclude,
    });
  },

  delete(id: string) {
    return prisma.company.delete({ where: { id } });
  },

  async findMany(query: CompanyQueryInput) {
    const { page, limit, search, industry } = query;

    const where: Prisma.CompanyWhereInput = {
      ...(industry ? { industry } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { location: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: companyInclude,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.company.count({ where }),
    ]);

    return { items, total, page, limit };
  },
};
