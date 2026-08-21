"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import { useFieldProps } from "./field";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  /** Groeit automatisch mee met de inhoud. */
  autoResize?: boolean;
}

/** Textarea — meerregelig tekstveld, optioneel meegroeiend. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, autoResize, className, onInput, rows = 4, ...props },
  ref
) {
  const inner = React.useRef<HTMLTextAreaElement | null>(null);
  const merged = useFieldProps(props as Parameters<typeof useFieldProps>[0]) as TextareaProps;
  const { invalid: isInvalid, ...rest } = { ...merged, invalid: invalid ?? merged.invalid };

  const resize = React.useCallback(() => {
    const node = inner.current;
    if (!node || !autoResize) return;
    node.style.height = "auto";
    node.style.height = `${node.scrollHeight}px`;
  }, [autoResize]);

  React.useEffect(resize, [resize, rest.value]);

  return (
    <textarea
      ref={(node) => {
        inner.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      }}
      rows={rows}
      className={cn("pxui-textarea", isInvalid && "pxui-input-invalid", className)}
      aria-invalid={isInvalid || undefined}
      onInput={(event) => {
        resize();
        onInput?.(event);
      }}
      {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
    />
  );
});
