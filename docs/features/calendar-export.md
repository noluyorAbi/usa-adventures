# Feature: Kalender-Export (.ics)

> Geplante Spots (mit Datum) als `.ics`-Datei exportieren und in Google/Apple
> Kalender importieren. Rein clientseitig.

## Status

Umgesetzt.

## Warum (Nutzen)

Unsere geplanten Trips landen mit einem Klick im echten Kalender — kein
Abtippen, keine Doppelplanung.

## Dateien

| Datei                | Rolle                                                                   |
| -------------------- | ----------------------------------------------------------------------- |
| `lib/ics.ts`         | `buildIcs()` erzeugt den ICS-Text, `downloadIcs()` startet den Download |
| `app/plans/page.tsx` | Button "Kalender (.ics)" (nur sichtbar, wenn geplante Spots da sind)    |

## So funktioniert es

`buildIcs(places)` nimmt alle Spots mit `plannedDate` und macht daraus
`VEVENT`-Ganztagstermine (DTSTART/DTEND als DATE, DTEND ist exklusiv = Folgetag).
`downloadIcs()` packt das in einen `Blob` und triggert einen unsichtbaren
Download-Link. Kein Server nötig.

## So erweitert man es (für Agenten)

- Uhrzeiten statt Ganztags: `plannedDate` um eine Zeit erweitern (Typ in
  `lib/types.ts`) und DTSTART/DTEND auf `DATE-TIME` umstellen.
- Nur einen Trip exportieren: `downloadIcs(filtered)` bekommt bereits die
  gefilterte Liste — mit aktivem Trip-Filter wird automatisch nur der Trip
  exportiert.

## Warum diese Entscheidung

ICS clientseitig bauen + als Blob herunterladen hält alles lokal (keine
Kalender-API, kein OAuth). Standardformat, das Google/Apple/Outlook lesen.

## Was in Zukunft besser wäre

- Uhrzeiten statt Ganztags-Terminen (braucht Zeit-Feld im Datenmodell).
- Ein „Zu Google Kalender hinzufügen"-Link pro Spot als Alternative zum Download.

## Fallstricke

ICS braucht CRLF (`\r\n`) zwischen den Zeilen — ist in `buildIcs` so umgesetzt,
nicht auf `\n` ändern. Sonderzeichen in Namen/Notizen werden escaped.

## Regeln-Check

- [x] Nur lucide-Icons, keine Emojis
- [x] Kein Backend/keine Secrets
- [x] `npm run check` grün
