import { Alert, Badge, Card, CardContent, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@projectx/ui";
import { CodeBlock } from "../../../components/code-block";
import { TOKEN_GROUPS, readTokens } from "../../../lib/tokens";

export default function ThemingPage() {
  const tokens = readTokens();
  const find = (name: string) => tokens.find((token) => token.name === name);
  const radii = tokens.filter((token) => token.name.startsWith("--r-"));
  const shadows = tokens.filter((token) => token.name.startsWith("--sh-"));

  return (
    <div className="docs-body docs-body-wide">
      <Badge tone="accent">Fundament</Badge>
      <h1 className="docs-title" style={{ marginTop: 14 }}>Thema &amp; tokens</h1>
      <p className="docs-lead">
        Elke kleur in deze library komt uit één bestand: <code className="docs-inline-code">tokens.css</code>.
        Componenten schrijven nooit een hex-waarde — ze gebruiken alleen variabelen. Pas een token aan en de
        volledige UI verandert mee, in licht én donker.
      </p>

      <Alert tone="accent" title="Bron: het ProjectX UI-design" style={{ marginTop: 22 }}>
        De waarden hieronder zijn exact overgenomen uit het admin-paneel-design. Wil je een tweede merk
        ondersteunen? Kopieer het <code className="docs-inline-code">:root</code>-blok en overschrijf het onder een
        eigen selector, bijvoorbeeld <code className="docs-inline-code">[data-brand=&quot;klant-x&quot;]</code>.
      </Alert>

      {TOKEN_GROUPS.map((group) => (
        <div className="docs-section" key={group.title}>
          <h2 className="docs-section-title">{group.title}</h2>
          <p className="docs-section-desc">{group.description}</p>
          <div className="docs-swatches">
            {group.names.map((name) => {
              const token = find(name);
              return (
                <div className="docs-swatch" key={name}>
                  <div className="docs-swatch-color" style={{ background: `var(${name})` }} />
                  <div className="docs-swatch-meta">
                    <div className="docs-swatch-name">{name}</div>
                    <div className="docs-swatch-value">{token?.light ?? "—"}</div>
                    {token?.dark && <div className="docs-swatch-value">donker: {token.dark}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="docs-section">
        <h2 className="docs-section-title">Radius &amp; schaduw</h2>
        <div className="docs-grid-2">
          <Card>
            <CardContent>
              <div className="pxui-eyebrow" style={{ marginBottom: 14 }}>Radius</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {radii.map((token) => (
                  <div key={token.name} style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: 62, height: 62, background: "var(--surface-3)",
                        border: "1px solid var(--border)", borderRadius: `var(${token.name})`,
                      }}
                    />
                    <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 6, fontFamily: "var(--mono)" }}>
                      {token.name.replace("--r-", "")}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="pxui-eyebrow" style={{ marginBottom: 14 }}>Schaduw</div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {shadows.map((token) => (
                  <div key={token.name} style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: 62, height: 62, background: "var(--surface)",
                        borderRadius: "var(--r-md)", boxShadow: `var(${token.name})`,
                      }}
                    />
                    <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 8, fontFamily: "var(--mono)" }}>
                      {token.name.replace("--sh-", "")}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="docs-section">
        <h2 className="docs-section-title">Herkleuren</h2>
        <p className="docs-p">Eén variabele aanpassen volstaat om de hele library te herkleuren:</p>
        <CodeBlock
          standalone
          code={`:root {
  --accent: #0d9488;        /* hoofdkleur   */
  --accent-hover: #0f766e;  /* hover        */
  --accent-active: #115e59; /* actief       */
  --accent-tint: #f0fdfa;   /* zachte vlakken, actieve nav-items */
}

[data-theme="dark"] {
  --accent: #2dd4bf;
  --accent-fg: #04201d;
}`}
        />
      </div>

      <div className="docs-section">
        <h2 className="docs-section-title">
          Dichtheid <Badge tone="accent" size="sm">nieuw</Badge>
        </h2>
        <p className="docs-p">
          Naast licht en donker heeft de library één schaalknop:{" "}
          <code className="docs-inline-code">--density</code>. Elke hoogte en padding is geschreven als{" "}
          <code className="docs-inline-code">calc(Npx * var(--density))</code>, dus compact en ruim werken meteen
          door in knoppen, velden, tabellen, lijsten en agenda&apos;s — zonder één component aan te passen.
        </p>
        <CodeBlock
          standalone
          code={`:root { --density: 1; }
[data-density="compact"] { --density: 0.86; }
[data-density="comfy"]   { --density: 1.14; }

/* in een component */
.pxui-btn { height: calc(40px * var(--density)); }`}
        />
        <p className="docs-p">
          <code className="docs-inline-code">ThemeProvider</code> zet{" "}
          <code className="docs-inline-code">data-density</code> op{" "}
          <code className="docs-inline-code">&lt;html&gt;</code> en onthoudt de keuze;{" "}
          <code className="docs-inline-code">DensityToggle</code> is de kant-en-klare schakelaar en{" "}
          <code className="docs-inline-code">ThemeScript</code> zet ze terug vóór de eerste paint.
        </p>
      </div>

      <div className="docs-section">
        <h2 className="docs-section-title">Alle tokens</h2>
        <Table dense minWidth={620}>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Licht</TableHead>
              <TableHead>Donker</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((token) => (
              <TableRow key={token.name}>
                <TableCell strong>
                  <span className="docs-type">{token.name}</span>
                </TableCell>
                <TableCell>
                  <span className="docs-default">{token.light}</span>
                </TableCell>
                <TableCell>
                  <span className="docs-default">{token.dark ?? "—"}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
