"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarRange,
  MapPin,
  RefreshCw,
  Coffee,
  Moon,
  Sun,
  ArrowRight,
} from "lucide-react";
import { CATEGORIES } from "@/lib/config";
import { distanceFromBase, fmtFahrzeit, fmtKm, isWeekendReachable } from "@/lib/geo";
import type { Place } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

type DaySlot = { label: string; Icon: typeof Sun; place: Place };

function pick<T>(arr: T[], n: number, seed: number): T[] {
  if (!arr.length) return [];
  const copy = [...arr];
  // deterministic-ish shuffle with seed
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(
      (((seed * (i + 3) * 9301 + 49297) % 233280) / 233280) * (i + 1),
    );
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
}

/**
 * Baut aus erreichbaren Spots ein 2-Tage-Wochenend-Programm.
 */
export default function WeekendComposer({
  places,
  onOpen,
}: {
  places: Place[];
  onOpen: (id: string) => void;
}) {
  const [seed, setSeed] = useState(() => Date.now());

  const reachable = useMemo(
    () =>
      places.filter((p) => {
        if (p.category === "home") return false;
        const km = distanceFromBase(p.lat, p.lng);
        return isWeekendReachable(km) && p.status !== "visited";
      }),
    [places],
  );

  const food = reachable.filter((p) => p.category === "food" || p.category === "bar");
  const outdoor = reachable.filter((p) =>
    ["hike", "surf", "park", "activity"].includes(p.category),
  );
  const rest = reachable.filter((p) => !food.includes(p) && !outdoor.includes(p));

  const plan = useMemo(() => {
    const day1Out = pick(outdoor.length ? outdoor : reachable, 1, seed)[0];
    const day1Food = pick(
      food.filter((f) => f.id !== day1Out?.id),
      1,
      seed + 1,
    )[0];
    const day2Out = pick(
      outdoor.filter((o) => o.id !== day1Out?.id),
      1,
      seed + 2,
    )[0];
    const day2Food = pick(
      food.filter((f) => f.id !== day1Food?.id && f.id !== day2Out?.id),
      1,
      seed + 3,
    )[0];
    const evening = pick(
      rest.filter(
        (r) =>
          r.id !== day1Out?.id &&
          r.id !== day2Out?.id &&
          r.id !== day1Food?.id &&
          r.id !== day2Food?.id,
      ),
      1,
      seed + 4,
    )[0];

    const sat: DaySlot[] = [];
    const sun: DaySlot[] = [];
    if (day1Out) sat.push({ label: "Samstag · draußen", Icon: Sun, place: day1Out });
    if (day1Food) sat.push({ label: "Samstag · essen", Icon: Coffee, place: day1Food });
    if (evening) sat.push({ label: "Samstag · Abend", Icon: Moon, place: evening });
    if (day2Out) sun.push({ label: "Sonntag · draußen", Icon: Sun, place: day2Out });
    if (day2Food) sun.push({ label: "Sonntag · essen", Icon: Coffee, place: day2Food });
    return { sat, sun };
  }, [seed, outdoor, food, rest, reachable]);

  const totalStops = plan.sat.length + plan.sun.length;

  return (
    <section className="card relative overflow-hidden rounded-3xl p-5 sm:p-6">
      <div className="pointer-events-none absolute top-0 right-0 h-36 w-36 rounded-full bg-[var(--amber)] opacity-15 blur-3xl" />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
              Wochenend-Komponist
            </p>
            <h2 className="font-display text-2xl">48 Stunden ab Oxnard</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {reachable.length} Spots im 4-Stunden-Radius · {totalStops} Stops
              zusammengestellt
            </p>
          </div>
          <button
            onClick={() => setSeed(Date.now())}
            disabled={reachable.length < 2}
            className="flex shrink-0 items-center gap-2 rounded-full border border-[var(--border)] bg-white/80 px-3 py-2 text-sm transition hover:border-[var(--sky)] active:scale-[0.97] disabled:opacity-40"
          >
            <RefreshCw size={14} /> Neu mischen
          </button>
        </div>

        {totalStops === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] py-10 text-center text-sm text-[var(--text-dim)]">
            <CalendarRange className="mx-auto mb-2 text-[var(--sky)]" size={22} />
            Noch zu wenig nahe Spots. Fügt Orte im Wochenend-Radius hinzu.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                { title: "Samstag", slots: plan.sat },
                { title: "Sonntag", slots: plan.sun },
              ] as const
            ).map((day) => (
              <div key={day.title} className="flex flex-col gap-2">
                <h3 className="text-xs tracking-[0.15em] text-[var(--text-dim)] uppercase">
                  {day.title}
                </h3>
                <AnimatePresence mode="popLayout">
                  {day.slots.map((slot, i) => {
                    const CatIcon = CATEGORIES[slot.place.category].Icon;
                    const km = distanceFromBase(slot.place.lat, slot.place.lng);
                    return (
                      <motion.button
                        key={slot.place.id + seed}
                        layout
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE, delay: i * 0.05 }}
                        onClick={() => onOpen(slot.place.id)}
                        className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-white/75 p-3 text-left transition hover:-translate-y-0.5 hover:border-[var(--sky)]"
                      >
                        <span
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                          style={{
                            background: `color-mix(in srgb, ${CATEGORIES[slot.place.category].color} 18%, transparent)`,
                            color: CATEGORIES[slot.place.category].color,
                          }}
                        >
                          <CatIcon size={16} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-1 text-[11px] text-[var(--text-dim)]">
                            <slot.Icon size={11} /> {slot.label}
                          </p>
                          <p className="leading-tight font-medium">{slot.place.name}</p>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                            <MapPin size={11} />
                            {fmtKm(km)} · ~{fmtFahrzeit(km)}
                          </p>
                        </div>
                        <ArrowRight
                          size={14}
                          className="mt-1 shrink-0 text-[var(--text-dim)]"
                        />
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
