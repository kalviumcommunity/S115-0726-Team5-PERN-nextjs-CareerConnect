import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { applySecurityHeaders, applyCorsHeaders } from "@/lib/security-headers";

// Fine-grained role checks (e.g. "only the owning employer can edit this
// specific job") still happen in the service layer, since middleware can't
// see resource ownership. This middleware only handles the coarse-grained
// "must be logged in" / "must have role X" checks so unauthenticated or
// wrong-role requests are rejected before hitting business logic.
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    // ── Handle CORS preflight ──────────────────────────────────────────
    if (req.method === "OPTIONS" && pathname.startsWith("/api")) {
      const response = new NextResponse(null, { status: 204 });
      applySecurityHeaders(response.headers);
      applyCorsHeaders(response.headers, req.headers.get("origin"));
      return response;
    }

    // ── Employer-only mutations ────────────────────────────────────────
    const isEmployerMutation =
      pathname.startsWith("/api/jobs") &&
      ["POST", "PUT", "DELETE"].includes(req.method);
    const isBatchUpdate = pathname.startsWith("/api/applications/batch-update");
    const isApplicationPatch =
      pathname.match(/^\/api\/applications\/[^/]+$/) && req.method === "PATCH";

    if ((isEmployerMutation || isBatchUpdate || isApplicationPatch) && role !== "EMPLOYER") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    // ── Candidate-only mutations ───────────────────────────────────────
    const isApplicationCreate =
      pathname === "/api/applications" && req.method === "POST";
    if (isApplicationCreate && role !== "CANDIDATE") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    // ── Apply security headers to response ─────────────────────────────
    const response = NextResponse.next();
    applySecurityHeaders(response.headers);

    if (pathname.startsWith("/api")) {
      applyCorsHeaders(response.headers, req.headers.get("origin"));
    }

    return response;
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;

        // Public, unauthenticated routes.
        const isPublic =
          pathname === "/api/auth/register" ||
          pathname.startsWith("/api/auth") ||
          (pathname === "/api/jobs" && req.method === "GET") ||
          (pathname.match(/^\/api\/jobs\/[^/]+$/) && req.method === "GET") ||
          (pathname.startsWith("/api/companies") && req.method === "GET");

        if (isPublic) return true;

        // Everything else under /api requires a valid session.
        if (pathname.startsWith("/api")) return !!token;

        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    "/api/jobs/:path*",
    "/api/applications/:path*",
    "/api/notifications/:path*",
    "/api/companies/:path*",
    "/api/users/:path*",
    "/api/dashboard/:path*",
  ],
};
