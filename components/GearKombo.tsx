"use client";

/**
 * Kombinationen aus Vlog- und Fotokamera, jede mit SWOT.
 *
 * Die Reihenfolge ist die Rangfolge: die Empfehlung steht oben, die
 * Gegenprobe unten. Preise und Monatsrate kommen aus derselben Rechnung
 * wie der Konfigurator, damit die Seite sich nicht selbst widerspricht.
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  Layers,
  Minus,
  TrendingUp,
} from "lucide-react";
import GearBild from "@/components/GearBild";
import { FOTOKAMERAS, KAUF, KOMBOS } from "@/data/shop";
import { komboSumme } from "@/lib/shop";
import type { Kombo } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

const URTEIL: Record<Kombo["urteil"], { text: string; ton: string }> = {
  empfehlung: { text: "Empfehlung", ton: "var(--sage)" },
  moeglich: { text: "möglich", ton: "var(--amber)" },
  verworfen: { text: "verworfen", ton: "var(--text-dim)" },
};

/** Die vier SWOT-Felder, bewusst deutsch benannt und mit eigenem Ton. */
const FELDER = [
  { key: "staerken", titel: "Stärken", Icon: Check, ton: "var(--sage)" },
  { key: "schwaechen", titel: "Schwächen", Icon: Minus, ton: "var(--terra)" },
  { key: "chancen", titel: "Chancen", Icon: TrendingUp, ton: "var(--sky)" },
  { key: "risiken", titel: "Risiken", Icon: AlertTriangle, ton: "var(--rose)" },
] as const;

function eur(n: number): string {
  return `${Math.round(n).toLocaleString("de-DE")} EUR`;
}

export default function GearKombo() {
  const [offen, setOffen] = useState<string | null>(KOMBOS[0]?.id ?? null);

  return (
    <section className="card flex flex-col gap-4 rounded-3xl p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Layers size={16} className="text-[var(--text-dim)]" />
        <div>
          <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
            Eine filmt, eine fotografiert
          </p>
          <h2 className="font-display text-2xl">Welche Kombination, und warum</h2>
        </div>
      </div>

      <p className="max-w-3xl text-sm text-[var(--text-muted)]">
        Sobald eine echte Fotokamera dazukommt, ändert sich die Rechnung für die
        Videokamera: Tele, Porträt und Standbild übernimmt dann die Fotokamera, und
        genau dafür kostet die 4P ihren Aufpreis. Deshalb stehen hier Paarungen und
        keine zwei getrennten Listen. Jede mit Stärken, Schwächen, Chancen und Risiken.
      </p>

      <ul className="flex flex-col gap-3">
        {KOMBOS.map((k, i) => {
          const s = komboSumme(k);
          const vlog = KAUF.find((x) => x.id === k.vlog);
          const foto = k.foto ? FOTOKAMERAS.find((f) => f.id === k.foto) : undefined;
          const u = URTEIL[k.urteil];
          const auf = offen === k.id;

          return (
            <li
              key={k.id}
              className="overflow-hidden rounded-2xl border bg-white/60"
              style={{
                borderColor:
                  k.urteil === "empfehlung" ? "var(--sage)" : "var(--border)",
              }}
            >
              <button
                type="button"
                onClick={() => setOffen(auf ? null : k.id)}
                aria-expanded={auf}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span className="flex shrink-0 items-center gap-1">
                  <GearBild
                    bild={vlog?.bild}
                    alt={vlog?.name ?? ""}
                    art="kamera"
                    hoehe="h-14"
                  />
                  {foto ? (
                    <>
                      <ArrowRight size={12} className="text-[var(--text-dim)]" />
                      <GearBild
                        bild={foto.bild}
                        alt={foto.name}
                        art="foto"
                        hoehe="h-14"
                      />
                    </>
                  ) : null}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{k.name}</span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase"
                      style={{
                        background: `color-mix(in srgb, ${u.ton} 14%, transparent)`,
                        color: u.ton,
                      }}
                    >
                      {i === 0 && k.urteil === "empfehlung" ? "Meine Wahl" : u.text}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-xs text-[var(--text-muted)]">
                    {k.these}
                  </span>
                </span>

                <span className="hidden shrink-0 text-right sm:block">
                  <span className="font-display block text-xl tabular-nums">
                    {eur(s.gesamt)}
                  </span>
                  <span className="block text-xs text-[var(--text-dim)] tabular-nums">
                    rund {eur(s.monatlich)} pro Monat
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
                    transition={{ duration: 0.28, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-3 border-t border-[var(--border)] px-4 py-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {FELDER.map(({ key, titel, Icon, ton }) => (
                          <div
                            key={key}
                            className="rounded-xl border border-[var(--border)] p-3"
                          >
                            <p
                              className="flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase"
                              style={{ color: ton }}
                            >
                              <Icon size={13} />
                              {titel}
                            </p>
                            <ul className="mt-1.5 flex list-disc flex-col gap-1 pl-4 text-sm text-[var(--text-muted)]">
                              {k[key].map((z) => (
                                <li key={z}>{z}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <div className="grid gap-2 sm:grid-cols-3">
                        <div className="rounded-xl border border-[var(--border)] p-3">
                          <p className="text-xs text-[var(--text-dim)]">Videokamera</p>
                          <p className="text-sm font-medium">{vlog?.name}</p>
                          <p className="text-sm tabular-nums">
                            {eur(s.vlogPreis)}
                            {s.vlogShop && (
                              <span className="text-[var(--text-dim)]">
                                {" "}
                                · {s.vlogShop.shop}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="rounded-xl border border-[var(--border)] p-3">
                          <p className="text-xs text-[var(--text-dim)]">Fotokamera</p>
                          <p className="text-sm font-medium">{foto?.name ?? "keine"}</p>
                          <p className="text-sm tabular-nums">
                            {foto ? `${eur(s.fotoPreis)} gebraucht` : "0 EUR"}
                          </p>
                        </div>
                        <div
                          className="rounded-xl border p-3"
                          style={{
                            borderColor: s.nullProzent
                              ? "var(--sage)"
                              : "var(--border)",
                          }}
                        >
                          <p className="text-xs text-[var(--text-dim)]">Monatlich</p>
                          <p className="font-display text-xl tabular-nums">
                            {eur(s.monatlich)}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {s.nullProzent
                              ? "Videoteil zinsfrei über 18 Monate"
                              : "Videoteil über Klarna, mit Zins"}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm">
                        <strong>Fazit:</strong>{" "}
                        <span className="text-[var(--text-muted)]">{k.fazit}</span>
                      </p>
                      <p className="text-xs text-[var(--text-dim)]">{k.zahlweg}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      <p className="text-xs text-[var(--text-dim)]">
        Videopreise sind Neupreise vom 18.08.2026, Fotopreise der untere Rand der
        Gebrauchtspanne. Die Monatsrate rechnet den Videoteil über die zinsfreie
        Finanzierung, wo der Shop sie anbietet, sonst über Klarna mit 13,27 Prozent, und
        den Fototeil über zwölf PayPal-Raten, deren Zinssatz erst im Checkout steht.
      </p>
    </section>
  );
}
