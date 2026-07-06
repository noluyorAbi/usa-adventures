"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, CalendarClock, Sparkles } from "lucide-react";
import PlaceCard from "./PlaceCard";
import { STATUSES } from "@/lib/config";
import type { Place, Status } from "@/lib/types";

const COLUMNS: { status: Status; icon: typeof Lightbulb; blurb: string }[] = [
  { status: "wishlist", icon: Lightbulb, blurb: "Ideen, die auf ihren Moment warten" },
  { status: "planned", icon: CalendarClock, blurb: "Fest im Kalender" },
  { status: "visited", icon: Sparkles, blurb: "Schon abgehakt" },
];

export default function PlanBoard({
  places,
  onLove,
  onAdvance,
  onDelete,
  onFocus,
  onAdd,
}: {
  places: Place[];
  onLove: (id: string) => void;
  onAdvance: (id: string, next: Status) => void;
  onDelete: (id: string) => void;
  onFocus: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {COLUMNS.map(({ status, icon: Icon, blurb }) => {
        const items = places
          .filter((p) => p.status === status)
          .sort((a, b) => b.loves - a.loves);
        return (
          <div key={status} className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <Icon size={16} style={{ color: STATUSES[status].color }} />
              <h3 className="font-medium">{STATUSES[status].label}</h3>
              <span className="rounded-full bg-white/8 px-2 py-0.5 text-xs text-[var(--text-muted)] tabular-nums">
                {items.length}
              </span>
            </div>
            <p className="-mt-1 px-1 text-xs text-[var(--text-dim)]">{blurb}</p>

            <div className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {items.map((p) => (
                  <PlaceCard
                    key={p.id}
                    place={p}
                    onLove={onLove}
                    onAdvance={onAdvance}
                    onDelete={onDelete}
                    onFocus={onFocus}
                  />
                ))}
              </AnimatePresence>

              {items.length === 0 && (
                <motion.button
                  onClick={onAdd}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[var(--border)] py-8 text-sm text-[var(--text-dim)] transition hover:border-[var(--terra)] hover:text-[var(--terra)]"
                >
                  <motion.span
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    <Icon size={22} />
                  </motion.span>
                  Noch leer — Spot hinzufügen
                </motion.button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
