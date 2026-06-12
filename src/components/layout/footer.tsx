import type { LandingProfile, Social } from "@/types";

type FooterProps = {
  profile: LandingProfile;
  socials: Social[];
};

export function Footer({ profile, socials }: FooterProps) {
  return (
    <footer className="border-t border-slate-800 bg-[#020617]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>© {new Date().getFullYear()} {profile.name}. Built for self-hosted deployment.</p>
        <div className="flex flex-wrap gap-4">
          {socials.map((social) => (
            <a key={social.label} href={social.href} className="transition hover:text-cyan-300">
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
