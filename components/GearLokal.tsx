"use client";

/**
 * Gebrauchtmarkt München. Sortiert nach Urteil, nicht nach Preis: die
 * Frage ist nicht "was ist billig", sondern "was schlägt den Neukauf
 * mit Garantie und zinsfreier Rate".
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, MapPin, Search } from "lucide-react";
import GearBild from "@/components/GearBild";
import { KLEINANZEIGEN_STAND, LOKAL } from "@/data/shop";
import type { LokalAngebot } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

const URTEIL: Record<LokalAngebot["urteil"], { text: string; ton: string }> = {
  lohnt: { text: "lohnt", ton: "var(--sage)" },
  grenzwertig: { text: "grenzwertig", ton: "var(--amber)" },
  nein: { text: "nein", ton: "var(--text-dim)" },
};

export default function GearLokal() {
  const [nurLohnt, setNurLohnt] = useState(false);
  const liste = nurLohnt ? LOKAL.filter((l) => l.urteil === "lohnt") : LOKAL;

  return (
    <section className="card flex flex-col gap-4 rounded-3xl p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <MapPin size={16} className="text-[var(--text-dim)]" />
        <div className="min-w-0 flex-1">
          <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
            Kleinanzeigen, München plus 50 km
          </p>
          <h2 className="font-display text-2xl">Lohnt gebraucht vor Ort?</h2>
        </div>
        <button
          type="button"
          onClick={() => setNurLohnt((v) => !v)}
          aria-pressed={nurLohnt}
          className="rounded-full border px-3 py-1 text-xs transition-colors duration-150"
          style={{
            borderColor: nurLohnt ? "var(--sage)" : "var(--border-strong)",
            color: nurLohnt ? "var(--sage)" : "var(--text-muted)",
          }}
        >
          nur was lohnt
        </button>
      </div>

      <p className="text-sm text-[var(--text-muted)]">
        Bei der Kamera selbst bringt der Gebrauchtmarkt fast nichts: das beste Combo
        spart 50 EUR, kostet aber Gewährleistung und Ratenzahlung. Der Fund liegt beim
        Zubehör und beim Mietangebot.
      </p>

      <motion.ul layout className="grid gap-2 sm:grid-cols-2">
        <AnimatePresence initial={false} mode="popLayout">
          {liste.map((l) => {
            const u = URTEIL[l.urteil];
            const spart = l.neuPreis !== undefined ? l.neuPreis - l.preis : undefined;
            return (
              <motion.li
                key={l.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.22, ease: EASE }}
                className="flex flex-col gap-2 rounded-2xl border bg-white/60 p-4"
                style={{
                  borderColor: l.urteil === "lohnt" ? "var(--sage)" : "var(--border)",
                }}
              >
                <div className="flex items-start gap-3">
                  <GearBild bild={l.bild} alt={l.titel} art="kamera" hoehe="h-16" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{l.titel}</p>
                    <p className="text-xs text-[var(--text-dim)]">
                      {l.ort} · {l.km} km · {l.datum}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl tabular-nums">{l.preis} EUR</p>
                    {l.vorher !== undefined && (
                      <p className="text-xs text-[var(--text-dim)] tabular-nums line-through">
                        {l.vorher} EUR
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase"
                    style={{
                      background: `color-mix(in srgb, ${u.ton} 14%, transparent)`,
                      color: u.ton,
                    }}
                  >
                    {u.text}
                  </span>
                  {spart !== undefined && (
                    <span className="text-xs text-[var(--text-muted)] tabular-nums">
                      {spart > 0
                        ? `${spart.toLocaleString("de-DE")} EUR unter Neupreis`
                        : `${Math.abs(spart).toLocaleString("de-DE")} EUR über Neupreis`}
                    </span>
                  )}
                  <span className="text-xs text-[var(--text-dim)]">{l.was}</span>
                </div>

                <p className="text-sm text-[var(--text-muted)]">{l.begruendung}</p>

                <a
                  href={l.suche}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-[var(--border-strong)] px-3 py-1.5 text-xs transition-colors duration-150 hover:border-[var(--sky)]"
                >
                  <Search size={13} />
                  Suche öffnen
                  <ExternalLink size={12} />
                </a>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      <p className="text-xs text-[var(--text-dim)]">
        Stand {KLEINANZEIGEN_STAND}. Die Fotos zeigen das Modell, nicht das konkrete
        Angebot. Anzeigen verschwinden, deshalb führen die Links auf die Suche und nicht
        auf eine einzelne Anzeige. Privatkauf heißt: keine Gewährleistung, keine Raten,
        Restgarantie nur mit Originalrechnung.
      </p>
    </section>
  );
}
