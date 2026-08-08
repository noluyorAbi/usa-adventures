"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Backpack,
  Car,
  Check,
  ChevronDown,
  Fuel,
  Package,
  Route,
  Scale,
  Snowflake,
  Thermometer,
} from "lucide-react";
import { carNotesForTrip, packingForTrip } from "@/lib/packing";
import type { CarNoteKind, Place, Trip } from "@/lib/types";

/** Ein Icon je Art von Auto-Hinweis, damit man die Sorte auf einen Blick sieht. */
const CAR_ICON: Record<CarNoteKind, typeof Car> = {
  road: Route,
  fuel: Fuel,
  winter: Snowflake,
  space: Package,
  heat: Thermometer,
  law: Scale,
};

const CAR_LABEL: Record<CarNoteKind, string> = {
  road: "Strasse",
  fuel: "Sprit",
  winter: "Winter",
  space: "Platz",
  heat: "Hitze",
  law: "Regeln",
};

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
  const carNotes = useMemo(() => carNotesForTrip(trip), [trip]);
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
            Basis, Spot-Kategorien und was nur dieser Trip verlangt · {done}/
            {items.length} abgehakt
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

      {carNotes.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-4">
          <div className="flex items-center gap-2">
            <Car size={16} className="text-[var(--text-dim)]" />
            <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
              Was der 330i vorgibt
            </p>
          </div>
          <ul className="flex flex-col gap-2">
            {carNotes.map((note, i) => {
              const Icon = CAR_ICON[note.kind];
              return (
                <motion.li
                  key={`${note.kind}-${i}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                  className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-white/60 px-3 py-2.5"
                >
                  <span
                    className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg"
                    style={{
                      background: "color-mix(in srgb, var(--sky) 12%, transparent)",
                      color: "var(--sky)",
                    }}
                  >
                    <Icon size={13} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] tracking-wide text-[var(--text-dim)] uppercase">
                      {CAR_LABEL[note.kind]}
                    </span>
                    <span className="block text-sm text-[var(--text-muted)]">
                      {note.text}
                    </span>
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
