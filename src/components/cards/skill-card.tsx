"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { AboutItem, SkillCategory } from "@/types";
import { cn } from "@/lib/utils";

type SkillCardProps = {
  item: AboutItem | SkillCategory;
  compact?: boolean;
};

export function SkillCard({ item, compact = false }: SkillCardProps) {
  const Icon = item.icon;
  const reduceMotion = useReducedMotion();
  const hasItems = "items" in item;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.35 }}
      className={cn(
        "group rounded-2xl border border-slate-800 bg-[#111827]/80 p-6 shadow-2xl shadow-slate-950/30 transition-colors hover:border-cyan-400/35",
        compact && "p-5",
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-cyan-300 transition group-hover:border-cyan-400/50">
        <Icon aria-hidden="true" className="size-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-100">{item.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
      {hasItems ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {item.items.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 font-mono text-xs text-slate-300"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : null}
    </motion.article>
  );
}
