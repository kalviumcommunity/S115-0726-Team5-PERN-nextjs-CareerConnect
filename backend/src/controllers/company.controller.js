const { query } = require("../config/db");
const { toCompanyJSON } = require("../utils/mappers");
const { getInitials } = require("../utils/format");
const HttpError = require("../utils/HttpError");

/**
 * GET /api/employer/company (employer only)
 */
const getCompany = async (req, res) => {
  const result = await query("SELECT * FROM companies WHERE employer_id = $1", [req.user.id]);
  const company = result.rows[0];
  if (!company) throw new HttpError(404, "Company profile not found.");
  res.json({ company: toCompanyJSON(company) });
};

/**
 * PATCH /api/employer/company (employer only)
 * body: { name, email, location, description }
 */
const updateCompany = async (req, res) => {
  const { name, email, location, description } = req.body;

  const sets = [];
  const params = [];
  const set = (col, val) => {
    params.push(val);
    sets.push(`${col} = $${params.length}`);
  };

  if (name !== undefined) {
    set("name", name);
    set("logo_initials", getInitials(name));
  }
  if (email !== undefined) set("email", email);
  if (location !== undefined) set("location", location);
  if (description !== undefined) set("description", description);

  if (sets.length === 0) {
    throw new HttpError(400, "No fields to update.");
  }

  params.push(req.user.id);
  const result = await query(
    `UPDATE companies SET ${sets.join(", ")} WHERE employer_id = $${params.length} RETURNING *`,
    params
  );
  if (result.rows.length === 0) throw new HttpError(404, "Company profile not found.");

  res.json({ company: toCompanyJSON(result.rows[0]) });
};

/**
 * GET /api/employer/dashboard/stats (employer only)
 * Powers the stat cards on the Employer Dashboard page.
 */
const getDashboardStats = async (req, res) => {
  const jobsCountRes = await query("SELECT COUNT(*) FROM jobs WHERE employer_id = $1", [req.user.id]);
  const statsRes = await query(
    `SELECT a.status, COUNT(*) FROM applications a
     JOIN jobs j ON j.id = a.job_id
     WHERE j.employer_id = $1
     GROUP BY a.status`,
    [req.user.id]
  );

  const counts = { Pending: 0, Shortlisted: 0, "In Review": 0, Hired: 0, Rejected: 0 };
  let total = 0;
  statsRes.rows.forEach((row) => {
    counts[row.status] = Number(row.count);
    total += Number(row.count);
  });

  res.json({
    totalJobs: Number(jobsCountRes.rows[0].count),
    totalApplications: total,
    pending: counts["Pending"],
    shortlisted: counts["Shortlisted"],
    inReview: counts["In Review"],
    hired: counts["Hired"],
    rejected: counts["Rejected"],
  });
};

module.exports = { getCompany, updateCompany, getDashboardStats };
