/**
 * Formats a Date as "08 May 2025" — matching the exact format the frontend
 * mock data (and AppContext.applyToJob) already uses for appliedDate.
 */
const formatDate = (date = new Date()) =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/**
 * Derives 2-letter initials from a full name, e.g. "Devansh Pujari" -> "DP".
 */
const getInitials = (fullName = "") => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

module.exports = { formatDate, getInitials };
