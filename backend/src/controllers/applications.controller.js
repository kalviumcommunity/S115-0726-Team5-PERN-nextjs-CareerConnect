const { query, withTransaction } = require("../config/db");
const { toApplicationJSON, toNotificationJSON } = require("../utils/mappers");
const { formatDate } = require("../utils/format");
const { emitToUser } = require("../sockets");
const HttpError = require("../utils/HttpError");

const VALID_STATUSES = ["Pending", "Shortlisted", "In Review", "Hired", "Rejected"];

/**
 * Builds the same notification copy the frontend's updateApplicationStatus
 * already generates, so behavior is identical once wired up.
 */
const buildStatusNotification = (application, status) => {
  let type = "viewed";
  let title = "Application Update";
  let message = `Your application status for ${application.job_title} at ${application.company} has been updated to ${status}.`;

  if (status === "Shortlisted" || status === "Hired") {
    type = "accepted";
    title = `Application ${status}!`;
    message = `Congratulations! You have been ${status.toLowerCase()} by ${application.company} for the ${application.job_title} role.`;
  } else if (status === "Rejected") {
    type = "rejected";
    title = "Application Rejected";
    message = `We appreciate your time, but ${application.company} has updated your application for ${application.job_title} to Rejected.`;
  } else if (status === "In Review") {
    type = "viewed";
    title = "Application In Review";
    message = `${application.company} has updated your application for ${application.job_title} to In Review.`;
  }

  return { type, title, message };
};

/**
 * Inserts a notification row and immediately pushes it over the socket
 * to the recipient, then returns the created row.
 */
const createAndPushNotification = async (client, userId, { type, title, message }) => {
  const res = await client.query(
    `INSERT INTO notifications (user_id, type, title, message, date, read)
     VALUES ($1,$2,$3,$4,$5,false) RETURNING *`,
    [userId, type, title, message, "Just now"]
  );
  const notif = res.rows[0];
  emitToUser(userId, "notification:new", toNotificationJSON(notif));
  return notif;
};

/**
 * POST /api/applications (candidate only)
 * body: { jobId }
 *
 * Core "apply" flow from the problem statement: the application is written
 * to Postgres and returned in the same request/response cycle, already
 * carrying status "Pending" — so the candidate's UI can show it immediately.
 * The employer is notified in real time over the socket in the same beat.
 */
const applyToJob = async (req, res) => {
  const { jobId } = req.body;
  if (!jobId) throw new HttpError(400, "jobId is required.");

  const jobRes = await query("SELECT * FROM jobs WHERE id = $1", [jobId]);
  const job = jobRes.rows[0];
  if (!job) throw new HttpError(404, "Job not found.");

  const existing = await query(
    "SELECT id FROM applications WHERE job_id = $1 AND candidate_id = $2",
    [jobId, req.user.id]
  );
  if (existing.rows.length > 0) {
    throw new HttpError(409, "You have already applied to this job.");
  }

  const profileRes = await query(
    `SELECT u.name, u.email, cp.* FROM users u
     JOIN candidate_profiles cp ON cp.user_id = u.id
     WHERE u.id = $1`,
    [req.user.id]
  );
  const profile = profileRes.rows[0];
  if (!profile) throw new HttpError(400, "Complete your candidate profile before applying.");

  const application = await withTransaction(async (client) => {
    const appRes = await client.query(
      `INSERT INTO applications
        (job_id, candidate_id, candidate_name, candidate_email, candidate_phone, candidate_initials,
         job_title, company, applied_date, status, resume_url, skills, experience, education, bio)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'Pending',$10,$11,$12,$13,$14)
       RETURNING *`,
      [
        jobId,
        req.user.id,
        profile.name,
        profile.email,
        profile.phone,
        profile.avatar,
        job.title,
        job.company,
        formatDate(),
        profile.resume_name,
        profile.skills,
        "Candidate profile simulated experience",
        "Candidate profile simulated education",
        profile.bio,
      ]
    );
    const newApp = appRes.rows[0];

    // Notify the employer who owns this job — "candidate applied" is a
    // real-time event for them, mirroring the frontend's notification.
    await createAndPushNotification(client, job.employer_id, {
      type: "new_application",
      title: "New Application Received",
      message: `${profile.name} applied for your job: ${job.title}.`,
    });

    return newApp;
  });

  // Real-time: the employer's applications table/dashboard updates instantly.
  emitToUser(job.employer_id, "application:new", toApplicationJSON(application));

  res.status(201).json({ application: toApplicationJSON(application) });
};

