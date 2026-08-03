import { env } from "@/lib/env";

export function applySecurityHeaders(headers: Headers): void {
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-XSS-Protection", "1; mode=block");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (env.NODE_ENV === "production") {
    headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
}

export function applyCorsHeaders(headers: Headers, origin: string | null): void {
  const allowedOrigin = env.NEXTAUTH_URL ? new URL(env.NEXTAUTH_URL).origin : "*";
  
  if (origin === allowedOrigin || !origin) {
    headers.set("Access-Control-Allow-Origin", origin || allowedOrigin);
  } else {
    headers.set("Access-Control-Allow-Origin", "null");
  }

  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Access-Control-Allow-Credentials", "true");
}
