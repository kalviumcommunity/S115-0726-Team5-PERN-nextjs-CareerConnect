import { NextRequest } from "next/server";
import { applicationService } from "@/services/application.service";
import { requireAuth } from "@/lib/auth";
import { ApplicationStatusSchema } from "@/lib/validations";
import { handleApiError, successResponse } from "@/lib/api-response";
import { parseBody } from "@/utils/parse-request";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const application = await applicationService.getApplicationById(user, id);

    return successResponse(application);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const body = await request.json();
    const input = parseBody(ApplicationStatusSchema, body);
    const application = await applicationService.updateApplicationStatus(
      user,
      id,
      input,
    );

    return successResponse(application);
  } catch (error) {
    return handleApiError(error);
  }
}
