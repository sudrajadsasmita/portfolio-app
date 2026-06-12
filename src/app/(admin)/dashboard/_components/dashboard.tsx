import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  CircleAlert,
  Code2,
  Database,
  FileText,
  FolderKanban,
  Globe2,
  Info,
  Layers3,
  Rocket,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { environment } from "@/configs/environment";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

type CountResult = {
  profile: number;
  siteSettings: number;
  aboutItems: number;
  skills: number;
  projects: number;
  publishedProjects: number;
  featuredProjects: number;
  experiences: number;
};

type RecentProject = {
  id: string;
  title: string;
  description: string;
  is_featured: boolean;
  is_published: boolean;
  updated_at: string;
};

type RecentExperience = {
  id: string;
  year_label: string;
  title: string;
  updated_at: string;
};

type DashboardData = {
  counts: CountResult;
  profileName: string;
  profileTitle: string;
  profileEmail: string | null;
  siteTitle: string;
  siteDescription: string;
  recentProjects: RecentProject[];
  recentExperiences: RecentExperience[];
};

const emptyCounts: CountResult = {
  profile: 0,
  siteSettings: 0,
  aboutItems: 0,
  skills: 0,
  projects: 0,
  publishedProjects: 0,
  featuredProjects: 0,
  experiences: 0,
};

const statCards = [
  {
    valueKey: "projects",
    label: "Projects",
    description: "Total portfolio projects",
    icon: FolderKanban,
    href: "/dashboard/projects",
    tone: "cyan",
  },
  {
    valueKey: "publishedProjects",
    label: "Published",
    description: "Visible on landing page",
    icon: Globe2,
    href: "/dashboard/projects",
    tone: "emerald",
  },
  {
    valueKey: "skills",
    label: "Skills",
    description: "Grouped tech stack items",
    icon: Layers3,
    href: "/dashboard/skills",
    tone: "violet",
  },
  {
    valueKey: "experiences",
    label: "Experience",
    description: "Timeline journey entries",
    icon: BriefcaseBusiness,
    href: "/dashboard/experience",
    tone: "blue",
  },
] satisfies {
  valueKey: keyof CountResult;
  label: string;
  description: string;
  icon: typeof FolderKanban;
  href: string;
  tone: "cyan" | "emerald" | "violet" | "blue";
}[];

