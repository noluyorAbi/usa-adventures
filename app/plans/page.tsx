"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarPlus, Compass, SearchX } from "lucide-react";
import { useApp } from "@/lib/store";
import { CREW } from "@/lib/config";
import { downloadIcs } from "@/lib/ics";
import { nextUp } from "@/lib/plan";
import AnimatedNumber from "@/components/AnimatedNumber";
import TripChips from "@/components/TripChips";
import FilterBar from "@/components/FilterBar";
import PlanBoard from "@/components/PlanBoard";
import PlanTimeline from "@/components/PlanTimeline";
import NextUp from "@/components/NextUp";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function PlansPage() {
  const router = useRouter();
  const {
    places,
    trips,
    filtered,
    filters,
    setFilters,
    tripFilter,
    setTripFilter,
    love,
    advance,
    remove,
    select,
    openSheet,
    openModal,
  } = useApp();

  const focusOnMap = (id: string) => {
    select(id);
    router.push("/map");
  };

  const plannedCount = filtered.filter((p) => p.plannedDate).length;
  const wishlist = filtered.filter((p) => p.status === "wishlist").length;
  const planned = filtered.filter((p) => p.status === "planned").length;
  const visited = filtered.filter((p) => p.status === "visited").length;

  /**
   * Der nächste Termin kommt immer aus ALLEN Spots, nicht aus der gefilterten
   * Liste — sonst verschwindet der wichtigste Blick der Seite, sobald man filtert.
   */
  const upcoming = nextUp(places);
  const upcomingTrip = upcoming
    ? trips.find((t) => t.id === upcoming.tripId)
    : undefined;

  const stats = [
    { label: "Ideen", n: wishlist, c: "var(--text-muted)" },
    { label: "Geplant", n: planned, c: "var(--amber)" },
    { label: "Erlebt", n: visited, c: "var(--teal)" },
  ] as const;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl">Pläne</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Von der Idee zum erlebten Moment. Kanban, Kalender-Spur und Export.
          </p>
        </div>
        {plannedCount > 0 && (
          <button
            onClick={() => downloadIcs(filtered)}
            className="flex items-center gap-2 self-start rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 text-sm backdrop-blur transition hover:border-[var(--sky)] sm:self-auto"
            title="Geplante Spots als Kalender-Datei exportieren"
          >
            <CalendarPlus size={15} /> Kalender (.ics) · {plannedCount}
          </button>
        )}
      </div>

      {upcoming && <NextUp place={upcoming} trip={upcomingTrip} onOpen={openModal} />}

      {/* phase pulse */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.05, duration: 0.35, ease: EASE }}
            className="rounded-2xl border border-[var(--border)] bg-white/70 px-3 py-3 text-center"
          >
            <p
              className="font-display text-2xl leading-none tabular-nums"
              style={{ color: s.c }}
            >
              <AnimatedNumber value={s.n} />
            </p>
            <p className="mt-1 text-[11px] tracking-wide text-[var(--text-dim)] uppercase">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>

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

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="card flex flex-col items-center gap-3 rounded-3xl px-6 py-14 text-center"
        >
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            className="text-[var(--text-dim)]"
          >
            <SearchX size={28} />
          </motion.span>
          <p className="font-display text-xl">Keine Spots im Filter</p>
          <p className="max-w-sm text-sm text-[var(--text-muted)]">
            Die Filter oben sind gerade zu streng. Setz sie zurück oder leg einen neuen
            Spot an.
          </p>
          <button
            onClick={() => openSheet(tripFilter)}
            className="mt-1 flex items-center gap-2 rounded-full bg-[var(--terra)] px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
          >
            <Compass size={15} /> Spot hinzufügen
          </button>
        </motion.div>
      ) : (
        <>
          <PlanTimeline
            places={filtered}
            trips={trips}
            onFocus={(id) => openModal(id)}
          />

          <PlanBoard
            places={filtered}
            onLove={love}
            onAdvance={advance}
            onDelete={remove}
            onFocus={focusOnMap}
            onAdd={() => openSheet(tripFilter)}
          />
        </>
      )}
    </div>
  );
}
