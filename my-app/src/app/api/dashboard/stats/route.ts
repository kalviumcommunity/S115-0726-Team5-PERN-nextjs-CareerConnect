import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { handleApiError, successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET(_request: NextRequest) {
  try {
    const user = await requireAuth();

    if (user.role === Role.EMPLOYER) {
      const [totalJobs, activeJobs, totalApplications, applicationsByStatus] =
        await Promise.all([
          prisma.job.count({ where: { employerId: user.id } }),
          prisma.job.count({ where: { employerId: user.id, isActive: true } }),
          prisma.application.count({ where: { job: { employerId: user.id } } }),
          prisma.application.groupBy({
            by: ["status"],
            where: { job: { employerId: user.id } },
            _count: true,
          }),
        ]);

      return successResponse({
        totalJobs,
        activeJobs,
        totalApplications,
        applicationsByStatus: applicationsByStatus.reduce(
          (acc, item) => ({ ...acc, [item.status]: item._count }),
          {} as Record<string, number>,
        ),
      });
    }

    if (user.role === Role.CANDIDATE) {
      const [totalApplications, applicationsByStatus, unreadNotifications] =
        await Promise.all([
          prisma.application.count({ where: { candidateId: user.id } }),
          prisma.application.groupBy({
            by: ["status"],
            where: { candidateId: user.id },
            _count: true,
          }),
          prisma.notification.count({
            where: { userId: user.id, isRead: false },
          }),
        ]);

      return successResponse({
        totalApplications,
        applicationsByStatus: applicationsByStatus.reduce(
          (acc, item) => ({ ...acc, [item.status]: item._count }),
          {} as Record<string, number>,
        ),
        unreadNotifications,
      });
    }

    return successResponse({});
  } catch (error) {
    return handleApiError(error);
  }
}
