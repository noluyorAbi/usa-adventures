import type { GearItem, KameraOption } from "@/lib/types";

/**
 * ═══════════════════════════════════════════════════════════════════
 *  KAMERA UND AUSRÜSTUNG
 * ═══════════════════════════════════════════════════════════════════
 *
 * Sechs Monate dokumentieren, am Ende ein Kurzfilm. Die Frage ist nicht
 * "welche Kamera ist die beste", sondern "welche nimmt man täglich mit,
 * und wo kauft man sie".
 *
 * DER PUNKT, DER ALLES ENTSCHEIDET: Seit dem 22.12.2025 steht DJI auf
 * der FCC Covered List. Bereits zugelassene Geräte (Pocket 3, Action 5
 * Pro, Nano) bleiben in den USA verkäuflich, die neuen (Pocket 4,
 * Pocket 4P) bekommen keine Zulassung und dürfen dort nicht verkauft
 * oder zum Verkauf eingeführt werden. Auf Amazon US tauchen sie nur
 * über Graumarkt-Händler zu rund 980 USD auf, gegen 599 EUR in
 * Deutschland. Dazu kommt: in den USA gibt es für diese Modelle keinen
 * DJI-Service. Sechs Monate ohne Reparaturweg.
 *
 * PREISE:
 *   quelleUs "bestaetigt"  = am 17.08.2026 selbst nachgelesen
 *   quelleDe "uebernommen" = aus der eigenen Vorrecherche vom 14. und
 *                            17.08.2026, hier nicht nachgeprüft
 *
 * Feldnamen bleiben bewusst ohne Umlaute, nur die Anzeigetexte haben
 * welche. Sonst bricht jede Suche über die Datei.
 */

