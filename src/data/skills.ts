import type { AboutItem, SkillCategory } from "@/types";

export const aboutItems: AboutItem[] = [
  {
    title: "Frontend Development",
    description:
      "Responsive Next.js interfaces with accessible components, polished motion, and recruiter-friendly storytelling.",
    icon: "LayoutDashboard",
  },
  {
    title: "Backend Architecture",
    description:
      "Clean API boundaries, authentication flows, service layers, and maintainable backend modules.",
    icon: "ServerCog",
  },
  {
    title: "Database Design",
    description:
      "Relational schemas, query planning, indexing strategy, and pragmatic PostgreSQL-first modeling.",
    icon: "Database",
  },
  {
    title: "AI Integration",
    description:
      "AI chat features, prompt workflows, tool-assisted experiences, and product-ready OpenAI API usage.",
    icon: "BrainCircuit",
  },
  {
    title: "Self-hosted Deployment",
    description:
      "Dockerized applications prepared for Linux servers, reverse proxies, and home-server operations.",
    icon: "CloudCog",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    description: "Modern UI systems and typed client experiences.",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    icon: "Code2",
  },
  {
    title: "Backend",
    description: "API design, auth, and service architecture.",
    items: [
      "NestJS",
      "Golang Gin",
      "ElysiaJS",
      "Laravel",
      "Codeigniter 3",
      "REST API",
      "JWT Auth",
    ],
    icon: "Boxes",
  },
  {
    title: "Database",
    description: "Production data stores and caching layers.",
    items: ["PostgreSQL", "MySQL", "Redis"],
    icon: "Database",
  },
  {
    title: "DevOps",
    description: "Self-hosted deployments and server operations.",
    items: [
      "Docker",
      "Podman",
      "Nginx",
      "Linux Server",
      "Home Server Deployment",
    ],
    icon: "CloudCog",
  },
  {
    title: "AI",
    description: "AI product features with practical prompt systems.",
    items: ["OpenAI API", "AI Chat Integration", "Prompt Engineering"],
    icon: "Bot",
  },
];
