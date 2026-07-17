import { updateApplicationSchema } from "@/lib/validations";
import { applicationService } from "@/services/application.service";
import { requireRole, requireUser } from "@/lib/session";
import { successResponse, withErrorHandling } from "@/lib/api-response";

type Params = { params: Promise<{ applicationId: string }> };

// GET /api/applications/:applicationId
// Accessible by the owning candidate or the employer who owns the job.
export const GET = withErrorHandling(async (_req: Request, { params }: Params) => {
  const { applicationId } = await params;
  const user = await requireUser();
  const application = await applicationService.getById(user.id, user.role, applicationId);
  return successResponse(application);
});

// PATCH /api/applications/:applicationId — employer updates status
export const PATCH = withErrorHandling(async (req: Request, { params }: Params) => {
  const { applicationId } = await params;
  const employer = await requireRole("EMPLOYER");
  const body = await req.json();
  const { status } = updateApplicationSchema.parse(body);
  const application = await applicationService.updateStatus(employer.id, applicationId, status);
  return successResponse(application);
});
