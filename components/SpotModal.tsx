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
  Tag,
  MapPin,
  Globe,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { CATEGORIES, STATUSES } from "@/lib/config";
import { distanceFromBase, isWeekendReachable, driveHours, fmtKm } from "@/lib/geo";
import type { Status } from "@/lib/types";
import CopyForAgent from "@/components/CopyForAgent";
import { PROMPT_MAINTAIN_SPOT } from "@/lib/agentPrompts";

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
  const [lightbox, setLightbox] = useState<number | null>(null);

  const place = places.find((p) => p.id === modalId) ?? null;
  const galleryImages = place?.images ?? [];

  function dismiss() {
    setLightbox(null);
    closeModal();
  }

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
            onClick={dismiss}
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
                            <button
                              key={i}
                              onClick={() => setLightbox(i)}
                              className="group/img relative h-56 flex-shrink-0 snap-center overflow-hidden sm:h-72"
                              style={{ width: images.length > 1 ? "88%" : "100%" }}
                              aria-label={`Foto ${i + 1} groß ansehen`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={src}
                                alt={`${place.name} ${i + 1}`}
                                loading="lazy"
                                className="h-full w-full object-cover transition duration-500 group-hover/img:scale-[1.03]"
                              />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 bg-[color-mix(in_srgb,var(--sky)_10%,transparent)] px-6 py-8 text-center text-[var(--text-dim)]">
                          <ImageOff size={28} strokeWidth={1.6} />
                          <span className="text-xs">
                            Noch keine Fotos für diesen Ort.
                          </span>
                          <CopyForAgent
                            text={PROMPT_MAINTAIN_SPOT}
                            label="Fotos & Details ergänzen — Copy für Agent"
                            variant="compact"
                          />
                        </div>
                      )}
                      {images.length > 1 && (
                        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                          {images.length} Fotos · tippen zum Vergrößern
                        </span>
                      )}
                      <button
                        onClick={dismiss}
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
                        {place.priceLevel && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--teal)_14%,transparent)] px-2.5 py-1 text-[var(--teal)]">
                            <Tag size={12} /> {place.priceLevel}
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

                      {/* Highlights */}
                      {place.highlights && place.highlights.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <span className="text-xs tracking-wider text-[var(--text-dim)] uppercase">
                            Highlights
                          </span>
                          <ul className="flex flex-col gap-1.5">
                            {place.highlights.map((h, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-[15px] leading-snug text-[var(--text)]"
                              >
                                <span
                                  className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                                  style={{ background: cat.color }}
                                />
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Insider tip */}
                      {place.tips && (
                        <div
                          className="flex items-start gap-2.5 rounded-2xl p-3.5"
                          style={{
                            background:
                              "color-mix(in srgb, var(--amber) 12%, transparent)",
                          }}
                        >
                          <Lightbulb
                            size={17}
                            className="mt-0.5 shrink-0 text-[var(--amber)]"
                          />
                          <p className="text-sm leading-relaxed text-[var(--text)]">
                            <span className="font-medium">Insider-Tipp: </span>
                            {place.tips}
                          </p>
                        </div>
                      )}

                      {/* Address + website */}
                      {(place.address || place.website) && (
                        <div className="flex flex-wrap gap-2 text-sm">
                          {place.address && (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                `${place.name} ${place.address}`,
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-[var(--text-muted)] transition hover:border-[var(--sky)] hover:text-[var(--text)]"
                            >
                              <MapPin size={13} /> {place.address}
                            </a>
                          )}
                          {place.website && (
                            <a
                              href={place.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-[var(--sky)] transition hover:border-[var(--sky)]"
                            >
                              <Globe size={13} /> Website
                            </a>
                          )}
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

                      {/* Für den Kollegen: diesen Ort selbst pflegen */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--text-dim)]">
                        <span>Fotos oder Details ergänzen?</span>
                        <CopyForAgent
                          text={PROMPT_MAINTAIN_SPOT}
                          label="Copy für Agent"
                          variant="compact"
                        />
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>

          {/* Lightbox — Vollbild-Foto */}
          <AnimatePresence>
            {lightbox !== null && galleryImages[lightbox] && (
              <motion.div
                className="fixed inset-0 z-[1600] flex items-center justify-center bg-black/90 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightbox(null)}
              >
                <button
                  onClick={() => setLightbox(null)}
                  className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
                  aria-label="Schließen"
                >
                  <X size={20} />
                </button>
                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightbox(
                          (lightbox - 1 + galleryImages.length) % galleryImages.length,
                        );
                      }}
                      className="absolute left-3 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
                      aria-label="Vorheriges Foto"
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightbox((lightbox + 1) % galleryImages.length);
                      }}
                      className="absolute right-3 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
                      aria-label="Nächstes Foto"
                    >
                      <ChevronRight size={22} />
                    </button>
                  </>
                )}
                <motion.img
                  key={lightbox}
                  src={galleryImages[lightbox]}
                  alt={`${place.name} groß`}
                  className="max-h-[88vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  onClick={(e) => e.stopPropagation()}
                />
                {galleryImages.length > 1 && (
                  <span className="absolute bottom-5 rounded-full bg-white/15 px-3 py-1 text-sm text-white backdrop-blur">
                    {lightbox + 1} / {galleryImages.length}
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
