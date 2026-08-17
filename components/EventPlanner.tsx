"use client";

/**
 * Feste Termine: Konzert und Rennen.
 *
 * Der Urlaubsplaner nebenan rechnet mit verschiebbaren Trips. Diese
 * Ansicht rechnet mit dem Gegenteil: Termine, deren Datum jemand anders
 * gesetzt hat. Sie zeigt, was sie kosten, welche Urlaubstage sie fressen
 * und wo sie einem geplanten Trip in die Quere kommen.
 */

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ExternalLink, Flag, Music, TriangleAlert } from "lucide-react";
import { EVENTS } from "@/data/events";
import { kostenJeEvent, konflikte, summeGesetzt } from "@/lib/events";
import { parseIso } from "@/lib/vacation";
import type { FixedEvent, Trip } from "@/lib/types";

const WOCHENTAGE = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

function langesDatum(isoStr: string): string {
  const d = parseIso(isoStr);
  return `${WOCHENTAGE[d.getUTCDay()]}, ${String(d.getUTCDate()).padStart(2, "0")}.${String(
    d.getUTCMonth() + 1,
  ).padStart(2, "0")}.${d.getUTCFullYear()}`;
}

function spanne(e: FixedEvent): string {
  return e.startDate === e.endDate
    ? langesDatum(e.startDate)
    : `${langesDatum(e.startDate)} bis ${langesDatum(e.endDate)}`;
}

const usd = (n: number) => `${n.toLocaleString("de-DE")} USD`;

function Icon({ kind }: { kind: FixedEvent["kind"] }) {
  return kind === "motorsport" ? <Flag size={15} /> : <Music size={15} />;
}

