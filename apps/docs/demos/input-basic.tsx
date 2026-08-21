"use client";
import { Field, Input } from "@projectx/ui";

export default function Demo() {
  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <Input size="sm" placeholder="Klein veld" />
      <Input placeholder="Standaard veld" />
      <Input size="lg" placeholder="Groot veld" />
      <Input placeholder="Uitgeschakeld" disabled />
      <Field error="Dit e-mailadres is al in gebruik.">
        <Input defaultValue="davey@itworxs.be" invalid />
      </Field>
    </div>
  );
}
