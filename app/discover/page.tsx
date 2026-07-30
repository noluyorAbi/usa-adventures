"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import RotationArc from "@/components/RotationArc";
import SeasonRibbon from "@/components/SeasonRibbon";
import TripRoulette from "@/components/TripRoulette";
import WeekendComposer from "@/components/WeekendComposer";
import PackingPanel from "@/components/PackingPanel";
import DuetMeter from "@/components/DuetMeter";

export default function DiscoverPage() {
  const router = useRouter();
  const { places, trips, openModal, love, select } = useApp();

  const openSpot = (id: string) => {
    openModal(id);
  };

  const focusMap = (id: string) => {
    select(id);
    router.push(`/map?spot=${id}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl sm:text-4xl">Entdecken</h1>
        <p className="max-w-2xl text-sm text-[var(--text-muted)]">
          Werkzeuge, die aus unseren Spots und Trips neue Ideen machen: Rotationsbogen,
          Wochenend-Mix, Roulette, Packliste und Crew-Statistik. Alles lokal, nichts in
          der Cloud.
        </p>
      </div>

      <RotationArc trips={trips} />
      <SeasonRibbon trips={trips} />

      <div className="grid gap-6 lg:grid-cols-2">
        <TripRoulette places={places} trips={trips} onOpen={openSpot} onLove={love} />
        <WeekendComposer places={places} onOpen={focusMap} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PackingPanel trips={trips} places={places} />
        <DuetMeter places={places} />
      </div>
    </div>
  );
}
