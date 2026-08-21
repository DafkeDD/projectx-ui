"use client";
import * as React from "react";
import { variants } from "../lib/variants";

const badge = variants({
  base: "pxui-badge",
  variants: {
    tone: {
      neutral: "pxui-badge-neutral",
      accent: "pxui-badge-accent",
      green: "pxui-badge-green",
      amber: "pxui-badge-amber",
      red: "pxui-badge-red",
      blue: "pxui-badge-blue",
      violet: "pxui-badge-violet",
    },
    size: { sm: "pxui-badge-sm", md: "" },
  },
  defaultVariants: { tone: "neutral", size: "md" },
});

export type BadgeTone = "neutral" | "accent" | "green" | "amber" | "red" | "blue" | "violet";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: "sm" | "md";
  /** Statusbolletje links van het label. */
  dot?: boolean;
  icon?: React.ReactNode;
}

/** Badge — compact label voor status, categorie of telling. */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone, size, dot, icon, className, children, ...rest },
  ref
) {
  return (
    <span ref={ref} className={badge({ tone, size, className })} {...rest}>
      {dot && <span className="pxui-badge-dot" aria-hidden="true" />}
      {icon}
      {children}
    </span>
  );
});
