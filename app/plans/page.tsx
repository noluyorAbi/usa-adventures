"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { CREW } from "@/lib/config";
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl">Pläne</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Von der Idee zum erlebten Moment. Wir ziehen Spots durch die Phasen.
        </p>
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
