"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { differenceInCalendarDays, format } from "date-fns";
import { de } from "date-fns/locale";
import { ARRIVAL, DEPARTURE } from "@/lib/config";
import type { Trip } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Visueller 6-Monats-Bogen: alle datierten Trips als farbige Segmente
 * auf einer horizontalen Journey-Timeline.
 */
export default function RotationArc({ trips }: { trips: Trip[] }) {
  const total = Math.max(1, differenceInCalendarDays(DEPARTURE, ARRIVAL));
  const now = new Date();
  const dayIndex = Math.min(total, Math.max(0, differenceInCalendarDays(now, ARRIVAL)));
  const progress = (dayIndex / total) * 100;

  const blocks = useMemo(() => {
    return trips
      .filter((t) => t.startDate && t.endDate)
      .map((t) => {
        const start = new Date(t.startDate!);
        const end = new Date(t.endDate!);
        const left = Math.max(
          0,
          (differenceInCalendarDays(start, ARRIVAL) / total) * 100,
        );
        const right = Math.min(
          100,
          (differenceInCalendarDays(end, ARRIVAL) / total) * 100,
        );
        const width = Math.max(1.2, right - left);
        return { trip: t, left, width };
      })
      .sort((a, b) => a.left - b.left);
  }, [trips, total]);

  const months = useMemo(() => {
    const out: { label: string; left: number }[] = [];
    const cursor = new Date(ARRIVAL.getFullYear(), ARRIVAL.getMonth(), 1);
    for (let i = 0; i < 8; i++) {
      const d = new Date(cursor.getFullYear(), cursor.getMonth() + i, 1);
      if (d > DEPARTURE) break;
      const left = (differenceInCalendarDays(d, ARRIVAL) / total) * 100;
      if (left >= -5 && left <= 100) {
        out.push({
          label: format(d, "MMM", { locale: de }),
          left: Math.max(0, left),
        });
      }
    }
    return out;
  }, [total]);

  return (
    <section className="card relative overflow-hidden rounded-3xl p-5 sm:p-6">
      <div className="pointer-events-none absolute -top-12 right-0 h-40 w-40 rounded-full bg-[var(--sky)] opacity-15 blur-3xl" />
      <div className="relative flex flex-col gap-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
              Rotations-Bogen
            </p>
            <h2 className="font-display text-2xl">Sechs Monate als Linie</h2>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            {format(ARRIVAL, "d. MMM yyyy", { locale: de })}
            {" · "}
            {format(DEPARTURE, "d. MMM yyyy", { locale: de })}
          </p>
        </div>

        {/* month ticks */}
        <div className="relative h-5 text-[10px] tracking-wide text-[var(--text-dim)] uppercase">
          {months.map((m) => (
            <span
              key={m.label + m.left}
              className="absolute -translate-x-1/2"
              style={{ left: `${m.left}%` }}
            >
              {m.label}
            </span>
          ))}
        </div>

        {/* track */}
        <div className="relative h-14 rounded-2xl bg-black/[0.04] p-2">
          <div className="relative h-full overflow-hidden rounded-xl">
            {blocks.map(({ trip, left, width }, i) => (
              <motion.div
                key={trip.id}
                title={`${trip.name} · ${trip.region}`}
                initial={{ opacity: 0, scaleX: 0.6 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.45, ease: EASE, delay: i * 0.04 }}
                className="absolute top-0 bottom-0 overflow-hidden rounded-lg"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  background: trip.color,
                  transformOrigin: "left center",
                }}
              >
                <span className="absolute inset-0 flex items-center truncate px-1.5 text-[10px] font-medium text-white/95">
                  {width > 6 ? trip.name : ""}
                </span>
              </motion.div>
            ))}

            {/* today marker */}
            {dayIndex > 0 && dayIndex < total && (
              <motion.div
                className="absolute top-[-4px] bottom-[-4px] w-0.5 bg-[var(--text)]"
                style={{ left: `${progress}%` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--text)] px-1.5 py-0.5 text-[9px] whitespace-nowrap text-white">
                  heute
                </span>
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {blocks.slice(0, 8).map(({ trip }) => (
            <span
              key={trip.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white/70 px-2.5 py-1 text-xs"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: trip.color }}
              />
              {trip.name}
            </span>
          ))}
          {blocks.length > 8 && (
            <span className="text-xs text-[var(--text-dim)]">
              +{blocks.length - 8} weitere
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
