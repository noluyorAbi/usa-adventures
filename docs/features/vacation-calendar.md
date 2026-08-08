# Feature / Change: Urlaubsplaner, Jahreskalender und Fahrzeiten

> Acht Urlaubstage auf sechs Monate optimal verteilen, den ganzen Aufenthalt als
> Kalender sehen, und wissen wie lange man ab Camarillo wohin fährt.

**Datum:** 2026-08-08 · **Von:** Claude (Agent)

## 1. Warum der Change (Motivation)

Die App konnte Trips sammeln, aber nicht sagen, ob sie machbar sind. Machbar
heißt hier nicht Geld, sondern **Urlaubstage**. Wir haben acht für sechs Monate.

Die Rechnung war vorher unsichtbar und fällt hart aus: die dreizehn datierten
Reisen brauchen zusammen **51 Urlaubstage**. Das ist mehr als das Sechsfache des
Budgets. Wer das nicht sieht, plant ein halbes Jahr lang gegen eine Wand.

Dazu zwei kleinere Lücken: `lib/geo.ts` schätzt Fahrzeiten aus der Luftlinie mal
Faktor, was für die Frage „schaffe ich das nach der Arbeit" nicht reicht. Und die
Gegend um Camarillo, wo wir tatsächlich wohnen, war auf der Karte fast leer.

## 2. Was es tut (Erklärung des Features)

Neue Route **`/calendar`** mit vier Abschnitten.

**Budget gegen Bedarf.** Drei Zahlen nebeneinander: 8 verfügbar, 51 gebraucht,
43 fehlen. Darunter der Hinweis, dass ein Wochenendtrip von Freitagabend bis
Sonntagabend null Urlaubstage kostet und deshalb beliebig oft geht.

**Der Vorschlag.** Zwei Strategien, umschaltbar:

- _Meiste Zeit_: **25 freie Tage aus 8 Urlaubstagen**, in drei Blöcken.
  - 11.11. bis 15.11., 5 Tage für 2 (Veterans Day fällt auf Mittwoch)
  - 21.11. bis 29.11., 9 Tage für 3 (Thanksgiving plus Freitag danach)
  - 24.12. bis 03.01., 11 Tage für 3 (Weihnachten und Neujahr beide auf Freitag)
- _Längster Block_: ein einzelner, so lang wie das Budget ihn hergibt.

Je Block stehen die konkreten Tage, die man beantragen muss, und die Feiertage,
die man geschenkt bekommt.

**Preisschild je Trip.** Jede Reise mit Dauer und Urlaubskosten. Wochenendtrips
erscheinen als „gratis", die Daueretiketten wie SoCal Basis als „laufend".

**Der Kalender.** Sieben Monatsraster von September bis März. Wochenenden,
Feiertage und die vorgeschlagenen Urlaubstage sind eingefärbt, Trips laufen als
farbige Balken unter den Tagen mit.

**Fahrzeiten ab Camarillo.** 18 Ziele mit freier Fahrt und Berufsverkehr,
filterbar nach „nach der Arbeit" und „Wochenende".

Außerdem acht neue Spots rund um Camarillo: Old Town, Farmers Market, In-N-Out,
Habit Burger, Costco (wegen des Spritpreises), Trader Joes, die Erdbeerfelder
und ein bewusst offener Platzhalter für die Taqueria, die wir vor Ort suchen.

## 3. Wie es umgesetzt ist

```
data/holidays.ts   HOLIDAYS + URLAUBSBUDGET
data/drives.ts     DRIVES (Fahrzeiten ab Camarillo)
        │
        ▼
lib/vacation.ts    istFrei() · urlaubskosten() · kostenJeTrip()
                   besterUrlaubsplan()  ← der Optimierer
                   laengsterBlock()
        │
        ▼
components/VacationCalendar.tsx   Budget, Vorschlag, Trip-Kosten, Monatsraster
components/DriveTimes.tsx         Fahrzeiten-Liste
        │
        ▼
app/calendar/page.tsx             rendert beide, holt trips über useApp()
```

**Der Optimierer** ist gewichtetes Intervall-Scheduling mit Budget. Kandidaten
sind alle zusammenhängenden Blöcke, die an einem freien Tag beginnen und enden.
Jeder kostet die Arbeitstage darin und bringt seine volle Länge. Ein DP über
(Tagesindex, Restbudget) sucht die überschneidungsfreie Auswahl mit der größten
Summe. Bei 180 Tagen und Budget 8 läuft das in Millisekunden, deshalb kein
Näherungsverfahren und kein vorberechnetes Ergebnis.

## 4. Warum diese Entscheidung (Alternativen & Trade-offs)

**Warum Feiertage als Liste und nicht als Formel?** Die beweglichen US-Feiertage
folgen zwar Regeln (vierter Donnerstag im November), aber welche davon der
Arbeitgeber freigibt, ist Firmensache. Columbus Day geben viele Firmen nicht,
Heiligabend und Silvester sind Kulanz. Eine Liste, die man anfassen kann, ist
ehrlicher als eine Formel, die Sicherheit vortäuscht. Unsichere Einträge tragen
`assumed: true`.

