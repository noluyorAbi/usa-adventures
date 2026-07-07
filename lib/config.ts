import {
  Car,
  Waves,
  Footprints,
  UtensilsCrossed,
  Building2,
  Mountain,
  MapPin,
  House,
  type LucideIcon,
} from "lucide-react";
import type { Category, Status } from "./types";

/** Internship window — edit these two if the dates shift. */
export const ARRIVAL = new Date("2026-09-21T00:00:00");
export const DEPARTURE = new Date("2027-03-19T00:00:00");

/** Home base — Oxnard, CA. */
export const BASECAMP = { lat: 34.1975, lng: -119.1771, name: "Oxnard" };

/** Map opens on the whole country. */
export const US_VIEW = { lat: 38.5, lng: -111.5, zoom: 4 };

/** The two protagonists. Guests type their own name. */
export const CREW = ["Alperen", "Justus"];

export const CATEGORIES: Record<
  Category,
  { label: string; color: string; Icon: LucideIcon }
> = {
  home: { label: "Zuhause", color: "#e0567a", Icon: House },
  roadtrip: { label: "Roadtrip", color: "#f2683f", Icon: Car },
  surf: { label: "Surf & Beach", color: "#0fa3c4", Icon: Waves },
  hike: { label: "Hike", color: "#5aa06a", Icon: Footprints },
  food: { label: "Food", color: "#eaa41f", Icon: UtensilsCrossed },
  city: { label: "City", color: "#6a68d4", Icon: Building2 },
  park: { label: "Nationalpark", color: "#2f9e73", Icon: Mountain },
  other: { label: "Sonstiges", color: "#7d8a99", Icon: MapPin },
};

export const STATUSES: Record<Status, { label: string; short: string; color: string }> =
  {
    wishlist: { label: "Wishlist", short: "Idee", color: "#8496a8" },
    planned: { label: "Geplant", short: "Geplant", color: "#eaa41f" },
    visited: { label: "Erlebt", short: "Erlebt", color: "#0fa3c4" },
  };
