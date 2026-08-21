"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import { Portal } from "../lib/portal";
import { composeRefs } from "../lib/slot";
import { useAnchorPosition, type Align, type Side } from "../lib/anchor";

export interface TooltipProps {
  /** Inhoud van de tooltip. */
  content: React.ReactNode;
  children: React.ReactElement;
  side?: Side;
  align?: Align;
  /** Vertraging in ms voordat de tooltip verschijnt. */
  delay?: number;
  offset?: number;
  disabled?: boolean;
}

/**
 * Tooltip — verschijnt bij hover én bij toetsenbordfocus.
 * Wikkel één element in: <Tooltip content="..."><Button/></Tooltip>
 */
export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  delay = 220,
  offset = 8,
  disabled,
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLElement | null>(null);
  const tipRef = React.useRef<HTMLDivElement | null>(null);
  const timer = React.useRef<number | null>(null);
  const id = React.useId();
  const position = useAnchorPosition(anchorRef, tipRef, open, { side, align, offset });

  const show = () => {
    if (disabled) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setOpen(false);
  };

  React.useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const child = children as React.ReactElement<Record<string, unknown>>;
  const trigger = React.cloneElement(child, {
    ref: composeRefs(anchorRef, (child as unknown as { ref?: React.Ref<HTMLElement> }).ref),
    "aria-describedby": open ? `pxui-tooltip-${id}` : undefined,
    onMouseEnter: (event: React.MouseEvent) => {
      (child.props.onMouseEnter as ((e: React.MouseEvent) => void) | undefined)?.(event);
      show();
    },
    onMouseLeave: (event: React.MouseEvent) => {
      (child.props.onMouseLeave as ((e: React.MouseEvent) => void) | undefined)?.(event);
      hide();
    },
    onFocus: (event: React.FocusEvent) => {
      (child.props.onFocus as ((e: React.FocusEvent) => void) | undefined)?.(event);
      setOpen(true);
    },
    onBlur: (event: React.FocusEvent) => {
      (child.props.onBlur as ((e: React.FocusEvent) => void) | undefined)?.(event);
      hide();
    },
  } as Record<string, unknown>);

  return (
    <>
      {trigger}
      {open && (
        <Portal>
          <div
            ref={tipRef}
            id={`pxui-tooltip-${id}`}
            role="tooltip"
            data-side={position.side}
            className={cn("pxui-tooltip")}
            style={{ ...position.style, opacity: position.ready ? 1 : 0 }}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
}
