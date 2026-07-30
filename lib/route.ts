import type { Place } from "./types";
import { haversineKm } from "./geo";

/**
 * Grobe Routen-Metriken für einen Trip (Luftlinie, sortiert nach Nähe).
 * Keine Routing-API: bewusst lokal und ungefähr.
 */

export function tripRouteMetrics(spots: Place[]): {
  stopCount: number;
  airKm: number;
  roughDriveKm: number;
  roughDriveHours: number;
} {
  if (spots.length === 0) {
    return { stopCount: 0, airKm: 0, roughDriveKm: 0, roughDriveHours: 0 };
  }
  if (spots.length === 1) {
    return { stopCount: 1, airKm: 0, roughDriveKm: 0, roughDriveHours: 0 };
  }

  // Greedy nearest-neighbor from first spot (by name sort for stability)
  const remaining = [...spots].sort((a, b) => a.name.localeCompare(b.name));
  const path: Place[] = [remaining.shift()!];
  while (remaining.length) {
    const last = path[path.length - 1];
    let bestI = 0;
    let bestD = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = haversineKm(last.lat, last.lng, remaining[i].lat, remaining[i].lng);
      if (d < bestD) {
        bestD = d;
        bestI = i;
      }
    }
    path.push(remaining.splice(bestI, 1)[0]);
  }

  let air = 0;
  for (let i = 1; i < path.length; i++) {
    air += haversineKm(path[i - 1].lat, path[i - 1].lng, path[i].lat, path[i].lng);
  }
  const roughDriveKm = air * 1.3;
  const roughDriveHours = roughDriveKm / 85;

  return {
    stopCount: path.length,
    airKm: Math.round(air),
    roughDriveKm: Math.round(roughDriveKm),
    roughDriveHours: Math.round(roughDriveHours * 10) / 10,
  };
}

/** US-Staaten-Codes aus Spots (falls gesetzt). */
export function uniqueStates(places: Place[]): string[] {
  const set = new Set<string>();
  for (const p of places) {
    if (p.state) set.add(p.state.toUpperCase());
  }
  return [...set].sort();
}
