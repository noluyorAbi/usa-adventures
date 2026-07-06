import type { Trip } from "@/lib/types";

/**
 * ═══════════════════════════════════════════════════════════════════
 *  DIE TRIPS / REGIONEN
 * ═══════════════════════════════════════════════════════════════════
 *
 * Trips gruppieren Orte (siehe data/places.ts, Feld `tripId`).
 *
 * NEUEN TRIP ANLEGEN:
 *   1. Kopiere eine Zeile { ... } unten, einfügen, Werte ändern.
 *   2. Die `id` (z.B. "trip-alaska") kommt dann bei Orten ins Feld `tripId`.
 *
 * FELDER:
 *   id        eindeutig             "trip-alaska"
 *   name      Anzeigename           "Alaska"
 *   color     Hex-Farbe             "#2f9be0"  (https://coolors.co zum Aussuchen)
 *   region    kurzer Untertitel     "Anchorage · Denali"
 *   startDate "2026-12-01" oder null
 *   endDate   "2026-12-10" oder null
 *   createdAt Zeitstempel (kopieren + Datum ändern)
 */
export const TRIPS: Trip[] = [
  {
    id: "trip-socal",
    name: "SoCal Basis",
    color: "#0fa3c4",
    region: "Oxnard · LA · Santa Barbara",
    startDate: "2026-09-21",
    endDate: "2027-03-19",
    createdAt: "2026-09-20T00:00:00Z",
  },
  {
    id: "trip-pch",
    name: "Pacific Coast Highway",
    color: "#f2683f",
    region: "Big Sur · SF · Seattle",
    startDate: null,
    endDate: null,
    createdAt: "2026-09-20T00:01:00Z",
  },
  {
    id: "trip-southwest",
    name: "Südwesten & Canyons",
    color: "#eaa41f",
    region: "Grand Canyon · Zion · Vegas",
    startDate: null,
    endDate: null,
    createdAt: "2026-09-20T00:02:00Z",
  },
  {
    id: "trip-hawaii",
    name: "Hawaii",
    color: "#2f9be0",
    region: "Oahu · Maui · Big Island · Kauai",
    startDate: null,
    endDate: null,
    createdAt: "2026-09-20T00:03:00Z",
  },
  {
    id: "trip-eastcoast",
    name: "Ostküste",
    color: "#6a68d4",
    region: "NYC · DC · Miami",
    startDate: null,
    endDate: null,
    createdAt: "2026-09-20T00:04:00Z",
  },
  {
    id: "trip-rockies",
    name: "Rockies & Yellowstone",
    color: "#2f9e73",
    region: "Yellowstone · Grand Teton",
    startDate: null,
    endDate: null,
    createdAt: "2026-09-20T00:05:00Z",
  },
];
