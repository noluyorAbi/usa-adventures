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
}

export type NewPlace = Omit<Place, "id" | "loves" | "createdAt">;

export interface Trip {
  id: string;
  name: string;
  color: string;
  region: string; // short subtitle, e.g. "Big Island · Maui · Oahu"
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
}
