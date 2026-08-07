# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Build-time-only placeholders so `next build` can statically evaluate src/lib/env.ts.
# Render auto-passes any matching env vars you set in the dashboard/render.yaml as
# Docker build args, so real values take over automatically when configured there.
ARG DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ARG DIRECT_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ARG NEXTAUTH_SECRET="build-time-placeholder-secret-at-least-32-chars"
ARG NEXTAUTH_URL="http://localhost:3000"

RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
# No hardcoded ENV PORT here — Render injects PORT itself (default 10000) and
# server.ts already reads process.env.PORT. Don't shadow it with a fixed value.

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

USER nextjs

EXPOSE 10000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider "http://localhost:${PORT:-10000}/" || exit 1

CMD ["npx", "tsx", "server.ts"]
