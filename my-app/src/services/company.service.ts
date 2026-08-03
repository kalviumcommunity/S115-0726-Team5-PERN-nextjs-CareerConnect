import { Role } from "@prisma/client";
import { companyRepository } from "@/repositories/company.repository";
import { ForbiddenError, NotFoundError, ConflictError } from "@/lib/errors";
import type {
  CreateCompanyInput,
  CompanyQueryInput,
  UpdateCompanyInput,
} from "@/lib/validations";
import type { AuthenticatedUser } from "@/types";

export const companyService = {
  async listCompanies(query: CompanyQueryInput) {
    return companyRepository.findMany(query);
  },

  async getCompanyById(id: string) {
    const company = await companyRepository.findById(id);
    if (!company) {
      throw new NotFoundError("Company not found");
    }
    return company;
  },

  async getMyCompanies(user: AuthenticatedUser) {
    if (user.role !== Role.EMPLOYER) {
      throw new ForbiddenError("Only employers can view their companies");
    }
    return companyRepository.findByEmployerId(user.id);
  },

  async createCompany(user: AuthenticatedUser, input: CreateCompanyInput) {
    if (user.role !== Role.EMPLOYER) {
      throw new ForbiddenError("Only employers can create companies");
    }

    const existingCompany = await companyRepository.findByEmployerIdAndName(
      user.id,
      input.name,
    );

    if (existingCompany) {
      throw new ConflictError(`You already have a company named "${input.name}"`);
    }

    return companyRepository.create({
      ...input,
      employerId: user.id,
    });
  },

  async updateCompany(
    user: AuthenticatedUser,
    id: string,
    input: UpdateCompanyInput,
  ) {
    const company = await this.getCompanyById(id);

    if (user.role !== Role.EMPLOYER || company.employerId !== user.id) {
      throw new ForbiddenError("You can only update your own companies");
    }

    if (input.name && input.name !== company.name) {
      const existingCompany = await companyRepository.findByEmployerIdAndName(
        user.id,
        input.name,
      );
      if (existingCompany) {
        throw new ConflictError(`You already have a company named "${input.name}"`);
      }
    }

    return companyRepository.update(id, input);
  },

  async deleteCompany(user: AuthenticatedUser, id: string) {
    const company = await this.getCompanyById(id);

    if (user.role !== Role.EMPLOYER || company.employerId !== user.id) {
      throw new ForbiddenError("You can only delete your own companies");
    }

    await companyRepository.delete(id);
    return { id };
  },
};
