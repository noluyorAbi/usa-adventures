import { EVENTS } from "@/data/events";
import { iso, tageZwischen, urlaubskosten } from "@/lib/vacation";
import type { FixedEvent, Trip } from "@/lib/types";

/**
 * Rechnung fuer feste Termine.
 *
 * Drei Fragen beantwortet diese Datei: was kostet ein Termin in Dollar,
 * was kostet er in Urlaubstagen, und schlaegt er sich mit einem Trip, der
 * schon im Kalender steht. Die dritte Frage ist die wichtigste, weil ein
 * Rennwochenende nicht verschiebbar ist und ein Trip schon.
 */

export interface EventKosten {
  event: FixedEvent;
  /** Summe aller Posten in USD, pro Person */
  usd: number;
  /** Anteil, der auf Schaetzungen beruht */
  usdGeschaetzt: number;
  /** verbrauchte Urlaubstage */
  urlaubstage: number;
  /** die konkreten Tage, die man beantragen muss */
  urlaubsdaten: string[];
}

export function kostenJeEvent(events: FixedEvent[] = EVENTS): EventKosten[] {
  return events
    .map((event) => {
      const tage = tageZwischen(event.startDate, event.endDate);
      const urlaubsdaten = event.abendtermin
        ? []
        : tage.filter((d) => urlaubskosten(iso(d), iso(d)) > 0).map(iso);
      return {
        event,
        usd: event.kosten.reduce((s, k) => s + k.usd, 0),
        usdGeschaetzt: event.kosten
          .filter((k) => k.quelle === "schaetzung")
          .reduce((s, k) => s + k.usd, 0),
        urlaubstage: urlaubsdaten.length,
        urlaubsdaten,
      };
    })
    .sort((a, b) => a.event.startDate.localeCompare(b.event.startDate));
}

export interface EventKonflikt {
  event: FixedEvent;
  trip: Trip;
  /** die Tage, an denen sich beides ueberschneidet */
  tage: string[];
}

/**
 * Trips ueber 60 Tage sind Daueretiketten wie "SoCal Basis" und ueberlappen
 * per Definition alles. Die zaehlen hier nicht als Konflikt.
 */
export function konflikte(
  trips: Trip[],
  events: FixedEvent[] = EVENTS,
): EventKonflikt[] {
  const out: EventKonflikt[] = [];
  for (const event of events) {
    if (event.status !== "gesetzt") continue;
    const eventTage = new Set(tageZwischen(event.startDate, event.endDate).map(iso));
    for (const trip of trips) {
      if (!trip.startDate || !trip.endDate) continue;
      const tripTage = tageZwischen(trip.startDate, trip.endDate);
      if (tripTage.length > 60) continue;
      const tage = tripTage.map(iso).filter((d) => eventTage.has(d));
      if (tage.length) out.push({ event, trip, tage });
    }
  }
  return out;
}

/** Events je ISO-Datum, damit der Kalender Punkte setzen kann. */
export function eventsByIso(events: FixedEvent[] = EVENTS): Map<string, FixedEvent[]> {
  const m = new Map<string, FixedEvent[]>();
  for (const e of events) {
    if (e.status !== "gesetzt") continue;
    for (const d of tageZwischen(e.startDate, e.endDate)) {
      const k = iso(d);
      m.set(k, [...(m.get(k) ?? []), e]);
    }
  }
  return m;
}

export interface EventSumme {
  usd: number;
  usdGeschaetzt: number;
  urlaubstage: number;
}

export function summeGesetzt(events: FixedEvent[] = EVENTS): EventSumme {
  return kostenJeEvent(events.filter((e) => e.status === "gesetzt")).reduce(
    (s, k) => ({
      usd: s.usd + k.usd,
      usdGeschaetzt: s.usdGeschaetzt + k.usdGeschaetzt,
      urlaubstage: s.urlaubstage + k.urlaubstage,
    }),
    { usd: 0, usdGeschaetzt: 0, urlaubstage: 0 },
  );
}
