"use client";

/**
 * Fotokamera für Instagram: alle Kandidaten, neu und gebraucht, plus
 * die Frage, wo Gebrauchtkauf überhaupt auf Raten geht.
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Aperture, ChevronDown, ExternalLink, ShieldCheck } from "lucide-react";
import GearBild from "@/components/GearBild";
import { FOTOKAMERAS, GEBRAUCHT_HAENDLER } from "@/data/shop";
import type { FotoKamera } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

const URTEIL: Record<FotoKamera["urteil"], { text: string; ton: string }> = {
  pick: { text: "Empfehlung", ton: "var(--sage)" },
  moeglich: { text: "möglich", ton: "var(--amber)" },
  nein: { text: "nein", ton: "var(--text-dim)" },
};

const KLARNA: Record<
  (typeof GEBRAUCHT_HAENDLER)[number]["klarna"],
  { text: string; ton: string }
> = {
  ja: { text: "Klarna Raten", ton: "var(--sage)" },
  rechnung: { text: "nur Klarna Rechnung", ton: "var(--amber)" },
  nein: { text: "kein Klarna", ton: "var(--text-dim)" },
};

export default function GearFoto() {
  const [offen, setOffen] = useState<string | null>(null);
  const [nurPicks, setNurPicks] = useState(false);
  const liste = nurPicks ? FOTOKAMERAS.filter((f) => f.urteil === "pick") : FOTOKAMERAS;

  return (
    <div className="flex flex-col gap-5">
      <section className="card flex flex-col gap-3 rounded-3xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Aperture size={16} className="text-[var(--text-dim)]" />
          <div className="min-w-0 flex-1">
            <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
              Neu gegen gebraucht
            </p>
            <h2 className="font-display text-2xl">Fotokameras im Vergleich</h2>
          </div>
          <button
            type="button"
            onClick={() => setNurPicks((v) => !v)}
            aria-pressed={nurPicks}
            className="rounded-full border px-3 py-1 text-xs transition-colors duration-150"
            style={{
              borderColor: nurPicks ? "var(--sage)" : "var(--border-strong)",
              color: nurPicks ? "var(--sage)" : "var(--text-muted)",
            }}
          >
            nur Empfehlungen
          </button>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          Video macht die Pocket 3. Hier geht es um Fotos für Reise, Street, Porträts
          und Essen. Neupreise von geizhals.de, weil idealo bei Kameras automatisierte
          Abrufe blockiert. Gebrauchtpreise MPB, rebuy, eBay, Kleinanzeigen, Stand
          18.08.2026.
        </p>
        <ul className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {liste.map((f) => {
              const auf = offen === f.id;
              const u = URTEIL[f.urteil];
              return (
                <motion.li
                  key={f.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="overflow-hidden rounded-2xl border bg-white/60"
                  style={{
                    borderColor: f.urteil === "pick" ? "var(--sage)" : "var(--border)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOffen(auf ? null : f.id)}
                    aria-expanded={auf}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left"
                  >
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase"
                      style={{
                        background: `color-mix(in srgb, ${u.ton} 14%, transparent)`,
                        color: u.ton,
                      }}
                    >
                      {u.text}
                    </span>
                    <GearBild bild={f.bild} alt={f.name} art="foto" hoehe="h-14" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {f.name}
                      </span>
                      <span className="block truncate text-xs text-[var(--text-muted)]">
                        {f.sensor} · {f.gewicht}
                      </span>
                    </span>
                    <span className="shrink-0 text-right text-sm tabular-nums">
                      <span className="block">
                        {f.gebraucht ? `${f.gebraucht} EUR` : "kaum gebraucht"}
                        {f.unsicher && (
                          <span className="text-[var(--text-dim)]"> ?</span>
                        )}
                      </span>
                      <span className="block text-xs text-[var(--text-dim)]">
                        {f.neuMin
                          ? `neu ab ${f.neuMin.toLocaleString("de-DE")}`
                          : "neu nicht lieferbar"}
                      </span>
                    </span>
                    <ChevronDown
                      size={16}
                      className="shrink-0 text-[var(--text-dim)] transition-transform duration-200"
                      style={{ transform: auf ? "rotate(180deg)" : undefined }}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {auf && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.26, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-[var(--border)] px-4 py-3">
                          <dl className="grid gap-2 sm:grid-cols-2">
                            <div>
                              <dt className="text-xs text-[var(--text-dim)]">Gut</dt>
                              <dd className="text-sm">{f.gut}</dd>
                            </div>
                            <div>
                              <dt className="text-xs text-[var(--text-dim)]">Aber</dt>
                              <dd className="text-sm">{f.schlecht}</dd>
                            </div>
                          </dl>
                          {(f.kaufen.length > 0 || f.neuUrl || f.gebrauchtUrl) && (
                            <ul className="mt-3 flex flex-wrap gap-2">
                              {f.kaufen.map((k) => (
                                <li key={k.url}>
                                  <a
                                    href={k.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded-full border border-[var(--border-strong)] px-3 py-1 text-xs hover:border-[var(--sky)]"
                                  >
                                    {k.label}
                                    {k.preis && (
                                      <span className="text-[var(--text-dim)] tabular-nums">
                                        {" "}
                                        {k.preis} EUR
                                      </span>
                                    )}
                                    <ExternalLink size={12} />
                                  </a>
                                </li>
                              ))}
                              {f.neuUrl && (
                                <li>
                                  <a
                                    href={f.neuUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-muted)]"
                                  >
                                    neu, geizhals <ExternalLink size={12} />
                                  </a>
                                </li>
                              )}
                              {f.gebrauchtUrl && (
                                <li>
                                  <a
                                    href={f.gebrauchtUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-muted)]"
                                  >
                                    gebraucht, Quelle <ExternalLink size={12} />
                                  </a>
                                </li>
                              )}
                            </ul>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
        <p className="text-xs text-[var(--text-dim)]">
          G7X und RX100 sind gerade Gen-Z-Trendkameras (Blitz-Ästhetik, echtes Bokeh,
          Y2K), deshalb gebraucht teurer als neu. Als Kauf unvernünftig, als
          Wiederverkauf fast verlustfrei.
        </p>
      </section>

      <section className="card flex flex-col gap-3 rounded-3xl p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[var(--text-dim)]" />
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
              Gebraucht auf Raten
            </p>
            <h2 className="font-display text-2xl">Wo das überhaupt geht</h2>
          </div>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {GEBRAUCHT_HAENDLER.map((h) => {
            const k = KLARNA[h.klarna];
            return (
              <li
                key={h.name}
                className="flex flex-col gap-1 rounded-2xl border border-[var(--border)] bg-white/60 p-4"
              >
                <div className="flex items-center gap-2">
                  <a
                    href={h.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline-offset-2 hover:underline"
                  >
                    {h.name}
                  </a>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase"
                    style={{
                      background: `color-mix(in srgb, ${k.ton} 14%, transparent)`,
                      color: k.ton,
                    }}
                  >
                    {k.text}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-muted)]">{h.sonst}</p>
                <p className="text-xs text-[var(--text-dim)]">Garantie: {h.garantie}</p>
              </li>
            );
          })}
        </ul>
        <p className="text-sm text-[var(--text-muted)]">
          Konkret: a6400 Kit bei rebuy mit PayPal Raten und drei Jahren Garantie. Klarna
          direkt geht bei Gebrauchtkameras nur bei Back Market, dort ist der Bestand
          dünn. Wenn Klarna Pflicht ist, wird es die Neuware bei MediaMarkt mit 0 %, das
          ist über die Laufzeit billiger als gebraucht mit Zins.
        </p>
      </section>
    </div>
  );
}
