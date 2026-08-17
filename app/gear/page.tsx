"use client";

import GearPlanner from "@/components/GearPlanner";

export default function GearPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-6 pb-28 sm:px-6 sm:pb-10">
      <header>
        <h1 className="font-display text-4xl sm:text-5xl">Kamera</h1>
        <p className="mt-1 max-w-2xl text-sm text-[var(--text-muted)]">
          Sechs Monate dokumentieren und am Ende einen Kurzfilm daraus machen. Hier
          steht, welche Kamera das leistet, was mitkommt, was gekauft wird, wo es
          gekauft wird und was das gegen die Reisekasse bedeutet.
        </p>
      </header>

      <GearPlanner />
    </main>
  );
}
