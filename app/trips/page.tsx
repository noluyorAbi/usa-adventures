"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { PROMPT_ADD_TRIP } from "@/lib/agentPrompts";
import Dashboard from "@/components/Dashboard";
import TripsTab from "@/components/TripsTab";
import CopyForAgent from "@/components/CopyForAgent";

export default function TripsPage() {
  const router = useRouter();
  const { places, trips, setTripFilter } = useApp();

  const openTrip = (tripId: string) => {
    setTripFilter(tripId);
    router.push("/map");
  };

  return (
    <div className="flex flex-col gap-6">
      <Dashboard places={places} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl">Trips & Regionen</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Sechs große Routen quer durch die USA. Tipp einen an, um die Spots auf der
            Karte zu sehen.
          </p>
        </div>
        <CopyForAgent
          text={PROMPT_ADD_TRIP}
          label="Trip per Agent anlegen"
          variant="compact"
        />
      </div>
      <TripsTab trips={trips} places={places} onOpen={openTrip} />
    </div>
  );
}
