import { NextRequest } from "next/server";
import { jobService } from "@/services/job.service";
import { requireEmployer } from "@/lib/auth";
import { CreateJobSchema, JobQuerySchema } from "@/lib/validations";
import {
  handleApiError,
  paginatedMeta,
  successResponse,
} from "@/lib/api-response";
import { parseBody, parseQuery } from "@/utils/parse-request";

export async function GET(request: NextRequest) {
  try {
    const query = parseQuery(JobQuerySchema, request.nextUrl.searchParams);
    const result = await jobService.listJobs(query);

    return successResponse(result.items, 200, paginatedMeta(result.page, result.limit, result.total));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireEmployer();
    const body = await request.json();
    const input = parseBody(CreateJobSchema, body);
    const job = await jobService.createJob(user, input);

    return successResponse(job, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
