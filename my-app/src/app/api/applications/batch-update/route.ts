import { NextRequest } from "next/server";
import { applicationService } from "@/services/application.service";
import { requireAuth } from "@/lib/auth";
import { BatchUpdateApplicationsSchema } from "@/lib/validations";
import { handleApiError, successResponse } from "@/lib/api-response";
import { parseBody } from "@/utils/parse-request";

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const input = parseBody(BatchUpdateApplicationsSchema, body);
    const applications = await applicationService.batchUpdateApplicationStatus(
      user,
      input,
    );

    return successResponse(applications);
  } catch (error) {
    return handleApiError(error);
  }
}
