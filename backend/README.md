# Career Connect — Backend (PERN)

A PostgreSQL + Express + Node backend for the Apna.co-style job application
tracker, built to match the data model already defined in the existing
Next.js/React frontend (`src/context/AppContext.tsx`) **without changing any
frontend code**.

Stack: **P**ostgreSQL · **E**xpress · **R**eact (existing frontend, untouched) · **N**ode

## Problem statement, and how this backend satisfies it

> Apna.co wants a job application tracker where candidates see real-time
> status (viewed/rejected). When a candidate applies, the application appears
> immediately with a "pending" label. Employers can batch-update statuses for
> multiple applications.

| Requirement | Implementation |
|---|---|
| Application appears immediately, "Pending" | `POST /api/applications` writes to Postgres and returns the new row (status defaults to `Pending`) in the same request — no polling delay. |
| Real-time status (viewed / rejected / etc.) | Socket.IO. Every status change is pushed instantly to the affected candidate's private socket room (`application:statusUpdate`, `notification:new`), and every new application is pushed to the employer (`application:new`, `notification:new`). |
| Employers batch-update statuses | `PATCH /api/applications/batch-status` updates any number of application IDs in a single transaction, scoped so an employer can only touch applications on their own jobs. |
| PERN, done correctly | Raw `pg` (node-postgres) against a real relational schema with foreign keys, enums, indexes, and transactions — no ORM magic, no accidental Mongo/Mongoose. |

## Project layout

```
backend/
├── src/
│   ├── server.js            # boots HTTP + Socket.IO
│   ├── app.js                # Express app, middleware, route mounting
│   ├── config/
│   │   ├── db.js             # pg Pool + transaction helper
│   │   └── env.js            # env var loading
│   ├── db/
│   │   ├── schema.sql        # full DDL (tables, enums, indexes, trigger)
│   │   ├── migrate.js        # applies schema.sql
│   │   └── seed.js           # demo data matching the frontend's mock data
│   ├── middleware/
│   │   ├── auth.js           # requireAuth / requireRole / optionalAuth
│   │   └── errorHandler.js
│   ├── sockets/index.js      # Socket.IO auth + emitToUser()
│   ├── controllers/          # one per resource
│   ├── routes/                # one per resource, mounted under /api
│   └── utils/                 # jwt, mappers (DB row -> frontend JSON shape), etc.
├── package.json
└── .env.example
```

## Data model

Mirrors the frontend's TypeScript interfaces exactly — the API's JSON
responses use the same field names (`candidateName`, `jobTitle`,
`appliedDate`, `resumeUrl`, etc.) as `Job`, `Application`, `CandidateProfile`,
and `AppNotification` in `AppContext.tsx`.

- **users** — both candidates and employers, distinguished by `role`
- **candidate_profiles** — 1:1 with a candidate user
- **companies** — 1:1 with an employer user
- **jobs** — posted by an employer
- **applications** — a candidate applying to a job (`status` enum: `Pending`, `Shortlisted`, `In Review`, `Hired`, `Rejected`); unique on `(job_id, candidate_id)` so a candidate can't double-apply
- **notifications** — per-user notification feed (`type` enum: `viewed`, `rejected`, `accepted`, `new_application`)

See `src/db/schema.sql` for the full DDL with comments.

## Getting started

### 1. Prerequisites
- Node.js 18+
- PostgreSQL 13+ running locally (or a connection string to a hosted instance)

### 2. Install
```bash
cd backend
npm install
```

### 3. Configure
```bash
cp .env.example .env
# edit .env — at minimum set DATABASE_URL (or PGHOST/PGUSER/PGPASSWORD/PGDATABASE)
# and a real JWT_SECRET
```

### 4. Create the database, then run migrations + seed
```bash
# create the DB once, e.g.:
createdb career_connect
# or: psql -c "CREATE DATABASE career_connect;"

npm run migrate   # applies schema.sql
npm run seed       # loads demo data matching the frontend mocks
```
`npm run setup` does both in one go.

### 5. Run the API
```bash
npm run dev     # nodemon, auto-restart
# or
npm start
```
The API listens on `http://localhost:5000` by default (`PORT` in `.env`), with Socket.IO on the same port/server.

