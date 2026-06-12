"use client";

import { ArrowRight, Download, Mail, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button-custom";
import type { HeroSnippet, LandingProfile } from "@/types";

type HeroSectionProps = {
  profile: LandingProfile;
  snippet: HeroSnippet;
};

export function HeroSection({ profile, snippet }: HeroSectionProps) {
  const reduceMotion = useReducedMotion();
  const codeLines = snippet.code.split("\n");

  return (
    <section id="home" className="relative overflow-hidden bg-[#020617]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.2),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.16),transparent_30%)]" />
      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-6 px-3 py-8 min-[430px]:gap-8 min-[430px]:px-4 min-[430px]:py-12 sm:gap-12 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[0.7rem] font-medium text-emerald-300 min-[430px]:text-xs sm:px-4 sm:py-2 sm:text-sm">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span className="truncate">{profile.availability}</span>
          </div>
          <h1 className="mt-4 max-w-4xl text-[1.75rem] font-semibold leading-[1.12] text-slate-100 min-[430px]:mt-5 min-[430px]:text-4xl sm:mt-7 sm:text-5xl sm:leading-tight lg:text-6xl">
            {profile.headline}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 min-[430px]:mt-4 min-[430px]:leading-7 sm:mt-6 sm:text-lg sm:leading-8">
            {profile.description}
          </p>
          <div className="mt-5 grid gap-2 min-[430px]:grid-cols-2 min-[430px]:gap-3 sm:mt-8 sm:flex sm:flex-row">
            <Button
              href="#projects"
              className="min-[430px]:col-span-2 sm:col-span-1"
            >
              View Projects
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
            <Button href="#contact" variant="secondary">
              <Mail aria-hidden="true" className="size-4" />
              Contact Me
            </Button>
            <Button href={profile.cvUrl} variant="ghost" download>
              <Download aria-hidden="true" className="size-4" />
              Download CV
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="min-w-0 rounded-2xl border border-slate-800 bg-[#111827]/85 p-2.5 shadow-2xl shadow-blue-950/20 backdrop-blur min-[430px]:p-3 sm:p-4"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 sm:pb-4">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-rose-400" />
              <span className="size-3 rounded-full bg-amber-400" />
              <span className="size-3 rounded-full bg-emerald-400" />
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[0.7rem] text-slate-500 min-[430px]:gap-2 min-[430px]:text-xs">
              <Sparkles
                aria-hidden="true"
                className="size-3.5 text-cyan-300 min-[430px]:size-4"
              />
              {snippet.filename}
            </div>
          </div>
          <pre className="overflow-x-auto py-3 font-mono text-[0.68rem] leading-5 text-slate-300 min-[430px]:py-4 min-[430px]:text-xs min-[430px]:leading-6 sm:py-6 sm:text-sm sm:leading-7">
            <code>
              {codeLines.map((line, index) => (
                <span key={`${line}-${index}`} className="block">
                  <span className="mr-1.5 select-none text-slate-600 min-[430px]:mr-2 sm:mr-4">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {line}
                </span>
              ))}
              <motion.span
                aria-hidden="true"
                animate={reduceMotion ? undefined : { opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="ml-6 inline-block h-3.5 w-1.5 bg-cyan-300 align-middle min-[430px]:ml-8 min-[430px]:h-4 min-[430px]:w-2 sm:ml-10 sm:h-5"
              />
            </code>
          </pre>
          <div className="grid grid-cols-3 gap-1.5 border-t border-slate-800 pt-2.5 min-[430px]:gap-2 min-[430px]:pt-3 sm:gap-3 sm:pt-4">
            {["Next.js UI", "API Systems", "Self-hosted"].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-slate-800 bg-slate-950/70 px-1.5 py-1.5 text-center font-mono text-[0.58rem] leading-3 text-slate-300 min-[430px]:rounded-xl min-[430px]:px-2 min-[430px]:py-2 min-[430px]:text-[0.65rem] min-[430px]:leading-4 sm:rounded-2xl sm:p-3 sm:text-xs"
              >
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
