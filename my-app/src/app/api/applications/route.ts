import { createApplicationSchema, listApplicationsQuerySchema } from "@/lib/validations";
import { applicationService } from "@/services/application.service";
import { requireRole, requireUser } from "@/lib/session";
import { successResponse, withErrorHandling } from "@/lib/api-response";

// POST /api/applications — candidate applies to a job
export const POST = withErrorHandling(async (req: Request) => {
  const candidate = await requireRole("CANDIDATE");
  const body = await req.json();
  const { jobId } = createApplicationSchema.parse(body);
  const application = await applicationService.apply(candidate.id, jobId);
  return successResponse(application, 201);
});

// GET /api/applications — candidates see their own applications,
// employers see applications received on their jobs.
export const GET = withErrorHandling(async (req: Request) => {
  const user = await requireUser();
  const { searchParams } = new URL(req.url);
  const query = listApplicationsQuerySchema.parse(Object.fromEntries(searchParams));

  const result =
    user.role === "CANDIDATE"
      ? await applicationService.listForCandidate(user.id, query)
      : await applicationService.listForEmployer(user.id, query);

  return successResponse(result);
});
