import { z } from "zod";

// ─── Shared ──────────────────────────────────────────────────────────────────

export const IdParamSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

// ─── Auth ────────────────────────────────────────────────────────────────────

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  role: z.enum(["CANDIDATE", "EMPLOYER"]),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── Job ─────────────────────────────────────────────────────────────────────

export const CreateJobSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  company: z.string().min(2).max(200),
  location: z.string().min(2).max(200),
  salary: z.string().min(1).max(100),
  jobType: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"])
    .default("FULL_TIME"),
  experienceLevel: z
    .enum(["ENTRY", "MID", "SENIOR", "LEAD", "EXECUTIVE"])
    .default("ENTRY"),
  category: z
    .enum([
      "ENGINEERING",
      "DESIGN",
      "MARKETING",
      "SALES",
      "OPERATIONS",
      "FINANCE",
      "HR",
      "SUPPORT",
      "MANAGEMENT",
      "OTHER",
    ])
    .default("OTHER"),
  skills: z.array(z.string().min(1).max(100)).max(20).default([]),
  companyId: z.string().optional(),
});

export const UpdateJobSchema = CreateJobSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" },
);

export const JobQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  location: z.string().optional(),
  jobType: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"])
    .optional(),
  experienceLevel: z
    .enum(["ENTRY", "MID", "SENIOR", "LEAD", "EXECUTIVE"])
    .optional(),
  category: z
    .enum([
      "ENGINEERING",
      "DESIGN",
      "MARKETING",
      "SALES",
      "OPERATIONS",
      "FINANCE",
      "HR",
      "SUPPORT",
      "MANAGEMENT",
      "OTHER",
    ])
    .optional(),
  isActive: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => (val === undefined ? undefined : val === "true")),
  sort: z
    .enum(["createdAt", "title", "location", "salary"])
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  employerId: z.string().optional(),
});

// ─── Application ─────────────────────────────────────────────────────────────

export const CreateApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  coverLetter: z.string().max(5000).optional(),
});

export const ApplicationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z
    .enum(["PENDING", "VIEWED", "SHORTLISTED", "REJECTED", "ACCEPTED"])
    .optional(),
  jobId: z.string().optional(),
});

export const ApplicationStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "VIEWED",
    "SHORTLISTED",
    "REJECTED",
    "ACCEPTED",
  ]),
});

export const BatchUpdateApplicationsSchema = z.object({
  applicationIds: z
    .array(z.string().min(1))
    .min(1, "At least one application ID is required"),
  status: z.enum([
    "PENDING",
    "VIEWED",
    "SHORTLISTED",
    "REJECTED",
    "ACCEPTED",
  ]),
});

// ─── Notification ────────────────────────────────────────────────────────────

export const MarkNotificationsReadSchema = z.object({
  notificationIds: z
    .array(z.string().min(1))
    .min(1, "At least one notification ID is required"),
});

export const NotificationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  isRead: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => (val === undefined ? undefined : val === "true")),
});

// ─── Company ─────────────────────────────────────────────────────────────────

export const CreateCompanySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  logo: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  description: z.string().max(5000).optional(),
  size: z.string().max(100).optional(),
  industry: z.string().max(200).optional(),
  location: z.string().max(200).optional(),
});

export const UpdateCompanySchema = CreateCompanySchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" },
);

export const CompanyQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  industry: z.string().optional(),
});

// ─── User Profile ────────────────────────────────────────────────────────────

export const UpdateUserProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().max(30).optional(),
  location: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  skills: z.array(z.string().min(1).max(100)).max(50).optional(),
  resumeUrl: z.string().max(500).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" },
);

// ─── Type Exports ────────────────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateJobInput = z.infer<typeof CreateJobSchema>;
export type UpdateJobInput = z.infer<typeof UpdateJobSchema>;
export type JobQueryInput = z.infer<typeof JobQuerySchema>;
export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>;
export type ApplicationQueryInput = z.infer<typeof ApplicationQuerySchema>;
export type ApplicationStatusInput = z.infer<typeof ApplicationStatusSchema>;
export type BatchUpdateApplicationsInput = z.infer<
  typeof BatchUpdateApplicationsSchema
>;
export type MarkNotificationsReadInput = z.infer<
  typeof MarkNotificationsReadSchema
>;
export type NotificationQueryInput = z.infer<typeof NotificationQuerySchema>;
export type CreateCompanyInput = z.infer<typeof CreateCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof UpdateCompanySchema>;
export type CompanyQueryInput = z.infer<typeof CompanyQuerySchema>;
export type UpdateUserProfileInput = z.infer<typeof UpdateUserProfileSchema>;
