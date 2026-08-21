"use client";
import * as React from "react";
import { cn } from "../lib/cn";

export interface DataPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Eenheid achter de waarde, bv. "mmHg" of "µm". */
  unit?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: "neutral" | "accent" | "green" | "amber" | "red" | "blue" | "violet";
  size?: "sm" | "md";
}

/** DataPill — compacte meetwaarde: label, waarde en eenheid op één regel. */
export const DataPill = React.forwardRef<HTMLSpanElement, DataPillProps>(function DataPill(
  { label, value, unit, icon, tone = "neutral", size = "md", className, ...rest },
  ref
) {
  return (
    <span
      ref={ref}
      className={cn("pxui-datapill", `pxui-datapill-${tone}`, `pxui-datapill-${size}`, className)}
      {...rest}
    >
      {icon && <span className="pxui-datapill-icon">{icon}</span>}
      <span className="pxui-datapill-label">{label}</span>
      <b className="pxui-datapill-value">{value}</b>
      {unit && <em className="pxui-datapill-unit">{unit}</em>}
    </span>
  );
});
