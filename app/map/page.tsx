"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useApp } from "@/lib/store";
import { CATEGORIES, CREW } from "@/lib/config";
import type { Category } from "@/lib/types";
import TripChips from "@/components/TripChips";
import FilterBar from "@/components/FilterBar";
import PlaceCard from "@/components/PlaceCard";

const MapCanvas = dynamic(() => import("@/components/MapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-[#dbe8f4] text-sm text-[var(--text-dim)]">
      Karte lädt…
    </div>
  ),
});

const EASE = [0.16, 1, 0.3, 1] as const;

export default function MapPage() {
  const {
    places,
    trips,
    filtered,
    filters,
    setFilters,
    tripFilter,
    setTripFilter,
    selectedId,
    select,
    love,
    advance,
    remove,
    addMode,
    setAddMode,
    draft,
    setDraft,
    sheetOpen,
    openSheet,
  } = useApp();

  const selected = places.find((p) => p.id === selectedId) ?? null;

  return (
    <div className="flex flex-col gap-4">
      <TripChips
        trips={trips}
        places={places}
        selected={tripFilter}
        onSelect={setTripFilter}
      />
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        people={CREW}
        resultCount={filtered.length}
      />

      <div className="relative h-[62vh] min-h-[420px] overflow-hidden rounded-3xl border border-[var(--border)] shadow-[var(--shadow-float)]">
        <MapCanvas
          places={filtered}
          selectedId={selectedId}
          onSelect={select}
          addMode={addMode}
          draft={draft}
          onPick={(lat, lng) => {
            setDraft({ lat, lng });
            setAddMode(false);
            if (!sheetOpen) openSheet(tripFilter);
          }}
        />

        {/* Legend */}
        <div className="glass pointer-events-none absolute top-3 left-3 hidden gap-x-3 gap-y-1 rounded-2xl px-3 py-2 text-xs sm:grid sm:grid-cols-2">
          {(Object.keys(CATEGORIES) as Category[]).map((c) => (
            <span key={c} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: CATEGORIES[c].color }}
              />
              <span className="text-[var(--text-muted)]">{CATEGORIES[c].label}</span>
            </span>
          ))}
        </div>

        {/* Selected detail */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="absolute inset-x-3 bottom-3 z-[500] sm:inset-x-auto sm:right-3 sm:w-80"
            >
              <div className="relative">
                <button
                  onClick={() => select(null)}
                  className="glass absolute -top-2 -right-2 z-10 grid h-7 w-7 place-items-center rounded-full text-[var(--text-muted)]"
                  aria-label="Schließen"
                >
                  <X size={14} />
                </button>
                <PlaceCard
                  place={selected}
                  onLove={love}
                  onAdvance={advance}
                  onDelete={(id) => {
                    remove(id);
                    select(null);
                  }}
                  onFocus={() => {}}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-center text-xs text-[var(--text-dim)]">
        {filtered.length} von {places.length} Spots · Tipp auf einen Pin für Details
      </p>
    </div>
  );
}
