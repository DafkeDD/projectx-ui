"use client";
import * as React from "react";
import { variants } from "../lib/variants";
import { Slot } from "../lib/slot";
import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

const button = variants({
  base: "pxui-btn",
  variants: {
    variant: {
      primary: "pxui-btn-primary",
      secondary: "pxui-btn-secondary",
      ghost: "pxui-btn-ghost",
      danger: "pxui-btn-danger",
      "danger-soft": "pxui-btn-danger-soft",
      link: "pxui-btn-link",
    },
    size: {
      sm: "pxui-btn-sm",
      md: "",
      lg: "pxui-btn-lg",
    },
    block: { true: "pxui-btn-block", false: "" },
    iconOnly: { true: "pxui-btn-icon", false: "" },
  },
  defaultVariants: { variant: "primary", size: "md", block: false, iconOnly: false },
});

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "danger-soft" | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Volle breedte. */
  block?: boolean;
  /** Vierkante knop zonder label (icoonknop). Wordt automatisch gezet zonder children. */
  iconOnly?: boolean;
  /** Icoon links van het label. */
  icon?: React.ReactNode;
  /** Icoon rechts van het label. */
  iconRight?: React.ReactNode;
  /** Toont een spinner en blokkeert interactie. */
  loading?: boolean;
  /** Rendert het child-element in plaats van een <button> (bv. een <a> of <Link>). */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant,
    size,
    block,
    iconOnly,
    icon,
    iconRight,
    loading = false,
    asChild = false,
    className,
    children,
    disabled,
    type,
    ...rest
  },
  ref
) {
  const Comp = (asChild ? Slot : "button") as React.ElementType;
  const isIconOnly = iconOnly ?? (!children && (Boolean(icon) || Boolean(iconRight)));

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : (type ?? "button")}
      disabled={asChild ? undefined : disabled || loading}
      data-loading={loading ? "" : undefined}
      aria-busy={loading || undefined}
      className={button({ variant, size, block, iconOnly: isIconOnly, className })}
      {...rest}
    >
      {loading ? <Spinner size={size === "lg" ? 18 : size === "sm" ? 14 : 16} /> : icon}
      {children}
      {!loading && iconRight}
    </Comp>
  );
});

/** Groepeert knoppen tot één samengesteld blok. */
export const ButtonGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function ButtonGroup({ className, ...rest }, ref) {
    return <div ref={ref} role="group" className={cn("pxui-btn-group", className)} {...rest} />;
  }
);

