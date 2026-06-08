"use client";

import { ExperienceCard } from "@/components/cards/experience-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { experiences } from "@/data/experience";

export function ExperienceSection() {
  return (
    <section id="experience" className="bg-[#020617] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Experience"
          title="A journey through frontend, backend, AI, and infrastructure"
          description="This timeline is ready for formal roles, freelance work, or personal project milestones without changing the component design."
        />
        <div className="relative mt-12 space-y-8 before:absolute before:bottom-0 before:left-2 before:top-2 before:w-px before:bg-slate-800">
          {experiences.map((item) => (
            <ExperienceCard key={`${item.year}-${item.title}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