/**
 * GET /api/applications/me (candidate only)
 */
const myApplications = async (req, res) => {
  const result = await query(
    "SELECT * FROM applications WHERE candidate_id = $1 ORDER BY created_at DESC",
    [req.user.id]
  );
  res.json({ applications: result.rows.map(toApplicationJSON) });
};

/**
 * GET /api/applications (employer only)
 * Supports the same filters as the Employer Applications page:
 *   ?status=Pending&jobTitle=Frontend%20Developer&search=rohit
 */
const employerApplications = async (req, res) => {
  const { status, jobTitle, search } = req.query;

  const conditions = ["j.employer_id = $1"];
  const params = [req.user.id];

  if (status && VALID_STATUSES.includes(status)) {
    params.push(status);
    conditions.push(`a.status = $${params.length}`);
  }
  if (jobTitle) {
    params.push(jobTitle);
    conditions.push(`a.job_title = $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(a.candidate_name ILIKE $${params.length} OR a.job_title ILIKE $${params.length})`);
  }

  const sql = `
    SELECT a.* FROM applications a
    JOIN jobs j ON j.id = a.job_id
    WHERE ${conditions.join(" AND ")}
    ORDER BY a.created_at DESC
  `;
  const result = await query(sql, params);
  res.json({ applications: result.rows.map(toApplicationJSON) });
};

/**
 * PATCH /api/applications/:id/status (employer only)
 * body: { status }
 * Updates one application and pushes the change to the candidate in real time.
 */
const updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    throw new HttpError(400, `status must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  const ownershipCheck = await query(
    `SELECT a.* FROM applications a
     JOIN jobs j ON j.id = a.job_id
     WHERE a.id = $1 AND j.employer_id = $2`,
    [req.params.id, req.user.id]
  );
  const application = ownershipCheck.rows[0];
  if (!application) throw new HttpError(404, "Application not found.");

  const updated = await withTransaction(async (client) => {
    const res2 = await client.query(
      "UPDATE applications SET status = $1 WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );
    const updatedApp = res2.rows[0];

    const notifCopy = buildStatusNotification(updatedApp, status);
    await createAndPushNotification(client, updatedApp.candidate_id, notifCopy);

    return updatedApp;
  });

  // Real-time: candidate's "My Applications" / notifications update instantly
  // (this is the "viewed/rejected" live status the problem statement asks for).
  emitToUser(updated.candidate_id, "application:statusUpdate", toApplicationJSON(updated));

  res.json({ application: toApplicationJSON(updated) });
};

/**
 * PATCH /api/applications/batch-status (employer only)
 * body: { applicationIds: string[], status }
 *
 * The problem statement explicitly calls out batch status updates —
 * this updates every application in one transaction (scoped to jobs this
 * employer owns, so one employer can never touch another's applications),
 * writes one notification per affected candidate, and pushes a real-time
 * event to each of them.
 */
const batchUpdateStatus = async (req, res) => {
  const { applicationIds, status } = req.body;

  if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
    throw new HttpError(400, "applicationIds must be a non-empty array.");
  }
  if (!VALID_STATUSES.includes(status)) {
    throw new HttpError(400, `status must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  const updatedApps = await withTransaction(async (client) => {
    const res2 = await client.query(
      `UPDATE applications a
       SET status = $1
       FROM jobs j
       WHERE a.job_id = j.id
         AND j.employer_id = $2
         AND a.id = ANY($3::uuid[])
       RETURNING a.*`,
      [status, req.user.id, applicationIds]
    );
    const rows = res2.rows;

    for (const app of rows) {
      const notifCopy = buildStatusNotification(app, status);
      await createAndPushNotification(client, app.candidate_id, notifCopy);
    }

    return rows;
  });

  // Real-time push to every candidate whose application changed.
  updatedApps.forEach((app) => {
    emitToUser(app.candidate_id, "application:statusUpdate", toApplicationJSON(app));
  });

  res.json({
    updatedCount: updatedApps.length,
    applications: updatedApps.map(toApplicationJSON),
  });
};

module.exports = { applyToJob, myApplications, employerApplications, updateStatus, batchUpdateStatus };
