# Feature / Change: Kalifornien-Pflichttrips + trip-eigene Packliste mit Auto-Hinweisen

> Zwei neue Kalifornien-Trips, 16 neue Spots und eine Packliste, die pro Trip
> weiß, was unser BMW 330i vorgibt.

**Datum:** 2026-08-08 · **Von:** Claude (Agent)

## 1. Warum der Change (Motivation)

Zwei Lücken.

**Inhalt:** Die Karte hatte Yosemite, Sequoia und Death Valley als einzelne Pins
unter `trip-southwest`, aber keinen Weg, sie als Reise zu denken. Klassiker, die
man von Oxnard aus in einem langen Wochenende schafft, fehlten ganz: Mono Lake,
Bodie, Alabama Hills, McWay Falls, Hearst Castle, die Elefantenrobben bei San
Simeon, Pinnacles, Morro Rock.

**Packliste:** `packingForTrip` leitete alles aus den Kategorien der Spots und
der Saison ab. Das ergibt für einen Hike-Trip in der Sierra dieselbe Liste wie
für einen Hike-Trip in Hawaii. Was wirklich zählt, stand nirgends: dass der
Tioga Pass ab November zu ist, dass Chain Control R2 für einen Heckantriebler
Ketten bedeutet, dass Racetrack Playa mit 14 cm Bodenfreiheit nicht geht, oder
dass die US-Kfz-Versicherung an der mexikanischen Grenze endet.

Wir sind mobil und fahren einen 330i. Genau das entscheidet bei einigen Zielen,
ob man überhaupt hinkommt.

## 2. Was es tut (Erklärung des Features)

**Zwei neue Trips**

- **Sierra & Yosemite** (20.–23.10.2026, 4 Tage): Tunnel View, Mariposa Grove,
  Mono Lake South Tufa, Bodie Ghost Town. Das Datum liegt bewusst in einer freien
  Lücke zwischen PCH und PNW und noch vor der üblichen Tioga-Sperre.
- **Death Valley & Eastern Sierra** (03.–07.01.2027, 5 Tage): Badwater Basin,
  Zabriskie Point, Mesquite Flat Sand Dunes, Alabama Hills, Manzanar. Winter,
  weil das Tal im Sommer lebensgefährlich ist.

**16 neue Spots** mit den reichen Feldern (`about`, `bestTime`, `highlights`,
`tips`, `address`, `priceLevel`, `state`). Vier davon reichern den bestehenden
`trip-pch` an, zwei den `trip-weekend`.

**Packliste je Trip.** Unter der generierten Liste stehen jetzt Posten, die nur
für diesen Trip gelten, und darunter ein neuer Block „Was der 330i vorgibt" mit
Hinweisen nach Art: Straße, Sprit, Winter, Platz, Hitze, Regeln. Der Block
erscheint nur, wenn für den Trip etwas hinterlegt ist.

## 3. Wie es umgesetzt ist

```
data/trips.ts     +2 Trips
data/places.ts    +16 Spots (tripId zeigt auf die neuen bzw. bestehenden Trips)
data/packing.ts   NEU: TRIP_PACKING: Record<tripId, TripPacking>
        │
        ▼
lib/packing.ts    packingForTrip() hängt TRIP_PACKING[...].extras hinten an,
                  mit demselben seen-Set gegen Dubletten.
                  carNotesForTrip() liefert die Auto-Hinweise, leer wenn keine.
        │
        ▼
components/PackingPanel.tsx   rendert Liste wie bisher + Auto-Block
```

Die Reihenfolge in `packingForTrip` ist Absicht: Basis, Kategorien, Saison,
zuletzt das Trip-Eigene. Das Speziellste steht unten, weil man es zuletzt
abhakt und dort am ehesten nachliest.

Neue Typen in `lib/types.ts`: `TripPackItem`, `CarNote`, `CarNoteKind`,
`TripPacking`.

## 4. Warum diese Entscheidung (Alternativen & Trade-offs)

**Warum `data/packing.ts` und nicht mehr Regeln in `lib/packing.ts`?**
Weil es Inhalt ist, kein Verhalten. `AGENTS.md` sagt: Inhalte gehören nach
`data/`. So kann Justus einen Auto-Hinweis ergänzen, ohne die Merge-Logik zu
verstehen.

**Warum die Engine nicht ersetzt?** Die kategoriebasierte Ableitung ist für
spontane Trips ohne gepflegte Liste weiterhin das Beste. Trip-Extras ergänzen
sie, statt sie abzulösen. Trips ohne Eintrag verhalten sich exakt wie vorher.

