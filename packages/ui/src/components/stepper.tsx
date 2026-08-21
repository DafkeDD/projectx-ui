"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import { Icon } from "../icons/icon";

export interface StepperStep {
  label: React.ReactNode;
  description?: React.ReactNode;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepperStep[];
  /** Index van de actieve stap (0-based). */
  current: number;
  orientation?: "horizontal" | "vertical";
  /** Klikbare stappen (bv. om terug te gaan). */
  onStepClick?: (index: number) => void;
}

/** Stepper — voortgang door een meerstapsflow. */
export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(function Stepper(
  { steps, current, orientation = "horizontal", onStepClick, className, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn("pxui-stepper", `pxui-stepper-${orientation}`, className)}
      role="list"
      aria-label="Voortgang"
      {...rest}
    >
      {steps.map((step, index) => {
        const state = index < current ? "done" : index === current ? "active" : "todo";
        const clickable = Boolean(onStepClick) && index <= current;

        return (
          <div key={index} className={cn("pxui-step", `pxui-step-${state}`)} role="listitem">
            <button
              type="button"
              className="pxui-step-main"
              disabled={!clickable}
              aria-current={state === "active" ? "step" : undefined}
              onClick={() => clickable && onStepClick?.(index)}
            >
              <span className="pxui-step-marker">
                {state === "done" ? <Icon name="check" size={14} strokeWidth={3} /> : index + 1}
              </span>
              <span className="pxui-step-text">
                <span className="pxui-step-label">{step.label}</span>
                {step.description && <span className="pxui-step-description">{step.description}</span>}
              </span>
            </button>
            {index < steps.length - 1 && <span className="pxui-step-line" aria-hidden="true" />}
          </div>
        );
      })}
    </div>
  );
});
