"use client";
import * as React from "react";
import { cn } from "../lib/cn";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Waarde tussen 0 en `max`. Laat weg voor een onbepaalde balk. */
  value?: number;
  max?: number;
  tone?: "accent" | "green" | "amber" | "red" | "blue";
  size?: "sm" | "md" | "lg";
  /** Label boven de balk. */
  label?: React.ReactNode;
  /** Toont het percentage rechtsboven. */
  showValue?: boolean;
}

/** Progress — voortgangsbalk, bepaald of onbepaald. */
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, max = 100, tone = "accent", size = "md", label, showValue, className, ...rest },
  ref
) {
  const indeterminate = value === undefined || value === null;
  const percent = indeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div ref={ref} className={cn("pxui-progress-wrap", className)} {...rest}>
      {(label || showValue) && (
        <div className="pxui-progress-head">
          {label && <span className="pxui-progress-label">{label}</span>}
          {showValue && !indeterminate && (
            <span className="pxui-progress-value">{Math.round(percent)}%</span>
          )}
        </div>
      )}
      <div
        className={cn("pxui-progress", `pxui-progress-${size}`, `pxui-progress-${tone}`)}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : value}
      >
        <div
          className={cn("pxui-progress-bar", indeterminate && "pxui-progress-bar-indeterminate")}
          style={indeterminate ? undefined : { width: `${percent}%` }}
        />
      </div>
    </div>
  );
});

export interface ProgressCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  size?: number;
  thickness?: number;
  tone?: "accent" | "green" | "amber" | "red" | "blue";
  /** Toont het percentage in het midden. */
  showValue?: boolean;
}

/** ProgressCircle — ronde voortgangsindicator. */
export const ProgressCircle = React.forwardRef<HTMLDivElement, ProgressCircleProps>(
  function ProgressCircle(
    { value = 0, max = 100, size = 56, thickness = 5, tone = "accent", showValue, className, ...rest },
    ref
  ) {
    const percent = Math.min(100, Math.max(0, (value / max) * 100));
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;

    return (
      <div
        ref={ref}
        className={cn("pxui-progress-circle", `pxui-progress-${tone}`, className)}
        style={{ width: size, height: size }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        {...rest}
      >
        <svg width={size} height={size}>
          <circle
            className="pxui-progress-circle-track"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={thickness}
            fill="none"
          />
          <circle
            className="pxui-progress-circle-bar"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={thickness}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (percent / 100) * circumference}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        {showValue && <span className="pxui-progress-circle-value">{Math.round(percent)}%</span>}
      </div>
    );
  }
);
