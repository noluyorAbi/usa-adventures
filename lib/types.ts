export type Category =
  "roadtrip" | "surf" | "hike" | "food" | "city" | "park" | "other";

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
