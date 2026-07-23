import { NextRequest } from "next/server";
import { applicationService } from "@/services/application.service";
import { requireAuth } from "@/lib/auth";
import {
  ApplicationQuerySchema,
  CreateApplicationSchema,
} from "@/lib/validations";
import {
  handleApiError,
  paginatedMeta,
  successResponse,
} from "@/lib/api-response";
import { parseBody, parseQuery } from "@/utils/parse-request";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const query = parseQuery(
      ApplicationQuerySchema,
      request.nextUrl.searchParams,
    );
    const result = await applicationService.listApplications(user, query);

    return successResponse(
      result.items,
      200,
      paginatedMeta(result.page, result.limit, result.total),
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const input = parseBody(CreateApplicationSchema, body);
    const application = await applicationService.createApplication(user, input);

    return successResponse(application, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
