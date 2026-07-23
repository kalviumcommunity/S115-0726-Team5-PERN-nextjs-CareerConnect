const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { requireAuth, requireRole } = require("../middleware/auth");
const { getProfile, updateProfile } = require("../controllers/profile.controller");

const router = express.Router();

router.get("/me", requireAuth, requireRole("candidate"), asyncHandler(getProfile));
router.patch("/me", requireAuth, requireRole("candidate"), asyncHandler(updateProfile));

module.exports = router;
