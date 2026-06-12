import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { TechStackSection } from "@/components/sections/tech-stack-section";
import { getLandingContent } from "@/lib/portfolio";

export async function generateMetadata(): Promise<Metadata> {
  const { profile, siteSettings } = await getLandingContent();

  return {
    title: siteSettings.title,
    description: siteSettings.description,
    icons: {
      icon: siteSettings.faviconUrl || "/favicon.ico",
    },
    openGraph: {
      title: siteSettings.title,
      description: siteSettings.description,
      url: profile.siteUrl,
      siteName: siteSettings.siteName,
      type: "website",
      images: siteSettings.ogImageUrl ? [siteSettings.ogImageUrl] : undefined,
    },
    twitter: {
      card:
        siteSettings.twitterCard === "summary"
          ? "summary"
          : "summary_large_image",
      title: siteSettings.title,
      description: siteSettings.description,
      images: siteSettings.ogImageUrl ? [siteSettings.ogImageUrl] : undefined,
    },
  };
}

export default async function Home() {
  const {
    profile,
    siteSettings,
    heroSnippet,
    navItems,
    aboutItems,
    skillCategories,
    projects,
    experiences,
    socials,
  } = await getLandingContent();

  return (
    <div className="dark min-h-svh bg-[#020617] text-slate-100">
      <Navbar navItems={navItems} profile={profile} />
      <main>
        <HeroSection profile={profile} snippet={heroSnippet} />
        <AboutSection items={aboutItems} />
        <TechStackSection categories={skillCategories} />
        <ProjectsSection projects={projects} />
        <ExperienceSection experiences={experiences} />
        {/* <GithubSection /> */}
        <ContactSection
          profile={profile}
          siteSettings={siteSettings}
          socials={socials}
        />
      </main>
      <Footer profile={profile} socials={socials} />
    </div>
  );
}
