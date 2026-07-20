import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Fine-grained role checks (e.g. "only the owning employer can edit this
// specific job") still happen in the service layer, since middleware can't
// see resource ownership. This middleware only handles the coarse-grained
// "must be logged in" / "must have role X" checks so unauthenticated or
// wrong-role requests are rejected before hitting business logic.
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    const isEmployerMutation =
      pathname.startsWith("/api/jobs") &&
      ["POST", "PUT", "DELETE"].includes(req.method);
    const isBatchUpdate = pathname.startsWith("/api/applications/batch-update");
    const isApplicationPatch =
      pathname.match(/^\/api\/applications\/[^/]+$/) && req.method === "PATCH";

    if ((isEmployerMutation || isBatchUpdate || isApplicationPatch) && role !== "EMPLOYER") {
      return NextResponse.json(
        { success: false, error: { message: "Forbidden", code: "FORBIDDEN" } },
        { status: 403 }
      );
    }

    const isApplicationCreate =
      pathname === "/api/applications" && req.method === "POST";
    if (isApplicationCreate && role !== "CANDIDATE") {
      return NextResponse.json(
        { success: false, error: { message: "Forbidden", code: "FORBIDDEN" } },
        { status: 403 }
      );
    }

    return NextResponse.next();
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
          (pathname.match(/^\/api\/jobs\/[^/]+$/) && req.method === "GET");

        if (isPublic) return true;

        // Everything else under /api requires a valid session.
        if (pathname.startsWith("/api")) return !!token;

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/api/jobs/:path*", "/api/applications/:path*", "/api/notifications/:path*"],
};
