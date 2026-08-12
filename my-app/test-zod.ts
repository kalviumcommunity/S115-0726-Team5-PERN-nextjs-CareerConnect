import { z } from "zod";

const CreateJobSchema = z.object({
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

const payload = {
  title: "Test Job",
  description: "This is a test job description which is at least 10 chars.",
  company: "Test Company",
  location: "Bangalore, India",
  salary: "10L",
  jobType: "FULL_TIME",
  experienceLevel: "ENTRY",
  skills: ["React"],
};

const result = CreateJobSchema.safeParse(payload);
console.log("CreateJob:", JSON.stringify(result, null, 2));

const ApplicationStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "VIEWED",
    "SHORTLISTED",
    "REJECTED",
    "ACCEPTED",
  ]),
});

const payload2 = {
  status: "SHORTLISTED",
};

const result2 = ApplicationStatusSchema.safeParse(payload2);
console.log("AppStatus:", JSON.stringify(result2, null, 2));
