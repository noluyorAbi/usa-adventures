# Feature / Change: Home-Marker (Zuhause-Kategorie)

> Neue Kategorie `home` + drei Home-Spots (Basecamp Oxnard, BMW Oxnard Office,
> Camarillo), damit unsere Basis-Orte auf der Karte klar als „Zuhause" erscheinen.

**Datum:** 2026-07-07 · **Von:** Claude (Agent)

## 1. Warum der Change (Motivation)

Wir wollten unsere realen Ankerpunkte markiert haben: wo wir arbeiten (BMW Oxnard)
und wo wir wohnen (Camarillo) — zusätzlich zur allgemeinen Basis. Gibt der Karte
einen persönlichen Bezugspunkt.

## 2. Was es tut

Neue Kategorie **Zuhause** (`home`, House-Icon, rosa) mit eigener Farbe/Legende.
Drei Spots stehen darauf: Basecamp Oxnard, BMW Oxnard (Office), Camarillo. Sie
tauchen automatisch in Legende, Filter und Trip „SoCal Basis" auf.

## 3. Wie es umgesetzt ist

- `lib/types.ts`: `Category` um `"home"` erweitert.
- `lib/config.ts`: `CATEGORIES.home = { label: "Zuhause", color: "#e0567a", Icon: House }`.
- `data/places.ts`: `seed-basecamp` auf `home` umgestellt; `seed-bmw-oxnard` und
  `seed-camarillo` ergänzt.
- `lib/store.tsx`: `LS_KEY` von `v2` auf `v3` erhöht, damit die neuen Home-Spots
  bei allen (auch mit altem localStorage) erscheinen.

Legende/Filter iterieren über `Object.keys(CATEGORIES)` — die neue Kategorie
erscheint dort ohne weitere Änderung.

## 4. Warum diese Entscheidung (Alternativen & Trade-offs)

- **Eigene Kategorie** statt nur „city": macht die Orte visuell/semantisch klar als
  Zuhause und ist über den Kategorie-Filter isolierbar.
- **LS_KEY-Bump** statt stiller Migration: einfachste zuverlässige Methode, dass
  jeder die neuen Daten sieht. Trade-off: rein im Browser hinzugefügte Spots gehen
  dabei verloren — akzeptabel, da die Wahrheit in `data/*.ts` liegt.

## 5. Dateien

| Datei            | Rolle                                  |
| ---------------- | -------------------------------------- |
| `lib/types.ts`   | `home` zur `Category`-Union            |
| `lib/config.ts`  | `CATEGORIES.home` (Farbe + House-Icon) |
| `data/places.ts` | 3 Home-Spots                           |
| `lib/store.tsx`  | LS_KEY v2 → v3                         |

## 6. So erweitert man es (für Agenten)

Weitere Home-Orte: einfach in `data/places.ts` mit `category: "home"` ergänzen.
Koordinaten von BMW Oxnard sind grob geschätzt — exakte Werte aus Google Maps
(Rechtsklick) eintragen.

## 7. Was in Zukunft besser wäre

- Home-Pins optisch abheben (z.B. immer sichtbar, eigener Pin-Stil).
- Exakte BMW-Office-Koordinaten verifizieren.

## 8. Fallstricke / Annahmen

- LS_KEY-Bump leert lokale Browser-Änderungen (Reset auf Projektdaten) — hier
  bewusst in Kauf genommen.
- Icon `House` (nicht `Home`) — Name in dieser lucide-Version vorhanden.

## 9. Regeln-Check

- [x] Nur lucide-Icons, keine Emojis
- [x] Kein Backend/keine Secrets
- [x] `npm run check` grün
- [x] docs/features/README.md-Tabelle aktualisiert