export const KAMERA_OPTIONEN: KameraOption[] = [
  {
    id: "cam-pocket3-combo",
    name: "DJI Osmo Pocket 3, Creator Combo",
    typ: "Gimbal-Kamera, 1-Zoll-Sensor",
    preisDe: 399,
    preisUs: 550,
    quelleDe: "uebernommen",
    quelleUs: "schaetzung",
    usStatus: "offiziell",
    staerke:
      "Mechanischer 3-Achsen-Gimbal, also ruhige Aufnahmen im Gehen. Mikrofon, Akkugriff und Stativ sind im Paket. So klein, dass sie täglich mitkommt.",
    schwaeche: "Kein optischer Zoom, nicht wasserdicht, Fotos nur brauchbar.",
    urteil: "empfehlung",
    begruendung:
      "Für das Ziel „sechs Monate dokumentieren“ die richtige Wahl: der Gimbal ist genau das, was aus Handyaufnahmen einen Reisefilm macht, und das Combo spart den Zubehörkauf. In Deutschland rund 150 EUR günstiger als in den USA, also vor dem Abflug kaufen.",
  },
  {
    id: "cam-pocket3-standard",
    name: "DJI Osmo Pocket 3, Standard",
    typ: "Gimbal-Kamera, 1-Zoll-Sensor",
    preisDe: 299,
    preisUs: 439,
    quelleDe: "uebernommen",
    quelleUs: "bestaetigt",
    usStatus: "offiziell",
    staerke: "Dieselbe Kamera wie oben, 100 EUR günstiger.",
    schwaeche:
      "Ohne Funkmikrofon und Akkugriff. Beides einzeln nachzukaufen kostet mehr als die 100 EUR Aufpreis.",
    urteil: "moeglich",
    begruendung:
      "Die Budget-Variante, wenn die Reisekasse vor dem Abflug knapp wird. Das Mikrofon fehlt dann aber genau dort, wo es zählt: bei den Sprachaufnahmen für den Kurzfilm.",
  },
  {
    id: "cam-pocket4p",
    name: "DJI Osmo Pocket 4P",
    typ: "Gimbal-Kamera, zwei Objektive",
    preisDe: 599,
    preisUs: 980,
    quelleDe: "uebernommen",
    quelleUs: "bestaetigt",
    usStatus: "gesperrt",
    staerke:
      "Echtes zweites Objektiv mit 60 mm neben dem 20-mm-Weitwinkel. Für Porträts, Städte und Details ein spürbarer Unterschied, kein Digitalzoom.",
    schwaeche:
      "In den USA nicht offiziell erhältlich. Die Amazon-Angebote kommen von Graumarkt-Importeuren, und es gibt drüben keinen Servicefall.",
    urteil: "moeglich",
    begruendung:
      "Technisch die beste Ein-Geräte-Lösung. Wenn, dann nur in Deutschland und nur vor dem 10.09. Danach ist sie für sechs Monate weder nachkaufbar noch reparierbar. Die 200 EUR Aufpreis gegenüber dem Pocket-3-Combo sind ein echter Mehrwert, aber kein notwendiger.",
  },
  {
    id: "cam-pocket4",
    name: "DJI Osmo Pocket 4",
    typ: "Gimbal-Kamera, 1-Zoll-Sensor",
    preisDe: 489,
    quelleDe: "uebernommen",
    usStatus: "gesperrt",
    staerke: "Längerer Akku, 107 GB intern, besseres Tracking als Pocket 3.",
    schwaeche:
      "Rund 60 Prozent teurer als Pocket 3 Standard, ohne dass die Aufnahmen 60 Prozent besser aussehen. Interner Speicher hilft auf sechs Monaten kaum, gesichert wird ohnehin auf Karte und SSD.",
    urteil: "verworfen",
    begruendung:
      "Sitzt preislich zwischen den Stühlen: zu teuer gegen das Pocket-3-Combo, zu wenig gegen die 4P mit ihrem zweiten Objektiv. Wer mehr ausgeben will, nimmt gleich die 4P.",
  },
  {
    id: "cam-action5pro",
    name: "DJI Osmo Action 5 Pro",
    typ: "Action-Cam, wasserdicht",
    preisDe: 299,
    preisUs: 269,
    quelleDe: "uebernommen",
    quelleUs: "bestaetigt",
    usStatus: "offiziell",
    staerke:
      "20 m wasserdicht, montierbar, 4 h Akku. Überlebt Surf, Regen, Wanderung und Fahrtwind, wo die Pocket aufgibt.",
    schwaeche:
      "Nur elektronische Stabilisierung und Weitwinkel-Look. Als einzige Kamera für sechs Monate zu einseitig.",
    urteil: "moeglich",
    begruendung:
      "Die sinnvolle zweite Kamera, nicht die erste. In den USA günstiger als in Deutschland und dort offiziell erhältlich, also erst nach dem ersten vollen Gehalt am 16.10. kaufen, wenn überhaupt.",
  },
  {
    id: "cam-nano",
    name: "DJI Osmo Nano",
    typ: "POV-Minikamera, 52 g",
    preisUs: 299,
    quelleUs: "bestaetigt",
    usStatus: "offiziell",
    staerke: "Magnetisch tragbar, unauffällig, 4K. Gut für Fahrrad und POV.",
    schwaeche: "Kurzer Akku, wenig Speicher, kein Ersatz für eine Hauptkamera.",
    urteil: "verworfen",
    begruendung:
      "Löst kein Problem, das die Pocket nicht schon löst. Nur interessant, wenn später ein konkreter POV-Anlass auftaucht.",
  },
  {
    id: "cam-r50",
    name: "Canon EOS R50 mit 18 bis 150 mm",
    typ: "Systemkamera, APS-C",
    preisDe: 1030,
    quelleDe: "uebernommen",
    usStatus: "offiziell",
    staerke:
      "Deutlich bessere Fotos, Sucher, echter Zoom bis 240 mm Kleinbildäquivalent. Für Tiere in Nationalparks und Porträts die einzige Option in dieser Liste.",
    schwaeche:
      "Rund 690 g plus Tasche, im Gehen unruhig, und man hat sie abends in der Stadt eben nicht dabei.",
    urteil: "verworfen",
    begruendung:
      "Gute Kamera, falsches Ziel. Das Ziel heißt dokumentieren, nicht fotografieren lernen. Mit Zubehör über 1.100 EUR, das Zweieinhalbfache der Empfehlung, und sie konkurriert direkt mit der Reisekasse. Lässt sich jederzeit nachrüsten, die Reise nicht.",
  },
  {
    id: "cam-handy",
    name: "Smartphone plus DJI Osmo Mobile 8",
    typ: "Gimbal für das vorhandene Handy",
    preisDe: 115,
    quelleDe: "uebernommen",
    usStatus: "offiziell",
    staerke: "Billigste Lösung, das Handy ist ohnehin dabei.",
    schwaeche:
      "Handy am Stab ist im Alltag sperrig, der Akku geht für Navigation und Aufnahme gleichzeitig drauf, und die Clips liegen dort, wo man sie am wenigsten sortiert.",
    urteil: "moeglich",
    begruendung:
      "Der ehrliche Vergleichsmaßstab. Wenn nach zwei Wochen klar ist, dass ohnehin nur das Handy gezückt wird, wären 115 EUR statt 399 EUR die richtige Antwort gewesen. Für das Vorhaben Kurzfilm reicht es aber nicht.",
  },
];

