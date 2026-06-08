import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-2xl border text-sm font-semibold transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617] active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-cyan-400/40 bg-cyan-400 px-5 py-3 text-slate-950 shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5 hover:bg-cyan-300",
        outline:
          "border-slate-700 bg-transparent px-5 py-3 text-slate-100 hover:-translate-y-0.5 hover:border-cyan-400/50 hover:bg-slate-900",
        secondary:
          "border-slate-700 bg-slate-900 px-5 py-3 text-slate-100 hover:-translate-y-0.5 hover:border-cyan-400/50 hover:bg-slate-800",
        ghost:
          "border-slate-800 bg-transparent px-5 py-3 text-slate-300 hover:-translate-y-0.5 hover:border-slate-600 hover:bg-slate-900 hover:text-slate-100",
        destructive:
          "border-red-400/30 bg-red-500/10 px-5 py-3 text-red-200 hover:bg-red-500/20 focus-visible:ring-red-400",
        link: "border-transparent bg-transparent p-0 text-cyan-300 underline-offset-4 hover:text-cyan-200 hover:underline",
      },
      size: {
        default: "min-h-11 px-5 py-3",
        xs: "min-h-7 rounded-xl px-2.5 py-1 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "min-h-9 rounded-xl px-3 py-2 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "min-h-12 px-6 py-3.5 text-base",
        icon: "size-10 p-0",
        "icon-xs": "size-7 rounded-xl p-0 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-xl p-0",
        "icon-lg": "size-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonOwnProps = VariantProps<typeof buttonVariants> & {
  asChild?: boolean;
};

type ButtonAsButtonProps = React.ComponentProps<"button"> &
  ButtonOwnProps & {
    href?: undefined;
  };

type ButtonAsAnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  ButtonOwnProps & {
    href: string;
  };

type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, className }));

  if (asChild) {
    return (
      <Slot.Root
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={classes}
        {...props}
      />
    );
  }

  if (typeof (props as { href?: unknown }).href === "string") {
    const anchorProps = props as ButtonAsAnchorProps;

    return (
      <a
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={classes}
        {...anchorProps}
      />
    );
  }

  const buttonProps = props as ButtonAsButtonProps;

  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={classes}
      {...buttonProps}
    />
  );
}

export { Button, buttonVariants };
