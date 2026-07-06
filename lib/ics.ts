import type { Place } from "./types";

/**
 * Baut eine .ics-Kalenderdatei aus geplanten Spots (alles lokal, kein Backend).
 * Jeder Spot mit plannedDate wird ein Ganztags-Termin. Import in Google/Apple
 * Kalender per Doppelklick auf die heruntergeladene Datei.
 */

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** ISO-Datum "2026-11-05" -> "20261105" (ICS DATE). */
function icsDate(iso: string): string {
  return iso.replaceAll("-", "");
}

/** Nächster Tag für DTEND (ICS all-day ist exklusiv). */
function nextDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + 1));
  return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}`;
}

function escapeText(s: string): string {
  return s.replace(/[\\,;]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");
}

export function buildIcs(places: Place[]): string {
  const events = places
    .filter((p) => p.plannedDate)
    .map((p) => {
      const start = icsDate(p.plannedDate!);
      const end = nextDay(p.plannedDate!);
      return [
        "BEGIN:VEVENT",
        `UID:${p.id}@usa-adventures`,
        `DTSTART;VALUE=DATE:${start}`,
        `DTEND;VALUE=DATE:${end}`,
        `SUMMARY:${escapeText(p.name)}`,
        `DESCRIPTION:${escapeText(p.note || "")}`,
        `GEO:${p.lat};${p.lng}`,
        "END:VEVENT",
      ].join("\r\n");
    });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//USA Adventures//DE",
    "CALSCALE:GREGORIAN",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

/** Baut die .ics und startet den Download im Browser. */
export function downloadIcs(places: Place[], filename = "usa-adventures.ics") {
  const blob = new Blob([buildIcs(places)], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