const quickActions = [
  {
    title: "Profile",
    description: "Name, headline, resume, and social identity.",
    href: "/dashboard/profile",
    icon: UserRound,
  },
  {
    title: "Site Settings",
    description: "SEO metadata, OG image, favicon, and contact CTA.",
    href: "/dashboard/site-settings",
    icon: Settings,
  },
  {
    title: "About Items",
    description: "Capability cards shown below the hero.",
    href: "/dashboard/about-items",
    icon: Info,
  },
  {
    title: "Projects",
    description: "Case studies, links, stacks, and highlights.",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
];

const toneClasses = {
  cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
  emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  violet: "border-violet-400/20 bg-violet-400/10 text-violet-300",
  blue: "border-blue-400/20 bg-blue-400/10 text-blue-300",
};

function isSupabaseConfigured() {
  return Boolean(environment.SUPABASE_URL && environment.SUPABASE_ANON_KEY);
}

async function getDashboardData(): Promise<DashboardData> {
  if (!isSupabaseConfigured()) {
    return {
      counts: emptyCounts,
      profileName: "Portfolio Admin",
      profileTitle: "Supabase is not configured",
      profileEmail: null,
      siteTitle: "Portfolio Dashboard",
      siteDescription: "Connect Supabase environment variables to show live data.",
      recentProjects: [],
      recentExperiences: [],
    };
  }

  const supabase = await createClient();
  const [
    profileCountResult,
    siteSettingsCountResult,
    aboutItemsCountResult,
    skillsCountResult,
    projectsCountResult,
    publishedProjectsCountResult,
    featuredProjectsCountResult,
    experiencesCountResult,
    profileResult,
    siteSettingsResult,
    projectsResult,
    experiencesResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null),
    supabase
      .from("portfolio_site_settings")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("portfolio_about_items")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("portfolio_skills")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("portfolio_projects")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("portfolio_projects")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("portfolio_projects")
      .select("*", { count: "exact", head: true })
      .eq("is_featured", true),
    supabase
      .from("portfolio_experiences")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("profiles")
      .select("name,title,email")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("portfolio_site_settings")
      .select("title,description")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle(),
    supabase
      .from("portfolio_projects")
      .select("id,title,description,is_featured,is_published,updated_at")
      .order("updated_at", { ascending: false })
      .limit(4),
    supabase
      .from("portfolio_experiences")
      .select("id,year_label,title,updated_at")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(4),
  ]);

  const profile = profileResult.data;
  const siteSettings = siteSettingsResult.data;

  return {
    counts: {
      profile: profileCountResult.count ?? 0,
      siteSettings: siteSettingsCountResult.count ?? 0,
      aboutItems: aboutItemsCountResult.count ?? 0,
      skills: skillsCountResult.count ?? 0,
      projects: projectsCountResult.count ?? 0,
      publishedProjects: publishedProjectsCountResult.count ?? 0,
      featuredProjects: featuredProjectsCountResult.count ?? 0,
      experiences: experiencesCountResult.count ?? 0,
    },
    profileName: profile?.name ?? "Portfolio Admin",
    profileTitle: profile?.title ?? "Fullstack Developer",
    profileEmail: profile?.email ?? null,
    siteTitle: siteSettings?.title ?? "Portfolio Dashboard",
    siteDescription:
      siteSettings?.description ??
      "Manage landing page content, project case studies, skills, experience, and SEO settings.",
    recentProjects: (projectsResult.data ?? []) as RecentProject[],
    recentExperiences: (experiencesResult.data ?? []) as RecentExperience[],
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getReadinessItems(counts: CountResult) {
  return [
    {
      label: "Profile identity",
      description: "Name, title, headline, email, and resume source.",
      done: counts.profile > 0,
      href: "/dashboard/profile",
    },
    {
      label: "Site settings",
      description: "SEO title, description, OG image, and contact CTA.",
      done: counts.siteSettings > 0,
      href: "/dashboard/site-settings",
    },
    {
      label: "About capabilities",
      description: "At least five capability cards for the landing page.",
      done: counts.aboutItems >= 5,
      href: "/dashboard/about-items",
    },
    {
      label: "Tech stack",
      description: "Skills grouped by frontend, backend, database, DevOps, and AI.",
      done: counts.skills >= 8,
      href: "/dashboard/skills",
    },
    {
      label: "Published projects",
      description: "Project cards visible on the public homepage.",
      done: counts.publishedProjects > 0,
      href: "/dashboard/projects",
    },
    {
      label: "Experience timeline",
      description: "Journey entries for roles, projects, or milestones.",
      done: counts.experiences > 0,
      href: "/dashboard/experience",
    },
  ];
}

function StatCard({
  value,
  label,
  description,
  href,
  icon: Icon,
  tone,
}: (typeof statCards)[number] & { value: number }) {
  return (
    <Card className="border-border/70 bg-card/80 shadow-sm shadow-slate-950/20">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardDescription>{label}</CardDescription>
            <CardTitle className="mt-2 text-3xl font-semibold">
              {value}
            </CardTitle>
          </div>
          <div
            className={cn(
              "flex size-11 items-center justify-center rounded-xl border",
              toneClasses[tone],
            )}
          >
            <Icon className="size-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">{description}</p>
        <Link
          href={href}
          className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:border-cyan-400/50 hover:text-cyan-300"
        >
          Manage
        </Link>
      </CardContent>
    </Card>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-background/40 p-4 text-sm text-muted-foreground">
      {label}
    </div>
  );
}

export default async function Dashboard() {
  const data = await getDashboardData();
  const readinessItems = getReadinessItems(data.counts);
  const completeItems = readinessItems.filter((item) => item.done).length;
  const readinessPercentage = Math.round(
    (completeItems / readinessItems.length) * 100,
  );

  return (
    <div className="w-full space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm shadow-slate-950/30 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.16),transparent_30%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
              <Sparkles className="size-3.5" />
              Portfolio control center
            </div>
            <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
              Welcome back, {data.profileName}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
              {data.siteDescription}
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button asChild className="h-10 gap-2">
                <Link href="/">
                  <Globe2 className="size-4" />
                  View Landing
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-10 gap-2">
                <Link href="/dashboard/projects">
                  <FolderKanban className="size-4" />
                  Manage Projects
                </Link>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-border/80 bg-background/70 p-5 backdrop-blur">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Landing readiness
            </p>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-4xl font-semibold">{readinessPercentage}%</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {completeItems} of {readinessItems.length} content areas ready
                </p>
              </div>
              <Rocket className="size-10 text-cyan-300" />
            </div>
            <div className="mt-5 h-2 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-500 to-violet-500"
                style={{ width: `${readinessPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => (
          <StatCard
            key={item.valueKey}
            {...item}
            value={data.counts[item.valueKey]}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-border/70 bg-card/80 shadow-sm shadow-slate-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BadgeCheck className="size-5 text-cyan-300" />
              Content Readiness
            </CardTitle>
            <CardDescription>
              Checklist untuk memastikan landing page terasa lengkap dan siap
              dilihat recruiter.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {readinessItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group rounded-xl border border-border bg-background/50 p-4 transition hover:border-cyan-400/40 hover:bg-cyan-400/5"
              >
                <div className="flex items-start gap-3">
                  {item.done ? (
                    <CheckCircle2 className="mt-0.5 size-5 text-emerald-400" />
                  ) : (
                    <CircleAlert className="mt-0.5 size-5 text-amber-300" />
                  )}
                  <div>
                    <h3 className="font-medium group-hover:text-cyan-300">
                      {item.label}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80 shadow-sm shadow-slate-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="size-5 text-violet-300" />
              Portfolio Snapshot
            </CardTitle>
            <CardDescription>
              Ringkasan identitas publik yang sedang aktif.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border bg-background/50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Site title
              </p>
              <p className="mt-2 font-medium">{data.siteTitle}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <div className="rounded-xl border border-border bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="mt-2 font-medium">{data.profileTitle}</p>
              </div>
              <div className="rounded-xl border border-border bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="mt-2 truncate font-medium">
                  {data.profileEmail ?? "Not configured"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border bg-background/50 p-3 text-center">
                <p className="text-xl font-semibold">
                  {data.counts.featuredProjects}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Featured</p>
              </div>
              <div className="rounded-xl border border-border bg-background/50 p-3 text-center">
                <p className="text-xl font-semibold">{data.counts.aboutItems}</p>
                <p className="mt-1 text-xs text-muted-foreground">About</p>
              </div>
              <div className="rounded-xl border border-border bg-background/50 p-3 text-center">
                <p className="text-xl font-semibold">
                  {data.counts.siteSettings}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">SEO</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border/70 bg-card/80 shadow-sm shadow-slate-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="size-5 text-cyan-300" />
              Recent Projects
            </CardTitle>
            <CardDescription>
              Project terbaru berdasarkan waktu update.
            </CardDescription>
            <CardAction>
              <Button asChild variant="ghost" size="sm" className="gap-1">
                <Link href="/dashboard/projects">
                  Open
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentProjects.length ? (
              data.recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-xl border border-border bg-background/50 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate font-medium">{project.title}</h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs",
                          project.is_published
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-slate-500/10 text-slate-400",
                        )}
                      >
                        {project.is_published ? "Published" : "Draft"}
                      </span>
                      {project.is_featured ? (
                        <span className="rounded-full bg-blue-400/10 px-2 py-0.5 text-xs text-blue-300">
                          Featured
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <p className="mt-3 font-mono text-xs text-muted-foreground">
                    Updated {formatDate(project.updated_at)}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState label="Belum ada project. Tambahkan project pertama untuk mengisi landing page." />
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80 shadow-sm shadow-slate-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5 text-emerald-300" />
              Recent Experience
            </CardTitle>
            <CardDescription>
              Timeline aktif yang muncul di halaman publik.
            </CardDescription>
            <CardAction>
              <Button asChild variant="ghost" size="sm" className="gap-1">
                <Link href="/dashboard/experience">
                  Open
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentExperiences.length ? (
              data.recentExperiences.map((experience) => (
                <div
                  key={experience.id}
                  className="rounded-xl border border-border bg-background/50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs text-cyan-300">
                        {experience.year_label}
                      </p>
                      <h3 className="mt-1 font-medium">{experience.title}</h3>
                    </div>
                    <p className="shrink-0 font-mono text-xs text-muted-foreground">
                      {formatDate(experience.updated_at)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState label="Belum ada experience. Isi journey agar portfolio terasa lebih kredibel." />
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm shadow-slate-950/20 transition hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-cyan-400/5"
            >
              <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-background text-cyan-300">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 font-semibold group-hover:text-cyan-300">
                {action.title}
              </h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {action.description}
              </p>
            </Link>
          );
        })}
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm shadow-slate-950/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-background text-cyan-300">
              <Database className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Data source</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Dashboard membaca data langsung dari Supabase dan landing page
                menggunakan data yang sama.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/dashboard/site-settings">
              <Settings className="size-4" />
              Tune Portfolio
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
