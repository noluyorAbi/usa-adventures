# Feature / Change: Spot-Detail-Modal (Bilder + Reise-Infos)

> Klick auf einen Spot öffnet ein Modal mit Bildergalerie, einer Erklärung (was
> ihn einzigartig macht / warum hin), der besten Reisezeit, Distanz ab Oxnard und
> Aktionen.

**Datum:** 2026-07-07 · **Von:** Claude (Agent)

## 1. Warum der Change (Motivation)

Die kleinen Karten zeigten nur das Nötigste. Für echte Reiseplanung wollten wir
pro Ort Bilder, Kontext und die ideale Reisezeit an einem Ort — als schönes,
fokussiertes Detail-Modal.

## 2. Was es tut

Öffnet sich per Klick auf den Spot-Namen oder den Details-Button (Maximize-Icon)
in jeder `PlaceCard`. Zeigt: Bildergalerie (horizontal scrollbar), „Warum hin"
(`about`), „Beste Zeit" (`bestTime`), Distanz/Wochenend-Info, Status, Trip, unsere
Notiz, Loves. Aktionen: Auf Karte zeigen, Status weiterschalten, Teilen (Deep-Link).

## 3. Wie es umgesetzt ist

- `lib/types.ts`: `Place` um optionale Felder `images?: string[]`, `about?: string`,
  `bestTime?: string` erweitert.
- `lib/store.tsx`: UI-Zustand `modalId` + `openModal(id)` / `closeModal()` in
  `useApp()`.
- `components/SpotModal.tsx`: liest `modalId` aus `useApp()`, rendert das Modal
  (framer-motion, Overlay + Sheet/Dialog). Global in `components/AppChrome.tsx`
  gemountet (wie AddPlaceSheet/Celebration).
- `components/PlaceCard.tsx`: Name-Klick + neuer Maximize-Button rufen `openModal`.
- `data/places.ts`: `about` + `bestTime` für alle Spots gepflegt; `images` optional.
- `lib/store.tsx`: `LS_KEY` v3 → v4, damit die neuen Felder bei allen ankommen.

## 4. Warum diese Entscheidung (Alternativen & Trade-offs)

- **Modal global über den Store** (`modalId`) statt lokalem State je Seite: von
  überall (Karte, Board, Timeline, Trips) mit einem Aufruf öffenbar, konsistent.
- **Bilder als URLs im Datenmodell**, nicht als Upload: bleibt **local-first**
  (kein Storage/Backend). Empfehlung: Dateien in `public/images/spots/` committen
  und lokal referenzieren — dann sind auch die Fotos Teil des Repos.
- **Bilder als externe URLs vorbefüllt**: pro Landmark-Spot ein echtes Foto von
  `upload.wikimedia.org` (via Wikipedia PageImages-API keyless geholt, dann als
  feste CDN-URL in `data/places.ts` hinterlegt). Kein API-Key zur Laufzeit, nur
  ein `<img src>`. Lokale Fotos (`public/images/spots/`) gehen genauso — beides
  ist erlaubt. Leer-Zustand bleibt für Spots ohne Bild.
- Für `<img>` externer/lokaler Quellen: gezielt `@next/next/no-img-element` je
  Zeile deaktiviert (kein `next/image`, weil URLs beliebig/lokal sein können und
  wir keine `remotePatterns` pflegen wollen).

## 5. Dateien

| Datei                      | Rolle                                           |
| -------------------------- | ----------------------------------------------- |
| `lib/types.ts`             | `images`/`about`/`bestTime` an `Place`          |
| `lib/store.tsx`            | `modalId` + `openModal`/`closeModal`, LS v3→v4  |
| `components/SpotModal.tsx` | das Modal                                       |
| `components/AppChrome.tsx` | mountet `<SpotModal/>` global                   |
| `components/PlaceCard.tsx` | Öffnen per Name-Klick + Details-Button          |
| `data/places.ts`           | `about` + `bestTime` je Spot, `images` optional |

## 6. So erweitert man es (für Agenten)

- **Fotos zu einem Spot:** in `data/places.ts` das Feld `images` füllen, z.B.
  `images: ["/images/spots/yosemite-1.jpg"]` (Datei nach `public/images/spots/`
  legen). Externe URLs `["https://…"]` gehen auch.
- Weitere Felder (z.B. `tips`, `cost`): an `Place` (types.ts) ergänzen und im
  Modal rendern.

## 7. Was in Zukunft besser wäre

- Lightbox/Vollbild für Bilder, Tastatur-Navigation.
- Echte Fotos der Crew nach den Trips (aktuell nur Texte/Leer-Zustand).
- `next/image` mit definierten `remotePatterns`, falls wir uns auf feste
  Bildquellen festlegen.

## 8. Fallstricke / Annahmen

- Externe Bild-URLs können brechen — lokale Dateien in `public/` sind robuster.
- LS_KEY-Bump (v3→v4) setzt Browser-Daten auf die Projektdaten zurück.

## 9. Regeln-Check

- [x] Nur lucide-Icons, keine Emojis
- [x] Kein Backend/keine Secrets (Bilder sind nur `<img src>`)
- [x] `npm run check` grün
- [x] docs/features/README.md-Tabelle aktualisiert
