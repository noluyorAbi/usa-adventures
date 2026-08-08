import type { TripPacking } from "@/lib/types";

/**
 * ═══════════════════════════════════════════════════════════════════
 *  PACKLISTEN JE TRIP  +  AUTO-HINWEISE
 * ═══════════════════════════════════════════════════════════════════
 *
 * lib/packing.ts baut eine Liste aus Basis-Ausrüstung, den Kategorien der
 * Spots und der Saison. Das ist generisch. Hier steht, was NUR für diesen
 * einen Trip gilt, und was das Auto dabei vorgibt.
 *
 * Unser Auto ist ein BMW 330i:
 *   - Heckantrieb, in Kalifornien im Winter das entscheidende Detail. Bei
 *     Chain Control R2 darf ohne Ketten nur durch, wer Allrad UND Winter-
 *     reifen hat. Das sind wir nicht.
 *   - Rund 14 cm Bodenfreiheit, also keine ausgewaschenen Pisten.
 *   - Premium, 91 Oktan. Regular reicht nicht.
 *   - Viele BMW fahren mit Runflats und ohne Reserverad. In der Wüste ohne
 *     Empfang ist das der Unterschied zwischen Ärger und Notlage.
 *
 * NEUEN EINTRAG ANLEGEN:
 *   Schlüssel ist die tripId aus data/trips.ts. extras kommen zusätzlich
 *   zur generierten Liste, car erscheint als eigener Block im Panel.
 */
