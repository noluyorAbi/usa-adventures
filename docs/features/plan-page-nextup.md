# Feature / Change: Plan-Seite mit "Als Nächstes", Monats-Spur und Datums-Lücken

> Die Plan-Seite beantwortet jetzt zuerst die Frage, die man wirklich hat: was steht
> als Nächstes an. Dazu Monats-Gruppierung der Kalender-Spur und eine sichtbare Warnung
> für geplante Spots ohne Datum.

**Datum:** 2026-07-30 · **Von:** Claude (Agent)

## 1. Warum der Change (Motivation)

Die Plan-Seite listete alles gleichwertig: drei Zähler, eine flache Datums-Liste,
darunter das Kanban-Board. Drei Probleme in der echten Nutzung:

1. **Kein Fokus.** Bei einem Halbjahr mit dutzenden Spots ist die erste Frage nie
   "wie viele Ideen habe ich", sondern "was ist das nächste Ding". Diese Antwort musste
   man sich aus einer langen Liste selbst zusammensuchen.
2. **Die Kalender-Spur war eine undifferenzierte Kette.** Über sechs Monate hinweg
   ohne Monatsgrenzen und ohne Bezug zu heute. Vergangene Termine sahen aus wie
   kommende.
3. **Stille Datenlücke.** Ein Spot mit Status `planned`, aber ohne `plannedDate`, taucht
   in der Kalender-Spur überhaupt nicht auf und fällt beim `.ics`-Export durch. Man
   merkt es nie.

## 2. Was es tut (Erklärung des Features)

- **"Als Nächstes"-Karte** über allem: der nächste anstehende Termin mit großem
  Countdown in Tagen, Wochentag und vollem Datum, Trip-Zuordnung, Notiz und einer
  einzigen Primäraktion (Detail-Modal öffnen). Bei "heute" steht dort `0 heute`.
- **Kalender-Spur nach Monat gebündelt.** Jede Gruppe trägt ihren Monatsnamen
  ("Oktober 2026"). Jeder Eintrag zeigt zusätzlich einen relativen Badge
  ("in 12 Tagen", "heute", "vor 3 Tagen"). Vergangene Einträge laufen auf Opacity 0.55
  und bekommen einen grauen Pin statt der Kategorie-Farbe.
- **Block "ohne Datum"** am Ende der Spur: alle `planned`-Spots ohne `plannedDate` als
  antippbare Chips mit Hinweistext. Ein Klick öffnet das Detail-Modal.
- **Zähler animieren** jetzt beim Mount über `AnimatedNumber` und staffeln sich leicht.
- **Leerer Filter hat einen echten Zustand**: schwebendes Icon, Erklärung und ein Button
  "Spot hinzufügen", statt einer leeren Seite.

## 3. Wie es umgesetzt ist

Die gesamte Datums-Logik liegt in **`lib/plan.ts`**, rein und ohne React, analog zu
`lib/filter.ts`:

| Funktion                 | Zweck                                                          |
| ------------------------ | -------------------------------------------------------------- |
| `parsePlanDate(iso)`     | `"2026-10-08"` als **lokales** Datum, nicht UTC                |
| `dayDiff(iso, today?)`   | ganze Tage bis zum Datum, negativ = Vergangenheit              |
| `relativeLabel(days)`    | deutscher Text: heute / morgen / in n Tagen / vor n Tagen      |
| `datedPlaces(places)`    | alle mit Datum, chronologisch                                  |
| `undatedPlanned(places)` | `status === "planned"` und kein Datum                          |
| `groupByMonth(places)`   | `PlanGroup[]` mit `key` (`2026-10`) und `label` (Oktober 2026) |
| `nextUp(places, today?)` | erster Termin ab heute, sonst `null`                           |

`components/NextUp.tsx` ist eine reine Präsentations-Komponente und bekommt `place`,
`trip` und `onOpen` als Props. `components/PlanTimeline.tsx` nutzt `groupByMonth` und
`undatedPlanned`. `app/plans/page.tsx` verdrahtet beides über `useApp()`.

Wichtig: **`nextUp` läuft über `places`, nicht über `filtered`.** Sonst verschwindet der
wichtigste Blick der Seite, sobald jemand einen Trip-Filter setzt. Die Spur und das Board
bleiben dagegen gefiltert.

