import { z } from "zod";


export const RegisterSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email(),
  password: z.string().min(6),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});


export const JobSchema = z.object({
  title: z
    .string()
    .min(3, "Title should be at least 3 characters"),

  description: z
    .string()
    .min(20, "Description is too short"),

  company: z
    .string()
    .min(2),

  location: z
    .string()
    .min(2),

  salary: z
    .string()
    .min(2),
});

export type JobInput = z.infer<typeof JobSchema>;