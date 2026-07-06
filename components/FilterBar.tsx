"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES, STATUSES } from "@/lib/config";
import { filterCount, type Filters } from "@/lib/filter";
import type { Category, Status } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export default function FilterBar({
  filters,
  setFilters,
  people,
  resultCount,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  people: string[];
  resultCount: number;
}) {
  const [open, setOpen] = useState(false);
  const active = filterCount(filters);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--text-dim)]"
          />
          <input
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            placeholder="Spot suchen…"
            className="w-full rounded-full border border-[var(--border)] bg-white/70 py-2.5 pr-9 pl-9 text-sm backdrop-blur outline-none focus:border-[var(--sky)]"
          />
          {filters.q && (
            <button
              onClick={() => setFilters({ ...filters, q: "" })}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text-dim)] hover:text-[var(--text)]"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="relative flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/70 px-4 py-2.5 text-sm backdrop-blur transition hover:border-[var(--sky)]"
          style={open ? { borderColor: "var(--sky)", color: "var(--sky)" } : undefined}
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filter</span>
          {active > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[var(--sky)] px-1 text-xs text-white">
              {active}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="card flex flex-col gap-4 rounded-2xl p-4">
              <Group label="Kategorie">
                {(Object.keys(CATEGORIES) as Category[]).map((c) => {
                  const on = filters.cats.includes(c);
                  const Icon = CATEGORIES[c].Icon;
                  return (
                    <Chip
                      key={c}
                      on={on}
                      color={CATEGORIES[c].color}
                      onClick={() =>
                        setFilters({ ...filters, cats: toggle(filters.cats, c) })
                      }
                    >
                      <Icon size={13} strokeWidth={2.2} /> {CATEGORIES[c].label}
                    </Chip>
                  );
                })}
              </Group>

              <Group label="Status">
                {(Object.keys(STATUSES) as Status[]).map((s) => (
                  <Chip
                    key={s}
                    on={filters.statuses.includes(s)}
                    color={STATUSES[s].color}
                    onClick={() =>
                      setFilters({ ...filters, statuses: toggle(filters.statuses, s) })
                    }
                  >
                    {STATUSES[s].label}
                  </Chip>
                ))}
              </Group>

              <Group label="Von wem">
                {people.map((p) => (
                  <Chip
                    key={p}
                    on={filters.person === p}
                    color="#6a68d4"
                    onClick={() =>
                      setFilters({
                        ...filters,
                        person: filters.person === p ? null : p,
                      })
                    }
                  >
                    {p}
                  </Chip>
                ))}
              </Group>

              <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-sm">
                <span className="text-[var(--text-muted)]">{resultCount} Spots</span>
                {active > 0 && (
                  <button
                    onClick={() =>
                      setFilters({
                        ...filters,
                        q: "",
                        cats: [],
                        statuses: [],
                        person: null,
                      })
                    }
                    className="text-[var(--sky)] hover:underline"
                  >
                    Zurücksetzen
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs tracking-wider text-[var(--text-dim)] uppercase">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  on,
  color,
  onClick,
  children,
}: {
  on: boolean;
  color: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition"
      style={{
        borderColor: on ? color : "var(--border)",
        background: on
          ? `color-mix(in srgb, ${color} 14%, transparent)`
          : "transparent",
        color: on ? color : "var(--text-muted)",
      }}
    >
      {children}
    </button>
  );
}
