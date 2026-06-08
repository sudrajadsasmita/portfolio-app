"use client";

import { SkillCard } from "@/components/cards/skill-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { aboutItems } from "@/data/skills";

export function AboutSection() {
  return (
    <section id="about" className="bg-[#0F172A] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="About"
          title="A practical fullstack profile with backend depth"
          description="I care about the whole path from interface quality to reliable APIs, relational data, deployment, and maintainable production systems."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {aboutItems.map((item) => (
            <SkillCard key={item.title} item={item} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
