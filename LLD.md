# Low-Level Design (LLD)

## 1. Directory Structure & Modules
The application follows a modular and layered architecture within the `my-app` directory:
- `src/app`: Next.js App Router routing logic and API endpoints.
- `src/components`: Reusable UI components.
- `src/services`: Business logic abstraction.
- `src/repositories`: Data access abstraction.
- `src/lib`: Core utilities (logger, Prisma singleton, NextAuth config).
- `src/socket`: Socket.IO client/server integration.

## 2. Database Schema (Prisma)
### 2.1 User & Roles
- **User**: Stores credentials, role (CANDIDATE, EMPLOYER, ADMIN), and profile info.
- **Company**: Linked to an Employer, stores company details.

### 2.2 Jobs & Applications
- **Job**: Stores job details (title, description, salary, type, category). Linked to an Employer and optionally a Company.
- **Application**: Join table between User (Candidate) and Job. Tracks `ApplicationStatus` (PENDING, VIEWED, SHORTLISTED, REJECTED, ACCEPTED).

### 2.3 Notifications
- **Notification**: Stores alerts for users, linked via `userId`. Tracks `NotificationType` and read status.

## 3. API Design
RESTful endpoints are structured under `src/app/api`:
- `POST /api/auth/register`: User registration.
- `GET /api/jobs`: Fetch jobs with filters and pagination.
- `POST /api/applications`: Submit an application.
- `PATCH /api/applications/[id]`: Update application status (Employer only).

### 3.1 Standard Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": { "page": 1, "limit": 10 }
}
```

## 4. Security & Middleware
- **Authentication Middleware**: Verifies JWT tokens on protected routes.
- **Role-Based Authorization**: Middleware and service-layer checks to ensure users only access permitted resources (e.g., candidates cannot post jobs).
- **Input Validation**: All incoming API requests are validated using `Zod` schemas before processing.
