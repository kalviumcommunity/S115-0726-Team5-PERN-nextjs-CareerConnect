const { query } = require("../config/db");
const { toJobJSON } = require("../utils/mappers");
const HttpError = require("../utils/HttpError");

/**
 * GET /api/jobs
 * Public list of all jobs. If the caller is an authenticated candidate,
 * each job includes `applied: true/false` for that candidate (matches
 * the frontend's Job.applied flag used to disable the "Apply Now" button).
 */
const listJobs = async (req, res) => {
  let sql = `
    SELECT j.*,
      ${req.user && req.user.role === "candidate" ? "EXISTS(SELECT 1 FROM applications a WHERE a.job_id = j.id AND a.candidate_id = $1) AS applied" : "false AS applied"}
    FROM jobs j
    ORDER BY j.created_at DESC
  `;
  const params = req.user && req.user.role === "candidate" ? [req.user.id] : [];
  const result = await query(sql, params);
  res.json({ jobs: result.rows.map(toJobJSON) });
};

/**
 * GET /api/jobs/:id
 */
const getJob = async (req, res) => {
  const result = await query("SELECT * FROM jobs WHERE id = $1", [req.params.id]);
  const job = result.rows[0];
  if (!job) throw new HttpError(404, "Job not found.");
  res.json({ job: toJobJSON(job) });
};

/**
 * GET /api/jobs/employer/mine (employer only)
 */
const myJobs = async (req, res) => {
  const result = await query(
    "SELECT * FROM jobs WHERE employer_id = $1 ORDER BY created_at DESC",
    [req.user.id]
  );
  res.json({ jobs: result.rows.map(toJobJSON) });
};

/**
 * POST /api/jobs (employer only)
 * body: { title, location, salary, experience, skills: string[], description }
 * `company` is pulled from the employer's own company profile, not the body,
 * so a candidate can't spoof which company a job is posted under.
 */
const createJob = async (req, res) => {
  const { title, location, salary, experience, skills, description } = req.body;

  if (!title || !location || !salary || !experience || !description) {
    throw new HttpError(400, "title, location, salary, experience and description are required.");
  }
  if (!Array.isArray(skills) || skills.length === 0) {
    throw new HttpError(400, "skills must be a non-empty array of strings.");
  }

  const companyRes = await query("SELECT name FROM companies WHERE employer_id = $1", [req.user.id]);
  const companyName = companyRes.rows[0]?.name || req.user.name;

  const result = await query(
    `INSERT INTO jobs (employer_id, title, company, location, salary, experience, skills, description)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [req.user.id, title, companyName, location, salary, experience, skills, description]
  );

  res.status(201).json({ job: toJobJSON(result.rows[0]) });
};

module.exports = { listJobs, getJob, myJobs, createJob };
