import { updateJobSchema } from "@/lib/validations";
import { jobService } from "@/services/job.service";
import { requireRole } from "@/lib/session";
import { successResponse, withErrorHandling } from "@/lib/api-response";

type Params = { params: Promise<{ jobId: string }> };

// GET /api/jobs/:jobId — public
export const GET = withErrorHandling(async (_req: Request, { params }: Params) => {
  const { jobId } = await params;
  const job = await jobService.getById(jobId);
  return successResponse(job);
});

// PUT /api/jobs/:jobId — employer, must own the job
export const PUT = withErrorHandling(async (req: Request, { params }: Params) => {
  const { jobId } = await params;
  const employer = await requireRole("EMPLOYER");
  const body = await req.json();
  const input = updateJobSchema.parse(body);
  const job = await jobService.update(employer.id, jobId, input);
  return successResponse(job);
});

// DELETE /api/jobs/:jobId — employer, must own the job
export const DELETE = withErrorHandling(async (_req: Request, { params }: Params) => {
  const { jobId } = await params;
  const employer = await requireRole("EMPLOYER");
  await jobService.delete(employer.id, jobId);
  return successResponse({ deleted: true });
});
