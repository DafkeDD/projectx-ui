"use client";
import { Button, Icon, Input } from "@projectx/ui";

export default function Demo() {
  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <Input prefix={<Icon name="search" />} placeholder="Zoek een tenant…" />
      <Input prefix={<Icon name="mail" />} type="email" placeholder="naam@bedrijf.be" />
      <Input addon=".projectx.be" placeholder="jouw-bedrijf" />
      <Input
        type="password"
        defaultValue="supergeheim"
        suffix={<Button variant="ghost" size="sm" icon={<Icon name="eye" />} aria-label="Toon wachtwoord" />}
      />
    </div>
  );
}
