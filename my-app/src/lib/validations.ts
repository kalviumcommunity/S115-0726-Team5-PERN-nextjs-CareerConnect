import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128),
  role: z.enum(["CANDIDATE", "EMPLOYER"]),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const CreateJobSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  company: z.string().min(2).max(200),
  location: z.string().min(2).max(200),
  salary: z.string().min(1).max(100),
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
  sort: z
    .enum(["createdAt", "title", "location", "salary"])
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  employerId: z.string().optional(),
});

export const CreateApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
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
