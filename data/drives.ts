/**
 * ═══════════════════════════════════════════════════════════════════
 *  FAHRZEITEN AB CAMARILLO
 * ═══════════════════════════════════════════════════════════════════
 *
 * Warum es das gibt: lib/geo.ts rechnet Luftlinie mal Faktor. Für ein
 * Wochenende reicht das, für die Frage "schaffe ich das nach der Arbeit"
 * nicht. In Südkalifornien entscheidet nicht die Entfernung, sondern die
 * Uhrzeit: dieselbe Strecke nach Downtown LA dauert sonntags 70 Minuten und
 * an einem Freitag um 17:00 gut zwei Stunden.
 *
 * `normal` ist freie Fahrt, `rush` die realistische Spanne im Berufsverkehr.
 * Beides gerundete Erfahrungswerte, keine Live-Daten: die App bleibt lokal
 * und fragt keine API.
 */

export interface Drive {
  id: string;
  ziel: string;
  /** Kilometer über die Straße, nicht Luftlinie */
  km: number;
  /** Minuten bei freier Fahrt */
  normal: number;
  /** Minuten im Berufsverkehr, null wenn es dort keinen gibt */
  rush: number | null;
  /** Die Strecke, die man tatsächlich fährt */
  route: string;
  note?: string;
}

export const DRIVES: Drive[] = [
  {
    id: "drive-bmw",
    ziel: "BMW Oxnard, unser Büro",
    km: 18,
    normal: 18,
    rush: 25,
    route: "101 Nord, Abfahrt Rice Ave",
    note: "Die einzige Strecke, die wir fünfmal die Woche fahren. Gegen den Hauptstrom, deshalb entspannt.",
  },
  {
    id: "drive-ventura",
    ziel: "Ventura, Pier und Downtown",
    km: 25,
    normal: 22,
    rush: 30,
    route: "101 Nord",
    note: "Nächster Ort mit Strandpromenade und Bars. Für einen Abend nach der Arbeit gut machbar.",
  },
  {
    id: "drive-ojai",
    ziel: "Ojai",
    km: 42,
    normal: 35,
    rush: 45,
    route: "101 Nord, dann 33 landeinwärts",
    note: "Bergort mit Kunstszene. Der Pink Moment bei Sonnenuntergang ist der Grund, spät zu fahren.",
  },
  {
    id: "drive-malibu",
    ziel: "Malibu, Zuma Beach",
    km: 55,
    normal: 45,
    rush: 70,
    route: "PCH 1 an der Küste entlang",
    note: "Die schönere Strecke nach LA. An Sommerwochenenden steht die PCH ab mittags.",
  },
  {
    id: "drive-sb",
    ziel: "Santa Barbara",
    km: 62,
    normal: 45,
    rush: 60,
    route: "101 Nord",
    note: "Bester Kompromiss aus Aufwand und Ertrag. Funktioniert auch als Feierabend-Trip.",
  },
  {
    id: "drive-santamonica",
    ziel: "Santa Monica",
    km: 85,
    normal: 65,
    rush: 110,
    route: "101 Süd, dann 405 Süd oder PCH",
    note: "Die 405 ist die unzuverlässigste Autobahn der Region. Über die PCH dauert es länger, aber planbarer.",
  },
  {
    id: "drive-hollywood",
    ziel: "Hollywood",
    km: 95,
    normal: 75,
    rush: 130,
    route: "101 Süd durchgehend",
    note: "Für Konzerte: drei Stunden vor Beginn losfahren. Metro B Line ab North Hollywood spart Parkgebühr und Nerven.",
  },
  {
    id: "drive-downtown",
    ziel: "Downtown LA",
    km: 100,
    normal: 80,
    rush: 140,
    route: "101 Süd bis zum Civic Center",
    note: "Der Klassiker für Fehlplanung. Freitag 17:00 sind zwei Stunden realistisch, sonntags früh reicht gut eine.",
  },
  {
    id: "drive-lax",
    ziel: "LAX Flughafen",
    km: 98,
    normal: 80,
    rush: 125,
    route: "101 Süd, 405 Süd",
    note: "Für Abflüge drei Stunden vorher losfahren. Das FlyAway-Shuttle ab Van Nuys ist die stressfreie Variante.",
  },
  {
    id: "drive-solvang",
    ziel: "Solvang",
    km: 105,
    normal: 75,
    rush: null,
    route: "101 Nord über Santa Barbara",
    note: "Dänisches Dorf im Santa Ynez Valley. Kein Berufsverkehr auf der Strecke.",
  },
  {
    id: "drive-sandiego",
    ziel: "San Diego",
    km: 300,
    normal: 195,
    rush: 260,
    route: "101 Süd, 405, 5 Süd",
    note: "Ein Freitagabend-Start kostet eine ganze Stunde extra. Samstag früh los ist deutlich besser.",
  },
  {
    id: "drive-joshuatree",
    ziel: "Joshua Tree NP",
    km: 330,
    normal: 210,
    rush: null,
    route: "101 Süd, 210 Ost, 10 Ost",
    note: "Wochenend-Distanz. Freitagabend anreisen, dann hat man zwei volle Tage.",
  },
  {
    id: "drive-sequoia",
    ziel: "Sequoia NP, Giant Forest",
    km: 400,
    normal: 270,
    rush: null,
    route: "101 Nord, 126, 5 Nord, 99, 198 Ost",
    note: "Die letzten 40 km sind Serpentinen. Im Winter mit Kettenkontrolle.",
  },
  {
    id: "drive-bigsur",
    ziel: "Big Sur, Bixby Bridge",
    km: 400,
    normal: 285,
    rush: null,
    route: "101 Nord, ab San Luis Obispo Hwy 1",
    note: "Reine Fahrzeit ohne Stopps, und Stopps sind hier der ganze Sinn. Realistisch ein voller Tag.",
  },
  {
    id: "drive-deathvalley",
    ziel: "Death Valley, Furnace Creek",
    km: 450,
    normal: 300,
    rush: null,
    route: "101 Süd, 210, 15 Nord, 190 Ost",
    note: "Letzte gute Tankstelle in Baker. Danach wird es teuer und dünn.",
  },
  {
    id: "drive-vegas",
    ziel: "Las Vegas",
    km: 470,
    normal: 300,
    rush: 390,
    route: "101 Süd, 210 Ost, 15 Nord",
    note: "Sonntagnachmittag steht die 15 zurück Richtung LA kilometerweit. Montagfrüh fahren oder Sonntag sehr früh.",
  },
  {
    id: "drive-yosemite",
    ziel: "Yosemite Valley",
    km: 480,
    normal: 330,
    rush: null,
    route: "101 Nord, 46 Ost, 99 Nord, 41 Nord",
    note: "Über fünf Stunden. Als Wochenende nur sinnvoll, wenn man Freitagabend fährt.",
  },
  {
    id: "drive-sf",
    ziel: "San Francisco",
    km: 560,
    normal: 360,
    rush: 420,
    route: "101 Nord durchgehend oder 5 Nord",
    note: "Über die 5 schneller und langweiliger, über die 101 schöner. Für einen Wochenendtrip zu weit.",
  },
];

/** Kilometer, ab denen ein Ziel für einen Feierabend ausscheidet. */
export const FEIERABEND_MINUTEN = 60;
