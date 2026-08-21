"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import { Icon } from "../icons/icon";

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  icon?: React.ReactNode;
  /** Kleur van het icoonvlak. */
  tone?: "accent" | "green" | "amber" | "red" | "blue" | "violet";
  /** Verandering t.o.v. vorige periode, bv. +12.4. */
  delta?: number;
  /** Tekst achter de delta, bv. "vs. vorige maand". */
  deltaLabel?: React.ReactNode;
  /** Kleine grafiek onderaan (bv. <Sparkline/>). */
  chart?: React.ReactNode;
}

/** Stat — KPI-tegel met waarde, icoon en trend. */
export const Stat = React.forwardRef<HTMLDivElement, StatProps>(function Stat(
  { label, value, icon, tone = "accent", delta, deltaLabel, chart, className, ...rest },
  ref
) {
  const direction = delta === undefined ? null : delta >= 0 ? "up" : "down";

  return (
    <div ref={ref} className={cn("pxui-stat", className)} {...rest}>
      <div className="pxui-stat-top">
        <span className="pxui-stat-label">{label}</span>
        {icon && <span className={cn("pxui-stat-icon", `pxui-stat-icon-${tone}`)}>{icon}</span>}
      </div>
      <div className="pxui-stat-value">{value}</div>
      {direction && (
        <div className={cn("pxui-stat-delta", `pxui-stat-delta-${direction}`)}>
          <Icon name={direction === "up" ? "arrowUp" : "arrowDown"} size={13} />
          {Math.abs(delta as number)}%
          {deltaLabel && <span className="pxui-stat-delta-label">{deltaLabel}</span>}
        </div>
      )}
      {chart && <div className="pxui-stat-chart">{chart}</div>}
    </div>
  );
});

/** Raster dat KPI-tegels netjes uitlijnt. */
export const StatGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { min?: number }
>(function StatGrid({ min = 200, className, style, ...rest }, ref) {
  return (
    <div
      ref={ref}
      className={cn("pxui-stat-grid", className)}
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`, ...style }}
      {...rest}
    />
  );
});
