import { HOLIDAYS, URLAUBSBUDGET } from "@/data/holidays";
import { ARRIVAL, DEPARTURE } from "@/lib/config";
import type { Trip } from "@/lib/types";

/**
 * Urlaubsrechnung. Reine Logik, keine Komponente, kein Zustand.
 *
 * Die Frage dahinter: acht Urlaubstage auf sechs Monate. Wohin legt man sie,
 * damit am meisten zusammenhängende Zeit herauskommt, und was kosten die
 * Reisen, die schon im Kalender stehen.
 */

const MS_TAG = 86_400_000;

export const HOLIDAY_BY_ISO = new Map(HOLIDAYS.map((h) => [h.date, h]));

export function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * ARRIVAL und DEPARTURE aus lib/config.ts sind lokale Date-Objekte. Wer die
 * mit toISOString() liest, bekommt in Europa den Vortag, weil Mitternacht
 * lokal vor Mitternacht UTC liegt. Deshalb hier über die lokalen Getter.
 */
export function isoVonDate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const t = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${t}`;
}

export const START_ISO = isoVonDate(ARRIVAL);
export const ENDE_ISO = isoVonDate(DEPARTURE);

export function parseIso(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** Wochenende oder Feiertag: kostet keinen Urlaubstag. */
export function istFrei(d: Date): boolean {
  const wd = d.getUTCDay();
  return wd === 0 || wd === 6 || HOLIDAY_BY_ISO.has(iso(d));
}

export function tageZwischen(vonIso: string, bisIso: string): Date[] {
  const a = parseIso(vonIso).getTime();
  const b = parseIso(bisIso).getTime();
  const out: Date[] = [];
  for (let t = a; t <= b; t += MS_TAG) out.push(new Date(t));
  return out;
}

/** Wie viele Urlaubstage ein Zeitraum verbraucht. */
export function urlaubskosten(vonIso: string, bisIso: string): number {
  return tageZwischen(vonIso, bisIso).filter((d) => !istFrei(d)).length;
}

export interface TripKosten {
  trip: Trip;
  tage: number;
  kosten: number;
  /** Trips über 60 Tage sind Daueretiketten wie SoCal Basis, keine Reise. */
  laufend: boolean;
}

export function kostenJeTrip(trips: Trip[]): TripKosten[] {
  return trips
    .filter((t) => t.startDate && t.endDate)
    .map((t) => {
      const tage = tageZwischen(t.startDate as string, t.endDate as string).length;
      return {
        trip: t,
        tage,
        kosten:
          tage > 60 ? 0 : urlaubskosten(t.startDate as string, t.endDate as string),
        laufend: tage > 60,
      };
    })
    .sort((a, b) =>
      (a.trip.startDate as string).localeCompare(b.trip.startDate as string),
    );
}

export function gesamtkosten(trips: Trip[]): number {
  return kostenJeTrip(trips).reduce((s, k) => s + k.kosten, 0);
}

/* ────────────────────────────────────────────────────────────────────
   Der Optimierer

   Gesucht sind zusammenhängende Blöcke, die an einem freien Tag beginnen
   und enden. Jeder kostet die Arbeitstage darin und bringt seine volle
   Länge. Aus allen Blöcken wird die überschneidungsfreie Auswahl gesucht,
   die im Budget bleibt und die meisten freien Tage ergibt.

   Das ist gewichtetes Intervall-Scheduling mit Budget, gelöst per DP über
   (Tagesindex, Restbudget). Bei rund 180 Tagen und Budget 8 ist das
   Millisekundensache, deshalb kein Näherungsverfahren.
   ──────────────────────────────────────────────────────────────────── */

export interface Block {
  vonIso: string;
  bisIso: string;
  /** Länge in Kalendertagen */
  laenge: number;
  /** verbrauchte Urlaubstage */
  kosten: number;
  /** die konkreten Tage, die man beantragen muss */
  urlaubstage: string[];
  /** Feiertage, die in den Block fallen */
  feiertage: { date: string; name: string }[];
}

export interface Urlaubsplan {
  bloecke: Block[];
  /** Summe der freien Tage über alle Blöcke */
  freieTage: number;
  /** tatsächlich verbrauchte Urlaubstage */
  verbraucht: number;
}

function baueBlock(tage: Date[], i: number, j: number): Block {
  const drin = tage.slice(i, j + 1);
  return {
    vonIso: iso(tage[i]),
    bisIso: iso(tage[j]),
    laenge: j - i + 1,
    kosten: drin.filter((d) => !istFrei(d)).length,
    urlaubstage: drin.filter((d) => !istFrei(d)).map(iso),
    feiertage: drin
      .map((d) => HOLIDAY_BY_ISO.get(iso(d)))
      .filter((h): h is NonNullable<typeof h> => !!h)
      .map((h) => ({ date: h.date, name: h.name })),
  };
}

/**
 * @param budget Urlaubstage, die zur Verfügung stehen
 * @param maxBlockKosten begrenzt, wie viel ein einzelner Block kosten darf.
 *   Ohne Grenze schluckt Weihnachten fast das ganze Budget. Wer lieber
 *   mehrere mittlere Blöcke will, dreht das herunter.
 */
export function besterUrlaubsplan(
  budget = URLAUBSBUDGET,
  maxBlockKosten = budget,
): Urlaubsplan {
  const tage = tageZwischen(START_ISO, ENDE_ISO);
  const n = tage.length;
  const frei = tage.map(istFrei);

  // Kandidaten je Startindex, damit das DP nicht jedes Mal neu sucht.
  const proStart: Block[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) {
    if (!frei[i]) continue;
    let kosten = 0;
    for (let j = i; j < n; j++) {
      if (!frei[j]) kosten++;
      if (kosten > maxBlockKosten) break;
      if (!frei[j] || kosten === 0) continue; // nur an freien Tagen enden, und nie gratis
      proStart[i].push(baueBlock(tage, i, j));
    }
  }

  const memo = new Map<number, { wert: number; wahl: Block[] }>();
  const loese = (pos: number, rest: number): { wert: number; wahl: Block[] } => {
    if (pos >= n) return { wert: 0, wahl: [] };
    const key = pos * (budget + 1) + rest;
    const hit = memo.get(key);
    if (hit) return hit;

    let best = loese(pos + 1, rest); // diesen Tag nicht als Blockstart nutzen
    for (const b of proStart[pos]) {
      if (b.kosten > rest) continue;
      const endIdx = Math.round(
        (parseIso(b.bisIso).getTime() - tage[0].getTime()) / MS_TAG,
      );
      const sub = loese(endIdx + 1, rest - b.kosten);
      const wert = b.laenge + sub.wert;
      if (wert > best.wert) best = { wert, wahl: [b, ...sub.wahl] };
    }
    memo.set(key, best);
    return best;
  };

  const { wert, wahl } = loese(0, budget);
  return {
    bloecke: wahl,
    freieTage: wert,
    verbraucht: wahl.reduce((s, b) => s + b.kosten, 0),
  };
}

/**
 * Der längste Einzelblock, den das Budget hergibt. Andere Frage als oben:
 * hier zählt eine lange Reise am Stück mehr als die Summe vieler kurzer.
 */
export function laengsterBlock(budget = URLAUBSBUDGET): Block | null {
  const tage = tageZwischen(START_ISO, ENDE_ISO);
  const n = tage.length;
  const frei = tage.map(istFrei);
  let best: Block | null = null;

  for (let i = 0; i < n; i++) {
    if (!frei[i]) continue;
    let kosten = 0;
    for (let j = i; j < n; j++) {
      if (!frei[j]) kosten++;
      if (kosten > budget) break;
      if (!frei[j]) continue;
      const laenge = j - i + 1;
      if (!best || laenge > best.laenge) best = baueBlock(tage, i, j);
    }
  }
  return best;
}
