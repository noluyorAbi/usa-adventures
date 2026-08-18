"use client";

/**
 * Was der 3D-Drucker statt der Kreditkarte erledigt. Gefiltert nach
 * Kategorie, jedes Modell mit Link, Material und dem Grund.
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Ban, ExternalLink, Flame, Printer, Star } from "lucide-react";
import { DRUCKE, NICHT_DRUCKEN } from "@/data/shop";
import type { DruckKategorie, DruckModell } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

const KATEGORIEN: { id: DruckKategorie | "alle"; label: string }[] = [
  { id: "alle", label: "Alle" },
  { id: "pocket", label: "Pocket 3" },
  { id: "speicher", label: "SD-Karten" },
  { id: "mac", label: "MacBook" },
  { id: "auto", label: "330i" },
  { id: "reise", label: "Reise" },
  { id: "action", label: "Action 5" },
  { id: "foto", label: "Fotokamera" },
];

const MATERIAL_TON: Record<DruckModell["material"], string> = {
  PLA: "var(--text-dim)",
  PETG: "var(--teal)",
  ASA: "var(--terra)",
  TPU: "var(--indigo)",
};

const FREI: Record<DruckModell["frei"], string> = {
  ja: "frei",
  nein: "kostenpflichtig",
  pruefen: "Lizenz prüfen",
};

export default function GearDruck() {
  const [kat, setKat] = useState<DruckKategorie | "alle">("alle");
  const liste = DRUCKE.filter((d) => kat === "alle" || d.kategorie === kat);

  return (
    <div className="flex flex-col gap-5">
      <section className="card flex flex-col gap-4 rounded-3xl p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Printer size={16} className="text-[var(--text-dim)]" />
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
              Drucken statt kaufen
            </p>
            <h2 className="font-display text-2xl">
              {DRUCKE.length} Modelle, alle verlinkt
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {KATEGORIEN.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setKat(k.id)}
              aria-pressed={kat === k.id}
              className="rounded-full border px-3 py-1 text-xs transition-colors duration-150 active:scale-[0.97]"
              style={{
                borderColor: kat === k.id ? "var(--sky)" : "var(--border-strong)",
                background: kat === k.id ? "var(--sky)" : "transparent",
                color: kat === k.id ? "#fff" : "var(--text)",
              }}
            >
              {k.label}
            </button>
          ))}
        </div>

        <motion.ul layout className="grid gap-2 sm:grid-cols-2">
          <AnimatePresence initial={false} mode="popLayout">
            {liste.map((d) => (
              <motion.li
                key={d.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.22, ease: EASE }}
              >
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col gap-1.5 rounded-2xl border bg-white/60 p-4 transition-[border-color,transform] duration-150 hover:-translate-y-px hover:border-[var(--sky)]"
                  style={{ borderColor: d.top ? "var(--sage)" : "var(--border)" }}
                >
                  <div className="flex items-start gap-2">
                    {d.top && (
                      <Star
                        size={14}
                        className="mt-1 shrink-0"
                        style={{ color: "var(--sage)" }}
                      />
                    )}
                    <span className="min-w-0 flex-1 text-sm font-medium">{d.name}</span>
                    <ExternalLink
                      size={14}
                      className="mt-1 shrink-0 text-[var(--text-dim)] transition-colors group-hover:text-[var(--sky)]"
                    />
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">{d.warum}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1 text-[10px] tracking-wide uppercase">
                    <span
                      className="rounded-full px-2 py-0.5 font-medium"
                      style={{
                        background: `color-mix(in srgb, ${MATERIAL_TON[d.material]} 14%, transparent)`,
                        color: MATERIAL_TON[d.material],
                      }}
                    >
                      {d.material}
                    </span>
                    {d.stuetzen && (
                      <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[var(--text-dim)]">
                        Stützen
                      </span>
                    )}
                    <span className="text-[var(--text-dim)]">
                      {d.site} · {FREI[d.frei]}
                    </span>
                  </div>
                </a>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <div className="flex items-start gap-2 rounded-2xl border border-[var(--border)] bg-white/60 p-4 text-sm">
          <Flame
            size={16}
            className="mt-0.5 shrink-0"
            style={{ color: "var(--terra)" }}
          />
          <p className="text-[var(--text-muted)]">
            <strong>Material:</strong> PLA nur für Zimmer und Geldbeutel. Ein geparkter
            Innenraum in Kalifornien erreicht 70 bis 90 °C, PLA erweicht ab 60, PETG
            wird ab 80 weich. Alles, was im 330i bleibt, in <strong>ASA</strong>. Sonst
            PETG.{" "}
            <a
              href="https://extruder.co.nz/testing-3d-printing-plastics-in-a-hot-car-pla-vs-petg-vs-asa/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Test
            </a>
          </p>
        </div>
      </section>

      <section className="card flex flex-col gap-3 rounded-3xl p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Ban size={16} className="text-[var(--text-dim)]" />
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
              Der Drucker ist keine Lösung für alles
            </p>
            <h2 className="font-display text-2xl">Nicht drucken, kaufen</h2>
          </div>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {NICHT_DRUCKEN.map((n) => (
            <li
              key={n.name}
              className="rounded-2xl border border-[var(--border)] bg-white/60 p-4"
            >
              <p className="text-sm font-medium">{n.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{n.grund}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
