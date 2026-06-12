"use client";

import { BriefcaseBusiness, Code2, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button-custom";
import { SectionHeading } from "@/components/ui/section-heading";
import type { LandingProfile, LandingSiteSettings, Social } from "@/types";

const icons = {
  Github: Code2,
  Linkedin: BriefcaseBusiness,
  Mail,
  MessageCircle,
};

type ContactSectionProps = {
  profile: LandingProfile;
  siteSettings: LandingSiteSettings;
  socials: Social[];
};

export function ContactSection({
  profile,
  siteSettings,
  socials,
}: ContactSectionProps) {
  return (
    <section id="contact" className="bg-[#0F172A]  px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Contact"
          title={siteSettings.contactCtaTitle}
          description={siteSettings.contactCtaDescription}
        />
        <div className="mt-12 rounded-2xl border border-slate-800 bg-[#111827]/90 p-6 shadow-2xl shadow-slate-950/30 md:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_0.8fr] md:items-center">
            <div>
              <p className="text-lg leading-8 text-slate-300">
                I am open to fullstack developer opportunities, backend-heavy
                product work, and practical AI integrations for modern web
                applications.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button href={`mailto:${profile.email}`}>
                  <Mail aria-hidden="true" className="size-4" />
                  Email Me
                </Button>
                <Button href={profile.cvUrl} variant="secondary" download>
                  Download CV
                </Button>
              </div>
            </div>
            <div className="grid gap-3">
              {socials.map((social) => {
                const Icon = icons[social.icon] || Mail;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
                  >
                    <span className="inline-flex items-center gap-3">
                      <Icon aria-hidden="true" className="size-5" />
                      {social.label}
                    </span>
                    <span className="font-mono text-xs text-slate-500">
                      open
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