export const TRIP_PACKING: Record<string, TripPacking> = {
  "trip-sierra": {
    extras: [
      {
        label: "Schneeketten passend zur Reifengröße",
        why: "Sierra-Pässe haben ab Oktober Kontrollen",
        priority: "must",
      },
      {
        label: "Bärensichere Aufbewahrung beachten",
        why: "In Yosemite darf nichts Essbares im Auto bleiben",
        priority: "must",
      },
      {
        label: "Mütze und Handschuhe",
        why: "Tunnel View liegt auf 1.500 m, morgens um den Gefrierpunkt",
        priority: "must",
      },
      {
        label: "Taschenlampe",
        why: "Sonnenuntergang im Oktober schon gegen 18:15",
        priority: "must",
      },
      {
        label: "Offline-Karten für Yosemite und die 395",
        why: "Im Valley und am Tioga Pass gibt es keinen Empfang",
        priority: "must",
      },
      {
        label: "Bargeld für Bodie",
        why: "State Park, Kartenzahlung nicht garantiert",
        priority: "nice",
      },
    ],
    car: [
      {
        kind: "winter",
        text: "Tioga Pass schließt nach dem ersten größeren Schneefall, oft Anfang bis Mitte November, und öffnet erst im Mai wieder. Ohne ihn wird aus einer Stunde nach Mono Lake ein Umweg von sieben. Vor der Abfahrt Caltrans QuickMap und den Yosemite-Straßenstatus prüfen.",
      },
      {
        kind: "winter",
        text: "Chain Control R2 bedeutet für uns Ketten, weil der 330i Heckantrieb hat. Ohne Ketten im Kofferraum weist die Kontrolle uns ab. Ketten in der richtigen Größe vorher kaufen, vor Ort kosten sie das Doppelte.",
      },
      {
        kind: "road",
        text: "Die letzten fünf Kilometer nach Bodie sind unbefestigt. Bei Trockenheit im Schritttempo machbar, nach Regen oder Schnee nicht. Im Zweifel den Abstecher streichen statt die Felgen zu opfern.",
      },
      {
        kind: "fuel",
        text: "Zwischen Lee Vining und Bishop liegen 100 km ohne verlässliche Tankstelle, und was es gibt, ist teuer. In Oakhurst oder Mariposa volltanken, Premium.",
      },
    ],
  },

  "trip-deathvalley": {
    extras: [
      {
        label: "Vier Gallonen Wasser im Kofferraum",
        why: "Reserve fürs Auto und für uns, unabhängig vom Trinkwasser",
        priority: "must",
      },
      {
        label: "Reifenpannenset oder Reserverad klären",
        why: "Viele BMW fahren Runflats ohne Ersatzrad",
        priority: "must",
      },
      {
        label: "Papierkarte des Parks",
        why: "Im Tal gibt es fast nirgends Empfang",
        priority: "must",
      },
      {
        label: "Stirnlampe mit Rotlicht",
        why: "Dark Sky Park, Rotlicht schont die Nachtsicht",
        priority: "must",
      },
      {
        label: "Warme Schicht für nachts",
        why: "Im Januar fällt es nach Sonnenuntergang unter 5 Grad",
        priority: "must",
      },
      {
        label: "Stativ",
        why: "Milchstraße über den Dünen braucht lange Belichtung",
        priority: "nice",
      },
      {
        label: "Alte Turnschuhe für die Dünen",
        why: "Sand kommt überall rein und bleibt drin",
        priority: "nice",
      },
    ],
    car: [
      {
        kind: "fuel",
        text: "Im Park kostet Sprit deutlich mehr als draußen. Vor der Einfahrt in Baker, Ridgecrest oder Lone Pine volltanken. Furnace Creek und Stovepipe Wells sind die einzigen Zapfsäulen im Tal.",
      },
      {
        kind: "road",
        text: "Racetrack Playa mit den wandernden Steinen und Titus Canyon sind für uns gestrichen: 43 km scharfkantiger Schotter, die regelmäßig Reifen zerlegen. Ersatz sind Badwater, Zabriskie, Dantes View und die Dünen, alle asphaltiert erreichbar.",
      },
      {
        kind: "road",
        text: "Artists Drive ist asphaltiert und geht problemlos, aber eng und einspurig. Fahrzeuge über 7,6 m sind verboten, uns betrifft das nicht.",
      },
      {
        kind: "heat",
        text: "Januar ist die richtige Zeit: tagsüber angenehme 18 bis 20 Grad. Im Sommer läuft hier die Klimaanlage gegen 50 Grad an und Motoren kochen. Deshalb steht der Trip im Winterfenster.",
      },
      {
        kind: "law",
        text: "Auf der 395 und im Park wird konsequent geblitzt. Die Strecke verleitet, weil sie leer und gerade ist.",
      },
    ],
  },

  "trip-pch": {
    extras: [
      {
        label: "Windjacke",
        why: "Am Kap zieht es auch bei Sonne",
        priority: "must",
      },
      {
        label: "Fernglas",
        why: "Wale, Seeotter und die Robben bei San Simeon",
        priority: "must",
      },
      {
        label: "Taschenlampe für die Bear Gulch Cave",
        why: "In Pinnacles ist die Höhle stockdunkel",
        priority: "must",
      },
      {
        label: "Hearst-Castle-Tickets vorab",
        why: "Führungen sind am Wochenende Wochen vorher weg",
        priority: "must",
      },
      {
        label: "Reisetabletten",
        why: "Big Sur ist eine Kurve nach der anderen",
        priority: "nice",
      },
    ],
    car: [
      {
        kind: "road",
        text: "Der Hwy 1 durch Big Sur wird nach Erdrutschen immer wieder abschnittsweise gesperrt, teils monatelang. Vor der Fahrt Caltrans QuickMap prüfen. Umleitung ist die 101 durch das Landesinnere, das kostet etwa zwei Stunden.",
      },
      {
        kind: "fuel",
        text: "Zwischen Carmel und Cambria liegen rund 150 Kurvenkilometer mit wenigen, sehr teuren Tankstellen. In Monterey oder Cambria volltanken.",
      },
      {
        kind: "space",
        text: "Der Kofferraum fasst rund 480 Liter. Für zwei Personen mit Wochenendgepäck reicht das, mit Campingausrüstung wird es eng. Weiche Taschen packen besser als Hartschalenkoffer.",
      },
    ],
  },

  "trip-ski": {
    extras: [
      {
        label: "Schneeketten und Handschuhe zum Auflegen",
        why: "Ketten anlegen bei Schneematsch ohne Handschuhe ist elend",
        priority: "must",
      },
      {
        label: "Eiskratzer und Enteiserspray",
        why: "Steht in keinem Mietwagen und in unserem auch nicht",
        priority: "must",
      },
      {
        label: "Skipass vorab online",
        why: "An der Kasse kostet es spürbar mehr",
        priority: "nice",
      },
      {
        label: "Sonnenbrille mit hoher Kategorie",
        why: "Schnee auf 2.700 m blendet extrem",
        priority: "must",
      },
    ],
    car: [
      {
        kind: "winter",
        text: "Heckantrieb plus Sommerreifen ist die schlechteste Kombination für den Berg. Ketten sind bei uns nicht optional, sondern Zufahrtsvoraussetzung. Vor der Abfahrt einmal trocken üben, im Schneematsch am Straßenrand lernt man das ungern.",
      },
      {
        kind: "winter",
        text: "Chain Control hat drei Stufen: R1 Ketten außer mit Winterreifen, R2 Ketten außer mit Allrad und Winterreifen, R3 Ketten für alle. Ab R2 brauchen wir sie in jedem Fall.",
      },
      {
        kind: "road",
        text: "Die 395 nach Mammoth ist gut ausgebaut, aber der Abschnitt über den Sherwin Summit auf 2.200 m kann bei Sturm gesperrt werden. Alternative ist warten, nicht ausweichen.",
      },
    ],
  },

  "trip-southwest": {
    extras: [
      {
        label: "America the Beautiful Jahrespass",
        why: "80 $ statt 30 bis 35 $ je Park, ab dem dritten Park billiger",
        priority: "must",
      },
      {
        label: "Trinkblase oder zwei große Flaschen",
        why: "Canyons haben oben Wasser, unten nicht",
        priority: "must",
      },
      {
        label: "Lippenpflege und Nasenspray",
        why: "Wüstenluft trocknet in Stunden aus",
        priority: "nice",
      },
      {
        label: "Zion-Shuttle-Zeiten prüfen",
        why: "Ins Tal darf man saisonal nur mit dem Shuttle",
        priority: "must",
      },
    ],
    car: [
      {
        kind: "fuel",
        text: "Zwischen Baker und Las Vegas sowie auf der 89 Richtung Page gibt es lange Abschnitte ohne Tankstelle. Faustregel für den Trip: unter einem Viertel Tank wird die nächste Gelegenheit genutzt, nicht die übernächste.",
      },
      {
        kind: "road",
        text: "Antelope Canyon ist nur mit Führung zugänglich, die Zufahrt macht der Veranstalter mit eigenen Fahrzeugen. Unser Auto bleibt auf dem Parkplatz, das ist gut so.",
      },
      {
        kind: "law",
        text: "Nevada und Arizona haben eigene Tempolimits bis 120 km/h, Utah teils mehr. Kalifornische Gewohnheiten passen dort nicht, und die Highway Patrol misst aus der Luft.",
      },
    ],
  },

  "trip-weekend": {
    extras: [
      {
        label: "Badesachen dauerhaft im Kofferraum",
        why: "Spontane Strandstopps scheitern sonst an Logistik",
        priority: "nice",
      },
      {
        label: "Picknickdecke",
        why: "Weinstraße und Strände ohne Restaurantpflicht",
        priority: "nice",
      },
      {
        label: "Ketten, wenn es Richtung Sequoia geht",
        why: "Generals Hwy ist im Winter kettenpflichtig",
        priority: "must",
      },
    ],
    car: [
      {
        kind: "road",
        text: "Alles in diesem Trip liegt unter vier Stunden ab Oxnard und ist durchgehend asphaltiert. Der einzige Haken ist die Generals Hwy im Sequoia: kurvig, steil, im Winter mit Kontrolle.",
      },
      {
        kind: "law",
        text: "Bei der Weinstraße fährt einer und trinkt nichts. Kalifornien liegt bei 0,08 Promille, und Verkostungsmengen summieren sich schneller als man denkt.",
      },
    ],
  },

  "trip-sd-baja": {
    extras: [
      {
        label: "Reisepass, nicht nur der Führerschein",
        why: "Für Mexiko und die Rückreise zwingend",
        priority: "must",
      },
      {
        label: "Ausdruck des DS-2019",
        why: "Wiedereinreise in die USA mit J-1",
        priority: "must",
      },
      {
        label: "Pesos in bar",
        why: "Kleine Stände in Ensenada nehmen keine Karte",
        priority: "must",
      },
      {
        label: "Wasser in Flaschen für Baja",
        why: "Leitungswasser meiden",
        priority: "must",
      },
    ],
    car: [
      {
        kind: "law",
        text: "Die US-Autoversicherung gilt in Mexiko nicht. Ohne mexikanische Kfz-Versicherung ist die Fahrt über die Grenze ein echtes Risiko. Günstiger und einfacher: das Auto auf US-Seite parken und zu Fuß oder mit dem Trolley nach Tijuana.",
      },
      {
        kind: "law",
        text: "Bei einem BMW mit deutschem Fahrer sind Kontrollen wahrscheinlicher. Führerschein, internationaler Führerschein und Fahrzeugpapiere zusammen griffbereit halten.",
      },
      {
        kind: "road",
        text: "Die Wartezeit an der Grenze zurück in die USA beträgt an Wochenenden regelmäßig zwei bis drei Stunden. Früh zurückfahren oder die SENTRI-Spuren meiden, die sind für Registrierte.",
      },
    ],
  },

  "trip-desert-night": {
    extras: [
      {
        label: "Rotlicht-Stirnlampe",
        why: "Weißes Licht ruiniert die Nachtsicht für alle",
        priority: "must",
      },
      {
        label: "Campingstuhl oder Decke",
        why: "Stundenlang nach oben schauen geht im Stehen nicht",
        priority: "must",
      },
      {
        label: "Sternenkarten-App offline geladen",
        why: "Kein Empfang im Park",
        priority: "nice",
      },
      {
        label: "Dicke Jacke, auch bei 25 Grad tagsüber",
        why: "Wüstennächte fallen um 20 Grad ab",
        priority: "must",
      },
    ],
    car: [
      {
        kind: "road",
        text: "Joshua Tree ist auf den Hauptstraßen komplett asphaltiert. Die Pinto Basin Road ist lang und leer, aber problemlos. Geneva-artige Pisten wie die Berdoo Canyon Road sind für uns tabu.",
      },
      {
        kind: "fuel",
        text: "Im Park gibt es keine Tankstelle. In Twentynine Palms oder Yucca Valley tanken, beide direkt vor den Eingängen.",
      },
      {
        kind: "heat",
        text: "Bei Nachtbeobachtung steht das Auto stundenlang. Innenlicht und Warnblinker aus, sonst ist morgens die Batterie leer und es kommt niemand vorbei.",
      },
    ],
  },

  "trip-local": {
    extras: [
      {
        label: "Ausweis für Bars",
        why: "21+ wird auch mit 22 kontrolliert, immer physisch",
        priority: "must",
      },
      {
        label: "Handtuch hinter dem Sitz",
        why: "Ventura und Oxnard sind zehn Minuten weg",
        priority: "nice",
      },
    ],
    car: [
      {
        kind: "law",
        text: "Kalifornien verlangt innerhalb von 20 Tagen nach Wohnsitznahme eine US-Fahrerlaubnis, wenn man hier arbeitet. Für die ersten Wochen reicht der deutsche Führerschein plus internationaler.",
      },
      {
        kind: "space",
        text: "In Oxnard und Ventura ist Straßenparken meist gratis, in Santa Barbara nur die ersten 75 Minuten in den Stadtgaragen. Danach wird es schnell teuer.",
      },
    ],
  },

  "trip-socal": {
    extras: [
      {
        label: "Powerbank",
        why: "Navigation und Fotos ziehen den Akku leer",
        priority: "must",
      },
      {
        label: "Sonnenbrille im Auto lassen",
        why: "Die 101 fährt abends direkt in die Sonne",
        priority: "nice",
      },
    ],
    car: [
      {
        kind: "road",
        text: "Der 101 zwischen Oxnard und LA steht werktags ab 15:00 und morgens ab 06:30. Für Termine in LA eine Stunde Puffer, nicht dreißig Minuten.",
      },
      {
        kind: "law",
        text: "Carpool-Spuren auf der 101 und der 405 dürfen mit zwei Personen benutzt werden. Zu zweit ist das der größte Zeitgewinn überhaupt.",
      },
      {
        kind: "fuel",
        text: "Der 330i will Premium mit 91 Oktan. Regular spart ein paar Cent und kostet Leistung, die Preisdifferenz in Kalifornien ist ohnehin gering.",
      },
    ],
  },

  "trip-hawaii": {
    extras: [
      {
        label: "Riffschonende Sonnencreme",
        why: "Oxybenzon ist auf Hawaii verboten",
        priority: "must",
      },
      {
        label: "Wasserschuhe",
        why: "Lavagestein an vielen Stränden",
        priority: "must",
      },
      {
        label: "Regenjacke für die Road to Hana",
        why: "Die Ostseite von Maui ist Regenwald",
        priority: "must",
      },
    ],
    car: [
      {
        kind: "space",
        text: "Unser Auto bleibt in Oxnard. Auf den Inseln braucht es einen Mietwagen, und dafür eine echte Kreditkarte auf den Namen des Fahrers. Debitkarten werden am Schalter regelmäßig abgelehnt.",
      },
    ],
  },
};
