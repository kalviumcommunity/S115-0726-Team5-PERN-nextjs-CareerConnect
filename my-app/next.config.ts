import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Custom server (server.ts) handles HTTP — do not use "standalone" output
  // because that requires copying additional static files that our Dockerfile
  // already handles explicitly.
  reactStrictMode: true,
  serverExternalPackages: ["pino", "pino-pretty"],
};

export default nextConfig;
