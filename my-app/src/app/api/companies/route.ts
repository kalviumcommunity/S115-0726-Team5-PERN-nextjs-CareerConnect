import { NextRequest } from "next/server";
import { companyService } from "@/services/company.service";
import { requireEmployer } from "@/lib/auth";
import { CreateCompanySchema, CompanyQuerySchema } from "@/lib/validations";
import {
  handleApiError,
  paginatedMeta,
  successResponse,
} from "@/lib/api-response";
import { parseBody, parseQuery } from "@/utils/parse-request";

export async function GET(request: NextRequest) {
  try {
    const query = parseQuery(CompanyQuerySchema, request.nextUrl.searchParams);
    const result = await companyService.listCompanies(query);

    return successResponse(result.items, 200, paginatedMeta(result.page, result.limit, result.total));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireEmployer();
    const body = await request.json();
    const input = parseBody(CreateCompanySchema, body);
    const company = await companyService.createCompany(user, input);

    return successResponse(company, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
