const { query, withTransaction } = require("../config/db");
const { toProfileJSON } = require("../utils/mappers");
const HttpError = require("../utils/HttpError");

/**
 * GET /api/profile/me (candidate only)
 */
const getProfile = async (req, res) => {
  const userRes = await query("SELECT * FROM users WHERE id = $1", [req.user.id]);
  const profileRes = await query("SELECT * FROM candidate_profiles WHERE user_id = $1", [req.user.id]);

  const user = userRes.rows[0];
  const profile = profileRes.rows[0];
  if (!user || !profile) throw new HttpError(404, "Profile not found.");

  res.json({ profile: toProfileJSON(user, profile) });
};

/**
 * PATCH /api/profile/me (candidate only)
 * body: Partial<CandidateProfile> — matches AppContext.updateProfile's signature.
 * `name`/`email` update the users row; everything else updates candidate_profiles.
 */
const updateProfile = async (req, res) => {
  const {
    name,
    email,
    phone,
    location,
    dob,
    status,
    bio,
    avatar,
    resumeName,
    resumeUpdated,
    skills,
    preferences,
  } = req.body;

  await withTransaction(async (client) => {
    if (name || email) {
      const sets = [];
      const params = [];
      if (name) {
        params.push(name);
        sets.push(`name = $${params.length}`);
      }
      if (email) {
        params.push(email.toLowerCase());
        sets.push(`email = $${params.length}`);
      }
      params.push(req.user.id);
      await client.query(`UPDATE users SET ${sets.join(", ")} WHERE id = $${params.length}`, params);
    }

    const sets = [];
    const params = [];
    const set = (col, val) => {
      params.push(val);
      sets.push(`${col} = $${params.length}`);
    };

    if (phone !== undefined) set("phone", phone);
    if (location !== undefined) set("location", location);
    if (dob !== undefined) set("dob", dob);
    if (status !== undefined) set("status", status);
    if (bio !== undefined) set("bio", bio);
    if (avatar !== undefined) set("avatar", avatar);
    if (resumeName !== undefined) set("resume_name", resumeName);
    if (resumeUpdated !== undefined) set("resume_updated", resumeUpdated);
    if (skills !== undefined) set("skills", skills);
    if (preferences?.roles !== undefined) set("pref_roles", preferences.roles);
    if (preferences?.locations !== undefined) set("pref_locations", preferences.locations);
    if (preferences?.jobTypes !== undefined) set("pref_job_types", preferences.jobTypes);
    if (preferences?.experience !== undefined) set("pref_experience", preferences.experience);

    if (sets.length > 0) {
      params.push(req.user.id);
      await client.query(
        `UPDATE candidate_profiles SET ${sets.join(", ")} WHERE user_id = $${params.length}`,
        params
      );
    }
  });

  const userRes = await query("SELECT * FROM users WHERE id = $1", [req.user.id]);
  const profileRes = await query("SELECT * FROM candidate_profiles WHERE user_id = $1", [req.user.id]);
  res.json({ profile: toProfileJSON(userRes.rows[0], profileRes.rows[0]) });
};

module.exports = { getProfile, updateProfile };