/**
 * Die Packliste. Getrennt nach dem, was schon da ist, dem was vor dem
 * Abflug gekauft wird, und dem was drüben warten kann.
 */
export const GEAR: GearItem[] = [
  /* ── schon vorhanden ──────────────────────────────────────────── */
  {
    id: "g-handy",
    name: "Smartphone",
    aktion: "mitnehmen",
    wofuer: "Fotos, Zweitkamera, Schnitt unterwegs",
    hinweis:
      "Bleibt die Fotokamera. Die Pocket macht Video, das Handy macht Bilder, so muss keins von beiden alles können.",
  },
  {
    id: "g-laptop",
    name: "Laptop",
    aktion: "mitnehmen",
    wofuer: "Wöchentliches Sichern, später der Schnitt",
    hinweis:
      "Ohne wöchentliches Umkopieren wird aus sechs Monaten Material kein Film, sondern ein Kartenstapel.",
  },
  {
    id: "g-powerbank",
    name: "Powerbank und USB-C-Netzteil",
    aktion: "mitnehmen",
    wofuer: "Laden im Auto und unterwegs",
    hinweis:
      "US-Steckdosen liefern 120 V. Moderne USB-C-Netzteile können das, aber jedes Gerät mit festem Stecker braucht einen Adapter.",
  },
  {
    id: "g-stativ",
    name: "Kleines Stativ oder Klemme, falls vorhanden",
    aktion: "mitnehmen",
    wofuer: "Zeitraffer, Selbstaufnahmen, Nachtaufnahmen",
    hinweis: "Im Creator Combo ist ein Mini-Stativ enthalten, dann entfällt das.",
  },

  /* ── vor dem Abflug in Deutschland kaufen ─────────────────────── */
  {
    id: "g-pocket3",
    name: "DJI Osmo Pocket 3, Creator Combo",
    aktion: "kaufen-de",
    preis: 399,
    quelle: "uebernommen",
    wofuer: "Die Hauptkamera",
    hinweis:
      "Vor dem 10.09. kaufen, nicht drüben, und nicht erst am Flughafen auspacken. Zwei Wochen Vorlauf reichen, um zu wissen, wo die Tasten sitzen. Gleich am Anfang auf 30 oder 60 Bilder pro Sekunde stellen: das US-Stromnetz läuft mit 60 Hz, bei 25 oder 50 flackert jede Innenbeleuchtung.",
  },
  {
    id: "g-sd",
    name: "Zwei microSD-Karten, je 256 GB, V30",
    aktion: "kaufen-de",
    preis: 60,
    quelle: "schaetzung",
    wofuer: "Aufnahme und Rotation",
    hinweis:
      "Zwei Karten im Wechsel, nie beide gleichzeitig im Auto lassen. V30 ist das Minimum für 4K, langsamere Karten brechen die Aufnahme ab. 256 GB sind nicht für die Gesamtmenge gedacht, sondern für die Wochen ohne Laptop: acht Tage Südwesten oder zehn Tage Hawaii passen locker drauf.",
  },
  {
    id: "g-leser",
    name: "microSD-Kartenleser",
    aktion: "kaufen-de",
    preis: 15,
    quelle: "schaetzung",
    wofuer: "Karte in den Laptop bekommen",
    hinweis:
      "Klingt banal und ist der häufigste Grund, warum das wöchentliche Sichern ausfällt. Ein SD-Slot im Laptop hilft nicht, die Pocket schreibt auf microSD.",
  },
  {
    id: "g-etui",
    name: "Hartschalen-Etui",
    aktion: "kaufen-de",
    preis: 25,
    quelle: "schaetzung",
    wofuer: "Schutz im Rucksack",
    hinweis:
      "Der Gimbal ist das empfindliche Teil. Lose im Rucksack überlebt er das halbe Jahr nicht.",
  },

  /* ── drüben kaufen, nach dem ersten vollen Gehalt ─────────────── */
  {
    id: "g-ssd",
    name: "Externe SSD, 2 TB",
    aktion: "kaufen-us",
    preis: 120,
    quelle: "schaetzung",
    wofuer: "Wöchentliches Backup",
    hinweis:
      "Bewusst 2 TB, nicht 1. Die Speicherrechnung weiter unten kommt beim mittleren Szenario schon auf rund 1,7 TB, beim oberen auf fast 3. Eine 1-TB-Platte ist im Februar voll, und dann wird improvisiert statt gesichert. In den USA günstiger als hier und nicht eilig, also ab dem 16.10.",
  },
  {
    id: "g-cloud",
    name: "Offsite-Backup, sechs Monate",
    aktion: "kaufen-us",
    preis: 70,
    quelle: "schaetzung",
    wofuer: "Die Kopie, die nicht in derselben Wohnung liegt",
    hinweis:
      "Laptop und SSD liegen im selben Zimmer. Ein Einbruch oder ein Wohnungsbrand kostet dann beides und damit sechs Monate, die sich nicht nachdrehen lassen. Ein laufender Cloud-Sync ist die einzige Position auf dieser Liste, die einen Totalverlust verhindert.",
  },
  {
    id: "g-action5",
    name: "DJI Osmo Action 5 Pro",
    aktion: "kaufen-us",
    preis: 269,
    quelle: "bestaetigt",
    wofuer: "Wasser, Surf, Regen, Fahrtwind",
    hinweis:
      "Optional und nur, wenn sich zeigt, dass die Pocket an ihre Grenze kommt. In den USA offiziell erhältlich und billiger als in Deutschland, also bewusst dort kaufen.",
  },
  {
    id: "g-saugnapf",
    name: "Saugnapfhalterung fürs Auto",
    aktion: "kaufen-us",
    preis: 30,
    quelle: "schaetzung",
    wofuer: "Roadtrip-Aufnahmen aus dem 330i",
    hinweis: "Erst kaufen, wenn der erste Roadtrip terminiert ist.",
  },

  /* ── bewusst später oder gar nicht ────────────────────────────── */
  {
    id: "g-fotokamera",
    name: "Systemkamera",
    aktion: "spaeter",
    wofuer: "Bessere Fotos, Tiere, Porträts",
    hinweis:
      "Bewusst nicht jetzt. Wenn nach zwei Monaten klar ist, dass die Fotos wirklich fehlen, lässt sich das nachholen. Vorher wären es 1.100 EUR gegen eine Vermutung.",
  },
  {
    id: "g-drohne",
    name: "Drohne",
    aktion: "spaeter",
    wofuer: "Luftaufnahmen",
    hinweis:
      "In den Nationalparks ohnehin verboten, und DJI-Drohnen sind in den USA seit dem FCC-Eintrag ein eigenes Thema. Für diese Reise kein Thema.",
  },
];
