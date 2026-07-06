import type { Category, Place, Status } from "./types";

export interface Filters {
  q: string;
  cats: Category[];
  statuses: Status[];
  person: string | null;
  tripId: string | null;
}

export const EMPTY_FILTERS: Filters = {
  q: "",
  cats: [],
  statuses: [],
  person: null,
  tripId: null,
};

export function filterCount(f: Filters): number {
  return (
    (f.q ? 1 : 0) +
    f.cats.length +
    f.statuses.length +
    (f.person ? 1 : 0) +
    (f.tripId ? 1 : 0)
  );
}

export function applyFilters(places: Place[], f: Filters): Place[] {
  const q = f.q.trim().toLowerCase();
  return places.filter((p) => {
    if (f.tripId && p.tripId !== f.tripId) return false;
    if (f.cats.length && !f.cats.includes(p.category)) return false;
    if (f.statuses.length && !f.statuses.includes(p.status)) return false;
    if (f.person && p.addedBy !== f.person) return false;
    if (q && !`${p.name} ${p.note}`.toLowerCase().includes(q)) return false;
    return true;
  });
}
