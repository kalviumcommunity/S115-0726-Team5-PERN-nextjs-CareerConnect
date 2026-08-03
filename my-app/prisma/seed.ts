import {
  ApplicationStatus,
  ExperienceLevel,
  JobCategory,
  JobType,
  NotificationType,
  PrismaClient,
  Role,
} from "@prisma/client";
import { hashPassword } from "../src/utils/password";
import { logger } from "../src/lib/logger";

const prisma = new PrismaClient();

const SEED_PASSWORD = "Password123!";

async function main() {
  logger.info("Starting database seed...");

  // Clear existing data in reverse dependency order
  await prisma.notification.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await hashPassword(SEED_PASSWORD);

  // ── Employers ──────────────────────────────────────────────────────────────

  const employer1 = await prisma.user.create({
    data: {
      name: "Apna Tech Solutions",
      email: "employer@apna.co",
      password: hashedPassword,
      role: Role.EMPLOYER,
    },
  });

  const employer2 = await prisma.user.create({
    data: {
      name: "QuickDeliver Logistics",
      email: "hr@quickdeliver.co",
      password: hashedPassword,
      role: Role.EMPLOYER,
    },
  });

  // ── Candidates ─────────────────────────────────────────────────────────────

  const candidate1 = await prisma.user.create({
    data: {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      password: hashedPassword,
      role: Role.CANDIDATE,
      phone: "+91 98765 43210",
      location: "Bangalore, India",
      bio: "Passionate frontend developer with 3 years of React experience. Love building clean, accessible UIs.",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js"],
    },
  });

  const candidate2 = await prisma.user.create({
    data: {
      name: "Priya Patel",
      email: "priya@example.com",
      password: hashedPassword,
      role: Role.CANDIDATE,
      phone: "+91 99887 76655",
      location: "Hyderabad, India",
      bio: "Backend engineer specialising in distributed systems and high-throughput APIs.",
      skills: ["Node.js", "PostgreSQL", "Docker", "AWS", "Redis"],
    },
  });

  const candidate3 = await prisma.user.create({
    data: {
      name: "Arjun Mehta",
      email: "arjun@example.com",
      password: hashedPassword,
      role: Role.CANDIDATE,
      phone: "+91 77665 44332",
      location: "Pune, India",
      bio: "Full-stack developer with a strong eye for product design. Built 5+ production SaaS apps.",
      skills: ["React", "Node.js", "MongoDB", "GraphQL", "Docker"],
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@careerconnect.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  // ── Companies ──────────────────────────────────────────────────────────────

  const company1 = await prisma.company.create({
    data: {
      name: "Apna Tech Solutions",
      description:
        "Leading technology solutions provider specialising in enterprise software and cloud infrastructure.",
      size: "201-500",
      industry: "Technology",
      location: "Bangalore",
      website: "https://apnatech.example.com",
      employerId: employer1.id,
    },
  });

  const company2 = await prisma.company.create({
    data: {
      name: "Apna Ventures",
      description: "Early-stage investment arm and incubator for deep-tech startups across India.",
      size: "51-200",
      industry: "Finance",
      location: "Mumbai",
      employerId: employer1.id,
    },
  });

  const company3 = await prisma.company.create({
    data: {
      name: "QuickDeliver",
      description:
        "Fast-growing logistics and last-mile delivery platform serving major Indian cities.",
      size: "501-1000",
      industry: "Logistics",
      location: "Delhi NCR",
      employerId: employer2.id,
    },
  });

  const company4 = await prisma.company.create({
    data: {
      name: "QD Analytics",
      description: "Data intelligence arm of QuickDeliver, building real-time supply-chain dashboards.",
      size: "11-50",
      industry: "Technology",
      location: "Delhi NCR",
      employerId: employer2.id,
    },
  });

  // ── Jobs (employer1) ───────────────────────────────────────────────────────

  const jobs = await Promise.all([
    // employer1 / company1
    prisma.job.create({
      data: {
        title: "Frontend Developer",
        description:
          "Build responsive web applications using React and Next.js. Collaborate with design and backend teams to deliver pixel-perfect UIs.",
        company: "Apna Tech Solutions",
        location: "Bangalore",
        salary: "8-12 LPA",
        jobType: JobType.FULL_TIME,
        experienceLevel: ExperienceLevel.MID,
        category: JobCategory.ENGINEERING,
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
        employerId: employer1.id,
        companyId: company1.id,
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
        jobType: JobType.FULL_TIME,
        experienceLevel: ExperienceLevel.MID,
        category: JobCategory.ENGINEERING,
        skills: ["Node.js", "PostgreSQL", "Docker", "AWS"],
        employerId: employer1.id,
        companyId: company1.id,
      },
    }),
    // employer1 / company2
    prisma.job.create({
      data: {
        title: "Investment Analyst",
        description:
          "Evaluate early-stage startup pitches, conduct due diligence, and prepare investment memos.",
        company: "Apna Ventures",
        location: "Mumbai",
        salary: "12-18 LPA",
        jobType: JobType.FULL_TIME,
        experienceLevel: ExperienceLevel.SENIOR,
        category: JobCategory.FINANCE,
        skills: ["Financial Modelling", "Due Diligence", "Excel", "Pitch Evaluation"],
        employerId: employer1.id,
        companyId: company2.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Marketing Manager",
        description:
          "Own the growth roadmap for Apna Ventures. Drive brand awareness, content strategy, and partner events.",
        company: "Apna Ventures",
        location: "Mumbai",
        salary: "10-14 LPA",
        jobType: JobType.FULL_TIME,
        experienceLevel: ExperienceLevel.MID,
        category: JobCategory.MARKETING,
        skills: ["Content Marketing", "SEO", "Brand Strategy", "Analytics"],
        employerId: employer1.id,
        companyId: company2.id,
      },
    }),
    // employer2 / company3
    prisma.job.create({
      data: {
        title: "Delivery Operations Manager",
        description:
          "Oversee last-mile delivery fleet across 3 cities. Optimise routes and manage SLA compliance.",
        company: "QuickDeliver",
        location: "Delhi NCR",
        salary: "8-11 LPA",
        jobType: JobType.FULL_TIME,
        experienceLevel: ExperienceLevel.MID,
        category: JobCategory.OPERATIONS,
        skills: ["Operations", "Logistics", "Fleet Management", "Data Analysis"],
        employerId: employer2.id,
        companyId: company3.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Customer Support Lead",
        description:
          "Handle customer queries via phone and chat. Build and lead a support team of 8 agents.",
        company: "QuickDeliver",
        location: "Hyderabad",
        salary: "5-7 LPA",
        jobType: JobType.FULL_TIME,
        experienceLevel: ExperienceLevel.ENTRY,
        category: JobCategory.SUPPORT,
        skills: ["Communication", "Problem Solving", "CRM", "Team Leadership"],
        employerId: employer2.id,
        companyId: company3.id,
      },
    }),
    // employer2 / company4
    prisma.job.create({
      data: {
        title: "Data Engineer",
        description:
          "Build real-time ETL pipelines for logistics data. Own the warehouse layer and BI dashboards.",
        company: "QD Analytics",
        location: "Delhi NCR",
        salary: "12-16 LPA",
        jobType: JobType.FULL_TIME,
        experienceLevel: ExperienceLevel.MID,
        category: JobCategory.ENGINEERING,
        skills: ["Python", "Spark", "Kafka", "Airflow", "Redshift"],
        employerId: employer2.id,
        companyId: company4.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "UI/UX Designer",
        description:
          "Design intuitive dashboards for internal logistics teams. Run user research and A/B tests.",
        company: "QD Analytics",
        location: "Remote",
        salary: "7-10 LPA",
        jobType: JobType.FULL_TIME,
        experienceLevel: ExperienceLevel.ENTRY,
        category: JobCategory.DESIGN,
        skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
        employerId: employer2.id,
        companyId: company4.id,
      },
    }),
  ]);

  // ── Applications ───────────────────────────────────────────────────────────
  // Mixing statuses so every case is testable end-to-end

  const applications = await Promise.all([
    // candidate1 — SHORTLISTED on Frontend Dev (shows green path in UI)
    prisma.application.create({
      data: {
        candidateId: candidate1.id,
        jobId: jobs[0].id, // Frontend Developer
        status: ApplicationStatus.SHORTLISTED,
        coverLetter: "I have 3 years of React/Next.js experience and am passionate about clean UIs.",
      },
    }),
    // candidate1 — VIEWED on Backend Engineer
    prisma.application.create({
      data: {
        candidateId: candidate1.id,
        jobId: jobs[1].id, // Backend Engineer
        status: ApplicationStatus.VIEWED,
      },
    }),
    // candidate1 — PENDING on Data Engineer
    prisma.application.create({
      data: {
        candidateId: candidate1.id,
        jobId: jobs[6].id, // Data Engineer
        status: ApplicationStatus.PENDING,
      },
    }),
    // candidate2 — PENDING on Frontend Dev
    prisma.application.create({
      data: {
        candidateId: candidate2.id,
        jobId: jobs[0].id, // Frontend Developer
        status: ApplicationStatus.PENDING,
      },
    }),
    // candidate2 — REJECTED on Delivery Operations Manager
    prisma.application.create({
      data: {
        candidateId: candidate2.id,
        jobId: jobs[4].id, // Delivery Operations Manager
        status: ApplicationStatus.REJECTED,
      },
    }),
    // candidate2 — ACCEPTED on Customer Support Lead
    prisma.application.create({
      data: {
        candidateId: candidate2.id,
        jobId: jobs[5].id, // Customer Support Lead
        status: ApplicationStatus.ACCEPTED,
      },
    }),
    // candidate3 — PENDING on UI/UX Designer
    prisma.application.create({
      data: {
        candidateId: candidate3.id,
        jobId: jobs[7].id, // UI/UX Designer
        status: ApplicationStatus.PENDING,
      },
    }),
    // candidate3 — VIEWED on Frontend Developer
    prisma.application.create({
      data: {
        candidateId: candidate3.id,
        jobId: jobs[0].id, // Frontend Developer
        status: ApplicationStatus.VIEWED,
      },
    }),
    // candidate3 — REJECTED on Investment Analyst
    prisma.application.create({
      data: {
        candidateId: candidate3.id,
        jobId: jobs[2].id, // Investment Analyst
        status: ApplicationStatus.REJECTED,
      },
    }),
  ]);

  // ── Notifications ──────────────────────────────────────────────────────────

  await prisma.notification.createMany({
    data: [
      {
        userId: candidate1.id,
        title: "Application shortlisted",
        message: `Your application for ${jobs[0].title} at ${jobs[0].company} has been shortlisted. Expect a call soon!`,
        type: NotificationType.APPLICATION_SHORTLISTED,
        isRead: false,
      },
      {
        userId: candidate1.id,
        title: "Application viewed",
        message: `Your application for ${jobs[1].title} at ${jobs[1].company} was viewed by the recruiter.`,
        type: NotificationType.APPLICATION_VIEWED,
        isRead: true,
      },
      {
        userId: candidate1.id,
        title: "Application submitted",
        message: `Your application for ${jobs[6].title} at ${jobs[6].company} has been submitted.`,
        type: NotificationType.APPLICATION_SUBMITTED,
        isRead: true,
      },
      {
        userId: candidate2.id,
        title: "Application rejected",
        message: `Thank you for applying to ${jobs[4].title} at ${jobs[4].company}. Unfortunately your application was not selected.`,
        type: NotificationType.APPLICATION_REJECTED,
        isRead: false,
      },
      {
        userId: candidate2.id,
        title: "Offer accepted!",
        message: `Congratulations! Your application for ${jobs[5].title} at ${jobs[5].company} has been accepted.`,
        type: NotificationType.APPLICATION_ACCEPTED,
        isRead: false,
      },
      {
        userId: candidate3.id,
        title: "Application viewed",
        message: `Your application for ${jobs[0].title} at ${jobs[0].company} was reviewed by the hiring team.`,
        type: NotificationType.APPLICATION_VIEWED,
        isRead: false,
      },
      {
        userId: candidate3.id,
        title: "Application rejected",
        message: `We regret to inform you that your application for ${jobs[2].title} at ${jobs[2].company} was not selected.`,
        type: NotificationType.APPLICATION_REJECTED,
        isRead: false,
      },
    ],
  });

  logger.info(
    {
      employers: [employer1.email, employer2.email],
      admin: admin.email,
      candidates: [candidate1.email, candidate2.email, candidate3.email],
      companies: [company1.name, company2.name, company3.name, company4.name],
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
