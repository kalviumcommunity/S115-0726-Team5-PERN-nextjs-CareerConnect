import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: "Demo Employer",
      email: "employer@test.com",
      password: "hashed-password",
      role: Role.EMPLOYER,
    },
  });

  await prisma.user.create({
    data: {
      name: "Demo Candidate",
      email: "candidate@test.com",
      password: "hashed-password",
      role: Role.CANDIDATE,
    },
  });

  console.log("Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());