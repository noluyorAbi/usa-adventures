# Feature: Distanz ab Oxnard + Wochenend-Radius

> Jeder Spot zeigt die Luftlinie ab unserer Basis (Oxnard) und ob er
> "wochenendtauglich" ist. Zusätzlich ein Filter "Nur Wochenend-Trips".

## Status

Umgesetzt.

## Warum (Nutzen)

Wir sehen sofort, was ein spontaner Wochenendtrip ist (SoCal) und was ein großer
Trip mit Flug/mehreren Tagen (Hawaii, Ostküste). Hilft beim schnellen Planen.

## Dateien

| Datei                      | Rolle                                                            |
| -------------------------- | ---------------------------------------------------------------- |
| `lib/geo.ts`               | Haversine-Distanz, grobe Fahrzeit, `isWeekendReachable`, `fmtKm` |
| `lib/config.ts`            | `BASECAMP` (Oxnard-Koordinaten) als Referenzpunkt                |
| `components/PlaceCard.tsx` | zeigt Distanz-Chip + "Wochenende"-Hinweis                        |
| `lib/filter.ts`            | `weekendOnly`-Filter (nutzt `isWeekendReachable`)                |
| `components/FilterBar.tsx` | Toggle "Nur Wochenend-Trips"                                     |

## So funktioniert es

`distanceFromBase(lat, lng)` rechnet die Luftlinie von `BASECAMP` zum Spot
(Haversine). `driveHours(km)` schätzt grob die Autofahrt (Luftlinie × 1,25 / 85
km/h). `isWeekendReachable(km)` = unter ~4 h. PlaceCard zeigt beides als Chip; der
Filter blendet auf Wunsch alles außerhalb des Radius aus.

## So erweitert man es (für Agenten)

- Radius ändern: Grenze in `isWeekendReachable` (aktuell 4 h) anpassen.
- Echte Routen statt Luftlinie: bräuchte eine externe Routing-API — das würde
  aber gegen "kein Backend/keine Keys" verstoßen. Bewusst weggelassen.
- Distanz woanders anzeigen: `distanceFromBase` + `fmtKm` importieren.

## Warum diese Entscheidung

Luftlinie + grobe Schätzung reicht für die Aussage „Wochenende vs. großer Trip"
und bleibt **komplett lokal**. Echtes Routing (Google/OSRM) wäre genauer, braucht
aber Keys/Requests — bewusst dagegen entschieden (local-first).

## Was in Zukunft besser wäre

- Optionaler Umschalter „echte Route" nur, falls wir local-first je aufweichen.
- Fahrzeit pro Person/Verkehrsmittel (Flug für Hawaii statt „großer Trip").

## Fallstricke

Luftlinie, nicht Straßenkilometer. Für Hawaii ist "Fahrzeit" sinnlos (Flug) —
darum wird dort nur "großer Trip" impliziert, keine Fahrzeit versprochen.

## Regeln-Check

- [x] Nur lucide-Icons, keine Emojis
- [x] Kein Backend/keine Secrets (reine Mathe)
- [x] `npm run check` grün
