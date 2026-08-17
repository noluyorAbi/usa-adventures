import type { FixedEvent } from "@/lib/types";

/**
 * ═══════════════════════════════════════════════════════════════════
 *  FESTE TERMINE: KONZERTE UND RENNEN
 * ═══════════════════════════════════════════════════════════════════
 *
 * Trips kann man schieben, ein Konzert und ein Rennwochenende nicht.
 * Deshalb stehen die Termine hier zuerst fest und die Reisen in
 * data/trips.ts richten sich danach.
 *
 * PREISE: Alles mit `quelle: "schaetzung"` ist gerechnet, nicht gebucht.
 * Recherchestand 17.08.2026. Nur das F1-Grounds-Pass steht offiziell bei
 * COTA und ist deshalb `bestaetigt`.
 *
 * NEUEN TERMIN ANLEGEN: Block kopieren, Werte aendern. `status: "option"`
 * heisst, die App zeigt ihn als Alternative und zaehlt ihn nicht mit.
 */
export const EVENTS: FixedEvent[] = [
  /* ── EsDeeKid, Council House Rat Tour ─────────────────────────── */
  {
    id: "ev-esdeekid-la",
    title: "EsDeeKid, Council House Rat Tour",
    artistOrSeries: "EsDeeKid",
    kind: "konzert",
    startDate: "2026-10-07",
    endDate: "2026-10-07",
    city: "Los Angeles",
    state: "CA",
    venue: "Hollywood Palladium",
    lat: 34.0983,
    lng: -118.3268,
    color: "#b5468a",
    abendtermin: true,
    status: "gesetzt",
    anreise: "Auto ab Camarillo, rund 95 km, 1 h 15 bis 2 h je nach Verkehr",
    begruendung:
      "Von den drei Kalifornien-Terminen der einzige, der ab Camarillo an einem Abend hin und zurueck geht. Kostet null Urlaubstage.",
    hinweis:
      "Mittwochabend, also Arbeitstag. Doors meist 19:00, Ende gegen 23:00, danach eine gute Stunde zurueck. Der Donnerstag danach wird kurz. Parken am Palladium ist teuer und die Ausfahrt dauert, ein Platz in einer Seitenstrasse oder Metro B Line bis Hollywood/Vine ist entspannter.",
    ticketUrl: "https://www.ticketmaster.com/esdeekid-tickets/artist/4035134",
    kosten: [
      {
        label: "Ticket inkl. Gebuehren",
        usd: 85,
        quelle: "schaetzung",
        note: "GA Stehplatz, Palladium-Niveau",
      },
      {
        label: "Parken",
        usd: 35,
        quelle: "schaetzung",
        note: "Lot am Palladium, guenstiger per Metro",
      },
      {
        label: "Sprit hin und zurueck",
        usd: 22,
        quelle: "schaetzung",
        note: "190 km, 5,63 USD/gal Ventura County",
      },
      { label: "Essen und Trinken", usd: 40, quelle: "schaetzung" },
    ],
  },
  {
    id: "ev-esdeekid-sd",
    title: "EsDeeKid, San Diego",
    artistOrSeries: "EsDeeKid",
    kind: "konzert",
    startDate: "2026-10-12",
    endDate: "2026-10-12",
    city: "San Diego",
    state: "CA",
    venue: "SOMA",
    lat: 32.7509,
    lng: -117.2115,
    color: "#8b5cf6",
    status: "option",
    anreise: "Auto ab Camarillo, rund 300 km, 3 h ohne Verkehr",
    begruendung:
      "Faellt auf Columbus Day. Wenn BMW den Tag freigibt, wird daraus ein Kurztrip mit Uebernachtung statt eines Abends.",
    hinweis:
      "Columbus Day steht in data/holidays.ts als `assumed`. Erst wenn der BMW-Feiertagskalender vorliegt, ist das ein freier Tag. Sonst kostet der Termin einen Urlaubstag und der LA-Termin ist die bessere Wahl.",
    kosten: [
      { label: "Ticket inkl. Gebuehren", usd: 75, quelle: "schaetzung" },
      { label: "Uebernachtung, geteiltes Zimmer", usd: 90, quelle: "schaetzung" },
      { label: "Sprit hin und zurueck", usd: 70, quelle: "schaetzung" },
      { label: "Essen und Trinken", usd: 60, quelle: "schaetzung" },
    ],
  },
  {
    id: "ev-esdeekid-austin",
    title: "EsDeeKid, Austin",
    artistOrSeries: "EsDeeKid",
    kind: "konzert",
    startDate: "2026-10-16",
    endDate: "2026-10-16",
    city: "Austin",
    state: "TX",
    venue: "Stubb's Waller Creek Amphitheater",
    lat: 30.2681,
    lng: -97.7365,
    color: "#c45c26",
    status: "option",
    anreise: "Flug LAX oder BUR nach AUS",
    begruendung:
      "Waere der Traumfall, Konzert und Rennen in derselben Stadt. Geht aber nicht auf: zwischen dem 16.10. und dem Rennwochenende liegen neun Tage.",
    hinweis:
      "Beides in einer Reise hiesse zehn Tage Texas und rund sieben Urlaubstage, also fast das ganze Halbjahresbudget. Zwei getrennte Fluege waeren billiger als die Woche dazwischen. Deshalb: Konzert in LA, Rennen in Austin.",
    kosten: [
      { label: "Ticket inkl. Gebuehren", usd: 80, quelle: "schaetzung" },
      { label: "Zusatzflug", usd: 320, quelle: "schaetzung" },
    ],
  },

  /* ── Formel 1, Grosser Preis der USA ──────────────────────────── */
  {
    id: "ev-f1-cota",
    title: "Formel 1, Grosser Preis der USA",
    artistOrSeries: "Formel 1",
    kind: "motorsport",
    startDate: "2026-10-23",
    endDate: "2026-10-25",
    city: "Austin",
    state: "TX",
    venue: "Circuit of The Americas",
    lat: 30.1328,
    lng: -97.6411,
    color: "#e0567a",
    status: "gesetzt",
    anreise: "Flug LAX oder BUR nach AUS, rund 3 h",
    begruendung:
      "Das Rennen ist Sonntag, 25.10. Freitag Training, Samstag Qualifying. Anreise Donnerstagabend, Rueckflug Montagfrueh oder Sonntagnacht.",
    hinweis:
      "Nur der Freitag kostet einen Urlaubstag, der Rest ist Wochenende. Rennstart Sonntagnachmittag Ortszeit, die genaue Uhrzeit erst kurz vorher fix. COTA hat 2026 erstmals einen Donnerstag-Preview-Day (22.10.), der kostet einen zweiten Urlaubstag und ist optional. Hotels in Austin ziehen zum Rennwochenende stark an, je frueher gebucht desto besser. Shuttle statt Parkplatz nehmen, die Ausfahrt vom Gelaende dauert sonst Stunden.",
    ticketUrl: "https://circuitoftheamericas.com/event/f1/tickets/",
    kosten: [
      {
        label: "3-Tage General Admission",
        usd: 450,
        quelle: "bestaetigt",
        note: "COTA offiziell, inkl. Gebuehren. Tribuene ab rund 700 USD",
      },
      {
        label: "Flug LAX nach AUS, hin und zurueck",
        usd: 350,
        quelle: "schaetzung",
        note: "Rennwochenende, frueh buchen",
      },
      {
        label: "Hotel 3 Naechte, geteiltes Zimmer",
        usd: 600,
        quelle: "schaetzung",
        note: "200 USD pro Nacht und Person, Rennwochenende",
      },
      { label: "Mietwagen und Sprit, geteilt", usd: 130, quelle: "schaetzung" },
      {
        label: "Shuttle zur Strecke",
        usd: 60,
        quelle: "schaetzung",
        note: "Alternative zum Parkplatz",
      },
      { label: "Essen und Trinken, 4 Tage", usd: 200, quelle: "schaetzung" },
    ],
  },
];

/** Nur die Termine, die wirklich gebucht werden sollen. */
export const GESETZTE_EVENTS = EVENTS.filter((e) => e.status === "gesetzt");
