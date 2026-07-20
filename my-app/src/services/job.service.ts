import { jobRepository } from "@/repositories/job.repository";
import { ApiError } from "@/lib/api-response";
import type { CreateJobInput, ListJobsQuery, UpdateJobInput } from "@/lib/validations";

export const jobService = {
  async list(query: ListJobsQuery) {
    const { items, total } = await jobRepository.findMany(query);
    return {
      jobs: items,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },

  async listForEmployer(employerId: string, query: ListJobsQuery) {
    const { items, total } = await jobRepository.findByEmployer(employerId, query);
    return {
      jobs: items,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },

  async getById(id: string) {
    const job = await jobRepository.findById(id);
    if (!job) throw ApiError.notFound("Job not found");
    return job;
  },

  async create(employerId: string, input: CreateJobInput) {
    return jobRepository.create({ ...input, employerId });
  },

  async update(employerId: string, jobId: string, input: UpdateJobInput) {
    const job = await jobRepository.findById(jobId);
    if (!job) throw ApiError.notFound("Job not found");
    if (job.employerId !== employerId) {
      throw ApiError.forbidden("You can only edit jobs you posted");
    }
    return jobRepository.update(jobId, input);
  },

  async delete(employerId: string, jobId: string) {
    const job = await jobRepository.findById(jobId);
    if (!job) throw ApiError.notFound("Job not found");
    if (job.employerId !== employerId) {
      throw ApiError.forbidden("You can only delete jobs you posted");
    }
    await jobRepository.delete(jobId);
  },
};