export default function EventPlanner({ trips }: { trips: Trip[] }) {
  const [offen, setOffen] = useState<string | null>("ev-f1-cota");

  const kosten = useMemo(() => kostenJeEvent(EVENTS), []);
  const summe = useMemo(() => summeGesetzt(EVENTS), []);
  const clashes = useMemo(() => konflikte(trips, EVENTS), [trips]);

  const gesetzt = kosten.filter((k) => k.event.status === "gesetzt");
  const optionen = kosten.filter((k) => k.event.status === "option");

  return (
    <div className="flex flex-col gap-5">
      {/* ── Die Summe ───────────────────────────────────────────────── */}
      <section className="card flex flex-col gap-4 rounded-3xl p-5 sm:p-6">
        <div>
          <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
            Feste Termine
          </p>
          <h2 className="font-display text-2xl">Ein Konzert und ein Rennwochenende</h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--text-muted)]">
            Zwei Termine, deren Datum nicht verhandelbar ist. EsDeeKid spielt am 07.10.
            im Hollywood Palladium, die Formel 1 faehrt vom 23. bis 25.10. in Austin.
            Alles andere im Kalender richtet sich danach.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border)] bg-white/60 p-4">
            <p className="text-xs text-[var(--text-dim)]">Kosten je Person</p>
            <p className="font-display text-3xl">{usd(summe.usd)}</p>
            <p className="text-xs text-[var(--text-muted)]">
              davon {usd(summe.usdGeschaetzt)} geschaetzt
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-white/60 p-4">
            <p className="text-xs text-[var(--text-dim)]">Urlaubstage</p>
            <p className="font-display text-3xl" style={{ color: "var(--terra)" }}>
              {summe.urlaubstage}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              nur der Freitag in Austin
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-white/60 p-4">
            <p className="text-xs text-[var(--text-dim)]">Zu buchen bis</p>
            <p className="font-display text-3xl">Sept.</p>
            <p className="text-xs text-[var(--text-muted)]">
              Fluege und Austin-Hotel ziehen zum Rennen an
            </p>
          </div>
        </div>
      </section>

      {/* ── Konflikte ───────────────────────────────────────────────── */}
      {clashes.length > 0 && (
        <section className="card flex flex-col gap-3 rounded-3xl p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <TriangleAlert size={16} style={{ color: "var(--terra)" }} />
            <div>
              <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
                Kollisionen
              </p>
              <h2 className="font-display text-2xl">
                {clashes.length} geplante Reise
                {clashes.length === 1 ? "" : "n"} liegt im Weg
              </h2>
            </div>
          </div>
          <ul className="flex flex-col gap-2">
            {clashes.map((c) => (
              <li
                key={`${c.event.id}-${c.trip.id}`}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-[var(--border)] bg-white/60 p-4 text-sm"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: c.trip.color }}
                />
                <span className="font-medium">{c.trip.name}</span>
                <span className="text-[var(--text-muted)]">
                  ueberschneidet sich an {c.tage.length} Tag
                  {c.tage.length === 1 ? "" : "en"} mit {c.event.title}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-[var(--text-dim)]">
            Das Rennen ist der feste Punkt, die Reisen sind es nicht. Wer den Konflikt
            aufloesen will, verschiebt die Trips in <code>data/trips.ts</code>, nicht
            den Termin.
          </p>
        </section>
      )}

      {/* ── Die Termine im Detail ───────────────────────────────────── */}
      <section className="card flex flex-col gap-3 rounded-3xl p-5 sm:p-6">
        <div>
          <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
            Gesetzt
          </p>
          <h2 className="font-display text-2xl">Was jeder Termin kostet</h2>
        </div>

        <ul className="flex flex-col gap-2">
          {gesetzt.map(({ event, usd: summeEvent, urlaubstage, urlaubsdaten }) => {
            const auf = offen === event.id;
            return (
              <li
                key={event.id}
                className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white/60"
              >
                <button
                  onClick={() => setOffen(auf ? null : event.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
                    style={{
                      background: `color-mix(in srgb, ${event.color} 16%, transparent)`,
                      color: event.color,
                    }}
                  >
                    <Icon kind={event.kind} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {event.title}
                    </span>
                    <span className="block truncate text-xs text-[var(--text-muted)]">
                      {spanne(event)} · {event.venue}, {event.city}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="font-display block text-lg">
                      {usd(summeEvent)}
                    </span>
                    <span
                      className="block text-xs"
                      style={{
                        color: urlaubstage ? "var(--terra)" : "var(--teal)",
                      }}
                    >
                      {urlaubstage
                        ? `${urlaubstage} Urlaubstag${urlaubstage === 1 ? "" : "e"}`
                        : "kein Urlaub"}
                    </span>
                  </span>
                  <ChevronDown
                    size={16}
                    className="shrink-0 text-[var(--text-dim)] transition"
                    style={{ transform: auf ? "rotate(180deg)" : undefined }}
                  />
                </button>

                {auf && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-[var(--border)] px-4 py-3"
                  >
                    <p className="text-sm text-[var(--text-muted)]">
                      {event.begruendung}
                    </p>

                    <ul className="mt-3 flex flex-col gap-1">
                      {event.kosten.map((k) => (
                        <li key={k.label} className="flex items-baseline gap-2 text-sm">
                          <span className="min-w-0 flex-1 truncate">
                            {k.label}
                            {k.note && (
                              <span className="text-xs text-[var(--text-dim)]">
                                {" "}
                                · {k.note}
                              </span>
                            )}
                          </span>
                          <span
                            className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px]"
                            style={{
                              background:
                                k.quelle === "bestaetigt"
                                  ? "color-mix(in srgb, var(--teal) 14%, transparent)"
                                  : "color-mix(in srgb, var(--text-dim) 14%, transparent)",
                              color:
                                k.quelle === "bestaetigt"
                                  ? "var(--teal)"
                                  : "var(--text-dim)",
                            }}
                          >
                            {k.quelle === "bestaetigt" ? "belegt" : "geschaetzt"}
                          </span>
                          <span className="w-20 shrink-0 text-right tabular-nums">
                            {usd(k.usd)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[11px] text-[var(--text-muted)]">
                        {event.anreise}
                      </span>
                      {urlaubsdaten.map((d) => (
                        <span
                          key={d}
                          className="rounded-full px-2 py-0.5 text-[11px]"
                          style={{
                            background:
                              "color-mix(in srgb, var(--terra) 14%, transparent)",
                            color: "var(--terra)",
                          }}
                        >
                          Urlaub {d.slice(8)}.{d.slice(5, 7)}.
                        </span>
                      ))}
                    </div>

                    {event.hinweis && (
                      <p className="mt-3 text-xs text-[var(--text-dim)]">
                        {event.hinweis}
                      </p>
                    )}

                    {event.ticketUrl && (
                      <a
                        href={event.ticketUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs"
                        style={{ color: "var(--sky)" }}
                      >
                        Tickets <ExternalLink size={12} />
                      </a>
                    )}
                  </motion.div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── Verworfene Alternativen ─────────────────────────────────── */}
      {optionen.length > 0 && (
        <section className="card flex flex-col gap-3 rounded-3xl p-5 sm:p-6">
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
              Alternativen
            </p>
            <h2 className="font-display text-2xl">Termine, die wir nicht nehmen</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Stehen hier, damit die Entscheidung nachvollziehbar bleibt und man sie
              umdrehen kann, wenn sich etwas aendert.
            </p>
          </div>
          <ul className="flex flex-col gap-2">
            {optionen.map(({ event }) => (
              <li
                key={event.id}
                className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-3"
              >
                <p className="text-sm font-medium">
                  {event.venue}, {event.city} · {spanne(event)}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {event.begruendung}
                </p>
                {event.hinweis && (
                  <p className="mt-1 text-xs text-[var(--text-dim)]">{event.hinweis}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