**Warum keine bestehenden Spots umgehängt?** Yosemite, Sequoia und Death Valley
hängen an `trip-southwest`. Ein `tripId`-Wechsel in `data/` würde bei einem
Browser mit vorhandenem localStorage nicht ankommen, weil `mergePlaces` bei
bekannten IDs den lokalen Stand gewinnen lässt. Ergebnis wären zwei Wahrheiten.
Stattdessen neue, spezifischere Spots angelegt.

**Warum Datumsangaben statt `null`?** Die anderen elf Trips haben feste Fenster.
Die neuen wurden in Lücken gelegt, die noch frei waren (20.–23.10. und Anfang
Januar). Ein Trip ohne Datum wäre in der Zeitleiste heimatlos.

**Bewusst nicht gemacht:** kein Wetter-API-Abruf für Passsperrungen, kein
Höhenprofil, keine Tankstellen-Datenbank. Alles local-first, deshalb steht in den
Hinweisen „Caltrans prüfen" statt einer Behauptung über den Zustand einer Straße
an einem bestimmten Tag.

## 5. Dateien

| Datei                         | Rolle                                                   |
| ----------------------------- | ------------------------------------------------------- |
| `data/trips.ts`               | +2 Trips: `trip-sierra`, `trip-deathvalley`             |
| `data/places.ts`              | +16 Spots, alle mit `state: "CA"` und reichen Feldern   |
| `data/packing.ts`             | NEU: Extras und Auto-Hinweise je `tripId`               |
| `lib/types.ts`                | `TripPackItem`, `CarNote`, `CarNoteKind`, `TripPacking` |
| `lib/packing.ts`              | Merge der Trip-Extras, neue `carNotesForTrip()`         |
| `components/PackingPanel.tsx` | Auto-Block mit Icon je Hinweis-Art                      |

## 6. So erweitert man es (für Agenten)

- **Neuer Auto-Hinweis:** `data/packing.ts`, Eintrag beim passenden `tripId`
  unter `car`. Art aus `CarNoteKind` wählen, dann stimmen Icon und Label
  automatisch.
- **Neue Art von Hinweis:** `CarNoteKind` in `lib/types.ts` erweitern, dann
  `CAR_ICON` und `CAR_LABEL` in `PackingPanel.tsx`. Beide Records sind auf den
  Typ gemappt, `npm run check` meldet einen fehlenden Eintrag.
- **Neuer Trip mit Packliste:** erst `data/trips.ts`, dann derselbe Schlüssel in
  `data/packing.ts`. Ohne Eintrag greift nur die generische Liste, das ist
  gültig, kein Fehler.

## 7. Was in Zukunft besser machbar wäre

- Auto-Hinweise **je Spot** statt je Trip. Bodie und Alabama Hills tragen ihre
  Schotter-Warnung heute im `tips`-Feld, das ist doppelt gepflegt.
- Ein Flag `pavedOnly` am `Place` plus Filter „nur asphaltiert erreichbar".
  Damit ließe sich die Karte auf das reduzieren, was mit dem 330i wirklich geht.
- Saisonale Sichtbarkeit: Spots wie Tioga Pass oder Glacier Point Road könnten
  ein `closedMonths` bekommen und außerhalb der Saison ausgegraut erscheinen.
- Die Packliste hakt in lokalem Component-State ab, nicht in `localStorage`. Ein
  Reload verliert die Haken.

## 8. Fallstricke / Annahmen

- **Öffnungszeiten und Straßenzustände ändern sich.** Tioga Pass, Glacier Point
  Road und der Hwy 1 durch Big Sur sind bewusst als „prüfen" formuliert, nicht
  als Zusage. Wer daraus feste Aussagen macht, baut ein Versprechen ein, das die
  App nicht halten kann.
- **Preise sind Stand August 2026** und in den `priceLevel`-Feldern gerundet.
- **Koordinaten** stammen aus öffentlichen Quellen und zeigen auf den jeweiligen
  Parkplatz oder Aussichtspunkt, nicht auf den geografischen Mittelpunkt des
  Gebiets. Für die Distanzberechnung ab Basecamp ist das die nützlichere Wahl.
- Der Text zur mexikanischen Kfz-Versicherung ist eine Warnung, keine
  Rechtsberatung.

## 9. Regeln-Check

- [x] Nur lucide-Icons, keine Emojis
- [x] Kein Backend/keine Secrets
- [x] `npm run check` grün (0 Fehler; 3 Warnungen bestehen vorher in
      `lib/store.tsx`)
- [x] `npm run build` läuft
- [x] docs/features/README.md-Tabelle aktualisiert
- [x] UI-Text deutsch, Code englisch
