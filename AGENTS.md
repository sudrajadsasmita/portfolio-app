# AGENTS.md

## Project Goal

Build a modern personal portfolio website for a Fullstack Developer specializing in:

- Next.js
- Backend Architecture
- PostgreSQL
- Self-hosted Infrastructure
- AI-powered Applications

The website must look professional, modern, developer-focused, and suitable for job applications.

## Tech Stack

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide React
- Docker / Podman support

Do not use:

- Pages Router
- Supabase
- Firebase
- unnecessary backend services
- overly complex CMS

## Deployment Target

This project will be deployed on a self-hosted home server.

Prepare the project for:

- Dockerfile
- docker-compose.yml
- production build
- reverse proxy compatibility with Nginx / Caddy
- environment variable support

Do not assume deployment to Vercel.

## Design Direction

Use this visual style:

- dark mode only
- modern developer aesthetic
- terminal-inspired UI
- premium SaaS layout
- clean and minimalist
- subtle futuristic style
- recruiter-friendly
- responsive on mobile and desktop

Avoid:

- green matrix hacker style
- excessive neon
- too many particles
- chaotic animation
- childish UI

## Color Palette

Use these colors:

- Main background: `#020617`
- Section background: `#0F172A`
- Card background: `#111827`
- Border: `#1E293B`
- Primary text: `#E5E7EB`
- Secondary text: `#94A3B8`
- Muted text: `#64748B`
- Cyan accent: `#38BDF8`
- Blue accent: `#2563EB`
- Purple accent: `#8B5CF6`
- Success accent: `#22C55E`

## Typography

Use:

- Geist Sans or Inter for main text
- JetBrains Mono for code, terminal, and developer-style sections

## Required Sections

Create these homepage sections:

1. Navbar
2. Hero
3. About
4. Tech Stack
5. Featured Projects
6. Experience / Journey
7. GitHub Showcase
8. Contact
9. Footer

## Navbar Requirements

Navbar should include:

- Logo / name
- Home
- About
- Stack
- Projects
- Experience
- Contact
- Download CV button

Style:

- sticky top
- glassmorphism effect
- dark transparent background
- subtle border
- mobile menu support

## Hero Requirements

Hero must include:

- availability badge
- headline
- short description
- CTA buttons
- terminal/code mockup

Hero headline example:

```txt
Fullstack Developer specializing in Next.js & Backend Systems
```

Hero description example:

```txt
I build modern web applications with scalable backend APIs,
PostgreSQL, and self-hosted infrastructure.
```

CTA buttons:

- View Projects
- Contact Me
- Download CV

Terminal mockup example:

```ts
const developer = {
  role: "Fullstack Developer",
  stack: ["Next.js", "NestJS", "PostgreSQL"],
  focus: "Backend Architecture + Modern UI",
  deployment: "Self-hosted Server",
};
```

## About Section

Create modern cards for:

- Frontend Development
- Backend Architecture
- Database Design
- AI Integration
- Self-hosted Deployment

## Tech Stack Section

Group technologies by category.

Frontend:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend:

- NestJS
- Laravel
- Golang Gin
- REST API
- JWT Auth

Database:

- PostgreSQL
- MySQL
- MongoDB
- Redis

DevOps:

- Docker
- Podman
- Nginx
- Linux Server
- Home Server Deployment

AI:

- OpenAI API
- AI Chat Integration
- Prompt Engineering

## Featured Projects Section

Create reusable project cards.

Each project must support:

- title
- description
- image or mockup
- tech stack badges
- feature highlights
- live demo link
- source code link
- case study link

Prioritize these example projects:

1. AI Chat Application
2. Next.js Portfolio Website
3. Backend API Boilerplate
4. Admin Dashboard / Management System

## Experience Section

Use a vertical timeline layout.

Support:

- year
- title
- description
- tech stack
- highlights

If formal experience is empty, allow personal project journey entries.

## GitHub Section

Create developer-style GitHub showcase.

Include:

- pinned repositories UI
- contribution-style grid mockup
- repository cards
- terminal-inspired layout

Do not depend on GitHub API unless explicitly requested.

Use static data first.

## Contact Section

Include:

- email
- GitHub
- LinkedIn
- WhatsApp optional
- clear CTA text

CTA example:

```txt
Interested in working together?
Let's build something useful, scalable, and production-ready.
```

## Content Architecture

Use data-driven content.

Create files like:

```txt
src/data/profile.ts
src/data/projects.ts
src/data/skills.ts
src/data/experience.ts
src/data/socials.ts
```

Do not hardcode all content inside UI components.

## Folder Structure

Use this structure:

```txt
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── layout/
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   │
│   ├── sections/
│   │   ├── hero-section.tsx
│   │   ├── about-section.tsx
│   │   ├── tech-stack-section.tsx
│   │   ├── projects-section.tsx
│   │   ├── experience-section.tsx
│   │   ├── github-section.tsx
│   │   └── contact-section.tsx
│   │
│   ├── cards/
│   │   ├── project-card.tsx
│   │   ├── skill-card.tsx
│   │   └── experience-card.tsx
│   │
│   └── ui/
│
├── data/
│   ├── profile.ts
│   ├── projects.ts
│   ├── skills.ts
│   ├── experience.ts
│   └── socials.ts
│
├── lib/
│   └── utils.ts
│
└── types/
    └── index.ts
```

## Animation Rules

Use Framer Motion for:

- fade in
- slide up
- hover lift
- subtle glow
- terminal cursor blink

Avoid:

- heavy animations
- animation that hurts performance
- too much motion on mobile

Respect reduced motion preference where possible.

## UI Rules

Use:

- rounded-2xl cards
- subtle borders
- soft shadows
- dark glass effect
- clean spacing
- responsive grid
- consistent section padding
- hover states

Do not use:

- skill percentage bars
- random fake statistics
- unnecessary loading screen
- auto-playing sound
- unreadable contrast

## SEO Requirements

Add proper metadata:

- title
- description
- Open Graph
- Twitter card
- favicon support

Example title:

```txt
Your Name — Fullstack Developer
```

Example description:

```txt
Fullstack Developer specializing in Next.js, backend architecture, PostgreSQL, and self-hosted applications.
```

## Accessibility Requirements

Ensure:

- semantic HTML
- proper heading hierarchy
- accessible buttons and links
- good contrast
- keyboard navigation
- alt text for images
- responsive mobile menu

## Performance Requirements

Optimize for:

- fast initial load
- minimal dependencies
- optimized images
- static data first
- no unnecessary API calls
- production-ready build

## Docker Requirements

Add:

- Dockerfile
- docker-compose.yml
- .dockerignore

The app should run with:

```bash
docker compose up -d --build
```

Expose app on port:

```txt
3000
```

## Environment Variables

Prepare `.env.example`.

Example:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CONTACT_EMAIL=your-email@example.com
```

## Code Quality

Follow:

- TypeScript strict mode
- reusable components
- clean naming
- consistent formatting
- no unused code
- no console.log in production components
- avoid duplicated UI logic

## Final Output Expectation

The final result should be a polished, responsive, dark developer portfolio website that clearly communicates:

- fullstack capability
- Next.js expertise
- backend architecture skill
- PostgreSQL experience
- self-hosted deployment understanding
- AI application experience

