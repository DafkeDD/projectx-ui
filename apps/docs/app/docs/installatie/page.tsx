import { Alert, Badge, Card, CardContent, Stepper } from "@projectx/ui";
import { CodeBlock } from "../../../components/code-block";

export default function InstallatiePage() {
  return (
    <div className="docs-body">
      <Badge tone="accent">Aan de slag</Badge>
      <h1 className="docs-title" style={{ marginTop: 14 }}>Installatie</h1>
      <p className="docs-lead">
        ProjectX UI werkt in elk React-project met een bundler (Next.js, Vite, Remix). Je hebt twee manieren:
        componenten kopiëren met de CLI, of de monorepo rechtstreeks gebruiken.
      </p>

      <div className="docs-section">
        <h2 className="docs-section-title">1 · De monorepo lokaal draaien</h2>
        <p className="docs-p">Dit is de documentatiesite die je nu bekijkt, met alle bronbestanden ernaast.</p>
        <CodeBlock standalone code={"npm install\nnpm run dev      # documentatiesite op http://localhost:3000\nnpm run registry # registry + props-tabellen opnieuw genereren"} />
        <p className="docs-p">
          Structuur: <code className="docs-inline-code">packages/ui</code> (de library),
          <code className="docs-inline-code">packages/cli</code> (de <code className="docs-inline-code">add</code>-CLI),
          <code className="docs-inline-code">apps/docs</code> (deze site) en
          <code className="docs-inline-code">registry/</code> (gegenereerde JSON).
        </p>
      </div>

      <div className="docs-section">
        <h2 className="docs-section-title">2 · Componenten in een bestaand project zetten</h2>
        <Stepper
          steps={[
            { label: "init", description: "tokens + basis" },
            { label: "add", description: "component kopiëren" },
            { label: "importeren", description: "css + component" },
          ]}
          current={2}
          style={{ marginTop: 18, marginBottom: 22 }}
        />
        <CodeBlock standalone code={"# eenmalig: tokens, basis-CSS en hulpfuncties\nnpx projectx-ui init\n\n# daarna per component\nnpx projectx-ui add button card dialog\n\n# alles in één keer\nnpx projectx-ui add --all\n\n# overzicht van wat er beschikbaar is\nnpx projectx-ui list"} />
        <p className="docs-p">
          <code className="docs-inline-code">init</code> maakt <code className="docs-inline-code">projectx-ui.json</code> aan
          met je paden en kopieert de gedeelde bestanden (tokens, base-CSS, <code className="docs-inline-code">cn()</code>,
          <code className="docs-inline-code">variants()</code>, Slot, Portal, hooks en de icon set).
        </p>
      </div>

      <div className="docs-section">
        <h2 className="docs-section-title">3 · CSS inladen</h2>
        <p className="docs-p">Importeer één stylesheet in je globale CSS. De volgorde maakt niet uit; alles werkt met cascade-vrije klassen.</p>
        <CodeBlock standalone code={'/* app/globals.css */\n@import "tailwindcss";        /* optioneel: Tailwind als engine */\n@import "./components/ui/ui.css";  /* tokens + alle gekopieerde componenten */'} />
        <Alert tone="amber" title="Tailwind is niet verplicht" style={{ marginTop: 16 }}>
          De componenten hebben Tailwind niet nodig — ze gebruiken eigen <code className="docs-inline-code">pxui-</code>klassen.
          Tailwind v4 staat er alleen voor de reset en voor utilities in je eigen markup.
        </Alert>
      </div>

      <div className="docs-section">
        <h2 className="docs-section-title">4 · Providers</h2>
        <p className="docs-p">Twee providers zet je één keer bovenaan je app: thema en meldingen.</p>
        <CodeBlock
          standalone
          code={`// app/layout.tsx
import { ThemeProvider, ThemeScript, ToastProvider } from "@/components/ui";

export default function RootLayout({ children }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}`}
        />
      </div>

      <div className="docs-section">
        <h2 className="docs-section-title">Lettertypes</h2>
        <p className="docs-p">
          Het design gebruikt <strong>Hanken Grotesk</strong> voor tekst en <strong>JetBrains Mono</strong> voor code.
          Laad ze via Google Fonts, of pas <code className="docs-inline-code">--font</code> en
          <code className="docs-inline-code">--mono</code> aan in <code className="docs-inline-code">tokens.css</code>.
        </p>
        <CodeBlock
          standalone
          code={'<link\n  href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400,500,600,700,800&family=JetBrains+Mono:wght@400,600&display=swap"\n  rel="stylesheet"\n/>'}
        />
      </div>

      <div className="docs-section">
        <Card>
          <CardContent>
            <div style={{ fontWeight: 650, marginBottom: 6 }}>Vereisten</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: "var(--text-2)", lineHeight: 1.9 }}>
              <li>React 18 of 19</li>
              <li>Node 20 of hoger (voor de CLI)</li>
              <li>Een bundler die CSS-imports aankan (Next.js, Vite, …)</li>
              <li>Geen enkele UI- of utility-library — die zitten er bewust niet in</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
