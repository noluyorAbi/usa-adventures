import { TRIP_PACKING } from "@/data/packing";
import type { CarNote, Category, Place, Trip } from "./types";

/**
 * Generiert eine lokale Packliste aus den Kategorien der Spots eines Trips.
 * Keine API, rein regelbasiert.
 *
 * Reihenfolge: Basis, dann was die Kategorien der Spots verlangen, dann die
 * Saison, zuletzt die trip-eigenen Posten aus data/packing.ts. Die stehen
 * hinten, weil sie am speziellsten sind und man sie zuletzt abhakt.
 */

export type PackItem = {
  id: string;
  label: string;
  why: string;
  priority: "must" | "nice";
};

const BY_CATEGORY: Partial<
  Record<Category, { label: string; why: string; priority: "must" | "nice" }[]>
> = {
  hike: [
    { label: "Wanderschuhe", why: "Trails und Geröll", priority: "must" },
    {
      label: "Tagesrucksack + Wasser",
      why: "Mind. 1,5 L pro Person",
      priority: "must",
    },
    { label: "Layer / Fleece", why: "Temperatursprünge am Berg", priority: "must" },
    { label: "Sonnenhut + SPF", why: "Höhe = mehr UV", priority: "nice" },
  ],
  surf: [
    { label: "Badehose / Bikini", why: "Beach + Wellen", priority: "must" },
    { label: "Quick-dry Handtuch", why: "Nasses Auto vermeiden", priority: "must" },
    {
      label: "Neopren-Booties (optional)",
      why: "Kälteres Wasser SoCal/PNW",
      priority: "nice",
    },
  ],
  roadtrip: [
    {
      label: "Aux / Bluetooth-Kabel",
      why: "Lange Highways brauchen Playlists",
      priority: "must",
    },
    {
      label: "Snacks + Kühler",
      why: "Tankstellen sind teuer und langweilig",
      priority: "must",
    },
    {
      label: "Bargeld für Maut / Parks",
      why: "Manches läuft offline",
      priority: "nice",
    },
  ],
  park: [
    {
      label: "National-Park-Pass / Eintritt",
      why: "America the Beautiful lohnt sich",
      priority: "must",
    },
    { label: "Fernglas", why: "Wildlife und Aussichten", priority: "nice" },
    { label: "Kopflampe", why: "Sonnenuntergang im Canyon", priority: "must" },
  ],
  city: [
    { label: "Bequeme Sneaker", why: "Kilometer zu Fuß", priority: "must" },
    { label: "Powerbank", why: "Maps fressen Akku", priority: "must" },
    { label: "Leichte Jacke", why: "Klimaanlagen und Wind", priority: "nice" },
  ],
  food: [
    {
      label: "Appetit und Neugier",
      why: "Portionen sind oft riesig",
      priority: "must",
    },
    { label: "Reservierungs-Screenshots", why: "Offline-Backup", priority: "nice" },
  ],
  bar: [
    { label: "Ausweis (physisch)", why: "21+ Checks sind strikt", priority: "must" },
    { label: "Rideshare-Budget", why: "Kein Fahren nach Drinks", priority: "must" },
  ],
  activity: [
    { label: "Wetterfeste Schuhe", why: "Viele Outdoor-Aktivitäten", priority: "must" },
    { label: "Kleine Crossbody / Fanny", why: "Hände frei", priority: "nice" },
  ],
  other: [
    {
      label: "Notizen / Wishlist",
      why: "Spontane Abstecher festhalten",
      priority: "nice",
    },
  ],
  home: [],
};

const BASE: PackItem[] = [
  {
    id: "base-id",
    label: "Reisepass + Führerschein",
    why: "J-1 und Mietwagen",
    priority: "must",
  },
  {
    id: "base-card",
    label: "Kreditkarte (physisch)",
    why: "Mietwagen und Hotels brauchen oft Chip + PIN",
    priority: "must",
  },
  {
    id: "base-charger",
    label: "US-Adapter / Kabel",
    why: "Ein Set für zwei reicht oft nicht",
    priority: "must",
  },
  {
    id: "base-med",
    label: "Hausapotheke light",
    why: "Ibuprofen, Pflaster, Sonnencreme",
    priority: "nice",
  },
];

export function packingForTrip(trip: Trip | null, places: Place[]): PackItem[] {
  const spots = trip ? places.filter((p) => p.tripId === trip.id) : places;
  const cats = new Set(spots.map((p) => p.category));
  const seen = new Set<string>();
  const out: PackItem[] = [];

  for (const item of BASE) {
    seen.add(item.label);
    out.push(item);
  }

  for (const cat of cats) {
    const list = BY_CATEGORY[cat] ?? [];
    for (const raw of list) {
      if (seen.has(raw.label)) continue;
      seen.add(raw.label);
      out.push({
        id: `${cat}-${raw.label}`,
        label: raw.label,
        why: raw.why,
        priority: raw.priority,
      });
    }
  }

  // Season extras
  const season = (trip?.season ?? "").toLowerCase();
  if (season.includes("winter") || season.includes("schnee")) {
    for (const raw of [
      {
        label: "Thermounterwäsche",
        why: "Nächte unter null",
        priority: "must" as const,
      },
      {
        label: "Handschuhe + Mütze",
        why: "Windchill in den Bergen",
        priority: "must" as const,
      },
    ]) {
      if (seen.has(raw.label)) continue;
      seen.add(raw.label);
      out.push({ id: `season-${raw.label}`, ...raw });
    }
  }

  // Trip-eigene Posten: das, was nur hier gilt und keine Kategorie herleitet.
  for (const raw of TRIP_PACKING[trip?.id ?? ""]?.extras ?? []) {
    if (seen.has(raw.label)) continue;
    seen.add(raw.label);
    out.push({ id: `trip-${raw.label}`, ...raw });
  }

  return out;
}

/**
 * Was das Auto fuer diesen Trip vorgibt. Leer, wenn fuer den Trip nichts
 * hinterlegt ist: dann zeigt das Panel den Block gar nicht erst an.
 */
export function carNotesForTrip(trip: Trip | null): CarNote[] {
  return TRIP_PACKING[trip?.id ?? ""]?.car ?? [];
}
