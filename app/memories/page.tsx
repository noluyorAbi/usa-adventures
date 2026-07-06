"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import TripChips from "@/components/TripChips";
import Timeline from "@/components/Timeline";

export default function MemoriesPage() {
  const router = useRouter();
  const { places, trips, filtered, tripFilter, setTripFilter, select, openSheet } =
    useApp();

  const focusOnMap = (id: string) => {
    select(id);
    router.push("/map");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl">Erinnerungen</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Alles was ihr schon erlebt habt, chronologisch.
        </p>
      </div>

      <TripChips
        trips={trips}
        places={places}
        selected={tripFilter}
        onSelect={setTripFilter}
      />

      <Timeline
        places={filtered}
        onFocus={focusOnMap}
        onAdd={() => openSheet(tripFilter)}
      />
    </div>
  );
}