## 4. Warum diese Entscheidung (Alternativen & Trade-offs)

- **Warum kein echter Kalender im Monatsraster?** Ein 7-Spalten-Grid wäre auf dem Handy
  unlesbar und die Daten sind dünn besetzt (einzelne Termine pro Monat). Eine
  gruppierte Liste trägt die gleiche Information ohne leere Zellen.
- **Warum die Logik in `lib/plan.ts` und nicht in der Komponente?** Datums-Arithmetik ist
  genau die Sorte Code, die man ohne Browser prüfen will, und `groupByMonth` wird
  absehbar auch auf der Trips-Seite gebraucht.
- **Warum `parsePlanDate` statt `new Date(iso)`?** `new Date("2026-10-08")` ist
  UTC-Mitternacht. Westlich von Greenwich, also genau am Einsatzort in Kalifornien,
  kippt das auf den 7. Oktober. Der explizite lokale Konstruktor vermeidet einen Bug,
  der erst vor Ort aufgefallen wäre.
- **Warum kein Datepicker im "ohne Datum"-Block?** Das wäre ein zweites
  Eingabe-Paradigma neben `AddPlaceSheet`. Der Chip führt ins bestehende Detail-Modal.
- **Bewusst nicht gemacht:** Drag-and-drop im Board, Erinnerungen, Push. Braucht Backend
  oder verkompliziert ohne echten Gewinn.

## 5. Dateien

| Datei                         | Rolle                                                      |
| ----------------------------- | ---------------------------------------------------------- |
| `lib/plan.ts`                 | neue reine Logik: Countdown, Gruppierung, nächster Termin  |
| `components/NextUp.tsx`       | neu: "Als Nächstes"-Karte mit Countdown und einer Aktion   |
| `components/PlanTimeline.tsx` | umgebaut: Monatsgruppen, relative Badges, Block ohne Datum |
| `app/plans/page.tsx`          | verdrahtet NextUp, animierte Zähler, Leerzustand           |
| `data/places.ts`              | neuer Spot: EsDeeKid im Hollywood Palladium am 07.10.2026  |

## 6. So erweitert man es (für Agenten)

- **Weitere Zeitfenster** (etwa "diese Woche"): in `lib/plan.ts` eine Funktion daneben
  legen, nicht in der Komponente rechnen.
- **Monats-Gruppierung auf der Trips-Seite**: `groupByMonth` importieren, sie kennt nur
  `Place[]`.
- **`.ics`-Export für undatierte Spots**: `lib/ics.ts` filtert aktuell auf
  `plannedDate`; die Chips aus dem "ohne Datum"-Block sind die Liste, die dort fehlt.

## 7. Was in Zukunft besser machbar wäre

- Echte Wochenansicht für Monate mit vielen Terminen.
- "Heute"-Linie, die zwischen zwei Einträge gezeichnet wird, statt nur Dimmen.
- Konflikt-Erkennung: zwei Spots am selben Tag in verschiedenen Regionen markieren.
- `nextUp` respektiert Filter bewusst nicht. Wenn das je gewünscht ist, gehört ein
  sichtbarer Hinweis dazu, sonst wirkt es kaputt.

## 8. Fallstricke / Annahmen

- `plannedDate` ist immer `YYYY-MM-DD` ohne Zeit. Käme je eine Uhrzeit dazu, muss
  `parsePlanDate` erweitert werden.
- Der Countdown rechnet gegen die **lokale Zeit des Browsers**. Nach dem Umzug nach
  Kalifornien verschiebt sich die Basis automatisch mit, das ist gewollt.
- Ist der letzte Termin vorbei, verschwindet die "Als Nächstes"-Karte komplett. Das ist
  Absicht, kein Fehler.
- `row++` in `PlanTimeline` erzeugt den Stagger-Delay über Monatsgruppen hinweg und ist
  bei 0.4 s gedeckelt, damit lange Listen nicht sekundenlang einlaufen.

## 9. Regeln-Check

- [x] Nur lucide-Icons, keine Emojis
- [x] Kein Backend/keine Secrets
- [x] `npm run check` grün (0 Errors; die 3 Warnungen in `AddPlaceSheet`/`store` sind älter)
- [x] docs/features/README.md-Tabelle aktualisiert
