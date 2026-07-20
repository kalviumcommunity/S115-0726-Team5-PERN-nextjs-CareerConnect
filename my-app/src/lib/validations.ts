import { z } from "zod";

// ---------- Auth ----------

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  role: z.enum(["CANDIDATE", "EMPLOYER"]),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

// ---------- Jobs ----------

export const createJobSchema = z.object({
  title: z.string().trim().min(2).max(150),
  description: z.string().trim().min(10).max(5000),
  company: z.string().trim().min(1).max(150),
  location: z.string().trim().min(1).max(150),
  salary: z.number().int().positive("Salary must be a positive number"),
});
export type CreateJobInput = z.infer<typeof createJobSchema>;

export const updateJobSchema = createJobSchema.partial();
export type UpdateJobInput = z.infer<typeof updateJobSchema>;

export const listJobsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  location: z.string().trim().optional(),
  sort: z.enum(["latest", "oldest", "salary_asc", "salary_desc"]).default("latest"),
});
export type ListJobsQuery = z.infer<typeof listJobsQuerySchema>;

// ---------- Applications ----------

export const createApplicationSchema = z.object({
  jobId: z.string().min(1, "jobId is required"),
});
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

export const applicationStatusEnum = z.enum([
  "PENDING",
  "VIEWED",
  "SHORTLISTED",
  "REJECTED",
  "ACCEPTED",
]);

export const updateApplicationSchema = z.object({
  status: applicationStatusEnum,
});
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;

export const batchUpdateApplicationSchema = z.object({
  applicationIds: z.array(z.string().min(1)).min(1, "At least one applicationId is required"),
  status: applicationStatusEnum,
});
export type BatchUpdateApplicationInput = z.infer<typeof batchUpdateApplicationSchema>;

export const listApplicationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: applicationStatusEnum.optional(),
  jobId: z.string().optional(),
});
export type ListApplicationsQuery = z.infer<typeof listApplicationsQuerySchema>;

// ---------- Notifications ----------

export const markNotificationsReadSchema = z.object({
  notificationIds: z.array(z.string().min(1)).optional(), // omit to mark all as read
});
export type MarkNotificationsReadInput = z.infer<typeof markNotificationsReadSchema>;
