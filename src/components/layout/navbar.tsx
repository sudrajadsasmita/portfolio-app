"use client";

import { Download, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button-custom";
import { cn } from "@/lib/utils";
import type { LandingProfile, NavItem } from "@/types";

type NavbarProps = {
  navItems: NavItem[];
  profile: LandingProfile;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase();
}

export function Navbar({ navItems, profile }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const initials = getInitials(profile.name) || "SD";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#020617]/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#home"
          className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <span className="flex size-9 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 font-mono text-sm font-bold text-cyan-300">
            {initials}
          </span>
          <span className="text-sm font-semibold text-slate-100 sm:text-base">
            {profile.name}
          </span>
        </a>
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="hidden lg:block">
          <Button href={profile.cvUrl} variant="secondary" download>
            <Download aria-hidden="true" className="size-4" />
            Download CV
          </Button>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex size-10 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
        </button>
      </nav>
      <div
        className={cn(
          "border-t border-slate-800 bg-[#020617]/95 px-4 py-4 lg:hidden",
          !open && "hidden",
        )}
      >
        <div className="mx-auto grid max-w-7xl gap-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-sm font-medium text-slate-300 hover:bg-slate-900"
            >
              {item.label}
            </a>
          ))}
          <Button
            href={profile.cvUrl}
            variant="secondary"
            download
            className="mt-2"
          >
            <Download aria-hidden="true" className="size-4" />
            Download CV
          </Button>
        </div>
      </div>
    </header>
  );
}
