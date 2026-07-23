const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { requireAuth, requireRole, optionalAuth } = require("../middleware/auth");
const { listJobs, getJob, myJobs, createJob } = require("../controllers/jobs.controller");

const router = express.Router();

router.get("/", optionalAuth, asyncHandler(listJobs));
router.get("/employer/mine", requireAuth, requireRole("employer"), asyncHandler(myJobs));
router.get("/:id", asyncHandler(getJob));
router.post("/", requireAuth, requireRole("employer"), asyncHandler(createJob));

module.exports = router;
