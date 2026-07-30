"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Leaf, Snowflake, Sun, CloudSun } from "lucide-react";
import type { Trip } from "@/lib/types";

const MONTHS = [
  { key: "Sep", Icon: Leaf, tip: "Ankommen, Basecamp setzen", hue: "#eaa41f" },
  { key: "Okt", Icon: Leaf, tip: "PCH & Parks im goldenen Licht", hue: "#f2683f" },
  { key: "Nov", Icon: Leaf, tip: "Canyons + Thanksgiving East", hue: "#c45c26" },
  { key: "Dez", Icon: Snowflake, tip: "Hawaii oder Baja mild", hue: "#2f9be0" },
  { key: "Jan", Icon: Snowflake, tip: "Ski Tahoe / Mammoth", hue: "#5b8def" },
  { key: "Feb", Icon: CloudSun, tip: "Desert bloom & Texas", hue: "#8b5cf6" },
  { key: "Mär", Icon: Sun, tip: "Abschiedstouren SoCal", hue: "#0fa3c4" },
] as const;

function monthIndex(iso?: string | null): number | null {
  if (!iso) return null;
  const m = new Date(iso).getMonth(); // 0-11
  // map Sep(8)..Mar(2) into ribbon 0..6
  if (m >= 8) return m - 8;
  if (m <= 2) return m + 4;
  return null;
}

/**
 * Horizontale Saison-Leiste Sept–März mit Trip-Pills pro Monat.
 */
export default function SeasonRibbon({ trips }: { trips: Trip[] }) {
  const byMonth = useMemo(() => {
    return MONTHS.map((m, i) => {
      const list = trips.filter((t) => {
        const a = monthIndex(t.startDate);
        const b = monthIndex(t.endDate);
        if (a === null && b === null) return false;
        if (a !== null && b !== null) return i >= a && i <= b;
        return a === i || b === i;
      });
      return { ...m, trips: list };
    });
  }, [trips]);

  return (
    <section className="card flex flex-col gap-4 rounded-3xl p-5 sm:p-6">
      <div>
        <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
          Saison-Band
        </p>
        <h2 className="font-display text-2xl">Von September bis März</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Welche Monate rufen welche Trips
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {byMonth.map((m, i) => (
          <motion.div
            key={m.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="min-w-[7.5rem] flex-1 rounded-2xl border border-[var(--border)] bg-white/70 p-3"
          >
            <div className="mb-2 flex items-center gap-1.5">
              <span
                className="grid h-7 w-7 place-items-center rounded-lg text-white"
                style={{ background: m.hue }}
              >
                <m.Icon size={14} />
              </span>
              <span className="text-sm font-medium">{m.key}</span>
            </div>
            <p className="mb-2 text-[11px] leading-snug text-[var(--text-dim)]">
              {m.tip}
            </p>
            <div className="flex flex-col gap-1">
              {m.trips.slice(0, 3).map((t) => (
                <span
                  key={t.id}
                  className="truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium text-white"
                  style={{ background: t.color }}
                >
                  {t.name}
                </span>
              ))}
              {m.trips.length === 0 && (
                <span className="text-[10px] text-[var(--text-dim)]">offen</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
