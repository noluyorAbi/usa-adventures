"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import type { Place, Trip } from "@/lib/types";

export default function TripChips({
  trips,
  places,
  selected,
  onSelect,
}: {
  trips: Trip[];
  places: Place[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const count = (id: string | null) =>
    id === null ? places.length : places.filter((p) => p.tripId === id).length;

  return (
    <div className="-mx-1 flex [scrollbar-width:none] gap-2 overflow-x-auto px-1 pb-1 [&::-webkit-scrollbar]:hidden">
      <Chip active={selected === null} color="#2f9be0" onClick={() => onSelect(null)}>
        <Globe size={14} strokeWidth={2.2} /> Alle
        <Count n={count(null)} active={selected === null} />
      </Chip>
      {trips.map((t) => {
        const active = selected === t.id;
        return (
          <Chip
            key={t.id}
            active={active}
            color={t.color}
            onClick={() => onSelect(active ? null : t.id)}
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: t.color }}
            />
            {t.name}
            <Count n={count(t.id)} active={active} />
          </Chip>
        );
      })}
    </div>
  );
}

function Chip({
  active,
  color,
  onClick,
  children,
}: {
  active: boolean;
  color: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm whitespace-nowrap transition"
      style={{
        borderColor: active ? color : "var(--border)",
        color: active ? "#fff" : "var(--text-muted)",
      }}
    >
      {active && (
        <motion.span
          layoutId="trip-chip-bg"
          className="absolute inset-0 rounded-full"
          style={{ background: color }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">{children}</span>
    </button>
  );
}

function Count({ n, active }: { n: number; active: boolean }) {
  return (
    <span
      className="relative z-10 rounded-full px-1.5 text-xs tabular-nums"
      style={{
        background: active ? "rgba(255,255,255,0.25)" : "rgba(28,55,90,0.08)",
        color: active ? "#fff" : "var(--text-dim)",
      }}
    >
      {n}
    </span>
  );
}
