"use client";
import * as React from "react";
import { cn } from "../lib/cn";

export interface EntityDetail {
  icon?: React.ReactNode;
  label: React.ReactNode;
  /** Maakt van het detail een knop. */
  onClick?: () => void;
  href?: string;
}

export interface EntityHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Avatar, logo of icoontegel links. */
  media?: React.ReactNode;
  title: React.ReactNode;
  /** Lichtere toevoeging achter de titel, bv. "V, 68j". */
  titleSuffix?: React.ReactNode;
  /** Regel onder de titel, bv. geboortedatum en nummers. */
  meta?: React.ReactNode;
  /** Badges of labels. */
  tags?: React.ReactNode;
  /** Contactgegevens of snelle links, rechts van de tags. */
  details?: EntityDetail[];
  /** Knoppen rechts. */
  actions?: React.ReactNode;
  /** Lijn onder de kop. */
  divider?: boolean;
  size?: "sm" | "md";
}

/**
 * EntityHeader — kop van een dossier, klant of patiënt: media, naam, kerngegevens,
 * labels, contactgegevens en acties in één blok dat netjes afbreekt op smalle schermen.
 */
export const EntityHeader = React.forwardRef<HTMLDivElement, EntityHeaderProps>(
  function EntityHeader(
    { media, title, titleSuffix, meta, tags, details, actions, divider = true, size = "md", className, children, ...rest },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          "pxui-entity",
          `pxui-entity-${size}`,
          divider && "pxui-entity-divider",
          className
        )}
        {...rest}
      >
        {media && <div className="pxui-entity-media">{media}</div>}

        <div className="pxui-entity-identity">
          <h1 className="pxui-entity-title">
            {title}
            {titleSuffix && <span className="pxui-entity-suffix">{titleSuffix}</span>}
          </h1>
          {meta && <div className="pxui-entity-meta">{meta}</div>}
        </div>

        {tags && <div className="pxui-entity-tags">{tags}</div>}

        {details && details.length > 0 && (
          <div className="pxui-entity-details">
            {details.map((detail, index) => {
              const content = (
                <>
                  {detail.icon && <span className="pxui-entity-detail-icon">{detail.icon}</span>}
                  {detail.label}
                </>
              );
              if (detail.href) {
                return (
                  <a key={index} className="pxui-entity-detail" href={detail.href}>
                    {content}
                  </a>
                );
              }
              if (detail.onClick) {
                return (
                  <button key={index} type="button" className="pxui-entity-detail" onClick={detail.onClick}>
                    {content}
                  </button>
                );
              }
              return (
                <span key={index} className="pxui-entity-detail pxui-entity-detail-static">
                  {content}
                </span>
              );
            })}
          </div>
        )}

        {actions && <div className="pxui-entity-actions">{actions}</div>}
        {children}
      </div>
    );
  }
);
