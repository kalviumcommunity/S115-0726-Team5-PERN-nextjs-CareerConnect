const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { requireAuth, requireRole } = require("../middleware/auth");
const {
  applyToJob,
  myApplications,
  employerApplications,
  updateStatus,
  batchUpdateStatus,
} = require("../controllers/applications.controller");

const router = express.Router();

router.post("/", requireAuth, requireRole("candidate"), asyncHandler(applyToJob));
router.get("/me", requireAuth, requireRole("candidate"), asyncHandler(myApplications));
router.get("/", requireAuth, requireRole("employer"), asyncHandler(employerApplications));

// Batch route must be registered before the ":id/status" route so
// "batch-status" is never swallowed as an :id param.
router.patch("/batch-status", requireAuth, requireRole("employer"), asyncHandler(batchUpdateStatus));
router.patch("/:id/status", requireAuth, requireRole("employer"), asyncHandler(updateStatus));

module.exports = router;
