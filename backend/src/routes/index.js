const express = require("express");

const authRoutes = require("./auth.routes");
const jobsRoutes = require("./jobs.routes");
const applicationsRoutes = require("./applications.routes");
const notificationsRoutes = require("./notifications.routes");
const profileRoutes = require("./profile.routes");
const companyRoutes = require("./company.routes");

const router = express.Router();

router.get("/health", (req, res) => res.json({ status: "ok", service: "career-connect-api" }));

router.use("/auth", authRoutes);
router.use("/jobs", jobsRoutes);
router.use("/applications", applicationsRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/profile", profileRoutes);
router.use("/employer", companyRoutes);

module.exports = router;
