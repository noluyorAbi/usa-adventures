# Feature: Überrasch uns (Zufalls-Spot)

> Ein Button auf der Karte wählt einen zufälligen Wishlist-Spot aus der aktuellen
> Auswahl und fliegt hin. Für spontane Ideen.

## Status

Umgesetzt.

## Warum (Nutzen)

Wenn wir unentschlossen sind: ein Klick, ein Vorschlag. Respektiert die aktiven
Filter/Trip-Auswahl, ist also nie komplett random-daneben.

## Dateien

| Datei                      | Rolle                                           |
| -------------------------- | ----------------------------------------------- |
| `app/map/page.tsx`         | `surprise()` + Button oben rechts auf der Karte |
| `components/MapCanvas.tsx` | `FlyTo` animiert zum gewählten Spot             |

## So funktioniert es

`surprise()` nimmt aus `filtered` alle `status === "wishlist"` (Fallback: alle
gefilterten), zieht per `Math.random()` einen und ruft `select(id)`. Die Auswahl
löst in MapCanvas den `FlyTo` aus.

## So erweitert man es (für Agenten)

- Auch Wochenend-Radius berücksichtigen: `filtered` vor der Zufallswahl mit
  `isWeekendReachable(distanceFromBase(...))` aus `lib/geo.ts` einschränken.
- Auf anderer Seite anbieten: `useApp()` importieren, gleiche Logik.

## Warum diese Entscheidung

Der Zufall respektiert die aktive Auswahl (`filtered`), damit der Vorschlag im
Kontext bleibt (z.B. nur Hawaii, wenn Hawaii-Trip gewählt ist). Einfacher
`Math.random()`-Pick statt komplexer Gewichtung — bewusst simpel gehalten.

## Was in Zukunft besser wäre

- Optional den Wochenend-Radius einbeziehen („überrasch uns, aber machbar").
- Gewichtung nach Loves, damit Favoriten öfter vorgeschlagen werden.

## Fallstricke

`Math.random()` ist im App-Code ok (Browser). NICHT in Remotion-Skripten
(`remotion/`) verwenden — dort ist es gesperrt.

## Regeln-Check

- [x] Nur lucide-Icons, keine Emojis
- [x] Kein Backend/keine Secrets
- [x] `npm run check` grün