### Demo accounts (created by `npm run seed`)
| Role | Email | Password |
|---|---|---|
| Candidate | `devansh.pujari@example.com` | `Password123!` |
| Employer | `employer@techsolutions.com` | `Password123!` |

## API reference

All routes are prefixed with `/api`. Protected routes require
`Authorization: Bearer <token>` (returned from register/login).

### Auth
| Method | Path | Auth | Body | Notes |
|---|---|---|---|---|
| POST | `/auth/register` | – | `{ name, email, password, role, companyName? }` | `role` is `candidate` or `employer` |
| POST | `/auth/login` | – | `{ email, password }` | |
| GET | `/auth/me` | any | – | |

### Jobs
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/jobs` | optional | Public list; if a candidate token is sent, each job includes `applied: boolean` |
| GET | `/jobs/:id` | – | |
| GET | `/jobs/employer/mine` | employer | Jobs posted by the caller |
| POST | `/jobs` | employer | `{ title, location, salary, experience, skills: string[], description }` |

### Applications
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/applications` | candidate | `{ jobId }` — creates with status `Pending`, notifies employer in real time |
| GET | `/applications/me` | candidate | Caller's own applications |
| GET | `/applications` | employer | All applications on the employer's jobs. Query params: `?status=&jobTitle=&search=` |
| PATCH | `/applications/:id/status` | employer | `{ status }` — single update, real-time push to that candidate |
| PATCH | `/applications/batch-status` | employer | `{ applicationIds: string[], status }` — **batch update**, one push per affected candidate |

### Notifications
| Method | Path | Auth |
|---|---|---|
| GET | `/notifications/me` | any |
| PATCH | `/notifications/mark-read` | any |

### Candidate profile
| Method | Path | Auth |
|---|---|---|
| GET | `/profile/me` | candidate |
| PATCH | `/profile/me` | candidate — partial update, same shape as `CandidateProfile` |

### Employer / company
| Method | Path | Auth |
|---|---|---|
| GET | `/employer/company` | employer |
| PATCH | `/employer/company` | employer |
| GET | `/employer/dashboard/stats` | employer — powers the dashboard stat cards |

## Real-time events (Socket.IO)

Connect with the JWT from login:
```js
import { io } from "socket.io-client";
const socket = io("http://localhost:5000", { auth: { token } });
```

Each user is automatically joined to a private room; events are targeted, never broadcast.

| Event | Sent to | Payload |
|---|---|---|
| `application:new` | employer | the new `Application` |
| `application:statusUpdate` | candidate | the updated `Application` (fired for both single and batch updates) |
| `notification:new` | either | the new `AppNotification` |

## Integrating with the existing frontend (not done in this task, by design)

Per the task instructions, **no frontend files were modified**. When you're
ready to wire it up, the shapes already match `AppContext.tsx`'s interfaces,
so the change is localized to that one file:

1. Add `axios` (or use `fetch`) and `socket.io-client` to the frontend's `package.json`.
2. In `AppProvider`, replace the `useState` initial mock arrays with
   `useEffect` calls that `fetch`/`axios.get` from the endpoints above.
3. Replace `applyToJob`, `postJob`, `updateApplicationStatus`,
   `updateProfile`, `markNotificationsAsRead` bodies with the matching API
   calls (the local `setState` updates can stay as optimistic UI, since the
   socket events will also come in and can reconcile state).
4. Open a socket connection once the user logs in and merge incoming
   `application:new` / `application:statusUpdate` / `notification:new`
   events into state — this is what gives the "real-time" behavior the
   problem statement asks for, matching the candidate Applications page's
   own copy: *"Track the live progress of your job applications in real time."*
5. Set `CORS_ORIGIN` in the backend's `.env` to wherever the Next.js dev
   server runs (default assumed: `http://localhost:3000`).

## Security notes
- Passwords hashed with bcrypt (10 rounds).
- JWT-based auth; role checks (`requireRole`) enforced server-side on every
  mutating route — an employer token can never touch another employer's
  jobs/applications, and a candidate token can never post jobs or change
  statuses.
- All SQL uses parameterized queries (no string concatenation) to prevent
  injection.
- `helmet` for baseline HTTP security headers; CORS restricted to the
  configured frontend origin.
