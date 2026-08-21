"use client";
import * as React from "react";
import { cn } from "../lib/cn";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  /** Optioneel label in het midden van de lijn. */
  label?: React.ReactNode;
}

/** Separator — dunne scheidingslijn, optioneel met label. */
export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = "horizontal", label, className, ...rest },
  ref
) {
  if (label) {
    return (
      <div ref={ref} className={cn("pxui-separator-labelled", className)} {...rest}>
        <span className="pxui-separator-line" />
        <span className="pxui-separator-label">{label}</span>
        <span className="pxui-separator-line" />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={cn("pxui-separator", `pxui-separator-${orientation}`, className)}
      {...rest}
    />
  );
});
