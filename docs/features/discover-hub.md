# Discover Hub (Entdecken)

**Datum:** 2026-07-17

## Warum

Die App hatte Karte, Pläne, Trips und Erinnerungen, aber keine spielerische
Oberfläche, die aus den vorhandenen Daten _neue Ideen_ macht. Entdecken bündelt
kreative Tools ohne Backend.

## Was

Neue Route `/discover` mit:

1. **Rotations-Bogen** (`RotationArc`) — 6-Monats-Timeline mit datierten Trips
2. **Saison-Band** (`SeasonRibbon`) — Sep–Mär mit Trip-Zuordnung
3. **Roulette** (`TripRoulette`) — theatralischer Wishlist-Zufall
4. **Wochenend-Komponist** (`WeekendComposer`) — 48h-Plan im 4h-Radius
5. **Packliste** (`PackingPanel`) — regelbasiert aus Spot-Kategorien
6. **Crew-Duett** (`DuetMeter`) — Alperen vs Justus + Staaten

Zusätzlich: mehr Trips/Spots in `data/`, reichere Trip-Karten, Plan-Timeline,
Store-Merge für neue Seeds trotz localStorage.

## Wie

- Daten: `data/trips.ts`, `data/places.ts`, `lib/types.ts` (Trip-Felder, `state`)
- Hilfen: `lib/packing.ts`, `lib/route.ts`, Store-Merge in `lib/store.tsx` (v7)
- UI: Komponenten unter `components/*`, Nav in `AppChrome.tsx`
- Route: `app/discover/page.tsx`

## Entscheidung

Alles lokal und regelbasiert (Haversine, Kategorie-Regeln). Keine Routing-API,
kein Wetter-Service. Trade-off: ungefähre Kilometer und Packlisten, dafür null
Secrets und offline-fähig.

## Zukunft

- Drag-and-drop Wochenend-Slots speichern
- Staaten-Sammlung 50/50 gamifizieren
- Packliste in localStorage merken

## Regeln-Check

- Keine Emojis, lucide only
- Kein Backend
- TypeScript strict
- Docs aktualisiert
