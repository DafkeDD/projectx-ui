"use client";
import * as React from "react";
import { cn } from "../lib/cn";

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Knoppen onderaan. */
  action?: React.ReactNode;
  size?: "sm" | "md";
}

/** EmptyState — lege lijst, geen resultaten, nog niets ingesteld. */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { icon, title, description, action, size = "md", className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cn("pxui-empty", `pxui-empty-${size}`, className)} {...rest}>
      {icon && <div className="pxui-empty-icon">{icon}</div>}
      <div className="pxui-empty-title">{title}</div>
      {description && <p className="pxui-empty-description">{description}</p>}
      {children}
      {action && <div className="pxui-empty-action">{action}</div>}
    </div>
  );
});
