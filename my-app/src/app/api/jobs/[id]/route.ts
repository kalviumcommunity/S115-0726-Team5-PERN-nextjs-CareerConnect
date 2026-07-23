import { NextRequest } from "next/server";
import { jobService } from "@/services/job.service";
import { requireEmployer } from "@/lib/auth";
import { UpdateJobSchema } from "@/lib/validations";
import { handleApiError, successResponse } from "@/lib/api-response";
import { parseBody } from "@/utils/parse-request";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const job = await jobService.getJobById(id);
    return successResponse(job);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireEmployer();
    const { id } = await context.params;
    const body = await request.json();
    const input = parseBody(UpdateJobSchema, body);
    const job = await jobService.updateJob(user, id, input);

    return successResponse(job);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const user = await requireEmployer();
    const { id } = await context.params;
    const result = await jobService.deleteJob(user, id);

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}
