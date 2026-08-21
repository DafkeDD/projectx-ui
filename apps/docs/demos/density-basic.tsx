"use client";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  DensityToggle,
  Field,
  Icon,
  Input,
  ListRow,
  useTheme,
} from "@projectx/ui";

export default function Demo() {
  const { density } = useTheme();

  return (
    <Card>
      <CardContent style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <DensityToggle />
          <span style={{ fontSize: 13, color: "var(--text-3)" }}>
            actief: <code>{density}</code>
          </span>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <Button>Opslaan</Button>
          <Button variant="secondary">Annuleren</Button>
          <Checkbox label="Herinnering sturen" defaultChecked />
        </div>

        <Field label="Zoeken">
          <Input placeholder="Naam of rijksregisternummer" prefix={<Icon name="search" />} />
        </Field>

        <div style={{ border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
          <ListRow lead="09:30" title="Annelies Peeters" subtitle="Controle · Dr. Reyniers" />
          <ListRow lead="10:15" title="Jonas De Smet" subtitle="Nazicht · Dr. Reyniers" />
          <ListRow lead="11:00" title="Fatima El Amrani" subtitle="Meting · Mr. Miroir" />
        </div>
      </CardContent>
    </Card>
  );
}
