/**
 * ═══════════════════════════════════════════════════════════════════
 *  FEIERTAGE UND URLAUBSBUDGET
 * ═══════════════════════════════════════════════════════════════════
 *
 * Fest eingetragen statt berechnet: bewegliche US-Feiertage folgen zwar
 * Regeln (vierter Donnerstag im November), aber welche davon der Arbeitgeber
 * tatsächlich freigibt, ist Firmensache. Eine Liste, die man anfasst, ist
 * ehrlicher als eine Formel, die so tut, als wüsste sie es.
 *
 * ANNAHME, die zu prüfen ist: Diese Liste bildet den üblichen Kanon eines
 * US-Arbeitgebers ab. Columbus Day geben viele Firmen NICHT frei, deshalb
 * steht er auf `assumed`. Sobald der echte BMW-Kalender vorliegt, hier
 * korrigieren, der Rest der App rechnet automatisch neu.
 */

export interface Holiday {
  date: string; // ISO
  name: string;
  /** true = wir sind nicht sicher, ob BMW den Tag freigibt */
  assumed?: boolean;
}

export const HOLIDAYS: Holiday[] = [
  { date: "2026-10-12", name: "Columbus Day", assumed: true },
  { date: "2026-11-11", name: "Veterans Day" },
  { date: "2026-11-26", name: "Thanksgiving" },
  { date: "2026-11-27", name: "Tag nach Thanksgiving" },
  { date: "2026-12-24", name: "Heiligabend", assumed: true },
  { date: "2026-12-25", name: "Weihnachten" },
  { date: "2026-12-31", name: "Silvester", assumed: true },
  { date: "2027-01-01", name: "Neujahr" },
  { date: "2027-01-18", name: "Martin Luther King Day" },
  { date: "2027-02-15", name: "Presidents Day" },
];

/** So viele bezahlte Urlaubstage haben wir für die sechs Monate. */
export const URLAUBSBUDGET = 8;
