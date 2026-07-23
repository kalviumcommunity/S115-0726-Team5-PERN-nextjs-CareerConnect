-- Career Connect / Apna.co Job Application Tracker
-- PostgreSQL schema. Field names are chosen so the JSON the API returns
-- can be mapped 1:1 onto the TypeScript interfaces already defined in
-- the frontend's src/context/AppContext.tsx (Job, Application,
-- CandidateProfile, AppNotification).

CREATE EXTENSION IF NOT EXISTS pgcrypto; -- gives us gen_random_uuid()

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('candidate', 'employer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('Pending', 'Shortlisted', 'In Review', 'Hired', 'Rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM ('viewed', 'rejected', 'accepted', 'new_application');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- Users (both candidates and employers live here; role decides which
-- companion profile table applies)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          user_role NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Candidate profile (1:1 with users where role = 'candidate')
-- Mirrors the `CandidateProfile` interface in AppContext.tsx
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS candidate_profiles (
  user_id         UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  phone           VARCHAR(30)  NOT NULL DEFAULT '',
  location        VARCHAR(150) NOT NULL DEFAULT '',
  dob             VARCHAR(50)  NOT NULL DEFAULT '',
  status          VARCHAR(150) NOT NULL DEFAULT 'Actively looking for opportunities',
  bio             TEXT         NOT NULL DEFAULT '',
  avatar          VARCHAR(10)  NOT NULL DEFAULT '',
  resume_name     VARCHAR(255) NOT NULL DEFAULT '',
  resume_updated  VARCHAR(50)  NOT NULL DEFAULT '',
  skills          TEXT[]       NOT NULL DEFAULT '{}',
  pref_roles      TEXT[]       NOT NULL DEFAULT '{}',
  pref_locations  TEXT[]       NOT NULL DEFAULT '{}',
  pref_job_types  VARCHAR(50)  NOT NULL DEFAULT 'Full-time',
  pref_experience VARCHAR(50)  NOT NULL DEFAULT ''
);

-- ---------------------------------------------------------------------------
-- Company / employer profile (1:1 with users where role = 'employer')
-- Mirrors the Employer > Company Profile page
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS companies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id   UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(150) NOT NULL DEFAULT '',
  location      VARCHAR(150) NOT NULL DEFAULT '',
  description   TEXT NOT NULL DEFAULT '',
  logo_initials VARCHAR(5)  NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Jobs. Mirrors the `Job` interface.
-- `company` is intentionally denormalized (kept as text) so API responses
-- match the frontend's Job.company: string field without an extra join.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS jobs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(150) NOT NULL,
  company     VARCHAR(150) NOT NULL,
  location    VARCHAR(150) NOT NULL,
  salary      VARCHAR(50)  NOT NULL,
  experience  VARCHAR(50)  NOT NULL,
  skills      TEXT[]       NOT NULL DEFAULT '{}',
  description TEXT         NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);

-- ---------------------------------------------------------------------------
-- Applications. Mirrors the `Application` interface.
-- candidate_name/email/phone/initials + job_title/company are snapshotted
-- at apply-time (same denormalization the frontend mock data already uses),
-- so history reads correctly even if a profile or job is edited later.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS applications (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id              UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  candidate_name      VARCHAR(150) NOT NULL,
  candidate_email     VARCHAR(150) NOT NULL,
  candidate_phone     VARCHAR(30)  NOT NULL DEFAULT '',
  candidate_initials  VARCHAR(5)   NOT NULL DEFAULT '',
  job_title           VARCHAR(150) NOT NULL,
  company             VARCHAR(150) NOT NULL,
  applied_date        VARCHAR(50)  NOT NULL,
  status              application_status NOT NULL DEFAULT 'Pending',
  resume_url          VARCHAR(255) NOT NULL DEFAULT '',
  skills              TEXT[]       NOT NULL DEFAULT '{}',
  experience          TEXT         NOT NULL DEFAULT '',
  education           TEXT         NOT NULL DEFAULT '',
  bio                 TEXT         NOT NULL DEFAULT '',
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
  UNIQUE (job_id, candidate_id) -- a candidate can only apply once per job
);

CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- ---------------------------------------------------------------------------
-- Notifications. Mirrors the `AppNotification` interface.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       notification_type NOT NULL,
  title      VARCHAR(150) NOT NULL,
  message    TEXT NOT NULL,
  date       VARCHAR(50) NOT NULL,
  read       BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- ---------------------------------------------------------------------------
-- Keep applications.updated_at fresh automatically
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_applications_updated_at ON applications;
CREATE TRIGGER trg_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
