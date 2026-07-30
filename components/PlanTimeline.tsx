"use client";

import { motion } from "framer-motion";
import { CalendarDays, CalendarOff, MapPin } from "lucide-react";
import { CATEGORIES } from "@/lib/config";
import {
  dayDiff,
  groupByMonth,
  parsePlanDate,
  relativeLabel,
  undatedPlanned,
} from "@/lib/plan";
import type { Place, Trip } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Kalender-Spur: alle datierten Spots chronologisch, nach Monat gebündelt.
 * Vergangenes bleibt sichtbar, aber zurückgenommen. Am Ende die geplanten Spots
 * ohne Datum, damit sie nicht still aus der Planung fallen.
 */
export default function PlanTimeline({
  places,
  trips,
  onFocus,
}: {
  places: Place[];
  trips: Trip[];
  onFocus: (id: string) => void;
}) {
  const groups = groupByMonth(places);
  const undated = undatedPlanned(places);

  if (!groups.length && !undated.length) return null;

  const tripOf = (p: Place) => trips.find((t) => t.id === p.tripId);
  let row = 0;

  return (
    <section className="card flex flex-col gap-5 rounded-3xl p-5 sm:p-6">
      <div>
        <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
          Kalender-Spur
        </p>
        <h2 className="font-display text-xl">Geplante Termine</h2>
      </div>

      {groups.map((group) => (
        <div key={group.key} className="flex flex-col gap-1">
          <p className="px-1 text-xs font-medium tracking-wide text-[var(--text-muted)]">
            {group.label}
          </p>
          <div className="relative flex flex-col pl-2">
            <div className="absolute top-3 bottom-3 left-[19px] w-px bg-[var(--border-strong)]" />
            {group.items.map((p) => {
              const Icon = CATEGORIES[p.category].Icon;
              const trip = tripOf(p);
              const days = dayDiff(p.plannedDate!);
              const past = days < 0;
              const date = parsePlanDate(p.plannedDate!).toLocaleDateString("de-DE", {
                weekday: "short",
                day: "2-digit",
                month: "short",
              });
              const delay = Math.min(row++ * 0.04, 0.4);

              return (
                <motion.button
                  key={p.id}
                  onClick={() => onFocus(p.id)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: past ? 0.55 : 1, x: 0 }}
                  transition={{ delay, duration: 0.3, ease: EASE }}
                  className="relative flex items-start gap-3 py-2 text-left"
                >
                  <span
                    className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-white text-white shadow-sm"
                    style={{
                      background: past
                        ? "var(--text-dim)"
                        : CATEGORIES[p.category].color,
                    }}
                  >
                    <Icon size={15} />
                  </span>
                  <span className="min-w-0 flex-1 rounded-2xl border border-[var(--border)] bg-white/70 px-3 py-2 transition hover:border-[var(--sky)]">
                    <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-[var(--text-dim)]">
                      <CalendarDays size={11} /> {date}
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[10px] tabular-nums"
                        style={{
                          background: past ? "transparent" : "var(--bg-2)",
                          color: past ? "var(--text-dim)" : "var(--text-muted)",
                        }}
                      >
                        {relativeLabel(days)}
                      </span>
                      {trip && (
                        <>
                          <span>·</span>
                          <span style={{ color: trip.color }}>{trip.name}</span>
                        </>
                      )}
                    </span>
                    <span className="block font-medium">{p.name}</span>
                    {p.note && (
                      <span className="flex items-start gap-1 text-xs text-[var(--text-muted)]">
                        <MapPin size={11} className="mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{p.note}</span>
                      </span>
                    )}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}

      {undated.length > 0 && (
        <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-[var(--border-strong)] p-3">
          <p className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <CalendarOff size={12} />
            {undated.length === 1
              ? "Ein geplanter Spot hat noch kein Datum"
              : `${undated.length} geplante Spots haben noch kein Datum`}
          </p>
          <div className="flex flex-wrap gap-2">
            {undated.map((p) => (
              <button
                key={p.id}
                onClick={() => onFocus(p.id)}
                className="rounded-full border border-[var(--border)] bg-white/70 px-3 py-1 text-xs transition hover:border-[var(--amber)]"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
