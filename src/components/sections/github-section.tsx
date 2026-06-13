"use client";

import { Code2, GitFork, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Repository } from "@/types";

const contributionCells = Array.from({ length: 84 }, (_, index) => {
  const levels = [
    "bg-slate-800",
    "bg-cyan-950",
    "bg-cyan-800",
    "bg-cyan-500",
    "bg-emerald-500",
  ];

  return levels[(index * 7 + index) % levels.length];
});

type GithubSectionProps = {
  repositories: Repository[];
};

export function GithubSection({ repositories }: GithubSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="github" className="bg-[#0F172A] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="GitHub showcase"
          title="Static repository showcase without API dependency"
          description="Pinned repositories, contribution-style activity, and terminal-inspired details keep the page reliable for static hosting."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-2xl shadow-slate-950/30"
          >
            <div className="flex items-center gap-3">
              <Code2 aria-hidden="true" className="size-6 text-cyan-300" />
              <div>
                <h3 className="text-lg font-semibold text-slate-100">
                  Pinned repositories
                </h3>
                <p className="font-mono text-xs text-slate-500">
                  git status --portfolio
                </p>
              </div>
            </div>
            <div
              className="mt-6 grid grid-cols-12 gap-1"
              aria-label="Contribution activity mockup"
            >
              {contributionCells.map((cell, index) => (
                <span key={index} className={`h-3 rounded-sm ${cell}`} />
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 font-mono text-sm text-slate-300">
              <p>
                <span className="text-cyan-300">$</span> pnpm build
              </p>
              <p className="mt-2 text-emerald-400">
                ✓ production bundle ready
              </p>
              <p className="mt-1 text-slate-500">
                reverse proxy: nginx | caddy
              </p>
            </div>
          </motion.div>
          {repositories.length ? (
            <div className="grid gap-4">
              {repositories.map((repo) => (
                <motion.a
                  key={repo.name}
                  href={repo.href}
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  whileHover={reduceMotion ? undefined : { y: -3 }}
                  viewport={{ once: true, margin: "-80px" }}
                  className="rounded-2xl border border-slate-800 bg-[#111827] p-5 transition hover:border-cyan-400/40"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-mono text-base font-semibold text-cyan-300">
                        {repo.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {repo.description}
                      </p>
                    </div>
                    <div className="flex gap-4 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Star aria-hidden="true" className="size-4" />
                        {repo.stars}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GitFork aria-hidden="true" className="size-4" />
                        {repo.forks}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {repo.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 font-mono text-xs text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.a>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 font-mono text-sm text-slate-400">
              No repositories configured yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
