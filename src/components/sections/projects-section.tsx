import { ProjectCard } from "@/components/cards/project-card";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Project } from "@/types";

type ProjectsSectionProps = {
  projects: Project[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="bg-[#0F172A] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Featured projects"
          title="Portfolio pieces that show the complete build"
          description="Each project card is structured to support a live demo, source code, and case study link while keeping the page static and fast."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              eager={index < 2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
