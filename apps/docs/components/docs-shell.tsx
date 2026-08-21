"use client";
import * as React from "react";
import Link from "next/link";
import { Badge, Button, Icon, ThemeToggle } from "@projectx/ui";
import { DocsNav } from "./docs-nav";

export function DocsShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="docs-shell">
      <DocsNav open={open} />
      <div className="docs-main">
        <header className="docs-topbar">
          <Button
            variant="ghost"
            size="sm"
            className="docs-nav-toggle"
            aria-label="Navigatie openen"
            icon={<Icon name="menu" />}
            onClick={() => setOpen((value) => !value)}
          />
          <Link href="/docs" style={{ fontWeight: 650, fontSize: 14.5, textDecoration: "none" }}>
            Documentatie
          </Link>
          <Badge tone="accent" size="sm">v0.1.0</Badge>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 12.5, color: "var(--text-3)" }} className="hide-sm">
            Eigen componenten — geen externe UI-library
          </span>
          <ThemeToggle size="sm" />
        </header>
        {children}
      </div>
    </div>
  );
}
