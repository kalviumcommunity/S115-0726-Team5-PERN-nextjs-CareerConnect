import { createJobSchema, listJobsQuerySchema } from "@/lib/validations";
import { jobService } from "@/services/job.service";
import { requireRole } from "@/lib/session";
import { successResponse, withErrorHandling } from "@/lib/api-response";

// GET /api/jobs?search=&location=&sort=&page=&limit=
// GET /api/jobs?mine=true  -> jobs posted by the authenticated employer
// Public by default: candidates (or anyone) can browse jobs without authenticating.
export const GET = withErrorHandling(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const mine = searchParams.get("mine") === "true";
  const query = listJobsQuerySchema.parse(Object.fromEntries(searchParams));

  if (mine) {
    const employer = await requireRole("EMPLOYER");
    const result = await jobService.listForEmployer(employer.id, query);
    return successResponse(result);
  }

  const result = await jobService.list(query);
  return successResponse(result);
});

// POST /api/jobs
// Employer only.
export const POST = withErrorHandling(async (req: Request) => {
  const employer = await requireRole("EMPLOYER");
  const body = await req.json();
  const input = createJobSchema.parse(body);
  const job = await jobService.create(employer.id, input);
  return successResponse(job, 201);
});
