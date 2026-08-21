"use client";
import * as React from "react";
import { Button, Icon, useCopyToClipboard } from "@projectx/ui";

const KEYWORDS =
  /\b(import|from|export|default|function|return|const|let|var|if|else|type|interface|await|async|new|useState|useMemo|useEffect)\b/g;

/** Kleine eigen highlighter — genoeg voor TSX-voorbeelden, nul dependencies. */
function highlight(code: string): string {
  const escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .replace(/(\/\/[^\n]*)/g, '<span class="tok-com">$1</span>')
    .replace(/(&quot;|&#39;|"|')((?:\\.|(?!\1)[^\\])*)\1/g, '<span class="tok-str">$1$2$1</span>')
    .replace(/(&lt;\/?)([A-Z][\w.]*)/g, '$1<span class="tok-tag">$2</span>')
    .replace(KEYWORDS, '<span class="tok-key">$1</span>')
    .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-num">$1</span>');
}

export interface CodeBlockProps {
  code: string;
  /** Toont een kopieerknop rechtsboven. */
  copyable?: boolean;
  standalone?: boolean;
}

export function CodeBlock({ code, copyable = true, standalone }: CodeBlockProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div style={{ position: "relative" }}>
      {copyable && (
        <Button
          size="sm"
          variant="ghost"
          aria-label="Code kopiëren"
          icon={<Icon name={copied ? "check" : "copy"} />}
          onClick={() => copy(code)}
          style={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
        />
      )}
      <pre className={standalone ? "docs-code docs-code-standalone" : "docs-code"}>
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
    </div>
  );
}
