import Link from "next/link";
import {
  Badge, Button, Card, CardDescription, CardHeader, CardTitle, Icon, ThemeToggle,
} from "@projectx/ui";
import { COMPONENTS } from "../content/catalog";
import { CodeBlock } from "../components/code-block";

const FEATURES = [
  {
    icon: "shield" as const,
    title: "Nul UI-dependencies",
    text: "Geen shadcn, geen Radix, geen Headless UI. Elk component — inclusief focus-trap, positionering en toetsenbordnavigatie — is hier zelf geschreven.",
  },
  {
    icon: "layers" as const,
    title: "Alle kleuren uit één bron",
    text: "Elke kleur, radius en schaduw komt uit het ProjectX UI-design. Componenten gebruiken uitsluitend tokens, nooit een hardcoded hex.",
  },
  {
    icon: "code" as const,
    title: "Copy-paste, jouw code",
    text: "Zoals shadcn: `npx projectx-ui add button` kopieert de bron in je project. Je bezit de componenten en past ze aan wanneer je wil.",
  },
  {
    icon: "moon" as const,
    title: "Licht én donker",
    text: "Eén ThemeProvider, twee volledige paletten. Alles schakelt mee, tot en met grafieken en overlays.",
  },
];

export default function HomePage() {
  return (
    <>
      <header
        style={{
          position: "sticky", top: 0, zIndex: 30, height: 60,
          display: "flex", alignItems: "center", gap: 12, padding: "0 24px",
          borderBottom: "1px solid var(--border)",
          background: "color-mix(in srgb, var(--surface) 82%, transparent)",
          backdropFilter: "blur(8px)",
        }}
      >
        <span className="docs-nav-mark" style={{ width: 32, height: 32, fontSize: 15 }}>X</span>
        <strong style={{ fontSize: 15, letterSpacing: "-0.02em" }}>ProjectX UI</strong>
        <Badge tone="accent" size="sm">v0.1.0</Badge>
        <span style={{ flex: 1 }} />
        <Button variant="ghost" size="sm" asChild>
          <Link href="/docs">Documentatie</Link>
        </Button>
        <ThemeToggle size="sm" />
      </header>

      <section className="docs-hero">
        <div className="docs-hero-inner">
          <Badge tone="accent" icon={<Icon name="sparkles" size={12} />}>
            {COMPONENTS.length} componenten · volledig eigen code
          </Badge>
          <h1 style={{ marginTop: 20 }}>
            Je eigen component library,
            <br />
            gebouwd op het ProjectX UI-design.
          </h1>
          <p>
            Werkt zoals shadcn — dezelfde compositie, dezelfde copy-paste-aanpak — maar zonder één regel code
            van shadcn, Radix of welke UI-library dan ook. Alles staat in jouw repo.
          </p>
          <div className="docs-hero-actions">
            <Button size="lg" asChild>
              <Link href="/docs/componenten/button">Bekijk de componenten</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/docs/installatie">Installatie</Link>
            </Button>
          </div>
          <div style={{ maxWidth: 520, margin: "28px auto 0", textAlign: "left" }}>
            <CodeBlock code={"npx projectx-ui init\nnpx projectx-ui add button card dialog"} standalone />
          </div>
        </div>
      </section>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 32px 90px" }}>
        <div className="docs-feature-grid">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <div>
                  <span
                    style={{
                      display: "grid", placeItems: "center", width: 38, height: 38,
                      borderRadius: "var(--r-md)", background: "var(--accent-tint)",
                      color: "var(--accent)", marginBottom: 12,
                    }}
                  >
                    <Icon name={feature.icon} size={19} />
                  </span>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.text}</CardDescription>
                </div>
              </CardHeader>
              <div style={{ height: 18 }} />
            </Card>
          ))}
        </div>

        <h2 className="docs-section-title" style={{ marginTop: 56 }}>Alles wat erin zit</h2>
        <p className="docs-section-desc">Van knop tot commandopalet, van tabel tot donutgrafiek.</p>
        <div
          style={{
            display: "grid", gap: 10, marginTop: 20,
            gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
          }}
        >
          {COMPONENTS.map((component) => (
            <Link
              key={component.slug}
              href={`/docs/componenten/${component.slug}`}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                border: "1px solid var(--border)", borderRadius: "var(--r-md)",
                background: "var(--surface)", textDecoration: "none", fontSize: 13.5, fontWeight: 550,
              }}
            >
              <Icon name="chevronRight" size={14} />
              {component.name}
              {component.isNew && <span className="docs-new">nieuw</span>}
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
