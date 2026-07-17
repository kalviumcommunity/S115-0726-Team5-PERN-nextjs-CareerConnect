import { registerSchema } from "@/lib/validations";
import { authService } from "@/services/auth.service";
import { successResponse, withErrorHandling } from "@/lib/api-response";

export const POST = withErrorHandling(async (req: Request) => {
  const body = await req.json();
  const input = registerSchema.parse(body);
  const user = await authService.register(input);
  return successResponse(user, 201);
});
