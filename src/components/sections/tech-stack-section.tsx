"use client";

import { SkillCard } from "@/components/cards/skill-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { skillCategories } from "@/data/skills";

export function TechStackSection() {
  return (
    <section id="stack" className="bg-[#020617] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Tech stack"
          title="Tools selected for real production work"
          description="A focused stack for web applications, backend APIs, data-heavy features, AI integrations, and self-hosted server deployments."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category) => (
            <SkillCard key={category.title} item={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
