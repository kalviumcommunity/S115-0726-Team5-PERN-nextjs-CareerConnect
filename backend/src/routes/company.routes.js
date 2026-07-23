const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { requireAuth, requireRole } = require("../middleware/auth");
const { getCompany, updateCompany, getDashboardStats } = require("../controllers/company.controller");

const router = express.Router();

router.get("/company", requireAuth, requireRole("employer"), asyncHandler(getCompany));
router.patch("/company", requireAuth, requireRole("employer"), asyncHandler(updateCompany));
router.get("/dashboard/stats", requireAuth, requireRole("employer"), asyncHandler(getDashboardStats));

module.exports = router;
