/**
 * These mappers translate snake_case PostgreSQL rows into the exact
 * camelCase shapes the frontend's TypeScript interfaces expect
 * (see src/context/AppContext.tsx: Job, Application, CandidateProfile,
 * AppNotification). Keeping this mapping in one place means the rest of
 * the frontend can eventually swap its mock `useState` for a `fetch` to
 * this API with zero shape changes.
 */

const toUserJSON = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
});

const toJobJSON = (row) => ({
  id: row.id,
  title: row.title,
  company: row.company,
  location: row.location,
  salary: row.salary,
  experience: row.experience,
  skills: row.skills || [],
  description: row.description,
  applied: Boolean(row.applied), // populated via LEFT JOIN in the query layer
});

const toApplicationJSON = (row) => ({
  id: row.id,
  jobId: row.job_id,
  candidateId: row.candidate_id,
  candidateName: row.candidate_name,
  candidateEmail: row.candidate_email,
  candidatePhone: row.candidate_phone,
  candidateInitials: row.candidate_initials,
  jobTitle: row.job_title,
  company: row.company,
  appliedDate: row.applied_date,
  status: row.status,
  resumeUrl: row.resume_url,
  skills: row.skills || [],
  experience: row.experience,
  education: row.education,
  bio: row.bio,
});

const toNotificationJSON = (row) => ({
  id: row.id,
  type: row.type,
  title: row.title,
  message: row.message,
  date: row.date,
  read: row.read,
});

const toProfileJSON = (userRow, profileRow) => ({
  name: userRow.name,
  email: userRow.email,
  phone: profileRow.phone,
  location: profileRow.location,
  dob: profileRow.dob,
  status: profileRow.status,
  bio: profileRow.bio,
  avatar: profileRow.avatar,
  resumeName: profileRow.resume_name,
  resumeUpdated: profileRow.resume_updated,
  skills: profileRow.skills || [],
  preferences: {
    roles: profileRow.pref_roles || [],
    locations: profileRow.pref_locations || [],
    jobTypes: profileRow.pref_job_types,
    experience: profileRow.pref_experience,
  },
});

const toCompanyJSON = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  location: row.location,
  description: row.description,
  logoInitials: row.logo_initials,
});

module.exports = {
  toUserJSON,
  toJobJSON,
  toApplicationJSON,
  toNotificationJSON,
  toProfileJSON,
  toCompanyJSON,
};
