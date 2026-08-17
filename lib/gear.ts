import { GEAR } from "@/data/gear";
import { ARRIVAL, DEPARTURE } from "@/lib/config";
import type { GearAktion, GearItem } from "@/lib/types";

/**
 * Rechnung für die Ausrüstung.
 *
 * Zwei Zahlen entscheiden den Kauf. Erstens, was vor dem Abflug fällig
 * ist, denn das geht direkt gegen die Reisekasse, die den ersten Monat
 * ohne Gehalt tragen muss. Zweitens, wie viel Speicher sechs Monate
 * tägliches Filmen wirklich brauchen, denn daran scheitern Reisefilme
 * öfter als an der Kamera.
 */

const MS_TAG = 86_400_000;

/** Tage zwischen Landung und Programmende. */
export const REISETAGE = Math.round((DEPARTURE.getTime() - ARRIVAL.getTime()) / MS_TAG);

export function nachAktion(aktion: GearAktion, gear: GearItem[] = GEAR): GearItem[] {
  return gear.filter((g) => g.aktion === aktion);
}

export function summe(aktion: GearAktion, gear: GearItem[] = GEAR): number {
  return nachAktion(aktion, gear).reduce((s, g) => s + (g.preis ?? 0), 0);
}

/**
 * Speicherbedarf. Die Pocket schreibt 4K mit rund 100 bis 130 Mbit/s,
 * das sind grob 0,75 bis 1,0 GB je Minute. Gerechnet wird nicht mit
 * Drehzeit, sondern mit behaltener Minute pro Tag: was man wegwirft,
 * hat trotzdem einmal Platz gebraucht, deshalb der Faktor drei.
 */
export const GB_PRO_MINUTE = { min: 0.75, max: 1.0 };
/** Verhältnis von gedrehtem zu behaltenem Material. */
export const DREHFAKTOR = 3;

export interface SpeicherBedarf {
  minutenProTag: number;
  gbMin: number;
  gbMax: number;
}

export function speicherbedarf(minutenProTag: number): SpeicherBedarf {
  const minuten = minutenProTag * DREHFAKTOR * REISETAGE;
  return {
    minutenProTag,
    gbMin: Math.round(minuten * GB_PRO_MINUTE.min),
    gbMax: Math.round(minuten * GB_PRO_MINUTE.max),
  };
}

/** Die drei Szenarien, die im Tab nebeneinander stehen. */
export const SPEICHER_SZENARIEN = [1, 3, 5].map(speicherbedarf);
