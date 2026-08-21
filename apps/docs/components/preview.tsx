"use client";
import * as React from "react";
import { Button, Icon, Segmented } from "@projectx/ui";
import { DEMOS } from "../demos";
import { CodeBlock } from "./code-block";

export interface PreviewProps {
  demoKey: string;
  code: string;
  align?: "center" | "start" | "block";
}

/** Preview — live component links, echte broncode rechts achter een tab. */
export function Preview({ demoKey, code, align = "center" }: PreviewProps) {
  const [tab, setTab] = React.useState("preview");
  const Demo = DEMOS[demoKey];

  return (
    <div className="docs-preview">
      <div className="docs-preview-bar">
        <Segmented
          size="sm"
          value={tab}
          onValueChange={setTab}
          options={[
            { value: "preview", label: "Voorbeeld", icon: <Icon name="eye" /> },
            { value: "code", label: "Code", icon: <Icon name="code" /> },
          ]}
        />
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 11.5, color: "var(--text-3)", fontFamily: "var(--mono)" }}>
          demos/{demoKey}.tsx
        </span>
      </div>

      {tab === "preview" ? (
        <div
          className={
            "docs-preview-stage" +
            (align === "start" ? " docs-preview-stage-start" : "") +
            (align === "block" ? " docs-preview-stage-block" : "")
          }
        >
          {Demo ? <Demo /> : <span style={{ color: "var(--text-3)" }}>Demo “{demoKey}” niet gevonden.</span>}
        </div>
      ) : (
        <CodeBlock code={code} />
      )}
    </div>
  );
}
