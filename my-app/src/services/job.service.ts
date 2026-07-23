import { Role } from "@prisma/client";
import { jobRepository } from "@/repositories/job.repository";
import { ForbiddenError, NotFoundError } from "@/lib/errors";
import type {
  CreateJobInput,
  JobQueryInput,
  UpdateJobInput,
} from "@/lib/validations";
import type { AuthenticatedUser } from "@/types";

export const jobService = {
  async listJobs(query: JobQueryInput) {
    return jobRepository.findMany(query);
  },

  async getJobById(id: string) {
    const job = await jobRepository.findById(id);
    if (!job) {
      throw new NotFoundError("Job not found");
    }
    return job;
  },

  async createJob(user: AuthenticatedUser, input: CreateJobInput) {
    if (user.role !== Role.EMPLOYER) {
      throw new ForbiddenError("Only employers can create jobs");
    }

    return jobRepository.create({
      ...input,
      employerId: user.id,
    });
  },

  async updateJob(
    user: AuthenticatedUser,
    id: string,
    input: UpdateJobInput,
  ) {
    const job = await this.getJobById(id);

    if (user.role !== Role.EMPLOYER || job.employerId !== user.id) {
      throw new ForbiddenError("You can only update your own jobs");
    }

    return jobRepository.update(id, input);
  },

  async deleteJob(user: AuthenticatedUser, id: string) {
    const job = await this.getJobById(id);

    if (user.role !== Role.EMPLOYER || job.employerId !== user.id) {
      throw new ForbiddenError("You can only delete your own jobs");
    }

    await jobRepository.delete(id);
    return { id };
  },
};
