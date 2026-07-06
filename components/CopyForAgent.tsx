"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

/**
 * Kopiert einen fertigen Agenten-Prompt in die Zwischenablage.
 * Wird auf der Landing (Tutorial) und kontextuell in der App genutzt.
 */
export default function CopyForAgent({
  text,
  label = "Copy für Agent",
  variant = "full",
}: {
  text: string;
  label?: string;
  variant?: "full" | "compact" | "primary";
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const base =
    "flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition";

  if (variant === "primary") {
    return (
      <button
        onClick={copy}
        className={`${base} px-5 py-2.5 text-white`}
        style={{
          background: copied ? "var(--teal)" : "var(--sky-grad)",
        }}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? "Kopiert" : label}
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={copy}
        className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white/70 px-3 py-1.5 text-xs backdrop-blur transition hover:border-[var(--sky)]"
        style={
          copied ? { borderColor: "var(--teal)", color: "var(--teal)" } : undefined
        }
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        {copied ? "Kopiert" : label}
      </button>
    );
  }

  return (
    <button
      onClick={copy}
      className={`${base} border border-[var(--border)] bg-black/[0.02] py-2 hover:border-[var(--sky)]`}
      style={copied ? { borderColor: "var(--teal)", color: "var(--teal)" } : undefined}
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? "Kopiert" : label}
    </button>
  );
}
