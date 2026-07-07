import type { Place } from "@/lib/types";

/**
 * ═══════════════════════════════════════════════════════════════════
 *  DIE ORTE / SPOTS  —  hier lebt fast alles
 * ═══════════════════════════════════════════════════════════════════
 *
 * WIE FÜGE ICH EINEN ORT HINZU? (auch ohne Coding-Erfahrung)
 *   1. Kopiere einen ganzen Block { ... } unten.
 *   2. Füge ihn darunter ein und ändere die Werte.
 *   3. Speichern. Die App zeigt ihn.
 *
 * FELDER:
 *   id           eindeutig, klein, mit Bindestrich   "spot-santa-cruz"
 *   name         Anzeigename                          "Santa Cruz"
 *   category     home|roadtrip|surf|hike|food|city|park|other
 *   lat, lng     Koordinaten (Google Maps: Rechtsklick -> Zahlen kopieren)
 *   status       wishlist | planned | visited
 *   note         kurze eigene Notiz
 *   addedBy      "Alperen" | "Justus" | "Crew" | eigener Name
 *   tripId       welche Reise? id aus data/trips.ts, oder null
 *   plannedDate  "2026-11-05" oder null
 *   visitedDate  "2026-11-05" oder null
 *   loves        Zahl (Herzchen)
 *   createdAt    Zeitstempel (kopieren + Datum ändern)
 *
 * OPTIONAL (erscheint im Detail-Modal, siehe docs/features/spot-modal.md):
 *   about        1-2 Sätze: was den Ort einzigartig macht + warum hin
 *   bestTime     idealer Reisezeitraum, z.B. "Sept–Okt" oder "Frühjahr"
 *   images       Liste von Bild-URLs. Empfehlung lokal: lege Dateien in
 *                public/images/spots/ und referenziere ["/images/spots/x.jpg"].
 *                Externe URLs ["https://…"] gehen auch.
 */
