import { ApplicationStatus, Role } from "@prisma/client";
import { applicationRepository } from "@/repositories/application.repository";
import { jobRepository } from "@/repositories/job.repository";
import { notificationService } from "@/services/notification.service";
import { socketService } from "@/services/socket.service";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "@/lib/errors";
import type {
  ApplicationQueryInput,
  ApplicationStatusInput,
  BatchUpdateApplicationsInput,
  CreateApplicationInput,
} from "@/lib/validations";
import type { AuthenticatedUser } from "@/types";

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING: "Pending",
  VIEWED: "Viewed",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
  ACCEPTED: "Accepted",
};

function assertCanAccessApplication(
  user: AuthenticatedUser,
  application: NonNullable<
    Awaited<ReturnType<typeof applicationRepository.findById>>
  >,
) {
  const isCandidate = user.role === Role.CANDIDATE && application.candidateId === user.id;
  const isEmployer =
    user.role === Role.EMPLOYER &&
    application.job.employerId === user.id;

  if (!isCandidate && !isEmployer) {
    throw new ForbiddenError("You do not have access to this application");
  }
}

async function notifyStatusChange(
  candidateId: string,
  jobTitle: string,
  company: string,
  status: ApplicationStatus,
  application: NonNullable<
    Awaited<ReturnType<typeof applicationRepository.findById>>
  >,
) {
  const title = "Application status updated";
  const message = `Your application for ${jobTitle} at ${company} is now ${STATUS_LABELS[status]}.`;

  await notificationService.createAndNotify(candidateId, title, message);

  await socketService.emitApplicationUpdated(candidateId, {
    application: {
      id: application.id,
      candidateId: application.candidateId,
      jobId: application.jobId,
      status: application.status,
      updatedAt: application.updatedAt.toISOString(),
      job: {
        id: application.job.id,
        title: application.job.title,
        company: application.job.company,
      },
    },
  });
}

export const applicationService = {
  async createApplication(
    user: AuthenticatedUser,
    input: CreateApplicationInput,
  ) {
    if (user.role !== Role.CANDIDATE) {
      throw new ForbiddenError("Only candidates can apply to jobs");
    }

    const job = await jobRepository.findById(input.jobId);
    if (!job) {
      throw new NotFoundError("Job not found");
    }

    const existing = await applicationRepository.findByCandidateAndJob(
      user.id,
      input.jobId,
    );
    if (existing) {
      throw new ConflictError("You have already applied to this job");
    }

    const application = await applicationRepository.create({
      candidateId: user.id,
      jobId: input.jobId,
      ...(input.coverLetter ? { coverLetter: input.coverLetter } : {}),
    });

    await notificationService.createAndNotify(
      user.id,
      "Application submitted",
      `Your application for ${job.title} at ${job.company} has been submitted.`,
    );

    return application;
  },

  async listApplications(user: AuthenticatedUser, query: ApplicationQueryInput) {
    if (user.role === Role.CANDIDATE) {
      return applicationRepository.findManyForCandidate(user.id, query);
    }

    if (user.role === Role.EMPLOYER) {
      return applicationRepository.findManyForEmployer(user.id, query);
    }

    throw new ForbiddenError("Invalid role for listing applications");
  },

  async getApplicationById(user: AuthenticatedUser, id: string) {
    const application = await applicationRepository.findById(id);
    if (!application) {
      throw new NotFoundError("Application not found");
    }

    assertCanAccessApplication(user, application);
    return application;
  },

  async updateApplicationStatus(
    user: AuthenticatedUser,
    id: string,
    input: ApplicationStatusInput,
  ) {
    if (user.role !== Role.EMPLOYER) {
      throw new ForbiddenError("Only employers can update application status");
    }

    const application = await applicationRepository.findById(id);
    if (!application) {
      throw new NotFoundError("Application not found");
    }

    if (application.job.employerId !== user.id) {
      throw new ForbiddenError(
        "You can only update applications for your own jobs",
      );
    }

    const updated = await applicationRepository.updateStatus(
      id,
      input.status as ApplicationStatus,
    );

    if (updated.status !== application.status) {
      await notifyStatusChange(
        updated.candidateId,
        updated.job.title,
        updated.job.company,
        updated.status,
        updated,
      );
    }

    return updated;
  },

  async batchUpdateApplicationStatus(
    user: AuthenticatedUser,
    input: BatchUpdateApplicationsInput,
  ) {
    if (user.role !== Role.EMPLOYER) {
      throw new ForbiddenError("Only employers can batch update applications");
    }

    const applications = await applicationRepository.findManyByIds(
      input.applicationIds,
    );

    if (applications.length !== input.applicationIds.length) {
      throw new NotFoundError("One or more applications were not found");
    }

    const unauthorized = applications.some(
      (app) => app.job.employerId !== user.id,
    );
    if (unauthorized) {
      throw new ForbiddenError(
        "You can only update applications for your own jobs",
      );
    }

    const [, updatedApplications] =
      await applicationRepository.batchUpdateStatus(
        input.applicationIds,
        input.status as ApplicationStatus,
      );

    const candidateIds = updatedApplications.map((app) => app.candidateId);

    for (const app of updatedApplications) {
      await notificationService.createAndNotify(
        app.candidateId,
        "Application status updated",
        `Your application for ${app.job.title} at ${app.job.company} is now ${STATUS_LABELS[input.status as ApplicationStatus]}.`,
      );
    }

    await socketService.emitApplicationBatchUpdated(candidateIds, {
      applications: updatedApplications.map((app) => ({
        id: app.id,
        candidateId: app.candidateId,
        jobId: app.jobId,
        status: app.status,
        updatedAt: app.updatedAt.toISOString(),
      })),
      status: input.status,
    });

    return updatedApplications;
  },
};
