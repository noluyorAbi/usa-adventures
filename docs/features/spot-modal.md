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

---

## Update 2026-07-07 — v2 (mehr Fotos & Details)

**Was neu ist**

- **Foto-Galerie mit Lightbox:** Bilder im Modal sind jetzt tippbar und öffnen ein
  Vollbild-Overlay mit Vor/Zurück und Zähler. Badge "N Fotos · tippen zum
  Vergrößern" bei Mehrfachbildern.
- **Neue optionale Detail-Felder** an `Place` (`lib/types.ts`), alle im Modal
  gerendert: `highlights: string[]` (Stichpunkt-Liste), `tips: string`
  (Insider-Tipp, amber-Box), `address` + `website` (klickbare Chips → Google Maps
  bzw. externe Seite), `priceLevel` (Chip in den Quick-Facts).
- **Zwei neue Kategorien** (`lib/config.ts` + `lib/types.ts`): `bar`
  („Bars & Clubs", Martini-Icon) und `activity` („Aktivität", Ticket-Icon).
  Filter-Chips, Add-Formular und Karten-Pins ziehen sich das automatisch aus
  `CATEGORIES`.
- **Copy-für-Agent im Modal:** Fußzeile + Leer-Zustand zeigen einen
  `CopyForAgent`-Button mit `PROMPT_MAINTAIN_SPOT` (`lib/agentPrompts.ts`) — der
  Kollege kopiert den Prompt und lässt seinen Agenten Fotos/Details ergänzen.
- **Inhalte:** ~18 echte Orte in `data/places.ts` (Trip `trip-local` „Vor der
  Haustür"): Food (Kalaveras, Cabo, Yolanda's, Moqueca, Otani, Cafe Amri), Bars &
  Clubs (El Chilito, Casa Agria, Topa Topa, Levity Live, Test Pilot, Good Lion),
  Aktivitäten (Whale Watching, Sea-Cave-Kayak, Channel Islands Harbor, Ventura
  Harbor Village, Camarillo Outlets).
- `lib/store.tsx`: `LS_KEY` v5 → v6, damit die neuen Felder/Orte bei allen ankommen.

**Bilder-Quelle:** Fotos sind stabile Wikimedia-Commons-URLs, per Wikipedia-
PageImages/REST-API (keyless) geholt und vor dem Eintragen auf HTTP 200 geprüft.
Restaurant-/Gericht-Fotos sind **illustrativ** (repräsentatives Gericht, nicht das
konkrete Lokal). Echte Crew-Fotos später lokal in `public/images/spots/` ablegen
und die URLs ersetzen.

**Fallstrick:** Wikimedia liefert bei On-Demand-Breiten teils HTTP 400 (angeforderte
Breite > Original). Immer die von der API zurückgegebene Thumbnail-URL nehmen oder
Breite ≤ Original — und jede URL vor dem Commit einmal laden.
