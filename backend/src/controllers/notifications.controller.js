const { query } = require("../config/db");
const { toNotificationJSON } = require("../utils/mappers");

/**
 * GET /api/notifications/me
 * Works for both candidates and employers — each just sees their own rows.
 */
const myNotifications = async (req, res) => {
  const result = await query(
    "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
    [req.user.id]
  );
  res.json({ notifications: result.rows.map(toNotificationJSON) });
};

/**
 * PATCH /api/notifications/mark-read
 * Marks every unread notification for the caller as read (matches the
 * frontend's markNotificationsAsRead, fired when the Notifications page mounts).
 */
const markAllRead = async (req, res) => {
  await query(
    "UPDATE notifications SET read = true WHERE user_id = $1 AND read = false",
    [req.user.id]
  );
  res.json({ message: "All notifications marked as read." });
};

module.exports = { myNotifications, markAllRead };
