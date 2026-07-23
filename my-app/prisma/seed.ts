import {
  ApplicationStatus,
  PrismaClient,
  Role,
} from "@prisma/client";
import { hashPassword } from "../src/utils/password";
import { logger } from "../src/lib/logger";

const prisma = new PrismaClient();

const SEED_PASSWORD = "Password123!";

async function main() {
  logger.info("Starting database seed...");

  await prisma.notification.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await hashPassword(SEED_PASSWORD);

  const employer = await prisma.user.create({
    data: {
      name: "Apna Tech Solutions",
      email: "employer@apna.co",
      password: hashedPassword,
      role: Role.EMPLOYER,
    },
  });

  const candidate1 = await prisma.user.create({
    data: {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      password: hashedPassword,
      role: Role.CANDIDATE,
    },
  });

  const candidate2 = await prisma.user.create({
    data: {
      name: "Priya Patel",
      email: "priya@example.com",
      password: hashedPassword,
      role: Role.CANDIDATE,
    },
  });

  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: "Frontend Developer",
        description:
          "Build responsive web applications using React and Next.js. Collaborate with design and backend teams.",
        company: "Apna Tech Solutions",
        location: "Bangalore",
        salary: "8-12 LPA",
        employerId: employer.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Backend Engineer",
        description:
          "Design and implement scalable REST APIs with Node.js, PostgreSQL, and cloud infrastructure.",
        company: "Apna Tech Solutions",
        location: "Mumbai",
        salary: "10-15 LPA",
        employerId: employer.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Delivery Executive",
        description:
          "Timely delivery of packages across the city. Must have a valid driving license.",
        company: "QuickDeliver",
        location: "Delhi NCR",
        salary: "3-4 LPA",
        employerId: employer.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Customer Support Associate",
        description:
          "Handle customer queries via phone and chat. Strong communication skills required.",
        company: "Apna Tech Solutions",
        location: "Hyderabad",
        salary: "4-5 LPA",
        employerId: employer.id,
      },
    }),
  ]);

  const applications = await Promise.all([
    prisma.application.create({
      data: {
        candidateId: candidate1.id,
        jobId: jobs[0].id,
        status: ApplicationStatus.SHORTLISTED,
      },
    }),
    prisma.application.create({
      data: {
        candidateId: candidate1.id,
        jobId: jobs[1].id,
        status: ApplicationStatus.VIEWED,
      },
    }),
    prisma.application.create({
      data: {
        candidateId: candidate2.id,
        jobId: jobs[0].id,
        status: ApplicationStatus.PENDING,
      },
    }),
    prisma.application.create({
      data: {
        candidateId: candidate2.id,
        jobId: jobs[2].id,
        status: ApplicationStatus.REJECTED,
      },
    }),
    prisma.application.create({
      data: {
        candidateId: candidate2.id,
        jobId: jobs[3].id,
        status: ApplicationStatus.ACCEPTED,
      },
    }),
  ]);

  await prisma.notification.createMany({
    data: [
      {
        userId: candidate1.id,
        title: "Application shortlisted",
        message: `Your application for ${jobs[0].title} at ${jobs[0].company} has been shortlisted.`,
        isRead: false,
      },
      {
        userId: candidate1.id,
        title: "Application viewed",
        message: `Your application for ${jobs[1].title} at ${jobs[1].company} has been viewed.`,
        isRead: true,
      },
      {
        userId: candidate2.id,
        title: "Application rejected",
        message: `Your application for ${jobs[2].title} at ${jobs[2].company} was not selected.`,
        isRead: false,
      },
      {
        userId: candidate2.id,
        title: "Offer accepted",
        message: `Congratulations! Your application for ${jobs[3].title} at ${jobs[3].company} has been accepted.`,
        isRead: false,
      },
    ],
  });

  logger.info(
    {
      employer: employer.email,
      candidates: [candidate1.email, candidate2.email],
      jobs: jobs.length,
      applications: applications.length,
      password: SEED_PASSWORD,
    },
    "Seed completed successfully",
  );
}

main()
  .catch((error) => {
    logger.error({ err: error }, "Seed failed");
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
