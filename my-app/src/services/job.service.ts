import { JobInput } from "@/lib/validations";
import * as repository from "@/repositories/job.repository";

export async function createEmployerJob(
  employerId: string,
  data: JobInput
) {
  return repository.createJob(
    employerId,
    data
  );
}

export async function fetchEmployerJobs(
  employerId: string
) {
  return repository.getEmployerJobs(
    employerId
  );
}

export async function editEmployerJob(
  id: string,
  data: JobInput
) {
  return repository.updateJob(id, data);
}

export async function removeEmployerJob(id: string) {
  return repository.deleteJob(id);
}