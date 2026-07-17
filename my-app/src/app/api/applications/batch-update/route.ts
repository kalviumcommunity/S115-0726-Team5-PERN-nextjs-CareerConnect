import { batchUpdateApplicationSchema } from "@/lib/validations";
import { applicationService } from "@/services/application.service";
import { requireRole } from "@/lib/session";
import { successResponse, withErrorHandling } from "@/lib/api-response";

// PATCH /api/applications/batch-update
// Body: { applicationIds: string[], status: ApplicationStatus }
export const PATCH = withErrorHandling(async (req: Request) => {
  const employer = await requireRole("EMPLOYER");
  const body = await req.json();
  const input = batchUpdateApplicationSchema.parse(body);
  const result = await applicationService.batchUpdateStatus(employer.id, input);
  return successResponse(result);
});
