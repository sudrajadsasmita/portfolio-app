import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <div className={cn("mx-auto max-w-3xl text-center", className)}>
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-slate-100 md:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-400">{description}</p>
    </div>
  );
}
