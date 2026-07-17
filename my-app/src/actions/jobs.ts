"use server";

import { JobSchema } from "@/lib/validations";
import { createEmployerJob } from "@/services/job.service";

export async function createJobAction(
  employerId: string,
  formData: FormData
) {
  const parsed = JobSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    company: formData.get("company"),
    location: formData.get("location"),
    salary: formData.get("salary"),
  });

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten(),
    };
  }

  await createEmployerJob(
    employerId,
    parsed.data
  );

  return {
    success: true,
  };
}