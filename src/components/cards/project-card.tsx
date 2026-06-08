"use client";

import { useState } from "react";
import Image, { type ImageLoaderProps } from "next/image";
import { ArrowUpRight, BookOpen, Code2, ExternalLink } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/types";
import { Button } from "@/components/ui/button-custom";

type ProjectCardProps = {
  project: Project;
  eager?: boolean;
};

function passthroughImageLoader({ src }: ImageLoaderProps) {
  return src;
}

export function ProjectCard({ project, eager = false }: ProjectCardProps) {
  const reduceMotion = useReducedMotion();
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = imageFailed ? undefined : project.imageUrl;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -5 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] shadow-2xl shadow-slate-950/30"
    >
      <div className="border-b border-slate-800 bg-slate-950/80 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-rose-400" />
            <span className="size-3 rounded-full bg-amber-400" />
            <span className="size-3 rounded-full bg-emerald-400" />
          </div>
          <span className="font-mono text-xs text-slate-500">
            {project.mockup}
          </span>
        </div>
        <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-2xl border border-slate-800 bg-[#020617]">
          {imageUrl ? (
            <Image
              loader={passthroughImageLoader}
              src={imageUrl}
              alt={project.imageAlt || `${project.title} project preview`}
              fill
              unoptimized
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              loading={eager ? "eager" : "lazy"}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="h-full p-4">
              <div className="grid gap-3">
                <div className="h-3 w-2/3 rounded-full bg-cyan-400/70" />
                <div className="h-3 w-5/6 rounded-full bg-slate-700" />
                <div className="h-3 w-1/2 rounded-full bg-purple-400/60" />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="h-16 rounded-xl border border-slate-800 bg-slate-900" />
                <div className="h-16 rounded-xl border border-slate-800 bg-slate-900" />
                <div className="h-16 rounded-xl border border-slate-800 bg-slate-900" />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-100">
          {project.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          {project.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 font-mono text-xs text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>
        <ul className="mt-5 space-y-2 text-sm text-slate-300">
          {project.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2">
              <ArrowUpRight
                aria-hidden="true"
                className="mt-0.5 size-4 text-cyan-300"
              />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 grid gap-2 sm:grid-cols-3">
          <Button
            href={project.links.demo}
            variant="secondary"
            className="h-10 px-3"
          >
            <ExternalLink aria-hidden="true" className="size-4" />
            Demo
          </Button>
          <Button
            href={project.links.source}
            variant="ghost"
            className="h-10 px-3"
          >
            <Code2 aria-hidden="true" className="size-4" />
            Code
          </Button>
          <Button
            href={project.links.caseStudy}
            variant="ghost"
            className="h-10 px-3"
          >
            <BookOpen aria-hidden="true" className="size-4" />
            Study
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
