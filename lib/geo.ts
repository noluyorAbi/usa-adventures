import { BASECAMP } from "./config";

/**
 * Kleine Geo-Helfer, komplett lokal (keine API).
 * Distanzen sind Luftlinie (Haversine); die Fahrzeit ist eine grobe Schätzung.
 */

const R = 6371; // Erdradius in km

export function haversineKm(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
): number {
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const la1 = (aLat * Math.PI) / 180;
  const la2 = (bLat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Luftlinie von unserer Basis (Oxnard) zu einem Punkt, in km. */
export function distanceFromBase(lat: number, lng: number): number {
  return haversineKm(BASECAMP.lat, BASECAMP.lng, lat, lng);
}

/** Sehr grobe Auto-Fahrzeit: Luftlinie * Straßenfaktor / Schnitt-Tempo. */
export function driveHours(km: number): number {
  return (km * 1.25) / 85;
}

/** Wochenend-tauglich = grob unter 4 h Fahrt pro Richtung. */
export function isWeekendReachable(km: number): boolean {
  return driveHours(km) <= 4;
}

export function fmtKm(km: number): string {
  if (km < 1) return "hier";
  if (km < 1000) return `${Math.round(km)} km`;
  return `${(km / 1000).toFixed(1)} Tsd. km`;
}
