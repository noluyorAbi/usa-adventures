"use client";

import { motion } from "framer-motion";
import { Heart, Trash2, ArrowRight, MapPin, Navigation, Maximize2 } from "lucide-react";
import { CATEGORIES, STATUSES } from "@/lib/config";
import { distanceFromBase, isWeekendReachable, fmtKm } from "@/lib/geo";
import { useApp } from "@/lib/store";
import type { Place, Status } from "@/lib/types";

const NEXT: Record<Status, Status | null> = {
  wishlist: "planned",
  planned: "visited",
  visited: null,
};

export default function PlaceCard({
  place,
  onLove,
  onAdvance,
  onDelete,
  onFocus,
}: {
  place: Place;
  onLove: (id: string) => void;
  onAdvance: (id: string, next: Status) => void;
  onDelete: (id: string) => void;
  onFocus: (id: string) => void;
}) {
  const { openModal } = useApp();
  const cat = CATEGORIES[place.category];
  const CatIcon = cat.Icon;
  const next = NEXT[place.status];
  const date = place.visitedDate || place.plannedDate;
  const km = distanceFromBase(place.lat, place.lng);
  const weekend = isWeekendReachable(km);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group glass rounded-2xl p-4"
      style={{ borderColor: `color-mix(in srgb, ${cat.color} 25%, var(--border))` }}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          onClick={() => openModal(place.id)}
          className="flex min-w-0 items-start gap-2 text-left"
          title="Details öffnen"
        >
          <span
            className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg"
            style={{
              background: `color-mix(in srgb, ${cat.color} 16%, transparent)`,
              color: cat.color,
            }}
          >
            <CatIcon size={16} strokeWidth={2.2} />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-medium">{place.name}</span>
            <span className="text-xs text-[var(--text-dim)]">
              {cat.label} · {place.addedBy}
              {date
                ? ` · ${new Date(date).toLocaleDateString("de-DE", { day: "2-digit", month: "short" })}`
                : ""}
            </span>
          </span>
        </button>

        <button
          onClick={() => onLove(place.id)}
          className="flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-sm text-[var(--rose)] transition hover:bg-[var(--rose)]/10 active:scale-90"
          aria-label="Lieben"
        >
          <Heart size={14} className={place.loves > 0 ? "fill-current" : ""} />
          {place.loves > 0 && <span className="tabular-nums">{place.loves}</span>}
        </button>
      </div>

      {place.note && (
        <p className="mt-2 line-clamp-2 text-sm text-[var(--text-muted)]">
          {place.note}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{
              color: STATUSES[place.status].color,
              background: `color-mix(in srgb, ${STATUSES[place.status].color} 15%, transparent)`,
            }}
          >
            {STATUSES[place.status].label}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] text-[var(--text-dim)]"
            style={{ background: "rgba(28,55,90,0.05)" }}
            title={`Luftlinie ab Oxnard${weekend ? " · Wochenend-tauglich" : " · großer Trip"}`}
          >
            <Navigation size={10} />
            {fmtKm(km)}
            {weekend ? " · Wochenende" : ""}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
          <button
            onClick={() => openModal(place.id)}
            className="grid h-7 w-7 place-items-center rounded-md text-[var(--text-dim)] transition hover:bg-black/[0.04] hover:text-[var(--text)]"
            aria-label="Details öffnen"
          >
            <Maximize2 size={14} />
          </button>
          <button
            onClick={() => onFocus(place.id)}
            className="grid h-7 w-7 place-items-center rounded-md text-[var(--text-dim)] transition hover:bg-black/[0.04] hover:text-[var(--text)]"
            aria-label="Auf Karte zeigen"
          >
            <MapPin size={14} />
          </button>
          {next && (
            <button
              onClick={() => onAdvance(place.id, next)}
              className="flex h-7 items-center gap-1 rounded-md px-2 text-xs text-[var(--teal)] transition hover:bg-[var(--teal)]/10"
            >
              {STATUSES[next].short} <ArrowRight size={12} />
            </button>
          )}
          <button
            onClick={() => onDelete(place.id)}
            className="grid h-7 w-7 place-items-center rounded-md text-[var(--text-dim)] transition hover:bg-[var(--rose)]/10 hover:text-[var(--rose)]"
            aria-label="Löschen"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
