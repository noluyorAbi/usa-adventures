export type Category =
  | "home"
  | "roadtrip"
  | "surf"
  | "hike"
  | "food"
  | "bar"
  | "activity"
  | "city"
  | "park"
  | "other";

export type Status = "wishlist" | "planned" | "visited";

export type TripDifficulty = "easy" | "medium" | "epic";

export interface Place {
  id: string;
  name: string;
  category: Category;
  lat: number;
  lng: number;
  status: Status;
  note: string;
  addedBy: string;
  tripId?: string | null;
  photoUrl?: string | null;
  plannedDate?: string | null; // ISO date
  visitedDate?: string | null; // ISO date
  loves: number;
  createdAt: string; // ISO

  // Reichere Details (optional, werden im Spot-Modal gezeigt)
  images?: string[]; // Bild-URLs (extern) oder Pfade wie /images/spot.jpg
  about?: string; // was den Ort einzigartig macht + warum hin
  bestTime?: string; // idealer Reisezeitraum, z.B. "Okt–Nov" oder "Frühjahr"
  highlights?: string[]; // 2-4 Stichpunkte: was man hier macht / bestellt
  tips?: string; // ein Insider-Tipp (1 Satz)
  address?: string; // Straße + Stadt, z.B. "1041 S Oxnard Blvd, Oxnard"
  website?: string; // volle URL, z.B. "https://…"
  priceLevel?: string; // "$" | "$$" | "$$$" oder "gratis" / "ab 45 $"
  state?: string; // US-State code, z.B. "CA", "NY" (für Staaten-Sammlung)
}

export type NewPlace = Omit<Place, "id" | "loves" | "createdAt">;

/** Ein Ausruestungsposten, wie ihn data/packing.ts pro Trip vorgibt. */
export interface TripPackItem {
  label: string;
  why: string;
  priority: "must" | "nice";
}

/**
 * Auto-Hinweis fuer einen Trip. Wir fahren einen BMW 330i: Heckantrieb,
 * wenig Bodenfreiheit, Premium-Sprit, oft kein Reserverad. Das entscheidet
 * bei manchen Zielen darueber, ob man ueberhaupt hinkommt.
 */
export type CarNoteKind = "road" | "fuel" | "winter" | "space" | "heat" | "law";

export interface CarNote {
  kind: CarNoteKind;
  text: string;
}

export interface TripPacking {
  extras: TripPackItem[];
  car: CarNote[];
}

/**
 * Ein Termin mit fremdbestimmtem Datum: Konzert, Rennen, Festival.
 *
 * Der Unterschied zum Trip ist nicht die Groesse, sondern wer das Datum
 * setzt. Einen Trip verschiebt man, ein Rennwochenende nicht. Deshalb
 * rechnet die App Events zuerst und legt die Trips drumherum.
 */
export type EventKind = "konzert" | "motorsport" | "sport" | "festival";

/**
 * Wie sicher der Preis ist. Geschaetzte Preise nie wie Fakten zeigen.
 *   bestaetigt  selbst beim Anbieter nachgelesen
 *   schaetzung  gerechnet oder aus Erfahrungswerten
 *   uebernommen aus einer fremden Recherche uebernommen, nicht nachgeprueft
 */
export type PreisQuelle = "bestaetigt" | "schaetzung" | "uebernommen";

export interface KostenPosten {
  label: string;
  /** USD pro Person */
  usd: number;
  quelle: PreisQuelle;
  note?: string;
}

export interface FixedEvent {
  id: string;
  title: string;
  artistOrSeries: string;
  kind: EventKind;
  /** ISO-Datum, erster Tag */
  startDate: string;
  /** ISO-Datum, letzter Tag. Bei eintaegigen Events gleich startDate. */
  endDate: string;
  city: string;
  state: string;
  venue: string;
  lat: number;
  lng: number;
  color: string;
  /** "gesetzt" = Ticket-Entscheidung gefallen, "option" = Alternative */
  status: "gesetzt" | "option";
  /** Kostenaufstellung pro Person */
  kosten: KostenPosten[];
  /**
   * Abendtermin: findet nach Feierabend statt und kostet deshalb keinen
   * Urlaubstag, auch wenn er auf einen Werktag faellt. Ein Konzert am
   * Mittwochabend ist kein freier Tag, nur ein kurzer Donnerstag.
   */
  abendtermin?: boolean;
  /** Anreise ab Camarillo: "Auto, 1 h 15" oder "Flug LAX nach AUS" */
  anreise: string;
  /** Warum dieses Datum und nicht ein anderes */
  begruendung: string;
  /** Worauf zu achten ist, ein bis drei Saetze */
  hinweis?: string;
  ticketUrl?: string;
}

