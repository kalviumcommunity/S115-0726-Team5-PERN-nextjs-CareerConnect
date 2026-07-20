import { applicationRepository } from "@/repositories/application.repository";
import { jobRepository } from "@/repositories/job.repository";
import { notificationRepository } from "@/repositories/notification.repository";
import { socketService } from "@/services/socket.service";
import { ApiError } from "@/lib/api-response";
import type {
  ListApplicationsQuery,
  BatchUpdateApplicationInput,
} from "@/lib/validations";
import type { ApplicationStatus } from "@prisma/client";

const STATUS_MESSAGES: Record<ApplicationStatus, string> = {
  PENDING: "is pending review",
  VIEWED: "has been viewed by the employer",
  SHORTLISTED: "has been shortlisted",
  REJECTED: "was not selected this time",
  ACCEPTED: "has been accepted",
};

function paginationMeta(query: ListApplicationsQuery, total: number) {
  return {
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.ceil(total / query.limit),
  };
}

export const applicationService = {
  async apply(candidateId: string, jobId: string) {
    const job = await jobRepository.findById(jobId);
    if (!job) throw ApiError.notFound("Job not found");

    const existing = await applicationRepository.findExisting(candidateId, jobId);
    if (existing) {
      throw ApiError.conflict("You have already applied to this job");
    }

    return applicationRepository.create({ candidateId, jobId });
  },

  async listForCandidate(candidateId: string, query: ListApplicationsQuery) {
    const { items, total } = await applicationRepository.findByCandidate(candidateId, query);
    return { applications: items, pagination: paginationMeta(query, total) };
  },

  async listForEmployer(employerId: string, query: ListApplicationsQuery) {
    const { items, total } = await applicationRepository.findByEmployer(employerId, query);
    return { applications: items, pagination: paginationMeta(query, total) };
  },

  async getById(userId: string, role: "CANDIDATE" | "EMPLOYER", applicationId: string) {
    const application = await applicationRepository.findById(applicationId);
    if (!application) throw ApiError.notFound("Application not found");

    const isOwner =
      role === "CANDIDATE"
        ? application.candidateId === userId
        : application.job.employerId === userId;

    if (!isOwner) throw ApiError.forbidden("You do not have access to this application");
    return application;
  },

  /**
   * Employer updates a single application's status. Creates a notification
   * for the candidate and emits a real-time socket event.
   */
  async updateStatus(employerId: string, applicationId: string, status: ApplicationStatus) {
    const application = await applicationRepository.findById(applicationId);
    if (!application) throw ApiError.notFound("Application not found");
    if (application.job.employerId !== employerId) {
      throw ApiError.forbidden("You can only update applications for your own jobs");
    }

    const updated = await applicationRepository.updateStatus(applicationId, status);

    const notification = await notificationRepository.create({
      userId: updated.candidateId,
      title: `Application update: ${updated.job.title}`,
      message: `Your application for ${updated.job.title} at ${updated.job.company} ${STATUS_MESSAGES[status]}.`,
    });

    socketService.emitApplicationUpdated(updated.candidateId, updated);
    socketService.emitNewNotification(updated.candidateId, notification);

    return updated;
  },

  /**
   * Employer updates many applications at once (e.g. selecting rows and
   * bulk-marking as "Viewed"). Only applications belonging to jobs the
   * employer owns are updated; the rest are silently ignored to avoid
   * leaking information about applications the employer doesn't own.
   */
  async batchUpdateStatus(employerId: string, input: BatchUpdateApplicationInput) {
    const candidates = await applicationRepository.findManyByIds(input.applicationIds);
    const ownedIds = candidates
      .filter((a) => a.job.employerId === employerId)
      .map((a) => a.id);

    if (ownedIds.length === 0) {
      throw ApiError.forbidden("None of the specified applications belong to your jobs");
    }

    await applicationRepository.batchUpdateStatus(ownedIds, input.status);
    const updated = await applicationRepository.findManyByIds(ownedIds);

    const notifications = await Promise.all(
      updated.map((application) =>
        notificationRepository.create({
          userId: application.candidateId,
          title: `Application update: ${application.job.title}`,
          message: `Your application for ${application.job.title} at ${application.job.company} ${STATUS_MESSAGES[input.status]}.`,
        })
      )
    );

    socketService.emitBatchApplicationsUpdated(updated);
    notifications.forEach((notification) =>
      socketService.emitNewNotification(notification.userId, notification)
    );

    return { updatedCount: ownedIds.length, applications: updated };
  },
};
