"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import { Icon } from "../icons/icon";

export interface AuthLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * "split" zet een gekleurd paneel naast het formulier (verdwijnt op mobiel),
   * "centered" zet de kaart midden op een zachte achtergrond.
   */
  variant?: "split" | "centered";
  /** Inhoud van het zijpaneel bij `split`. */
  aside?: React.ReactNode;
  /** Donker paneel in plaats van het accentverloop. */
  asideTone?: "accent" | "ink";
  /** Zijpaneel links of rechts. */
  asidePosition?: "left" | "right";
}

/**
 * AuthLayout — het frame rond een aanmeldscherm. Split zet een merkpaneel naast
 * het formulier, centered zet de kaart midden op het scherm met een zachte gloed.
 */
export const AuthLayout = React.forwardRef<HTMLDivElement, AuthLayoutProps>(function AuthLayout(
  { variant = "split", aside, asideTone = "accent", asidePosition = "left", className, children, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn("pxui-auth", `pxui-auth-${variant}`, `pxui-auth-aside-${asidePosition}`, className)}
      {...rest}
    >
      {variant === "split" && aside && (
        <aside className={cn("pxui-auth-aside", `pxui-auth-aside-${asideTone}`)}>
          <span className="pxui-auth-deco" aria-hidden="true" />
          <span className="pxui-auth-grid" aria-hidden="true" />
          <div className="pxui-auth-aside-inner">{aside}</div>
        </aside>
      )}

      <main className="pxui-auth-main">
        {variant === "centered" && (
          <>
            <span className="pxui-auth-glow" aria-hidden="true" />
            <span className="pxui-auth-glow pxui-auth-glow-two" aria-hidden="true" />
          </>
        )}
        {children}
      </main>
    </div>
  );
});

export interface AuthCardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Merknaam en logo bovenaan. */
  brand?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Inhoud onder de kaart, bv. "Nog geen account?". */
  footer?: React.ReactNode;
  /** Rendert een <form> in plaats van een <div>. */
  as?: "div" | "form";
}

/** AuthCard — de kaart met titel, formulier en voettekst. */
export const AuthCard = React.forwardRef<HTMLElement, AuthCardProps>(function AuthCard(
  { brand, title, description, footer, as = "form", className, children, ...rest },
  ref
) {
  const Comp = as as React.ElementType;

  return (
    <Comp ref={ref} className={cn("pxui-auth-card", className)} {...rest}>
      {brand && <div className="pxui-auth-brand">{brand}</div>}
      <h1 className="pxui-auth-title">{title}</h1>
      {description && <p className="pxui-auth-description">{description}</p>}
      <div className="pxui-auth-body">{children}</div>
      {footer && <div className="pxui-auth-footer">{footer}</div>}
    </Comp>
  );
});

export interface AuthDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/** AuthDivider — "of met e-mail"-scheiding tussen SSO en formulier. */
export const AuthDivider = React.forwardRef<HTMLDivElement, AuthDividerProps>(function AuthDivider(
  { className, children = "of", ...rest },
  ref
) {
  return (
    <div ref={ref} className={cn("pxui-auth-divider", className)} {...rest}>
      <span>{children}</span>
    </div>
  );
});

export interface SsoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Logo of icoon links. */
  icon?: React.ReactNode;
  label: React.ReactNode;
  /** Kleine regel onder het label. */
  description?: React.ReactNode;
  /** Toont een spinner en blokkeert de knop. */
  loading?: boolean;
  loadingLabel?: React.ReactNode;
  /** Merkkleur van de aanbieder, bv. de itsme®-oranje. */
  color?: string;
}

/** SsoButton — brede knop voor eID, itsme® of een andere aanbieder. */
export const SsoButton = React.forwardRef<HTMLButtonElement, SsoButtonProps>(function SsoButton(
  { icon, label, description, loading, loadingLabel = "Aanmelden…", color, className, style, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled || loading}
      data-loading={loading ? "" : undefined}
      className={cn("pxui-sso", className)}
      style={color ? ({ ["--pxui-sso-color" as string]: color, ...style } as React.CSSProperties) : style}
      {...rest}
    >
      <span className="pxui-sso-icon">
        {loading ? <Icon name="loader" size={18} className="pxui-sso-spin" /> : icon}
      </span>
      <span className="pxui-sso-text">
        <span className="pxui-sso-label">{loading ? loadingLabel : label}</span>
        {description && !loading && <span className="pxui-sso-description">{description}</span>}
      </span>
      {!loading && <Icon name="chevronRight" size={17} className="pxui-sso-arrow" />}
    </button>
  );
});
