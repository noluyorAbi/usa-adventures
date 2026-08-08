export type Category =
  | "home"
  | "roadtrip"
  | "surf"
  | "hike"
  | "food"
  | "bar"
  | "activity"
  | "city"
  | "park"
  | "other";

export type Status = "wishlist" | "planned" | "visited";

export type TripDifficulty = "easy" | "medium" | "epic";

export interface Place {
  id: string;
  name: string;
  category: Category;
  lat: number;
  lng: number;
  status: Status;
  note: string;
  addedBy: string;
  tripId?: string | null;
  photoUrl?: string | null;
  plannedDate?: string | null; // ISO date
  visitedDate?: string | null; // ISO date
  loves: number;
  createdAt: string; // ISO

  // Reichere Details (optional, werden im Spot-Modal gezeigt)
  images?: string[]; // Bild-URLs (extern) oder Pfade wie /images/spot.jpg
  about?: string; // was den Ort einzigartig macht + warum hin
  bestTime?: string; // idealer Reisezeitraum, z.B. "Okt–Nov" oder "Frühjahr"
  highlights?: string[]; // 2-4 Stichpunkte: was man hier macht / bestellt
  tips?: string; // ein Insider-Tipp (1 Satz)
  address?: string; // Straße + Stadt, z.B. "1041 S Oxnard Blvd, Oxnard"
  website?: string; // volle URL, z.B. "https://…"
  priceLevel?: string; // "$" | "$$" | "$$$" oder "gratis" / "ab 45 $"
  state?: string; // US-State code, z.B. "CA", "NY" (für Staaten-Sammlung)
}

export type NewPlace = Omit<Place, "id" | "loves" | "createdAt">;

/** Ein Ausruestungsposten, wie ihn data/packing.ts pro Trip vorgibt. */
export interface TripPackItem {
  label: string;
  why: string;
  priority: "must" | "nice";
}

/**
 * Auto-Hinweis fuer einen Trip. Wir fahren einen BMW 330i: Heckantrieb,
 * wenig Bodenfreiheit, Premium-Sprit, oft kein Reserverad. Das entscheidet
 * bei manchen Zielen darueber, ob man ueberhaupt hinkommt.
 */
export type CarNoteKind = "road" | "fuel" | "winter" | "space" | "heat" | "law";

export interface CarNote {
  kind: CarNoteKind;
  text: string;
}

export interface TripPacking {
  extras: TripPackItem[];
  car: CarNote[];
}

export interface Trip {
  id: string;
  name: string;
  color: string;
  region: string; // short subtitle, e.g. "Big Island · Maui · Oahu"
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  /** One-line mood line shown on trip cards */
  tagline?: string;
  /** Vibe label, e.g. "Coastal chill" */
  vibe?: string;
  /** Rough trip length in days */
  estimatedDays?: number;
  /** Best season window in German, e.g. "Herbst", "Winter" */
  season?: string;
  difficulty?: TripDifficulty;
}
