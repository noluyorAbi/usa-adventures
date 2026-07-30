"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dices, MapPin, Heart, ArrowRight, Sparkles } from "lucide-react";
import { CATEGORIES, STATUSES } from "@/lib/config";
import { distanceFromBase, fmtKm, driveHours } from "@/lib/geo";
import type { Place, Trip } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Theatralischer Spot-Roulette: spinnt durch Wishlist, landet mit
 * Shared-Element-Feeling auf einem Ergebnis-Card.
 */
export default function TripRoulette({
  places,
  trips,
  onOpen,
  onLove,
}: {
  places: Place[];
  trips: Trip[];
  onOpen: (id: string) => void;
  onLove: (id: string) => void;
}) {
  const pool = places.filter((p) => p.status === "wishlist");
  const [spinning, setSpinning] = useState(false);
  const [flash, setFlash] = useState<Place | null>(null);
  const [result, setResult] = useState<Place | null>(null);

  function spin() {
    if (!pool.length || spinning) return;
    setSpinning(true);
    setResult(null);
    let ticks = 0;
    const total = 14 + Math.floor(Math.random() * 8);
    const iv = setInterval(() => {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      setFlash(pick);
      ticks++;
      if (ticks >= total) {
        clearInterval(iv);
        setResult(pick);
        setFlash(null);
        setSpinning(false);
      }
    }, 90);
  }

  const show = result ?? flash;
  const trip = show ? trips.find((t) => t.id === show.tripId) : null;
  const km = show ? distanceFromBase(show.lat, show.lng) : 0;
  const Icon = show ? CATEGORIES[show.category].Icon : Dices;

  return (
    <section className="card relative overflow-hidden rounded-3xl p-5 sm:p-6">
      <div
        className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--terra)" }}
      />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
              Roulette
            </p>
            <h2 className="font-display text-2xl">Wohin als Nächstes?</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {pool.length} Wishlist-Spots im Topf. Glück und Algorithmus.
            </p>
          </div>
          <button
            onClick={spin}
            disabled={!pool.length || spinning}
            className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-white transition active:scale-[0.97] disabled:opacity-40"
            style={{ background: "var(--sun-grad)" }}
          >
            <Dices size={16} className={spinning ? "animate-spin" : ""} />
            {spinning ? "Dreht…" : "Drehen"}
          </button>
        </div>

        <div className="relative min-h-[160px]">
          <AnimatePresence mode="wait">
            {!show && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-[160px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--border)] text-[var(--text-dim)]"
              >
                <Sparkles size={22} className="text-[var(--terra)]" />
                <p className="text-sm">Nochmal drehen und schauen, was kommt</p>
              </motion.div>
            )}
            {show && (
              <motion.div
                key={show.id + (spinning ? "-spin" : "-done")}
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-white/80 p-4"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white"
                    style={{
                      background: CATEGORIES[show.category].color,
                    }}
                  >
                    <Icon size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-xl leading-tight">{show.name}</h3>
                    <p className="line-clamp-2 text-sm text-[var(--text-muted)]">
                      {show.note}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-dim)]">
                  <span
                    className="rounded-full px-2 py-0.5 text-white"
                    style={{ background: STATUSES[show.status].color }}
                  >
                    {STATUSES[show.status].label}
                  </span>
                  {trip && (
                    <span className="inline-flex items-center gap-1">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: trip.color }}
                      />
                      {trip.name}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={11} /> {fmtKm(km)} · ~{driveHours(km).toFixed(1)} h
                  </span>
                </div>
                {!spinning && result && (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => onOpen(result.id)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-white"
                      style={{ background: "var(--sky-grad)" }}
                    >
                      Details <ArrowRight size={14} />
                    </button>
                    <button
                      onClick={() => onLove(result.id)}
                      className="flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-2 text-sm"
                    >
                      <Heart size={14} className="text-[var(--rose)]" /> {result.loves}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