**Warum zwei Strategien statt einer Antwort?** „Längster Urlaub" ist mehrdeutig.
Die Summe aller freien Tage zu maximieren ergibt drei mittlere Blöcke, einen
einzelnen langen Block zu maximieren ergibt etwas anderes. Beides ist legitim,
also entscheidet der Nutzer und nicht der Algorithmus.

**Warum keine Trip-Daten automatisch verschoben?** Die Blöcke passen fast auf
Ostküste (25.11. bis 03.12.) und Hawaii (20.12. bis 30.12.). Ein Automatismus,
der Reisedaten umschreibt, würde Planung überschreiben, die vielleicht schon mit
jemandem abgesprochen ist. Die App zeigt die Diskrepanz und lässt die Entscheidung
beim Menschen.

**Warum eigene Fahrzeiten statt `lib/geo.ts`?** `driveHours()` rechnet Luftlinie
mal Faktor und kennt keinen Berufsverkehr. Für „Downtown LA" liefert das eine
Zahl, die freitags um 17:00 um eine Stunde danebenliegt. Die neue Tabelle ist
handgepflegt, dafür realistisch. `geo.ts` bleibt unverändert für die
Wochenend-Radius-Logik.

**Bewusst nicht gemacht:** keine Verkehrs-API, kein Kalender-Import, keine
automatische Urlaubsantragsstellung. Local-first bleibt.

## 5. Dateien

| Datei                             | Rolle                                        |
| --------------------------------- | -------------------------------------------- |
| `data/holidays.ts`                | Feiertage und Urlaubsbudget                  |
| `data/drives.ts`                  | 18 Fahrzeiten ab Camarillo                   |
| `lib/vacation.ts`                 | Urlaubsrechnung und Optimierer, reine Logik  |
| `components/VacationCalendar.tsx` | Budget, Vorschlag, Trip-Kosten, Monatsraster |
| `components/DriveTimes.tsx`       | Fahrzeiten mit Filter                        |
| `app/calendar/page.tsx`           | die Route                                    |
| `components/AppChrome.tsx`        | Nav-Eintrag                                  |
| `data/places.ts`                  | +8 Spots rund um Camarillo                   |

## 6. So erweitert man es (für Agenten)

- **Feiertag korrigieren:** `data/holidays.ts`. Der Rest rechnet automatisch neu,
  der Vorschlag ändert sich mit.
- **Budget ändern:** `URLAUBSBUDGET` in derselben Datei.
- **Neue Fahrzeit:** `data/drives.ts`, `rush: null` wenn es dort keinen
  Berufsverkehr gibt.
- **Andere Optimierung:** `besterUrlaubsplan(budget, maxBlockKosten)`. Der zweite
  Parameter deckelt, was ein einzelner Block kosten darf. Klein gesetzt ergibt
  das mehr, kürzere Blöcke.

## 7. Was in Zukunft besser machbar wäre

- **Trips auf Blöcke schieben, halbautomatisch.** Ein Knopf „auf diesen Block
  legen", der `startDate`/`endDate` vorschlägt und den Nutzer bestätigen lässt.
- **Urlaubstage festhalten.** Aktuell ist der Vorschlag berechnet, nicht
  gespeichert. Wer beantragte Tage markieren will, bräuchte sie im Store.
- **Wochenendtrips als eigene Kategorie.** Da sie gratis sind, wäre eine Ansicht
  „was geht ohne Urlaubstag" nützlich.
- **Feiertage automatisch aus dem Firmenkalender**, sobald der vorliegt.

## 8. Fallstricke / Annahmen

- **Die Feiertagsliste ist eine Annahme**, kein bestätigter BMW-Kalender. Drei
  Einträge tragen `assumed: true`. Fällt Heiligabend weg, kostet der
  Weihnachtsblock einen Tag mehr.
- **Datumsrechnung läuft in UTC.** `parseIso` baut absichtlich UTC-Daten, damit
  Sommerzeitwechsel keine Tage verschieben. `ARRIVAL`/`DEPARTURE` aus
  `lib/config.ts` sind dagegen lokale `Date`-Objekte, deshalb gibt es
  `isoVonDate()`, das über die lokalen Getter geht. Wer das mischt, bekommt
  Verschiebungen um einen Tag.
- **Trips über 60 Tage** gelten als Daueretikett und werden weder eingefärbt noch
  berechnet. Sonst wäre der ganze Kalender in der Farbe von SoCal Basis.
- **Die Fahrzeiten sind Erfahrungswerte**, gerundet, ohne Baustellen und ohne
  Unfälle. Der Berufsverkehr auf der 405 kann jede Schätzung sprengen.
- **Adressen der Camarillo-Spots sind grob** (Straße, nicht Hausnummer). Sie sind
  vor Ort zu prüfen, ein Eintrag ist absichtlich als Platzhalter markiert.

## 9. Regeln-Check

- [x] Nur lucide-Icons, keine Emojis
- [x] Kein Backend/keine Secrets
- [x] `npm run check` grün (0 Fehler; 3 Warnungen bestehen vorher)
- [x] `npm run build` läuft, `/calendar` ist statisch vorgerendert
- [x] docs/features/README.md-Tabelle aktualisiert
- [x] AGENTS.md um Route, Datendateien und lib-Datei ergänzt
- [x] UI-Text deutsch, Code englisch
