"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Heart,
  Navigation,
  CalendarClock,
  Sparkles,
  ArrowRight,
  ImageOff,
  Share2,
  Check,
  MapPinned,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { CATEGORIES, STATUSES } from "@/lib/config";
import { distanceFromBase, isWeekendReachable, driveHours, fmtKm } from "@/lib/geo";
import type { Status } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

const NEXT: Record<Status, Status | null> = {
  wishlist: "planned",
  planned: "visited",
  visited: null,
};

export default function SpotModal() {
  const router = useRouter();
  const { places, trips, modalId, closeModal, love, advance, select } = useApp();
  const [shared, setShared] = useState(false);

  const place = places.find((p) => p.id === modalId) ?? null;

  async function share() {
    if (!place) return;
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/map?spot=${place.id}`,
      );
    } catch {
      /* ignore */
    }
    setShared(true);
    window.setTimeout(() => setShared(false), 1800);
  }

  function showOnMap() {
    if (!place) return;
    select(place.id);
    closeModal();
    router.push("/map");
  }

  return (
    <AnimatePresence>
      {place && (
        <>
          <motion.div
            className="fixed inset-0 z-[1300] bg-[#0d2136]/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          />
          <motion.div
            className="fixed inset-0 z-[1400] flex items-end justify-center p-0 sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-[var(--surface-solid)] shadow-[0_-20px_60px_-20px_rgba(20,60,110,0.4)] sm:rounded-3xl"
              initial={{ y: 40, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const cat = CATEGORIES[place.category];
                const CatIcon = cat.Icon;
                const km = distanceFromBase(place.lat, place.lng);
                const weekend = isWeekendReachable(km);
                const hours = Math.round(driveHours(km));
                const trip = trips.find((t) => t.id === place.tripId);
                const next = NEXT[place.status];
                const images = place.images ?? [];

                return (
                  <>
                    {/* Images */}
                    <div className="relative">
                      {images.length > 0 ? (
                        <div className="flex snap-x gap-2 overflow-x-auto">
                          {images.map((src, i) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={i}
                              src={src}
                              alt={`${place.name} ${i + 1}`}
                              loading="lazy"
                              className="h-56 w-full flex-shrink-0 snap-center object-cover sm:h-72"
                              style={{
                                width: images.length > 1 ? "88%" : "100%",
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex h-40 flex-col items-center justify-center gap-2 bg-[color-mix(in_srgb,var(--sky)_10%,transparent)] text-[var(--text-dim)]">
                          <ImageOff size={30} strokeWidth={1.6} />
                          <span className="text-xs">
                            Noch keine Fotos — in data/places.ts unter
                            <code className="mx-1">images</code>ergänzen
                          </span>
                        </div>
                      )}
                      <button
                        onClick={closeModal}
                        className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-[var(--text)] backdrop-blur transition hover:bg-white"
                        aria-label="Schließen"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="flex flex-col gap-5 p-5 sm:p-6">
                      {/* Title row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span
                            className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                            style={{
                              background: `color-mix(in srgb, ${cat.color} 16%, transparent)`,
                              color: cat.color,
                            }}
                          >
                            <CatIcon size={20} strokeWidth={2.2} />
                          </span>
                          <div>
                            <h2 className="font-display text-2xl leading-tight">
                              {place.name}
                            </h2>
                            <p className="text-sm text-[var(--text-dim)]">
                              {cat.label}
                              {trip ? ` · ${trip.name}` : ""} · {place.addedBy}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => love(place.id)}
                          className="flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-sm text-[var(--rose)] transition hover:bg-[var(--rose)]/10 active:scale-90"
                          aria-label="Lieben"
                        >
                          <Heart
                            size={16}
                            className={place.loves > 0 ? "fill-current" : ""}
                          />
                          {place.loves > 0 && (
                            <span className="tabular-nums">{place.loves}</span>
                          )}
                        </button>
                      </div>

                      {/* Quick facts */}
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium"
                          style={{
                            color: STATUSES[place.status].color,
                            background: `color-mix(in srgb, ${STATUSES[place.status].color} 15%, transparent)`,
                          }}
                        >
                          {STATUSES[place.status].label}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/[0.05] px-2.5 py-1 text-[var(--text-muted)]">
                          <Navigation size={12} /> {fmtKm(km)} ab Oxnard
                          {weekend ? " · Wochenende" : ` · ~${hours} h`}
                        </span>
                        {place.bestTime && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--amber)_16%,transparent)] px-2.5 py-1 text-[var(--amber)]">
                            <CalendarClock size={12} /> Beste Zeit: {place.bestTime}
                          </span>
                        )}
                      </div>

                      {/* About */}
                      {place.about && (
                        <div className="flex flex-col gap-1.5">
                          <span className="flex items-center gap-1.5 text-xs tracking-wider text-[var(--text-dim)] uppercase">
                            <Sparkles size={13} /> Warum hin
                          </span>
                          <p className="text-[15px] leading-relaxed text-[var(--text)]">
                            {place.about}
                          </p>
                        </div>
                      )}

                      {/* Note */}
                      {place.note && (
                        <div className="flex flex-col gap-1.5">
                          <span className="text-xs tracking-wider text-[var(--text-dim)] uppercase">
                            Unsere Notiz
                          </span>
                          <p className="text-sm text-[var(--text-muted)]">
                            {place.note}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 border-t border-[var(--border)] pt-4">
                        <button
                          onClick={showOnMap}
                          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white"
                          style={{ background: "var(--sky-grad)" }}
                        >
                          <MapPinned size={15} /> Auf Karte zeigen
                        </button>
                        {next && (
                          <button
                            onClick={() => advance(place.id, next)}
                            className="flex items-center gap-1.5 rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--teal)] transition hover:bg-[var(--teal)]/10"
                          >
                            {STATUSES[next].short} <ArrowRight size={14} />
                          </button>
                        )}
                        <button
                          onClick={share}
                          className="flex items-center gap-1.5 rounded-full border border-[var(--border)] px-4 py-2 text-sm transition hover:border-[var(--sky)]"
                        >
                          {shared ? (
                            <>
                              <Check size={14} className="text-[var(--teal)]" /> Kopiert
                            </>
                          ) : (
                            <>
                              <Share2 size={14} /> Teilen
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