/* ── Kamera und Ausruestung ──────────────────────────────────────── */

/**
 * Ob das Geraet in den USA ueberhaupt legal verkauft wird. Seit dem
 * 22.12.2025 steht DJI auf der FCC Covered List: bereits zugelassene
 * Geraete bleiben verkaeuflich, neue bekommen keine Zulassung mehr.
 * Das entscheidet, ob man in Deutschland oder drueben kauft.
 */
export type UsStatus = "offiziell" | "gesperrt" | "zu-pruefen";

export interface KameraOption {
  id: string;
  name: string;
  /** Kurzform fuer die Tabelle, z.B. "Gimbal-Kamera" */
  typ: string;
  preisDe?: number;
  preisUs?: number;
  quelleDe?: PreisQuelle;
  quelleUs?: PreisQuelle;
  usStatus: UsStatus;
  /** Was sie besonders gut kann */
  staerke: string;
  /** Wo sie versagt */
  schwaeche: string;
  /** "empfehlung" hebt genau eine Zeile hervor */
  urteil: "empfehlung" | "moeglich" | "verworfen";
  begruendung: string;
}

export type GearAktion = "mitnehmen" | "kaufen-de" | "kaufen-us" | "spaeter";

export interface GearItem {
  id: string;
  name: string;
  aktion: GearAktion;
  /** EUR bei kaufen-de, USD bei kaufen-us, sonst leer */
  preis?: number;
  quelle?: PreisQuelle;
  wofuer: string;
  hinweis?: string;
}

export interface Trip {
  id: string;
  name: string;
  color: string;
  region: string; // short subtitle, e.g. "Big Island · Maui · Oahu"
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  /** One-line mood line shown on trip cards */
  tagline?: string;
  /** Vibe label, e.g. "Coastal chill" */
  vibe?: string;
  /** Rough trip length in days */
  estimatedDays?: number;
  /** Best season window in German, e.g. "Herbst", "Winter" */
  season?: string;
  difficulty?: TripDifficulty;
}

/* ── Einkauf, Raten, Fotokamera, 3D-Druck ─────────────────────────── */

/** Wie ein Shop die Rate anbietet. Klarna ist eine Zahlart im Checkout, kein eigener Link. */
export type RatenArt = "mm0" | "klarna" | "paypal" | "otto" | "keine";

export interface Angebot {
  shop: string;
  preis: number;
  url: string;
  raten: RatenArt[];
  quelle: PreisQuelle;
  hinweis?: string;
}

export type KaufKategorie = "kamera" | "speicher" | "schutz";

export interface KaufProdukt {
  id: string;
  name: string;
  kurz: string;
  kategorie: KaufKategorie;
  /** Steht in der Standardauswahl */
  standard: boolean;
  /** Menge, z.B. zwei Karten */
  menge?: number;
  idealoMin?: number;
  idealoUrl?: string;
  angebote: Angebot[];
  warum: string;
  /** Wenn ein 3D-Druck den Kauf ersetzt: id des Modells */
  druckErsatz?: string;
}

export interface Finanzierung {
  id: string;
  label: string;
  anbieter: string;
  monate: number;
  /** effektiver Jahreszins in Prozent */
  zins: number;
  hinweis: string;
  /** Welche RatenArt ein Angebot bieten muss */
  braucht: RatenArt | null;
}

export interface FotoKamera {
  id: string;
  name: string;
  neuMin?: number;
  neuUrl?: string;
  gebraucht?: string;
  gebrauchtVon?: number;
  gebrauchtUrl?: string;
  sensor: string;
  gewicht: string;
  gut: string;
  schlecht: string;
  urteil: "pick" | "moeglich" | "nein";
  unsicher?: boolean;
  kaufen: { label: string; url: string; raten: RatenArt[]; preis?: number }[];
}

export interface GebrauchtHaendler {
  name: string;
  klarna: "ja" | "rechnung" | "nein";
  sonst: string;
  garantie: string;
  url: string;
}

export type DruckKategorie =
  "pocket" | "speicher" | "mac" | "action" | "foto" | "reise" | "auto";

export interface DruckModell {
  id: string;
  name: string;
  kategorie: DruckKategorie;
  site: string;
  url: string;
  frei: "ja" | "nein" | "pruefen";
  warum: string;
  material: "PLA" | "PETG" | "ASA" | "TPU";
  stuetzen?: boolean;
  /** Ersetzt dieses Kaufprodukt */
  ersetzt?: string;
  top?: boolean;
}
