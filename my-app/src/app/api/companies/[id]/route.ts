import { NextRequest } from "next/server";
import { companyService } from "@/services/company.service";
import { requireEmployer } from "@/lib/auth";
import { UpdateCompanySchema } from "@/lib/validations";
import { handleApiError, successResponse } from "@/lib/api-response";
import { parseBody } from "@/utils/parse-request";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const company = await companyService.getCompanyById(id);
    return successResponse(company);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireEmployer();
    const { id } = await context.params;
    const body = await request.json();
    const input = parseBody(UpdateCompanySchema, body);
    const company = await companyService.updateCompany(user, id, input);

    return successResponse(company);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const user = await requireEmployer();
    const { id } = await context.params;
    const result = await companyService.deleteCompany(user, id);

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}
