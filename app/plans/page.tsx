"use client";

import { useRouter } from "next/navigation";
import { CalendarPlus } from "lucide-react";
import { useApp } from "@/lib/store";
import { CREW } from "@/lib/config";
import { downloadIcs } from "@/lib/ics";
import TripChips from "@/components/TripChips";
import FilterBar from "@/components/FilterBar";
import PlanBoard from "@/components/PlanBoard";

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
  } = useApp();

  const focusOnMap = (id: string) => {
    select(id);
    router.push("/map");
  };

  const plannedCount = filtered.filter((p) => p.plannedDate).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl">Pläne</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Von der Idee zum erlebten Moment. Wir ziehen Spots durch die Phasen.
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

      <PlanBoard
        places={filtered}
        onLove={love}
        onAdvance={advance}
        onDelete={remove}
        onFocus={focusOnMap}
        onAdd={() => openSheet(tripFilter)}
      />
    </div>
  );
}
