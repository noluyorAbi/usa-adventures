"use client";

import { differenceInCalendarDays } from "date-fns";
import { motion } from "framer-motion";
import AnimatedNumber from "./AnimatedNumber";
import { ARRIVAL, DEPARTURE } from "@/lib/config";
import type { Place } from "@/lib/types";

function useCountdown() {
  const now = new Date();
  const total = differenceInCalendarDays(DEPARTURE, ARRIVAL);
  const sinceStart = differenceInCalendarDays(now, ARRIVAL);
  const toStart = differenceInCalendarDays(ARRIVAL, now);

  if (toStart > 0)
    return { phase: "before" as const, headline: toStart, total, day: 0 };
  if (sinceStart >= total)
    return { phase: "after" as const, headline: total, total, day: total };
  return {
    phase: "during" as const,
    headline: total - sinceStart,
    total,
    day: sinceStart + 1,
  };
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="font-display text-3xl leading-none sm:text-4xl"
        style={{ color }}
      >
        <AnimatedNumber value={value} />
      </span>
      <span className="text-xs tracking-wider text-[var(--text-dim)] uppercase">
        {label}
      </span>
    </div>
  );
}

export default function Dashboard({ places }: { places: Place[] }) {
  const c = useCountdown();
  const visited = places.filter((p) => p.status === "visited").length;
  const planned = places.filter((p) => p.status === "planned").length;
  const wishlist = places.filter((p) => p.status === "wishlist").length;
  const progress = Math.min(100, Math.max(0, (c.day / c.total) * 100));

  const line =
    c.phase === "before"
      ? "Tage bis USA"
      : c.phase === "after"
        ? "Tage erlebt · wieder daheim"
        : `Tage übrig · Tag ${c.day} von ${c.total}`;

  return (
    <section className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
      <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[var(--terra)] opacity-20 blur-3xl" />
      <div className="relative flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-xs tracking-[0.25em] text-[var(--text-dim)] uppercase">
            Alperen &amp; Justus · Basis Oxnard, CA
          </p>
          <h1 className="font-display text-4xl leading-[1.05] sm:text-6xl">
            Sechs Monate <span className="text-gradient">USA</span>
          </h1>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-end gap-2">
            <span className="font-display text-gradient text-5xl leading-none sm:text-6xl">
              <AnimatedNumber value={c.headline} />
            </span>
            <span className="mb-1 text-sm text-[var(--text-muted)]">{line}</span>
          </div>
          {c.phase !== "before" && (
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "var(--sunset)" }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-8 border-t border-[var(--border)] pt-5">
          <Stat label="Erlebt" value={visited} color="var(--teal)" />
          <Stat label="Geplant" value={planned} color="var(--amber)" />
          <Stat label="Wishlist" value={wishlist} color="var(--text)" />
          <Stat label="Spots total" value={places.length} color="var(--indigo)" />
        </div>
      </div>
    </section>
  );
}
