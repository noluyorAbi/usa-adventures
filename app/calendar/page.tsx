"use client";

import { useApp } from "@/lib/store";
import VacationCalendar from "@/components/VacationCalendar";
import EventPlanner from "@/components/EventPlanner";
import DriveTimes from "@/components/DriveTimes";

export default function CalendarPage() {
  const { trips } = useApp();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-6 pb-28 sm:px-6 sm:pb-10">
      <header>
        <h1 className="font-display text-4xl sm:text-5xl">Kalender</h1>
        <p className="mt-1 max-w-2xl text-sm text-[var(--text-muted)]">
          Acht Urlaubstage, zehn Feiertage und sechs Monate. Hier steht, wohin die acht
          Tage gehören, was die geplanten Trips wirklich kosten und wie lange man ab
          Camarillo wohin fährt. Zuerst die zwei Termine, deren Datum feststeht.
        </p>
      </header>

      <EventPlanner trips={trips} />
      <VacationCalendar trips={trips} />
      <DriveTimes />
    </main>
  );
}
