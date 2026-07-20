import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApiError } from "@/lib/api-response";

export async function getCurrentSession() {
  return getServerSession(authOptions);
}

/**
 * Use inside API routes/services when a request MUST be authenticated.
 * Throws a 401 ApiError (caught by withErrorHandling) if not.
 */
export async function requireUser() {
  const session = await getCurrentSession();
  if (!session?.user) {
    throw ApiError.unauthorized("You must be logged in to perform this action");
  }
  return session.user;
}

/**
 * Use when a request MUST be authenticated AND have a specific role.
 */
export async function requireRole(role: "CANDIDATE" | "EMPLOYER") {
  const user = await requireUser();
  if (user.role !== role) {
    throw ApiError.forbidden(`This action requires the ${role} role`);
  }
  return user;
}
