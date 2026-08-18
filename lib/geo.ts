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

/** Dieselbe Schätzung in Minuten, weil die Anzeige immer in Minuten rechnet. */
export function driveMinutes(km: number): number {
  return Math.round(driveHours(km) * 60);
}

/**
 * Dauer so anschreiben, wie man sie auf die Uhr überträgt.
 *
 * Unter einer Stunde nur Minuten ("45 min"), darüber Stunden mit
 * zweistelligen Minuten ("1:15 h"). Bewusst kein "0,8 h": eine
 * Dezimalstunde muss man erst im Kopf umrechnen, und genau dabei
 * verschätzt man sich.
 */
export function fmtDauer(minuten: number): string {
  const m = Math.max(0, Math.round(minuten));
  if (m < 60) return `${m} min`;
  const std = Math.floor(m / 60);
  return `${std}:${String(m % 60).padStart(2, "0")} h`;
}

/**
 * Fahrzeit aus einer Distanz, fertig formatiert.
 *
 * Auf fünf Minuten gerundet: die Grundlage ist Luftlinie mal Straßenfaktor,
 * da wäre "3:14 h" eine vorgetäuschte Genauigkeit. "3:15 h" sagt dasselbe
 * und verspricht nicht mehr, als die Schätzung hergibt.
 */
export function fmtFahrzeit(km: number): string {
  const m = driveMinutes(km);
  if (m < 5) return "unter 5 min";
  return fmtDauer(Math.round(m / 5) * 5);
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
