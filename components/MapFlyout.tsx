"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Heart,
  Share2,
  Check,
  ArrowRight,
  Maximize2,
  Navigation,
  MapPin,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { CATEGORIES, STATUSES } from "@/lib/config";
import { distanceFromBase, isWeekendReachable, fmtKm } from "@/lib/geo";
import type { Place, Status } from "@/lib/types";

const NEXT: Record<Status, Status | null> = {
  wishlist: "planned",
  planned: "visited",
  visited: null,
};

/**
 * Kompakte, eigenständige Vorschau-Karte für den ausgewählten Pin auf der Karte.
 * Solide (nicht durchscheinend übers Satellitenbild), mit Foto-Cover oder
 * kategoriefarbenem Verlauf, klarer Hierarchie und eigenen Aktionen.
 */
export default function MapFlyout({ place }: { place: Place }) {
  const { openModal, love, advance, select } = useApp();
  const [shared, setShared] = useState(false);

  const cat = CATEGORIES[place.category];
  const CatIcon = cat.Icon;
  const status = STATUSES[place.status];
  const next = NEXT[place.status];
  const km = distanceFromBase(place.lat, place.lng);
  const weekend = isWeekendReachable(km);
  const cover = place.images?.[0] ?? null;
  const photoCount = place.images?.length ?? 0;

  async function share() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/map?spot=${place.id}`,
      );
    } catch {
      /* clipboard nicht verfügbar */
    }
    setShared(true);
    window.setTimeout(() => setShared(false), 1800);
  }

  return (
    <motion.div
      layout
      className="relative overflow-hidden rounded-[22px] bg-[var(--surface-solid)] shadow-[var(--shadow-lg)] ring-1 ring-black/[0.06]"
      style={{ borderTop: `3px solid ${cat.color}` }}
    >
      {/* Cover */}
      <button
        onClick={() => openModal(place.id)}
        className="group relative block h-28 w-full overflow-hidden text-left"
        aria-label={`${place.name} — Details öffnen`}
      >
        {cover ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={place.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/12 to-black/10" />
          </>
        ) : (
          <span
            className="absolute inset-0"
            style={{
              background: `radial-gradient(120% 120% at 15% 0%, color-mix(in srgb, ${cat.color} 62%, #1a2b40) 0%, #16283b 78%)`,
            }}
          >
            <CatIcon
              size={92}
              strokeWidth={1.4}
              className="absolute -right-3 -bottom-4 opacity-15"
              color="#ffffff"
            />
          </span>
        )}

        {/* Kategorie-Chip */}
        <span
          className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-white backdrop-blur"
          style={{ background: `color-mix(in srgb, ${cat.color} 78%, transparent)` }}
        >
          <CatIcon size={12} strokeWidth={2.6} /> {cat.label}
        </span>

        {photoCount > 1 && (
          <span className="absolute right-2.5 bottom-2.5 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
            {photoCount} Fotos
          </span>
        )}

        {/* Name auf dem Cover */}
        <h3 className="font-display absolute right-3 bottom-2 left-3 truncate text-lg leading-tight text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
          {place.name}
        </h3>
      </button>

      {/* Aktionen oben rechts — separat, überlappen den Titel nicht */}
      <div className="absolute top-2.5 right-2.5 z-10 flex gap-1.5">
        <button
          onClick={share}
          className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[var(--text-muted)] shadow-sm backdrop-blur transition hover:bg-white active:scale-90"
          aria-label="Link kopieren"
        >
          {shared ? (
            <Check size={15} className="text-[var(--teal)]" />
          ) : (
            <Share2 size={14} />
          )}
        </button>
        <button
          onClick={() => select(null)}
          className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[var(--text-muted)] shadow-sm backdrop-blur transition hover:bg-white active:scale-90"
          aria-label="Schließen"
        >
          <X size={15} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-3.5">
        {/* Meta-Zeile */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 font-medium"
            style={{
              color: status.color,
              background: `color-mix(in srgb, ${status.color} 15%, transparent)`,
            }}
          >
            {status.label}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[var(--text-muted)]"
            style={{ background: "rgba(28,55,90,0.05)" }}
          >
            <Navigation size={10} /> {fmtKm(km)}
            {weekend ? " · Wochenende" : ""}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 text-[var(--text-dim)]">
            <MapPin size={10} /> {place.addedBy}
          </span>
        </div>

        {(place.about || place.note) && (
          <p className="line-clamp-2 text-[13px] leading-relaxed text-[var(--text-muted)]">
            {place.about || place.note}
          </p>
        )}

        {/* Aktionen */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal(place.id)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-white transition active:scale-[0.98]"
            style={{ background: "var(--sky-grad)" }}
          >
            <Maximize2 size={14} /> Details
          </button>
          {next && (
            <button
              onClick={() => advance(place.id, next)}
              className="flex items-center gap-1 rounded-xl border border-[var(--border)] px-3 py-2 text-sm text-[var(--teal)] transition hover:bg-[var(--teal)]/10"
              title={`Weiter zu „${STATUSES[next].label}"`}
            >
              {STATUSES[next].short} <ArrowRight size={13} />
            </button>
          )}
          <button
            onClick={() => love(place.id)}
            className="flex items-center gap-1 rounded-xl border border-[var(--border)] px-2.5 py-2 text-sm text-[var(--rose)] transition hover:bg-[var(--rose)]/10 active:scale-90"
            aria-label="Lieben"
          >
            <Heart size={15} className={place.loves > 0 ? "fill-current" : ""} />
            {place.loves > 0 && (
              <span className="text-xs tabular-nums">{place.loves}</span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
