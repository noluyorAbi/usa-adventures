"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import AnimatedNumber from "./AnimatedNumber";
import { CATEGORIES } from "@/lib/config";
import { dayDiff, parsePlanDate, relativeLabel } from "@/lib/plan";
import type { Place, Trip } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Der eine Blick, der auf dieser Seite zählt: was steht als Nächstes an.
 * Bewusst eine einzige Primäraktion (Details öffnen).
 */
export default function NextUp({
  place,
  trip,
  onOpen,
}: {
  place: Place;
  trip?: Trip;
  onOpen: (id: string) => void;
}) {
  const days = dayDiff(place.plannedDate!);
  const Icon = CATEGORIES[place.category].Icon;
  const color = CATEGORIES[place.category].color;
  const date = parsePlanDate(place.plannedDate!).toLocaleDateString("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="card flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6"
    >
      {/* Countdown-Block */}
      <div
        className="flex shrink-0 items-baseline gap-2 sm:flex-col sm:items-center sm:gap-0"
        aria-label={`Nächster Termin ${relativeLabel(days)}`}
      >
        <span
          className="font-display text-5xl leading-none tabular-nums sm:text-6xl"
          style={{ color }}
        >
          {days === 0 ? "0" : <AnimatedNumber value={days} />}
        </span>
        <span className="text-xs tracking-[0.18em] text-[var(--text-dim)] uppercase">
          {days === 0 ? "heute" : days === 1 ? "Tag" : "Tage"}
        </span>
      </div>

      <div className="hidden w-px self-stretch bg-[var(--border)] sm:block" />

      {/* Inhalt */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
          Als Nächstes
        </p>
        <h2 className="font-display truncate text-2xl">{place.name}</h2>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={13} /> {date}
          </span>
          {trip && (
            <>
              <span className="text-[var(--text-dim)]">·</span>
              <span style={{ color: trip.color }}>{trip.name}</span>
            </>
          )}
        </p>
        {place.note && (
          <p className="flex items-start gap-1.5 text-sm text-[var(--text-muted)]">
            <MapPin size={13} className="mt-0.5 shrink-0" />
            <span className="line-clamp-2">{place.note}</span>
          </p>
        )}
      </div>

      {/* Primäraktion */}
      <button
        onClick={() => onOpen(place.id)}
        className="group flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
        style={{ background: color }}
      >
        <span
          className="grid h-5 w-5 place-items-center rounded-full bg-white/20"
          aria-hidden
        >
          <Icon size={12} />
        </span>
        Details
        <ArrowRight
          size={15}
          className="transition-transform duration-150 group-hover:translate-x-0.5"
        />
      </button>
    </motion.section>
  );
}
