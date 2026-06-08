import type { Project, Repository } from "@/types";

export const projects: Project[] = [
  {
    title: "SIJAGSA Petok Sangkulirang",
    description:
      "Village Fund Disbursement Management System used by villages in Sangkulirang District, East Kutai Regency. The platform streamlines fund disbursement requests through digital document submission, automated document generation, approval workflows, and electronic signature integration.",
    mockup: "Government Financial Management System",
    stack: ["Laravel", "Blade", "MySQL", "Bootstrap 5", "jQuery"],
    highlights: [
      "Digital submission workflow for village fund disbursement requests",
      "Multi-level approval and verification process",
      "Automatic fund disbursement document generation",
      "Electronic Signature integration for official documents",
      "Dynamic budget master data management",
      "Role-based access control for village officers and administrators",
      "Reduced manual paperwork and accelerated approval cycles",
    ],
    links: {
      demo: "#contact",
      source: "#github",
      caseStudy: "#contact",
    },
  },
];

export const repositories: Repository[] = [
  {
    name: "ai-chat-platform",
    description:
      "Streaming AI chat UI with typed API routes and conversation persistence.",
    stack: ["Next.js", "OpenAI", "PostgreSQL"],
    stars: 24,
    forks: 6,
    href: "#projects",
  },
  {
    name: "backend-api-boilerplate",
    description:
      "Reusable backend starter for auth, validation, repositories, and Docker deployment.",
    stack: ["NestJS", "JWT", "Docker"],
    stars: 18,
    forks: 4,
    href: "#projects",
  },
  {
    name: "self-hosted-portfolio",
    description:
      "Dark portfolio website optimized for home-server deployment behind Nginx or Caddy.",
    stack: ["Next.js", "Tailwind", "Podman"],
    stars: 31,
    forks: 8,
    href: "#home",
  },
];
