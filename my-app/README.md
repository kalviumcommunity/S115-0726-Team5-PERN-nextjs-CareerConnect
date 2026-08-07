# CareerConnect — Premium Job Portal

A production-ready job portal built with Next.js App Router, PostgreSQL, Prisma, NextAuth, and Socket.IO.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 6 |
| Authentication | NextAuth v4 (JWT + Credentials) |
| Validation | Zod |
| Real-time | Socket.IO |
| Logging | Pino |
| Styling | Tailwind CSS 4 |
| Deployment | Docker / Render |

## Architecture

```
Request → Middleware → Route Handler → Service → Repository → Prisma → PostgreSQL
```

### Directory Structure

```
src/
├── app/                    # Next.js App Router (pages + API routes)
│   ├── (auth)/             # Auth pages (login, register)
│   ├── (candidate)/        # Candidate dashboard, jobs, applications, profile
│   ├── (employer)/         # Employer dashboard, post jobs, manage applications
│   └── api/                # REST API routes
│       ├── applications/   # CRUD + batch update
│       ├── auth/           # NextAuth + register + logout
│       ├── companies/      # Company profiles CRUD
│       ├── dashboard/      # Role-based statistics
│       ├── jobs/           # Job listings CRUD
│       ├── notifications/  # Notification management
│       └── users/          # User profile management
├── components/             # Reusable UI components
├── context/                # React context (AppContext)
├── lib/                    # Core libraries
│   ├── api-response.ts     # Standardized API responses
│   ├── auth.ts             # NextAuth config + helpers
│   ├── env.ts              # Environment validation (Zod)
│   ├── errors.ts           # Custom error classes
│   ├── logger.ts           # Pino logger
│   ├── prisma.ts           # Prisma client singleton
│   ├── rate-limit.ts       # Token bucket rate limiter
│   ├── security-headers.ts # Security headers (Helmet equivalent)
│   └── validations.ts      # Zod validation schemas
├── repositories/           # Data access layer
├── services/               # Business logic layer
├── socket/                 # Socket.IO server + emitter
├── types/                  # TypeScript types + declarations
├── utils/                  # Utility functions
└── proxy.ts               # Next.js 16 proxy (auth + security)
```

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (local or Neon)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd my-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and secrets

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed the database (optional)
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

### Default Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| Employer | employer@apna.co | Password123! |
| Candidate | rahul@example.com | Password123! |
| Candidate | priya@example.com | Password123! |
| Admin | admin@careerconnect.com | Password123! |

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| DATABASE_URL | Yes | — | PostgreSQL connection string |
| DIRECT_URL | Yes | — | Prisma direct (non-pooled) connection string |
| NEXTAUTH_SECRET | Yes | — | JWT signing secret (min 32 chars) |
| NEXTAUTH_URL | Yes | — | Application URL (must match public URL in production) |
| NODE_ENV | No | development | Environment mode |
| PORT | No | 3000 | Server port |
| LOG_LEVEL | No | info | Logging level |

## API Response Format

### Success
```json
{
  "success": true,
  "message": "Success",
  "data": { ... },
  "meta": { "page": 1, "limit": 10, "total": 50, "totalPages": 5 }
}
```

### Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email address" }
  ]
}
```

## Roles & Permissions

| Action | Candidate | Employer | Admin |
|--------|-----------|----------|-------|
| View Jobs | ✅ | ✅ | ✅ |
| Apply to Jobs | ✅ | ❌ | ❌ |
| Post Jobs | ❌ | ✅ | ❌ |
| Manage Applications | Own only | Own jobs | ❌ |
| Manage Companies | ❌ | ✅ | ❌ |
| Dashboard Stats | ✅ | ✅ | ✅ |

## Security Features

- JWT authentication with secure session management
- Role-based access control (RBAC) at middleware + service layer
- Security headers (X-Content-Type-Options, X-Frame-Options, CSP, HSTS)
- CORS configuration
- Rate limiting (60 req/min API, 10 req/min auth)
- Input validation with Zod on every endpoint
- SQL injection prevention (Prisma parameterized queries)
- Password hashing with bcrypt (12 rounds)
- Environment variable validation at startup

## Docker

```bash
# Build the image
docker build -t careerconnect .

# Run the container locally
docker run -p 10000:10000 \
  -e DATABASE_URL="your-db-url" \
  -e DIRECT_URL="your-db-url" \
  -e NEXTAUTH_SECRET="your-secret" \
  -e NEXTAUTH_URL="http://localhost:10000" \
  careerconnect
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

## License

MIT
