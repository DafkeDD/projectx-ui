"use client";
/**
 * Slot — eigen implementatie van het `asChild`-patroon (zoals Radix Slot,
 * maar volledig zelf geschreven). Rendert het enige child-element en
 * voegt de props van de wrapper samen met die van het child.
 */
import * as React from "react";
import { cn } from "./cn";

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  ref
) {
  if (!React.isValidElement(children)) return null;
  const child = children as React.ReactElement<Record<string, unknown>>;

  return React.cloneElement(child, {
    ...mergeProps(slotProps as Record<string, unknown>, child.props),
    ref: composeRefs(ref, (child as unknown as { ref?: React.Ref<HTMLElement> }).ref),
  } as Record<string, unknown>);
});

function mergeProps(
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...slotProps, ...childProps };

  for (const key in slotProps) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    if (/^on[A-Z]/.test(key) && typeof slotValue === "function" && typeof childValue === "function") {
      merged[key] = (...args: unknown[]) => {
        (childValue as (...a: unknown[]) => void)(...args);
        (slotValue as (...a: unknown[]) => void)(...args);
      };
    } else if (key === "style") {
      merged[key] = { ...(slotValue as object), ...(childValue as object) };
    } else if (key === "className") {
      merged[key] = cn(slotValue as string, childValue as string);
    }
  }

  return merged;
}

export function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref && typeof ref === "object") (ref as React.MutableRefObject<T>).current = node;
    }
  };
}
