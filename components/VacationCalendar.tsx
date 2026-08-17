"use client";

/**
 * Urlaubsplaner und Jahreskalender.
 *
 * Die App konnte bisher Trips sammeln, aber nicht sagen, ob sie bezahlbar
 * sind. Bezahlbar heißt hier: in Urlaubstagen. Acht Stück für sechs Monate,
 * und die geplanten Reisen brauchen ein Vielfaches davon. Diese Ansicht
 * rechnet das vor und zeigt, wo die acht Tage am meisten bringen.
 */

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Info, Plane, Star, TriangleAlert } from "lucide-react";
import { HOLIDAYS, URLAUBSBUDGET } from "@/data/holidays";
import { eventsByIso } from "@/lib/events";
import {
  ARBEIT_START_ISO,
  ENDE_ISO,
  START_ISO,
  besterUrlaubsplan,
  gesamtkosten,
  iso,
  istFrei,
  kostenJeTrip,
  laengsterBlock,
  parseIso,
  tageZwischen,
  type Block,
} from "@/lib/vacation";
import type { Trip } from "@/lib/types";

const WOCHENTAGE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONATE = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

function kurz(isoStr: string): string {
  const d = parseIso(isoStr);
  return `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.`;
}

type Strategie = "summe" | "block";

export default function VacationCalendar({ trips }: { trips: Trip[] }) {
  const [strategie, setStrategie] = useState<Strategie>("summe");

  const planSumme = useMemo(() => besterUrlaubsplan(URLAUBSBUDGET), []);
  const blockBest = useMemo(() => laengsterBlock(URLAUBSBUDGET), []);
  const tripKosten = useMemo(() => kostenJeTrip(trips), [trips]);
  const bedarf = useMemo(() => gesamtkosten(trips), [trips]);

  // Welche Blöcke gerade angezeigt werden, hängt an der gewählten Strategie.
  const bloecke: Block[] = useMemo(
    () => (strategie === "summe" ? planSumme.bloecke : blockBest ? [blockBest] : []),
    [strategie, planSumme, blockBest],
  );

  const urlaubsTage = useMemo(
    () => new Set(bloecke.flatMap((b) => b.urlaubstage)),
    [bloecke],
  );
  const blockTage = useMemo(() => {
    const s = new Set<string>();
    for (const b of bloecke)
      for (const d of tageZwischen(b.vonIso, b.bisIso)) s.add(iso(d));
    return s;
  }, [bloecke]);

  const feiertagByIso = useMemo(() => new Map(HOLIDAYS.map((h) => [h.date, h])), []);

  // Trips je Tag, damit der Kalender die Farbbalken zeichnen kann.
  const tripsByIso = useMemo(() => {
    const m = new Map<string, Trip[]>();
    for (const t of trips) {
      if (!t.startDate || !t.endDate) continue;
      const tage = tageZwischen(t.startDate, t.endDate);
      if (tage.length > 60) continue; // Daueretiketten würden jeden Tag einfärben
      for (const d of tage) {
        const k = iso(d);
        m.set(k, [...(m.get(k) ?? []), t]);
      }
    }
    return m;
  }, [trips]);

  // Feste Termine je Tag. Sie stehen im selben Raster wie die Trips, aber
  // mit Ring statt Balken: ein Rennwochenende ist kein Reisevorschlag.
  const eventByIso = useMemo(() => eventsByIso(), []);

  const alleTage = useMemo(() => tageZwischen(START_ISO, ENDE_ISO), []);

  // Nach Monat gruppieren, jeder Monat startet montags im Raster.
  const monate = useMemo(() => {
    const out: { key: string; label: string; zellen: (Date | null)[] }[] = [];
    for (const d of alleTage) {
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
      let m = out.find((x) => x.key === key);
      if (!m) {
        m = {
          key,
          label: `${MONATE[d.getUTCMonth()]} ${d.getUTCFullYear()}`,
          zellen: [],
        };
        // Montag = 0 im Raster. Der Versatz zählt ab dem ersten Tag, den der
        // Monat hier tatsächlich hat, nicht ab dem Monatsersten: September
        // beginnt erst mit der Landung, und ab dem 1. gerechnet stünde die
        // ganze Zeile eine Spalte zu weit rechts.
        const offset = (d.getUTCDay() + 6) % 7;
        m.zellen = Array(offset).fill(null);
        out.push(m);
      }
      m.zellen.push(d);
    }
    return out;
  }, [alleTage]);

  // Die Tage zwischen Landung und erstem Arbeitstag. Sie kosten nichts, weil
  // noch kein Arbeitsverhältnis läuft, aus dem man Urlaub nehmen müsste.
  const vorlauf = useMemo(
    () => tageZwischen(START_ISO, ARBEIT_START_ISO).slice(0, -1),
    [],
  );
  const vorlaufSet = useMemo(() => new Set(vorlauf.map(iso)), [vorlauf]);

  const gezeigteFreieTage =
    strategie === "summe" ? planSumme.freieTage : (blockBest?.laenge ?? 0);
  const gezeigteKosten =
    strategie === "summe" ? planSumme.verbraucht : (blockBest?.kosten ?? 0);

  return (
    <div className="flex flex-col gap-5">
      {/* ── Budget gegen Bedarf ─────────────────────────────────────── */}
      <section className="card flex flex-col gap-4 rounded-3xl p-5 sm:p-6">
        <div>
          <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
            Urlaubsbudget
          </p>
          <h2 className="font-display text-2xl">Acht Tage für sechs Monate</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border)] bg-white/60 p-4">
            <p className="text-xs text-[var(--text-dim)]">Wir haben</p>
            <p className="font-display text-3xl">{URLAUBSBUDGET}</p>
            <p className="text-xs text-[var(--text-muted)]">Urlaubstage</p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-white/60 p-4">
            <p className="text-xs text-[var(--text-dim)]">Geplante Reisen brauchen</p>
            <p className="font-display text-3xl" style={{ color: "var(--terra)" }}>
              {bedarf}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              über {tripKosten.filter((k) => !k.laufend).length} Trips
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-white/60 p-4">
            <p className="text-xs text-[var(--text-dim)]">Fehlen</p>
            <p className="font-display text-3xl" style={{ color: "var(--terra)" }}>
              {Math.max(0, bedarf - URLAUBSBUDGET)}
            </p>
            <p className="text-xs text-[var(--text-muted)]">Tage</p>
          </div>
        </div>

        {bedarf > URLAUBSBUDGET && (
          <div className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-white/60 p-4">
            <TriangleAlert
              size={16}
              className="mt-0.5 shrink-0"
              style={{ color: "var(--terra)" }}
            />
            <p className="text-sm text-[var(--text-muted)]">
              So wie die Trips datiert sind, geht die Rechnung nicht auf. Entweder
              rücken Reisen auf die Blöcke unten, oder sie schrumpfen auf ein
              Wochenende, oder sie fallen weg. Ein Wochenendtrip von Freitagabend bis
              Sonntagabend kostet null Urlaubstage: davon sind beliebig viele drin.
            </p>
          </div>
        )}
      </section>

      {/* ── Der Vorlauf vor dem ersten Arbeitstag ───────────────────── */}
      <section className="card flex flex-col gap-3 rounded-3xl p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Plane size={16} className="text-[var(--text-dim)]" />
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
              Vor dem ersten Arbeitstag
            </p>
            <h2 className="font-display text-2xl">
              {vorlauf.length} Tage, die nichts kosten
            </h2>
          </div>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          Wir landen am {kurz(START_ISO)} und fangen erst am {kurz(ARBEIT_START_ISO)}{" "}
          an. Dazwischen liegen {vorlauf.length} Tage ohne Arbeitsverhältnis, aus dem
          man Urlaub nehmen müsste. Das ist das längste freie Fenster des ganzen
          Aufenthalts und es geht nicht vom Budget ab.
        </p>
        <p className="text-sm text-[var(--text-muted)]">
          Realistisch braucht ein Teil davon Wohnung, Bank, SSN und der kalifornische
          Führerschein. Was übrig bleibt, ist trotzdem mehr zusammenhängende Zeit als
          jeder Urlaubsblock danach.
        </p>
      </section>

      {/* ── Der Vorschlag ───────────────────────────────────────────── */}
      <section className="card flex flex-col gap-4 rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
              Bester Einsatz
            </p>
            <h2 className="font-display text-2xl">
              {gezeigteFreieTage} freie Tage aus {gezeigteKosten}
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {strategie === "summe"
                ? "Drei Blöcke, zusammen die meiste freie Zeit."
                : "Ein Block, so lang wie das Budget ihn hergibt."}
            </p>
          </div>
          <div className="flex gap-1 rounded-full border border-[var(--border)] p-1">
            {(
              [
                ["summe", "Meiste Zeit"],
                ["block", "Längster Block"],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setStrategie(k)}
                className="rounded-full px-3 py-1.5 text-xs transition"
                style={{
                  background: strategie === k ? "var(--sky)" : "transparent",
                  color: strategie === k ? "var(--surface-solid)" : "var(--text-muted)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ul className="flex flex-col gap-2">
          {bloecke.map((b) => (
            <motion.li
              key={b.vonIso}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-[var(--border)] bg-white/60 p-4"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-lg">
                  {kurz(b.vonIso)} bis {kurz(b.bisIso)}
                </span>
                <span className="text-sm text-[var(--text-muted)]">
                  {b.laenge} Tage am Stück für {b.kosten} Urlaubstag
                  {b.kosten === 1 ? "" : "e"}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {b.urlaubstage.map((u) => (
                  <span
                    key={u}
                    className="rounded-full px-2 py-0.5 text-[11px]"
                    style={{
                      background: "color-mix(in srgb, var(--terra) 14%, transparent)",
                      color: "var(--terra)",
                    }}
                  >
                    Urlaub {kurz(u)}
                  </span>
                ))}
                {b.feiertage.map((f) => (
                  <span
                    key={f.date}
                    className="rounded-full px-2 py-0.5 text-[11px]"
                    style={{
                      background: "color-mix(in srgb, var(--teal) 14%, transparent)",
                      color: "var(--teal)",
                    }}
                  >
                    {f.name}
                  </span>
                ))}
              </div>
            </motion.li>
          ))}
        </ul>

        <div className="flex items-start gap-3 text-xs text-[var(--text-dim)]">
          <Info size={14} className="mt-0.5 shrink-0" />
          <p>
            Gerechnet gegen die Feiertagsliste in <code>data/holidays.ts</code>. Ob BMW
            Columbus Day, Heiligabend und Silvester wirklich freigibt, ist noch nicht
            bestätigt. Fällt einer weg, ändert sich der Vorschlag.
          </p>
        </div>
      </section>

      {/* ── Was die Trips kosten ────────────────────────────────────── */}
      <section className="card flex flex-col gap-3 rounded-3xl p-5 sm:p-6">
        <div>
          <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
            Preisschild je Trip
          </p>
          <h2 className="font-display text-2xl">Was jede Reise kostet</h2>
        </div>
        <ul className="flex flex-col gap-1.5">
          {tripKosten.map(({ trip, tage, kosten, laufend }) => (
            <li
              key={trip.id}
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-white/60 px-3 py-2"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: trip.color }}
              />
              <span className="min-w-0 flex-1 truncate text-sm">{trip.name}</span>
              <span className="shrink-0 text-xs text-[var(--text-dim)]">
                {tage} Tage
              </span>
              <span
                className="w-20 shrink-0 text-right text-sm"
                style={{
                  color: laufend
                    ? "var(--text-dim)"
                    : kosten === 0
                      ? "var(--teal)"
                      : "var(--terra)",
                }}
              >
                {laufend ? "laufend" : kosten === 0 ? "gratis" : `${kosten} Urlaub`}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Der Kalender ────────────────────────────────────────────── */}
      <section className="card flex flex-col gap-4 rounded-3xl p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[var(--text-dim)]" />
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
              Sechs Monate am Stück
            </p>
            <h2 className="font-display text-2xl">Der ganze Aufenthalt</h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-[var(--text-muted)]">
          {[
            ["Urlaubstag", "var(--terra)"],
            ["Feiertag", "var(--teal)"],
            ["Wochenende", "var(--sky)"],
            ["vor Arbeitsbeginn", "var(--sage)"],
          ].map(([label, color]) => (
            <span key={label} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: color as string }}
              />
              {label}
            </span>
          ))}
          <span className="flex items-center gap-1.5">
            <Plane size={11} />
            Balken unten = Trip
          </span>
          <span className="flex items-center gap-1.5">
            <Star size={11} />
            Rahmen und Stern = fester Termin
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {monate.map((m) => (
            <div key={m.key}>
              <p className="mb-2 text-sm font-medium">{m.label}</p>
              <div className="grid grid-cols-7 gap-1">
                {WOCHENTAGE.map((w) => (
                  <span
                    key={w}
                    className="text-center text-[10px] text-[var(--text-dim)]"
                  >
                    {w}
                  </span>
                ))}
                {m.zellen.map((d, i) => {
                  if (!d) return <span key={`leer-${i}`} />;
                  const k = iso(d);
                  const feiertag = feiertagByIso.get(k);
                  const istUrlaub = urlaubsTage.has(k);
                  const imBlock = blockTage.has(k);
                  const tagTrips = tripsByIso.get(k) ?? [];
                  const tagEvents = eventByIso.get(k) ?? [];
                  const wochenende = d.getUTCDay() === 0 || d.getUTCDay() === 6;

                  const vorArbeit = vorlaufSet.has(k);
                  const bg = vorArbeit
                    ? "color-mix(in srgb, var(--sage) 18%, transparent)"
                    : istUrlaub
                      ? "color-mix(in srgb, var(--terra) 22%, transparent)"
                      : feiertag
                        ? "color-mix(in srgb, var(--teal) 20%, transparent)"
                        : wochenende
                          ? "color-mix(in srgb, var(--sky) 10%, transparent)"
                          : "transparent";

                  return (
                    <span
                      key={k}
                      title={`${k}${feiertag ? " · " + feiertag.name : ""}${
                        tagEvents.length
                          ? " · " + tagEvents.map((e) => e.title).join(", ")
                          : ""
                      }${
                        tagTrips.length
                          ? " · " + tagTrips.map((t) => t.name).join(", ")
                          : ""
                      }`}
                      className="relative grid aspect-square place-items-center rounded-md text-[11px]"
                      style={{
                        background: bg,
                        outline: tagEvents.length
                          ? `2px solid ${tagEvents[0].color}`
                          : imBlock
                            ? "1px solid var(--terra)"
                            : undefined,
                        color: istFrei(d) ? "var(--text)" : "var(--text-muted)",
                      }}
                    >
                      {d.getUTCDate()}
                      {tagEvents.length > 0 && (
                        <Star
                          size={7}
                          className="absolute top-0.5 right-0.5"
                          style={{ color: tagEvents[0].color }}
                          fill={tagEvents[0].color}
                        />
                      )}
                      {tagTrips.length > 0 && (
                        <span className="absolute right-0.5 bottom-0.5 left-0.5 flex gap-px">
                          {tagTrips.slice(0, 3).map((t) => (
                            <span
                              key={t.id}
                              className="h-0.5 flex-1 rounded-full"
                              style={{ background: t.color }}
                            />
                          ))}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
