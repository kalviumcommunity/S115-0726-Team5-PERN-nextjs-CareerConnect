/**
 * Seeds demo data that mirrors the mock data already present in the
 * frontend's src/context/AppContext.tsx, so the app looks identical
 * the moment the frontend is wired up to this API.
 *
 * Usage: npm run seed
 *
 * Demo logins (password for every seeded account is: Password123!)
 *   Candidate: devansh.pujari@example.com
 *   Employer:  employer@techsolutions.com
 */
const bcrypt = require("bcryptjs");
const { pool, withTransaction } = require("../config/db");

const DEMO_PASSWORD = "Password123!";

async function seed() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  await withTransaction(async (client) => {
    console.log("[seed] clearing existing data...");
    await client.query(
      "TRUNCATE notifications, applications, jobs, companies, candidate_profiles, users RESTART IDENTITY CASCADE"
    );

    console.log("[seed] creating employer + company...");
    const employerRes = await client.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'employer') RETURNING id`,
      ["Tech Solutions HR", "employer@techsolutions.com", passwordHash]
    );
    const employerId = employerRes.rows[0].id;

    await client.query(
      `INSERT INTO companies (employer_id, name, email, location, description, logo_initials)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        employerId,
        "Tech Solutions",
        "info@techsolutions.com",
        "Bangalore, India",
        "Tech Solutions is a leading developer of high-quality software products and mobile applications. We pride ourselves on innovation, engineering excellence, and maintaining a culture of collaborative growth.",
        "TS",
      ]
    );

    console.log("[seed] creating demo candidate...");
    const candidateRes = await client.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'candidate') RETURNING id`,
      ["Devansh Pujari", "devansh.pujari@example.com", passwordHash]
    );
    const candidateId = candidateRes.rows[0].id;

    await client.query(
      `INSERT INTO candidate_profiles
        (user_id, phone, location, dob, status, bio, avatar, resume_name, resume_updated,
         skills, pref_roles, pref_locations, pref_job_types, pref_experience)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [
        candidateId,
        "+91 98765 43210",
        "Bangalore, India",
        "12 Jan 2003",
        "Actively looking for opportunities",
        "Passionate and detail-oriented developer with a strong foundation in building scalable web applications.",
        "DP",
        "Devansh_Pujari_Resume.pdf",
        "08 May 2025",
        ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Git", "REST API"],
        ["Frontend Developer", "UI/UX Designer"],
        ["Bangalore", "Hyderabad", "Pune"],
        "Full-time",
        "1 - 3 Years",
      ]
    );

    console.log("[seed] creating a few more candidate accounts for realism...");
    const otherCandidates = [
      ["Rohit Kumar", "rohit.kumar@email.com", "+91 98765 43210", "RK"],
      ["Ananya Singh", "ananya.singh@email.com", "+91 98765 43211", "AS"],
      ["Manish Patel", "manish.patel@email.com", "+91 98765 43212", "MP"],
      ["Sneha Reddy", "sneha.reddy@email.com", "+91 98765 43213", "SR"],
      ["Nikhil Purohit", "nikhil.purohit@email.com", "+91 98765 43214", "NP"],
      ["Pooja Kapoor", "pooja.kapoor@email.com", "+91 98765 43215", "PK"],
    ];
    const candidateIds = {};
    for (const [name, email, phone, initials] of otherCandidates) {
      const res = await client.query(
        `INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,'candidate') RETURNING id`,
        [name, email, passwordHash]
      );
      candidateIds[email] = res.rows[0].id;
      await client.query(
        `INSERT INTO candidate_profiles (user_id, phone, avatar, skills)
         VALUES ($1,$2,$3,$4)`,
        [res.rows[0].id, phone, initials, []]
      );
    }

    console.log("[seed] creating jobs...");
    const jobDefs = [
      {
        title: "Frontend Developer",
        location: "Bangalore, India",
        salary: "₹8L - ₹12L",
        experience: "1 - 3 Years",
        skills: ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS"],
        description:
          "We are looking for a passionate Frontend Developer to build beautiful, responsive web applications using React and Tailwind CSS.",
      },
      {
        title: "UI/UX Designer",
        location: "Bangalore, India",
        salary: "₹6L - ₹10L",
        experience: "1 - 3 Years",
        skills: ["Figma", "Adobe XD", "UI Design", "Prototyping"],
        description:
          "Join our creative team to craft engaging, user-centered digital interfaces for web and mobile products.",
      },
      {
        title: "Full Stack Developer",
        location: "Bangalore, India",
        salary: "₹12L - ₹18L",
        experience: "3 - 5 Years",
        skills: ["React", "Node.js", "Express.js", "MongoDB"],
        description:
          "Looking for an experienced developer capable of handling both client-side and server-side logic in a MERN stack environment.",
      },
      {
        title: "Backend Developer",
        location: "Bangalore, India",
        salary: "₹10L - ₹15L",
        experience: "2 - 4 Years",
        skills: ["Node.js", "Express.js", "PostgreSQL", "Redis"],
        description:
          "Build robust, scalable APIs and microservices. Ensure high performance and low latency of backend requests.",
      },
      {
        title: "DevOps Engineer",
        location: "Bangalore, India",
        salary: "₹14L - ₹20L",
        experience: "3 - 5 Years",
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
        description:
          "Manage and optimize cloud deployment pipelines. Monitor application uptime, scaling, and system health.",
      },
    ];

    const jobIds = {};
    for (const j of jobDefs) {
      const res = await client.query(
        `INSERT INTO jobs (employer_id, title, company, location, salary, experience, skills, description)
         VALUES ($1,$2,'Tech Solutions',$3,$4,$5,$6,$7) RETURNING id`,
        [employerId, j.title, j.location, j.salary, j.experience, j.skills, j.description]
      );
      jobIds[j.title] = res.rows[0].id;
    }

    console.log("[seed] creating applications...");
    const applicationDefs = [
      {
        email: "rohit.kumar@email.com",
        name: "Rohit Kumar",
        phone: "+91 98765 43210",
        initials: "RK",
        jobTitle: "Frontend Developer",
        appliedDate: "08 May 2025",
        status: "Pending",
        resumeUrl: "Rohit_Kumar_Resume.pdf",
        skills: ["React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap", "Git", "REST APIs", "Figma"],
        experience:
          "Frontend Developer at Tech Solutions (Jan 2023 - Present)\nFrontend Developer at Webcraft Technologies (Aug 2021 - Dec 2022)",
        education: "Bachelor of Computer Applications (BCA) at Christ University, Bangalore (2018 - 2021)",
        bio: "Passionate Frontend Developer with 3+ years of experience building responsive, user-friendly web applications. Skilled in React, JavaScript, TypeScript, HTML5, CSS3, and modern CSS frameworks. Strong problem-solving abilities and a keen eye for detail.",
      },
      {
        email: "ananya.singh@email.com",
        name: "Ananya Singh",
        phone: "+91 98765 43211",
        initials: "AS",
        jobTitle: "UI/UX Designer",
        appliedDate: "07 May 2025",
        status: "Pending",
        resumeUrl: "Ananya_Singh_Portfolio.pdf",
        skills: ["Figma", "Sketch", "Adobe XD", "User Research", "Wireframing", "Prototyping", "Design Systems"],
        experience:
          "UI/UX Designer at Creative Studio (Jul 2023 - Present)\nJunior Product Designer at AppForge (Sep 2022 - Jun 2023)",
        education: "Bachelor of Design (B.Des) at National Institute of Design (2018 - 2022)",
        bio: "Detail-oriented Product Designer focusing on creating intuitive interfaces and delightful user journeys. Specialized in mobile applications and design system creation.",
      },
      {
        email: "manish.patel@email.com",
        name: "Manish Patel",
        phone: "+91 98765 43212",
        initials: "MP",
        jobTitle: "Full Stack Developer",
        appliedDate: "06 May 2025",
        status: "Shortlisted",
        resumeUrl: "Manish_Patel_Resume.pdf",
        skills: ["React", "Node.js", "Express.js", "MongoDB", "Redux", "Docker", "AWS", "Next.js"],
        experience:
          "Full Stack Engineer at ByteCode Corp (Mar 2022 - Present)\nSoftware Developer Intern at TechLab (Jan 2021 - Feb 2022)",
        education: "B.Tech in Computer Science at NIT Trichy (2018 - 2022)",
        bio: "Versatile Full Stack Developer with experience in MERN stack. Interested in system architecture, API optimization, and CI/CD pipelines.",
      },
      {
        email: "sneha.reddy@email.com",
        name: "Sneha Reddy",
        phone: "+91 98765 43213",
        initials: "SR",
        jobTitle: "Backend Developer",
        appliedDate: "05 May 2025",
        status: "In Review",
        resumeUrl: "Sneha_Reddy_Resume.pdf",
        skills: ["Node.js", "Python", "Django", "PostgreSQL", "Redis", "Kafka", "Docker", "GraphQL"],
        experience:
          "Backend Developer at DataFlow Systems (Nov 2022 - Present)\nPython Developer at PyTech Solutions (Jun 2021 - Oct 2022)",
        education: "M.Tech in Software Engineering at IIIT Bangalore (2019 - 2021)",
        bio: "Backend specialist with passion for writing clean, optimized code. Expert in database design, caching mechanisms, and distributed message queues.",
      },
      {
        email: "nikhil.purohit@email.com",
        name: "Nikhil Purohit",
        phone: "+91 98765 43214",
        initials: "NP",
        jobTitle: "DevOps Engineer",
        appliedDate: "04 May 2025",
        status: "Rejected",
        resumeUrl: "Nikhil_Purohit_Resume.pdf",
        skills: ["AWS", "Terraform", "Kubernetes", "Docker", "Jenkins", "GitHub Actions", "Prometheus", "Grafana"],
        experience:
          "DevOps Engineer at CloudScale Ltd (Feb 2023 - Present)\nSystems Administrator at WebHosting India (May 2021 - Jan 2023)",
        education: "B.Sc in Computer Science at Delhi University (2018 - 2021)",
        bio: "Infrastructure Automation Architect. Passionate about infrastructure as code, cloud cost optimization, and establishing high-availability production metrics.",
      },
      {
        email: "pooja.kapoor@email.com",
        name: "Pooja Kapoor",
        phone: "+91 98765 43215",
        initials: "PK",
        jobTitle: "UI/UX Designer",
        appliedDate: "03 May 2025",
        status: "Hired",
        resumeUrl: "Pooja_Kapoor_Portfolio.pdf",
        skills: ["Figma", "Adobe XD", "Wireframing", "Interaction Design", "Responsive Design", "Heuristic Evaluation"],
        experience:
          "Interaction Designer at Pixel Perfect Agency (Apr 2023 - Present)\nUI Designer at InnoApp Studios (May 2021 - Mar 2023)",
        education: "B.Des in Communication Design at NIFT Mumbai (2017 - 2021)",
        bio: "User Experience Designer who bridges the gap between user needs and business objectives. Experienced in user interviews, high-fidelity mockups, and usability testing.",
      },
      {
        email: "devansh.pujari@example.com",
        name: "Devansh Pujari",
        phone: "+91 98765 43210",
        initials: "DP",
        jobTitle: "UI/UX Designer",
        appliedDate: "07 May 2025",
        status: "Shortlisted",
        resumeUrl: "Devansh_Pujari_Resume.pdf",
        skills: ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Git", "REST API"],
        experience: "Passionate Frontend Developer with 2 years of experience.",
        education: "Bachelor of Computer Applications (BCA) at Christ University (2020 - 2023)",
        bio: "Passionate and detail-oriented developer with a strong foundation in building scalable web applications.",
      },
      {
        email: "devansh.pujari@example.com",
        name: "Devansh Pujari",
        phone: "+91 98765 43210",
        initials: "DP",
        jobTitle: "Frontend Developer",
        appliedDate: "08 May 2025",
        status: "Pending",
        resumeUrl: "Devansh_Pujari_Resume.pdf",
        skills: ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Git", "REST API"],
        experience: "Passionate Frontend Developer with 2 years of experience.",
        education: "Bachelor of Computer Applications (BCA) at Christ University (2020 - 2023)",
        bio: "Passionate and detail-oriented developer with a strong foundation in building scalable web applications.",
      },
    ];

    for (const a of applicationDefs) {
      const candId = candidateIds[a.email] || candidateId;
      const jobId = jobIds[a.jobTitle];
      await client.query(
        `INSERT INTO applications
          (job_id, candidate_id, candidate_name, candidate_email, candidate_phone, candidate_initials,
           job_title, company, applied_date, status, resume_url, skills, experience, education, bio)
         VALUES ($1,$2,$3,$4,$5,$6,$7,'Tech Solutions',$8,$9,$10,$11,$12,$13,$14)`,
        [
          jobId,
          candId,
          a.name,
          a.email,
          a.phone,
          a.initials,
          a.jobTitle,
          a.appliedDate,
          a.status,
          a.resumeUrl,
          a.skills,
          a.experience,
          a.education,
          a.bio,
        ]
      );
    }

    console.log("[seed] creating notifications for demo candidate...");
    const notifDefs = [
      {
        type: "viewed",
        title: "Application Viewed",
        message: "Tech Solutions viewed your application for Frontend Developer.",
        date: "08 May 2025",
        read: false,
      },
      {
        type: "accepted",
        title: "Application Shortlisted",
        message: "Congratulations! You have been shortlisted by Tech Solutions for UI/UX Designer.",
        date: "07 May 2025",
        read: false,
      },
      {
        type: "rejected",
        title: "Application Status Update",
        message:
          "Thank you for your interest in Tech Solutions. We regret to inform you that your application for DevOps Engineer has been rejected.",
        date: "04 May 2025",
        read: true,
      },
    ];
    for (const n of notifDefs) {
      await client.query(
        `INSERT INTO notifications (user_id, type, title, message, date, read)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [candidateId, n.type, n.title, n.message, n.date, n.read]
      );
    }
  });

  console.log("\n[seed] done!");
  console.log("--------------------------------------------------");
  console.log("Demo candidate login: devansh.pujari@example.com");
  console.log("Demo employer login:  employer@techsolutions.com");
  console.log(`Password (both):      ${DEMO_PASSWORD}`);
  console.log("--------------------------------------------------");
  await pool.end();
}

seed().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
