"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Backpack, Check, ChevronDown } from "lucide-react";
import { packingForTrip } from "@/lib/packing";
import type { Place, Trip } from "@/lib/types";

/**
 * Regelbasierte Packliste je Trip (oder gesamter Wishlist).
 */
export default function PackingPanel({
  trips,
  places,
}: {
  trips: Trip[];
  places: Place[];
}) {
  const [tripId, setTripId] = useState<string | "all">("all");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const trip = tripId === "all" ? null : (trips.find((t) => t.id === tripId) ?? null);
  const items = useMemo(() => packingForTrip(trip, places), [trip, places]);
  const done = items.filter((i) => checked[i.id]).length;

  return (
    <section className="card flex flex-col gap-4 rounded-3xl p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
            Packliste
          </p>
          <h2 className="font-display text-2xl">Was mitnehmen?</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Generiert aus Kategorien der Spots · {done}/{items.length} abgehakt
          </p>
        </div>
        <div className="relative">
          <select
            value={tripId}
            onChange={(e) => setTripId(e.target.value)}
            className="appearance-none rounded-full border border-[var(--border)] bg-white/80 py-2 pr-9 pl-4 text-sm outline-none"
          >
            <option value="all">Alle Spots</option>
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text-dim)]"
          />
        </div>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "var(--sky-grad)" }}
          animate={{ width: `${items.length ? (done / items.length) * 100 : 0}%` }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <ul className="flex flex-col gap-2">
        {items.map((item, i) => {
          const on = !!checked[item.id];
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02, duration: 0.25 }}
            >
              <button
                onClick={() => setChecked((c) => ({ ...c, [item.id]: !c[item.id] }))}
                className="flex w-full items-start gap-3 rounded-2xl border border-[var(--border)] bg-white/60 px-3 py-2.5 text-left transition hover:border-[var(--sky)]"
              >
                <span
                  className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border"
                  style={{
                    borderColor: on ? "var(--teal)" : "var(--border-strong)",
                    background: on ? "var(--teal)" : "transparent",
                    color: "#fff",
                  }}
                >
                  {on && <Check size={12} strokeWidth={3} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-sm font-medium ${on ? "text-[var(--text-dim)] line-through" : ""}`}
                  >
                    {item.label}
                  </span>
                  <span className="text-xs text-[var(--text-dim)]">{item.why}</span>
                </span>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[10px] tracking-wide uppercase"
                  style={{
                    background:
                      item.priority === "must"
                        ? "color-mix(in srgb, var(--terra) 14%, transparent)"
                        : "color-mix(in srgb, var(--sky) 12%, transparent)",
                    color: item.priority === "must" ? "var(--terra)" : "var(--sky)",
                  }}
                >
                  {item.priority === "must" ? "Muss" : "Nice"}
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>

      {items.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-sm text-[var(--text-dim)]">
          <Backpack size={22} />
          Keine Items — Trip hat noch keine Spots.
        </div>
      )}
    </section>
  );
}
