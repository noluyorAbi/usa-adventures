import type { Place } from "./types";

/**
 * Reine Plan-Logik: Was kommt als Nächstes, wie gruppiert sich die Kalender-Spur,
 * wie liest sich ein Abstand in Tagen. Ohne React, damit testbar und wiederverwendbar
 * (gleiche Rolle wie lib/filter.ts).
 */

/** Tagesgenau, ohne Uhrzeit-Rauschen. */
function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * "2026-10-08" als LOKALES Datum lesen. `new Date("2026-10-08")` wäre UTC-Mitternacht
 * und kippt je nach Zeitzone auf den Vortag — genau der Fehler, den wir hier vermeiden.
 */
export function parsePlanDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Ganze Tage von heute bis zum Datum. Negativ = liegt in der Vergangenheit. */
export function dayDiff(iso: string, today: Date = new Date()): number {
  const ms = parsePlanDate(iso).getTime() - startOfDay(today).getTime();
  return Math.round(ms / 86_400_000);
}

/** Deutscher Abstands-Text für ein Datum. */
export function relativeLabel(days: number): string {
  if (days === 0) return "heute";
  if (days === 1) return "morgen";
  if (days === -1) return "gestern";
  if (days > 0) return `in ${days} Tagen`;
  return `vor ${Math.abs(days)} Tagen`;
}

/** Alle Spots mit Datum, chronologisch aufsteigend. */
export function datedPlaces(places: Place[]): Place[] {
  return places
    .filter((p) => p.plannedDate)
    .sort(
      (a, b) =>
        parsePlanDate(a.plannedDate!).getTime() -
        parsePlanDate(b.plannedDate!).getTime(),
    );
}

/**
 * Spots, die auf "geplant" stehen, aber kein Datum haben. Die fallen aus der
 * Kalender-Spur heraus und werden sonst still vergessen.
 */
export function undatedPlanned(places: Place[]): Place[] {
  return places.filter((p) => p.status === "planned" && !p.plannedDate);
}

export interface PlanGroup {
  /** Sortier- und React-Key, z.B. "2026-10". */
  key: string;
  /** Anzeige, z.B. "Oktober 2026". */
  label: string;
  items: Place[];
}

/** Datierte Spots nach Monat bündeln, Reihenfolge bleibt chronologisch. */
export function groupByMonth(places: Place[]): PlanGroup[] {
  const groups: PlanGroup[] = [];
  for (const p of datedPlaces(places)) {
    const d = parsePlanDate(p.plannedDate!);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.items.push(p);
    } else {
      groups.push({
        key,
        label: d.toLocaleDateString("de-DE", { month: "long", year: "numeric" }),
        items: [p],
      });
    }
  }
  return groups;
}

/** Der nächste Termin ab heute (heute zählt mit). Null, wenn nichts mehr ansteht. */
export function nextUp(places: Place[], today: Date = new Date()): Place | null {
  return datedPlaces(places).find((p) => dayDiff(p.plannedDate!, today) >= 0) ?? null;
}
