const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { requireAuth } = require("../middleware/auth");
const { myNotifications, markAllRead } = require("../controllers/notifications.controller");

const router = express.Router();

router.get("/me", requireAuth, asyncHandler(myNotifications));
router.patch("/mark-read", requireAuth, asyncHandler(markAllRead));

module.exports = router;