export const PLACES: Place[] = [
  // Unser Zuhause / Basis (home)
  {
    id: "seed-basecamp",
    name: "Basecamp Oxnard",
    category: "home",
    lat: 34.1975,
    lng: -119.1771,
    status: "visited",
    note: "Unsere Basis für 6 Monate. Strand 10 Min entfernt.",
    about:
      "Unser Zuhause auf Zeit: Strände, Erdbeerfelder, entspannter als LA — die perfekte ruhige Basis für alles andere.",
    bestTime: "das ganze Halbjahr",
    images: [],
    addedBy: "Crew",
    tripId: "trip-socal",
    plannedDate: null,
    visitedDate: "2026-09-21",
    loves: 2,
    createdAt: "2026-09-21T00:00:00Z",
  },
  {
    id: "seed-bmw-oxnard",
    name: "BMW Oxnard (unser Office)",
    category: "home",
    lat: 34.1432,
    lng: -119.1713,
    status: "visited",
    note: "Unser Praktikum — E-Systems & Total Vehicle Validation. BMW Engineering & Emissions Test Center, 5900 Arcturus Ave, Oxnard, CA 93033.",
    about:
      "Wo die Arbeit passiert: E-Systems & Total Vehicle Validation. Preproduction-Fahrzeuge (BMW, M, MINI, RR) hautnah.",
    bestTime: "Mo–Fr",
    images: [],
    addedBy: "Crew",
    tripId: "trip-socal",
    plannedDate: null,
    visitedDate: "2026-09-21",
    loves: 2,
    createdAt: "2026-09-21T00:10:00Z",
  },
  {
    id: "seed-camarillo",
    name: "Camarillo (unser Zuhause)",
    category: "home",
    lat: 34.2164,
    lng: -119.0376,
    status: "visited",
    note: "Wo wir wohnen — ~15 Min von Oxnard.",
    about:
      "Outlets, gutes Wetter, kurze Wege — unser Alltag zwischen Arbeit und Küste.",
    bestTime: "immer",
    images: [],
    addedBy: "Crew",
    tripId: "trip-socal",
    plannedDate: null,
    visitedDate: "2026-09-21",
    loves: 2,
    createdAt: "2026-09-21T00:20:00Z",
  },

  // SoCal
  {
    id: "seed-innout",
    name: "In-N-Out Oxnard",
    category: "food",
    lat: 34.2261,
    lng: -119.1618,
    status: "planned",
    note: "Animal style, day one ritual.",
    about: "Kalifornisches Fast-Food-Ritual. Frische Burger, Animal Style ist Pflicht.",
    bestTime: "Tag 1",
    images: [],
    addedBy: "Crew",
    tripId: "trip-socal",
    plannedDate: "2026-09-21",
    visitedDate: null,
    loves: 2,
    createdAt: "2026-09-21T06:00:00Z",
  },
  {
    id: "seed-ventura",
    name: "Ventura Pier",
    category: "surf",
    lat: 34.27,
    lng: -119.29,
    status: "planned",
    note: "Sunset surf check, closest good break.",
    about:
      "Entspannter Longboard-Spot direkt am historischen Pier, oft glassy zum Sonnenuntergang. Unser Hausstrand.",
    bestTime: "Sept–Nov (warm, sanfter Swell)",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Aerial_view_of_the_pier%2C_Ventura%2C_California_LCCN2013631292.tiff/lossy-page1-1280px-Aerial_view_of_the_pier%2C_Ventura%2C_California_LCCN2013631292.tiff.jpg",
    ],
    addedBy: "Justus",
    tripId: "trip-socal",
    plannedDate: "2026-09-27",
    visitedDate: null,
    loves: 1,
    createdAt: "2026-09-22T00:00:00Z",
  },
  {
    id: "seed-sb",
    name: "Santa Barbara",
    category: "city",
    lat: 34.4208,
    lng: -119.6982,
    status: "wishlist",
    note: "State Street, wine, red-tile roofs.",
    about:
      "American Riviera: spanische Architektur, Weinberge und palmengesäumte Strände. Nur 30 Min die Küste hoch.",
    bestTime: "Frühjahr & Herbst",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Santa_Barbara_Downtown_%28may_2012%29_%282%29_%28cropped%29.jpg/1280px-Santa_Barbara_Downtown_%28may_2012%29_%282%29_%28cropped%29.jpg",
    ],
    addedBy: "Alperen",
    tripId: "trip-socal",
    plannedDate: null,
    visitedDate: null,
    loves: 1,
    createdAt: "2026-09-22T00:00:00Z",
  },
  {
    id: "seed-malibu",
    name: "Zuma Beach, Malibu",
    category: "surf",
    lat: 34.0169,
    lng: -118.8221,
    status: "wishlist",
    note: "Classic Malibu beach day.",
    about:
      "Der Inbegriff SoCal-Beach: breiter Sand, Promis, gute Anfängerwellen. Perfekter Strandtag.",
    bestTime: "Mai–Okt",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/ZumaBeachCountyPark.jpg/1280px-ZumaBeachCountyPark.jpg",
    ],
    addedBy: "Justus",
    tripId: "trip-socal",
    plannedDate: null,
    visitedDate: null,
    loves: 0,
    createdAt: "2026-09-23T00:00:00Z",
  },
  {
    id: "seed-griffith",
    name: "Griffith Observatory, LA",
    category: "city",
    lat: 34.1184,
    lng: -118.3004,
    status: "wishlist",
    note: "Skyline + Hollywood sign at dusk.",
    about:
      "Beste Aussicht auf die LA-Skyline und das Hollywood-Sign, dazu eine kostenlose Sternwarte. Magisch zur blauen Stunde.",
    bestTime: "klare Abende, Herbst/Winter",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Griffith_observatory_2006.jpg/1280px-Griffith_observatory_2006.jpg",
    ],
    addedBy: "Alperen",
    tripId: "trip-socal",
    plannedDate: null,
    visitedDate: null,
    loves: 2,
    createdAt: "2026-09-23T00:00:00Z",
  },
  {
    id: "seed-santamonica",
    name: "Santa Monica Pier",
    category: "city",
    lat: 34.0089,
    lng: -118.4973,
    status: "wishlist",
    note: "End of Route 66. Ferris wheel over the ocean.",
    about:
      "Das Ende der Route 66: Riesenrad überm Pazifik, Pier-Feeling, breiter Strand. Purer SoCal-Postkarten-Vibe.",
    bestTime: "Sommerabende",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Santa_monica_pier_entrance_evening.jpg/1280px-Santa_monica_pier_entrance_evening.jpg",
    ],
    addedBy: "Justus",
    tripId: "trip-socal",
    plannedDate: null,
    visitedDate: null,
    loves: 1,
    createdAt: "2026-09-23T02:00:00Z",
  },
  {
    id: "seed-channel",
    name: "Channel Islands NP",
    category: "park",
    lat: 34.0069,
    lng: -119.7785,
    status: "wishlist",
    note: "Ferry from Ventura. Kayak sea caves.",
    about:
      "Kaum besuchter Nationalpark direkt vor unserer Haustür — Kajak durch Seehöhlen, Robben, endemische Tiere. Die 'Galápagos Nordamerikas'.",
    bestTime: "Frühling–Herbst",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Channel_Islands_National_Park_by_Sentinel-2.jpg/1280px-Channel_Islands_National_Park_by_Sentinel-2.jpg",
    ],
    addedBy: "Crew",
    tripId: "trip-socal",
    plannedDate: null,
    visitedDate: null,
    loves: 1,
    createdAt: "2026-09-24T00:00:00Z",
  },

  // Pacific Coast Highway
  {
    id: "seed-bigsur",
    name: "Bixby Bridge, Big Sur",
    category: "roadtrip",
    lat: 36.3714,
    lng: -121.9026,
    status: "wishlist",
    note: "PCH Highway 1 north. The iconic photo.",
    about:
      "Die ikonische Küstenbrücke, wo Highway 1, Steilküste und Nebel verschmelzen — das Postkartenmotiv der PCH.",
    bestTime: "Sept–Okt (weniger Nebel)",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Bixby_Creek_Bridge%2C_California%2C_USA_-_May_2013.jpg/1280px-Bixby_Creek_Bridge%2C_California%2C_USA_-_May_2013.jpg",
    ],
    addedBy: "Alperen",
    tripId: "trip-pch",
    plannedDate: null,
    visitedDate: null,
    loves: 2,
    createdAt: "2026-09-25T00:00:00Z",
  },
  {
    id: "seed-sf",
    name: "San Francisco",
    category: "city",
    lat: 37.8079,
    lng: -122.475,
    status: "wishlist",
    note: "Golden Gate, the whole Bay.",
    about:
      "Golden Gate, Nebel, steile Hügel, Cable Cars — die dichtesten, europäischsten Stadt-Vibes der Westküste.",
    bestTime: "Sept–Okt (wärmster, klarster Monat)",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Golden_Gate_Bridge_as_seen_from_Battery_East.jpg/1280px-Golden_Gate_Bridge_as_seen_from_Battery_East.jpg",
    ],
    addedBy: "Alperen",
    tripId: "trip-pch",
    plannedDate: null,
    visitedDate: null,
    loves: 2,
    createdAt: "2026-09-27T00:00:00Z",
  },
  {
    id: "seed-seattle",
    name: "Seattle",
    category: "city",
    lat: 47.6062,
    lng: -122.3321,
    status: "wishlist",
    note: "Pacific NW. Coffee, Pike Place, rain.",
    about:
      "Grüne Regenstadt: Kaffee-Kultur, Pike Place Market, Wasser und Berge ringsum. Tor zum Pazifischen Nordwesten.",
    bestTime: "Jul–Sept (trocken)",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Seattle_Center_as_night_falls.jpg/1280px-Seattle_Center_as_night_falls.jpg",
    ],
    addedBy: "Justus",
    tripId: "trip-pch",
    plannedDate: null,
    visitedDate: null,
    loves: 1,
    createdAt: "2026-09-27T01:00:00Z",
  },

  // Southwest & canyons
  {
    id: "seed-joshua",
    name: "Joshua Tree NP",
    category: "park",
    lat: 33.8734,
    lng: -115.901,
    status: "wishlist",
    note: "Desert stars, boulder scrambling.",
    about:
      "Surreale Wüste aus Josuabäumen und Felsblöcken, einer der besten Sternenhimmel der USA. Kletter- und Fotografen-Traum.",
    bestTime: "Okt–April (nicht zu heiß)",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Joshua_Tree_-_Cyclops_%2B_Potato_Head_-_Sunrise.jpg/1280px-Joshua_Tree_-_Cyclops_%2B_Potato_Head_-_Sunrise.jpg",
    ],
    addedBy: "Justus",
    tripId: "trip-southwest",
    plannedDate: null,
    visitedDate: null,
    loves: 2,
    createdAt: "2026-09-24T00:00:00Z",
  },
  {
    id: "seed-vegas",
    name: "Las Vegas",
    category: "roadtrip",
    lat: 36.1699,
    lng: -115.1398,
    status: "wishlist",
    note: "4h drive. Long weekend detour.",
    about:
      "Neon, Shows, Buffets, Casinos — absurd und over-the-top, aber einmal muss man. Guter Ausgangspunkt für die Canyons.",
    bestTime: "Frühjahr/Herbst (mild)",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Las_Vegas_Strip_09_2017_4897.jpg/1280px-Las_Vegas_Strip_09_2017_4897.jpg",
    ],
    addedBy: "Alperen",
    tripId: "trip-southwest",
    plannedDate: null,
    visitedDate: null,
    loves: 1,
    createdAt: "2026-09-26T00:00:00Z",
  },
  {
    id: "seed-death",
    name: "Death Valley NP",
    category: "park",
    lat: 36.5054,
    lng: -117.0794,
    status: "wishlist",
    note: "Hottest place on earth. Go in winter.",
    about:
      "Extremste Landschaft der USA: Salzpfannen, Sanddünen, der tiefste Punkt Nordamerikas. Ausserirdisch schön.",
    bestTime: "Nov–März (sonst tödlich heiß)",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/9/98/Death_Valley_from_space.JPG",
    ],
    addedBy: "Justus",
    tripId: "trip-southwest",
    plannedDate: null,
    visitedDate: null,
    loves: 0,
    createdAt: "2026-09-27T00:00:00Z",
  },
  {
    id: "seed-sequoia",
    name: "Sequoia NP",
    category: "hike",
    lat: 36.4864,
    lng: -118.5658,
    status: "wishlist",
    note: "General Sherman, the giant trees.",
    about:
      "Die grössten Bäume der Erde — General Sherman ist der Volumen-Rekordhalter. Man fühlt sich winzig.",
    bestTime: "Mai–Okt (Strassen offen)",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/General_Sherman_Tree_in_Sequoia_National_Park_-_June_2022.jpg/1280px-General_Sherman_Tree_in_Sequoia_National_Park_-_June_2022.jpg",
    ],
    addedBy: "Justus",
    tripId: "trip-southwest",
    plannedDate: null,
    visitedDate: null,
    loves: 1,
    createdAt: "2026-09-26T00:00:00Z",
  },
  {
    id: "seed-yosemite",
    name: "Yosemite NP",
    category: "park",
    lat: 37.8651,
    lng: -119.5383,
    status: "wishlist",
    note: "Tunnel View, Half Dome. Big weekend.",
    about:
      "Granitkathedrale: El Capitan, Half Dome, donnernde Wasserfälle. Einer der schönsten Nationalparks der Welt.",
    bestTime: "Mai–Jun (Wasserfälle) & Sept–Okt",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Half_Dome_with_Eastern_Yosemite_Valley_%2850MP%29.jpg/1280px-Half_Dome_with_Eastern_Yosemite_Valley_%2850MP%29.jpg",
    ],
    addedBy: "Crew",
    tripId: "trip-southwest",
    plannedDate: null,
    visitedDate: null,
    loves: 2,
    createdAt: "2026-09-25T00:00:00Z",
  },
  {
    id: "seed-grandcanyon",
    name: "Grand Canyon NP",
    category: "park",
    lat: 36.1069,
    lng: -112.1129,
    status: "wishlist",
    note: "South Rim at sunrise. Bucket-list.",
    about:
      "Schiere, kaum fassbare Weite — eine der grossartigsten Naturkulissen der Welt. Sonnenaufgang am South Rim ist unvergesslich.",
    bestTime: "März–Mai & Sept–Nov",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Canyon_River_Tree_%28165872763%29.jpeg/1280px-Canyon_River_Tree_%28165872763%29.jpeg",
    ],
    addedBy: "Alperen",
    tripId: "trip-southwest",
    plannedDate: null,
    visitedDate: null,
    loves: 2,
    createdAt: "2026-09-28T00:00:00Z",
  },
  {
    id: "seed-zion",
    name: "Zion NP",
    category: "hike",
    lat: 37.2982,
    lng: -113.0263,
    status: "wishlist",
    note: "Angels Landing, The Narrows.",
    about:
      "Rote Sandstein-Schluchten, der Narrows-Hike durch den Fluss, Angels Landing für Schwindelfreie. Puren Adrenalin-Natur.",
    bestTime: "April–Mai & Sept–Okt",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/1/10/Zion_angels_landing_view.jpg",
    ],
    addedBy: "Justus",
    tripId: "trip-southwest",
    plannedDate: null,
    visitedDate: null,
    loves: 2,
    createdAt: "2026-09-28T01:00:00Z",
  },
  {
    id: "seed-antelope",
    name: "Antelope Canyon & Horseshoe Bend",
    category: "park",
    lat: 36.8619,
    lng: -111.3743,
    status: "wishlist",
    note: "Slot canyon light beams + the river bend.",
    about:
      "Slot-Canyon mit surrealen Lichtstrahlen und der berühmte Horseshoe-Bend-Flussbogen. Ein Foto-Jackpot.",
    bestTime: "März–Okt (Lichtstrahlen mittags im Sommer)",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Grand_Canyon_Horseshoe_Bend.jpg/1280px-Grand_Canyon_Horseshoe_Bend.jpg",
    ],
    addedBy: "Alperen",
    tripId: "trip-southwest",
    plannedDate: null,
    visitedDate: null,
    loves: 1,
    createdAt: "2026-09-28T02:00:00Z",
  },

  // Hawaii
  {
    id: "seed-waikiki",
    name: "Waikiki Beach, Oahu",
    category: "surf",
    lat: 21.2767,
    lng: -157.8266,
    status: "wishlist",
    note: "Learn to surf where surfing was born.",
    about:
      "Wo das Surfen zur Welt kam — sanfte, lange Wellen, Waikiki-Skyline und Diamond Head im Rücken.",
    bestTime: "April–Okt (trocken)",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/City_of_Waikiki_view.jpg/1280px-City_of_Waikiki_view.jpg",
    ],
    addedBy: "Crew",
    tripId: "trip-hawaii",
    plannedDate: null,
    visitedDate: null,
    loves: 2,
    createdAt: "2026-10-01T00:00:00Z",
  },
  {
    id: "seed-hana",
    name: "Road to Hana, Maui",
    category: "roadtrip",
    lat: 20.7504,
    lng: -156.0018,
    status: "wishlist",
    note: "600 curves, 54 bridges, waterfalls.",
    about:
      "600 Kurven, 54 Brücken, Wasserfälle und Dschungel — hier ist die Fahrt selbst das Ziel.",
    bestTime: "ganzjährig (früh starten)",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Hana_Highway_Millennium_Trail_Monument_and_Hana_Highway_Zero-Mile_Marker.jpg/1280px-Hana_Highway_Millennium_Trail_Monument_and_Hana_Highway_Zero-Mile_Marker.jpg",
    ],
    addedBy: "Alperen",
    tripId: "trip-hawaii",
    plannedDate: null,
    visitedDate: null,
    loves: 2,
    createdAt: "2026-10-01T01:00:00Z",
  },
  {
    id: "seed-volcanoes",
    name: "Volcanoes NP, Big Island",
    category: "park",
    lat: 19.4194,
    lng: -155.2885,
    status: "wishlist",
    note: "Active lava, Kilauea crater glow.",
    about:
      "Aktive Vulkane, glühende Krater, junge Lavafelder — hier entsteht die Erde vor deinen Augen.",
    bestTime: "ganzjährig; Kraterglühen nachts",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/P%C4%81hoehoe_and_Aa_flows_at_Hawaii.jpg/1280px-P%C4%81hoehoe_and_Aa_flows_at_Hawaii.jpg",
    ],
    addedBy: "Justus",
    tripId: "trip-hawaii",
    plannedDate: null,
    visitedDate: null,
    loves: 2,
    createdAt: "2026-10-01T02:00:00Z",
  },
  {
    id: "seed-napali",
    name: "Nā Pali Coast, Kauai",
    category: "hike",
    lat: 22.1741,
    lng: -159.6215,
    status: "wishlist",
    note: "Kalalau Trail cliffs. Jurassic Park scenery.",
    about:
      "Kathedralen-Steilküste von Kauai, nur zu Fuss oder per Boot erreichbar — die Jurassic-Park-Kulisse in echt.",
    bestTime: "Mai–Sept (Trail begehbar)",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/NaPali_overlook_Kalalau_Valley.jpg/1280px-NaPali_overlook_Kalalau_Valley.jpg",
    ],
    addedBy: "Alperen",
    tripId: "trip-hawaii",
    plannedDate: null,
    visitedDate: null,
    loves: 1,
    createdAt: "2026-10-01T03:00:00Z",
  },

  // East coast
  {
    id: "seed-nyc",
    name: "New York City",
    category: "city",
    lat: 40.7128,
    lng: -74.006,
    status: "wishlist",
    note: "The whole thing. Cross-country goal.",
    about:
      "Die Stadt schlechthin — Skyline, Museen, Broadway, Energie rund um die Uhr. Unser Cross-Country-Ziel.",
    bestTime: "Sept–Okt & Dez (Weihnachten)",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/1280px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg",
    ],
    addedBy: "Alperen",
    tripId: "trip-eastcoast",
    plannedDate: null,
    visitedDate: null,
    loves: 2,
    createdAt: "2026-10-05T00:00:00Z",
  },
  {
    id: "seed-dc",
    name: "Washington, D.C.",
    category: "city",
    lat: 38.9072,
    lng: -77.0369,
    status: "wishlist",
    note: "Monuments, Smithsonian (free).",
    about:
      "Monumente, die gratis Smithsonian-Museen, gebündelte US-Geschichte auf der National Mall.",
    bestTime: "Frühling (Kirschblüte) & Herbst",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/12-07-13-washington-by-RalfR-08.jpg/1280px-12-07-13-washington-by-RalfR-08.jpg",
    ],
    addedBy: "Justus",
    tripId: "trip-eastcoast",
    plannedDate: null,
    visitedDate: null,
    loves: 0,
    createdAt: "2026-10-05T01:00:00Z",
  },
  {
    id: "seed-miami",
    name: "Miami Beach",
    category: "surf",
    lat: 25.7907,
    lng: -80.13,
    status: "wishlist",
    note: "Art deco, warm water, Cuban food.",
    about:
      "Art-déco-Fassaden, warmes Wasser, kubanisches Essen und Nachtleben. Karibik-Feeling in den USA.",
    bestTime: "Nov–April (trocken, mild)",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Ocean_drive_day_2009j.JPG/1280px-Ocean_drive_day_2009j.JPG",
    ],
    addedBy: "Justus",
    tripId: "trip-eastcoast",
    plannedDate: null,
    visitedDate: null,
    loves: 1,
    createdAt: "2026-10-05T02:00:00Z",
  },

  // Rockies
  {
    id: "seed-yellowstone",
    name: "Yellowstone NP",
    category: "park",
    lat: 44.428,
    lng: -110.5885,
    status: "wishlist",
    note: "Geysers, bison, Grand Prismatic.",
    about:
      "Der erste Nationalpark der Welt: Geysire, die Grand Prismatic Spring, Bisons und Bären. Purer Wow-Faktor.",
    bestTime: "Jun–Sept (alles offen)",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/7/73/Grand_Canyon_of_yellowstone.jpg",
    ],
    addedBy: "Crew",
    tripId: "trip-rockies",
    plannedDate: null,
    visitedDate: null,
    loves: 2,
    createdAt: "2026-10-10T00:00:00Z",
  },
  {
    id: "seed-teton",
    name: "Grand Teton NP",
    category: "hike",
    lat: 43.7904,
    lng: -110.6818,
    status: "wishlist",
    note: "The dramatic peaks next door to Yellowstone.",
    about:
      "Die dramatischste Bergkette der Rockies, direkt neben Yellowstone — Alpenpanorama über spiegelnden Seen.",
    bestTime: "Jun–Sept",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Barns_grand_tetons.jpg/1280px-Barns_grand_tetons.jpg",
    ],
    addedBy: "Alperen",
    tripId: "trip-rockies",
    plannedDate: null,
    visitedDate: null,
    loves: 1,
    createdAt: "2026-10-10T01:00:00Z",
  },
];
