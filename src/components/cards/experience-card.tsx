"use client";

import { CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Experience } from "@/types";

type ExperienceCardProps = {
  item: Experience;
};

export function ExperienceCard({ item }: ExperienceCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, x: -18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.35 }}
      className="relative pl-8"
    >
      <div className="absolute left-0 top-2 size-4 rounded-full border-4 border-[#020617] bg-cyan-300 shadow-[0_0_0_1px_rgba(56,189,248,0.45)]" />
      <div className="rounded-2xl border border-slate-800 bg-[#111827]/85 p-6 shadow-2xl shadow-slate-950/30">
        <p className="font-mono text-sm font-semibold text-cyan-300">{item.year}</p>
        <h3 className="mt-2 text-xl font-semibold text-slate-100">{item.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {item.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 font-mono text-xs text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>
        <ul className="mt-5 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
          {item.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 text-emerald-400" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}
