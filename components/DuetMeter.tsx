"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { CREW } from "@/lib/config";
import { uniqueStates } from "@/lib/route";
import type { Place } from "@/lib/types";
import AnimatedNumber from "./AnimatedNumber";

/**
 * Duett-Statistik: wer hat wie viele Spots eingebracht, Love-Score, Staaten.
 */
export default function DuetMeter({ places }: { places: Place[] }) {
  const stats = useMemo(() => {
    const byPerson = CREW.map((name) => {
      const mine = places.filter((p) => p.addedBy === name);
      const loves = mine.reduce((s, p) => s + p.loves, 0);
      const visited = mine.filter((p) => p.status === "visited").length;
      return { name, count: mine.length, loves, visited };
    });
    const crew = places.filter((p) => p.addedBy === "Crew").length;
    const states = uniqueStates(places);
    const totalLoves = places.reduce((s, p) => s + p.loves, 0);
    return { byPerson, crew, states, totalLoves };
  }, [places]);

  const maxCount = Math.max(1, ...stats.byPerson.map((p) => p.count));

  return (
    <section className="card flex flex-col gap-5 rounded-3xl p-5 sm:p-6">
      <div>
        <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
          Crew-Duett
        </p>
        <h2 className="font-display text-2xl">Alperen &amp; Justus</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Wer bringt welche Spots ein · {stats.states.length} Staaten/Regionen im
          Datensatz
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.byPerson.map((p, i) => (
          <div
            key={p.name}
            className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-white/70 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-xl">{p.name}</span>
              <span
                className="grid h-8 w-8 place-items-center rounded-full text-sm font-medium text-white"
                style={{
                  background: i === 0 ? "var(--sky-grad)" : "var(--sun-grad)",
                }}
              >
                {p.name[0]}
              </span>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="font-display text-3xl leading-none">
                  <AnimatedNumber value={p.count} />
                </p>
                <p className="text-xs text-[var(--text-dim)]">Spots</p>
              </div>
              <div>
                <p className="font-display text-3xl leading-none text-[var(--rose)]">
                  <AnimatedNumber value={p.loves} />
                </p>
                <p className="text-xs text-[var(--text-dim)]">Hearts</p>
              </div>
              <div>
                <p className="font-display text-3xl leading-none text-[var(--teal)]">
                  <AnimatedNumber value={p.visited} />
                </p>
                <p className="text-xs text-[var(--text-dim)]">Erlebt</p>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/[0.06]">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: i === 0 ? "var(--sky-grad)" : "var(--sun-grad)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(p.count / maxCount) * 100}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-4 text-sm text-[var(--text-muted)]">
        <span className="inline-flex items-center gap-1.5">
          <Users size={14} /> {stats.crew} gemeinsame Spots (Crew)
        </span>
        <span className="text-[var(--text-dim)]">·</span>
        <span>{stats.totalLoves} Hearts total</span>
        {stats.states.length > 0 && (
          <>
            <span className="text-[var(--text-dim)]">·</span>
            <span className="flex flex-wrap gap-1">
              {stats.states.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-black/[0.05] px-1.5 py-0.5 font-mono text-xs"
                >
                  {s}
                </span>
              ))}
            </span>
          </>
        )}
      </div>
    </section>
  );
}
