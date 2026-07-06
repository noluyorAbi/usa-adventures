"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/config";
import type { Place, Trip } from "@/lib/types";

function fmt(d?: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

export default function TripsTab({
  trips,
  places,
  onOpen,
}: {
  trips: Trip[];
  places: Place[];
  onOpen: (tripId: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((t, i) => {
        const spots = places.filter((p) => p.tripId === t.id);
        const visited = spots.filter((p) => p.status === "visited").length;
        const pct = spots.length ? Math.round((visited / spots.length) * 100) : 0;
        const start = fmt(t.startDate);
        const end = fmt(t.endDate);
        return (
          <motion.button
            key={t.id}
            onClick={() => onOpen(t.id)}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
            whileHover={{ y: -3 }}
            className="card group relative overflow-hidden rounded-3xl p-5 text-left"
          >
            <span
              className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full opacity-20 blur-2xl"
              style={{ background: t.color }}
            />
            <div className="relative flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <span
                  className="h-3 w-3 rounded-full ring-4"
                  style={{
                    background: t.color,
                    boxShadow: `0 0 0 4px color-mix(in srgb, ${t.color} 18%, transparent)`,
                  }}
                />
                <ArrowRight
                  size={18}
                  className="text-[var(--text-dim)] transition group-hover:translate-x-1 group-hover:text-[var(--text)]"
                />
              </div>

              <div>
                <h3 className="font-display text-2xl leading-tight">{t.name}</h3>
                <p className="mt-0.5 text-sm text-[var(--text-muted)]">{t.region}</p>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-dim)]">
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {spots.length} Spots
                </span>
                {(start || end) && (
                  <span className="flex items-center gap-1">
                    <CalendarDays size={12} /> {start ?? "?"}
                    {end ? ` – ${end}` : ""}
                  </span>
                )}
              </div>

              {/* mini icon row */}
              <div className="flex flex-wrap gap-1.5">
                {spots.slice(0, 6).map((s) => {
                  const Icon = CATEGORIES[s.category].Icon;
                  return (
                    <span
                      key={s.id}
                      className="grid h-6 w-6 place-items-center rounded-md"
                      style={{
                        background: `color-mix(in srgb, ${CATEGORIES[s.category].color} 15%, transparent)`,
                        color: CATEGORIES[s.category].color,
                      }}
                    >
                      <Icon size={13} strokeWidth={2.2} />
                    </span>
                  );
                })}
                {spots.length > 6 && (
                  <span className="grid h-6 place-items-center rounded-md bg-black/[0.04] px-1.5 text-xs text-[var(--text-dim)]">
                    +{spots.length - 6}
                  </span>
                )}
              </div>

              <div className="mt-1 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: t.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <span className="text-xs text-[var(--text-dim)] tabular-nums">
                  {pct}%
                </span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
