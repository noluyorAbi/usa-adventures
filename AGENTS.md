# AGENTS.md

**Die eine, verbindliche Anleitung für jede KI, die an diesem Repo arbeitet**
(GitHub Copilot, Claude, Cursor, …). Das ist die _Single Source of Truth_.
`CLAUDE.md` und `.github/copilot-instructions.md` verweisen nur hierher — Regeln
stehen ausschließlich hier, damit nichts auseinanderläuft.

Lies dieses Dokument komplett, bevor du Code änderst.

---

## TL;DR (30 Sekunden)

- Lokale Reise-App (Next.js). **Kein Backend, keine Secrets.** Daten in `data/*.ts`
  - localStorage.
- **Nur `lucide-react`-Icons, niemals Emojis.**
- **TypeScript strict.** Globaler Zustand nur über `useApp()` (`lib/store.tsx`).
- Styling nur mit Tailwind + CSS-Variablen aus `app/globals.css`.
- **Vor „fertig": `npm run check` grün + jede Änderung in `docs/features/`
  dokumentiert** (siehe Änderungs-Protokoll).
- UI-Text deutsch, Code englisch.

Wer arbeitet hier: wir entwickeln gemeinsam per Vibe-Coding weiter — einer mit
Informatik-Background, einer steigt per KI-Agent ein. Deshalb zählen Disziplin und
lückenlose Doku.

---

## Projekt-Metadaten (für schnelle Orientierung)

| Feld               | Wert                                                             |
| ------------------ | ---------------------------------------------------------------- |
| Name               | USA Adventures                                                   |
| Repo               | https://github.com/noluyorAbi/usa-adventures                     |
| Live               | https://usa-adventures.vercel.app                                |
| Status             | aktiv, privat/Hobby, produktiv deployed                          |
| Crew               | Alperen (Informatik) & Justus (Vibe-Coding-Einstieg)             |
| Zweck              | 6-Monate-USA-Praktikum planen: Karte, Trips, Pläne, Erinnerungen |
| Reisezeitraum      | 21.09.2026 – 19.03.2027 (`lib/config.ts`: `ARRIVAL`/`DEPARTURE`) |
| Basis              | Oxnard, Kalifornien (`BASECAMP`)                                 |
| Persistenz         | `data/*.ts` (Repo) + `localStorage` (Browser). **Kein Backend.** |
| Env-Variablen      | keine                                                            |
| Auth/Login         | keiner                                                           |
| Sprache            | UI **deutsch**, Code **englisch**                                |
| Node               | >= 20 (Next 16)                                                  |
| Paketmanager       | npm                                                              |
| CI / Guardrails    | Husky pre-commit (prettier + eslint --fix + tsc)                 |
| Hosting/Deploy     | Vercel, Git-Integration (Push auf `main` = Deploy)               |
| Analytics/Tracking | keins                                                            |
| Barrierefreiheit   | `aria-label` an Icon-Buttons, Fokus-Ringe via `:focus-visible`   |

## Maschinenlesbar: llms.txt

Für LLM-Crawler/Agenten gibt es eine kompakte, maschinenlesbare Übersicht unter
**`/llms.txt`** (Quelle: `public/llms.txt`), nach der
[llmstxt.org](https://llmstxt.org)-Konvention: Kurzbeschreibung, Stack, wichtige
Dateien (inkl. dieser `AGENTS.md`, `.github/copilot-instructions.md`, `docs/`),
Routen und Links. **Reihenfolge zum Einlesen:** `/llms.txt` (Überblick) →
`AGENTS.md` (Regeln + Metadaten, dieses Dokument) → `docs/features/README.md`
(Feature-Details).

---

## North Star

Eine schöne, mobile, **komplett lokale** App, mit der zwei Freunde ihr
sechsmonatiges USA-Praktikum planen: interaktive Karte (USA + Hawaii), Trips,
Plan-Board, Erinnerungen. Sie soll sich **selbst weiterpflegen können** — jede
Änderung hinterlässt genug Doku, dass die nächste KI nahtlos weitermacht.

---

## HARTE REGELN (nicht verhandelbar)

1. **KEINE Emojis. Nirgends** (UI, Code, Commits, Doku). Immer `lucide-react`.
   Bewusste Design-Entscheidung. Icon-Namen vorher prüfen (`npm run typecheck`) —
   manche existieren nicht (`Github`, `Palmtree`).
2. **Kein Backend, keine externen Dienste, keine Credentials.** Kein Supabase/
   Firebase/DB/API-Key/`.env`-Secret. „Speichern" heißt: `data/*.ts` (geteilt via
   Git) oder `localStorage` (`lib/store.tsx`).
3. **TypeScript strict, kein `any`.** Typen aus `lib/types.ts`.
4. **Ein globaler Zustand:** `useApp()` aus `lib/store.tsx`. Keine neue
   State-Library (kein Redux/Zustand/Jotai).
5. **Styling nur Tailwind-Utilities + CSS-Variablen** aus `app/globals.css`
   (`var(--sky)`, `var(--terra)`, `var(--text-muted)` …). Kategorie-Farben aus
   `lib/config.ts` (`CATEGORIES`). Keine wahllosen Hex-Codes.
6. **Animationen:** `framer-motion`, Standard-Easing `cubic-bezier(0.16,1,0.3,1)`.
7. **Sprache:** UI-Texte **deutsch**, Code (Bezeichner/Dateinamen) **englisch**.
   Kommentare dürfen deutsch sein.
8. **Client vs Server:** `"use client"` nur, wenn Hooks/State/Interaktivität nötig.
   Sonst Server Component.
9. **Keine Component-Library** (kein shadcn/MUI). Bausteine sind handgeschrieben in
   `components/` — neue im gleichen Stil.
10. **Nichts Ungenutztes** committen (ESLint-Fehler). Zufall/Zeit nur im App-Code,
    **nie in `remotion/`** (dort gesperrt).
11. **Dokumentieren ist Pflicht.** Jede Änderung nach dem Änderungs-Protokoll.
    Undokumentiert = unfertig.

---

## Änderungs-Protokoll (das Repo pflegt sich selbst)

Bei **jeder** Änderung (Feature, Fix, Refactor):

1. **Doc** in `docs/features/<name>.md` anlegen/aktualisieren (Vorlage
   `docs/features/_TEMPLATE.md`). Immer enthalten:
   - **Warum** der Change (Motivation)
   - **Was** es tut (Erklärung)
   - **Wie** es umgesetzt ist
   - **Warum diese Entscheidung** (Alternativen & Trade-offs)
   - **Was in Zukunft besser** machbar wäre
   - Dateien, Fallstricke/Annahmen, Regeln-Check, Datum
2. **`docs/features/README.md`** Tabelle aktualisieren (verlinken).
3. Bei neuem Kernkonzept: **`AGENTS.md` + `CLAUDE.md`** aktualisieren.
4. **`README.md`** aktualisieren, wenn nutzersichtbar.
5. `npm run check` grün → committen (pre-commit Hook prüft mit).

Faustregel: erst verstehen, dann bauen, dann so dokumentieren, dass Stand **und**
Begründung ohne Rückfragen aus den Docs hervorgehen.

---

## Definition of Done (Checkliste vor jedem Commit)

- [ ] Keine Emojis (nur lucide-Icons).
- [ ] Keine Secrets/Keys/externen Dienste.
- [ ] `npm run check` grün, `npm run build` läuft.
- [ ] UI-Text deutsch, Code englisch.
- [ ] Neue Farben/Icons aus bestehenden Tokens/Configs.
- [ ] Feature-Doc in `docs/features/` geschrieben/aktualisiert + verlinkt.
- [ ] Bei nutzersichtbarer/Kern-Änderung: README/AGENTS/CLAUDE aktualisiert.

---

## Architektur & Datenfluss

```
data/places.ts + data/trips.ts   (Quelle der Wahrheit, im Repo)
        │  (Import beim Start)
        ▼
lib/store.tsx  AppProvider ──►  useApp()  ◄── alle Client-Komponenten
        │  (hydratisiert aus localStorage, schreibt bei Änderung zurück)
        ▼
app/(routen)   map / plans / trips / memories   +  components/*
```

- **`lib/store.tsx`** ist das Herz: hält `places`, `trips`, UI-Zustand (Auswahl,
  Filter, Add-Sheet) und die Aktionen (`add/update/remove/love/advance`). Startet
  mit `data/*`, hydratisiert danach aus `localStorage`, persistiert automatisch.
- **`lib/filter.ts`** ist reine Logik (gut testbar): `applyFilters(places, f)`.
- Reine Präsentations-Komponenten bekommen Props; globalen Zustand holt man über
  `useApp()`.

---

## Tech-Stack

| Bereich      | Wahl                        | Notiz                                      |
| ------------ | --------------------------- | ------------------------------------------ |
| Framework    | **Next.js 16** (App Router) | Routes = Ordner in `app/`                  |
| Sprache      | **TypeScript** (strict)     | Typen in `lib/types.ts`                    |
| UI           | **React 19**                | Functional Components + Hooks              |
| Styling      | **Tailwind CSS v4**         | Tokens in `app/globals.css`                |
| Icons        | **lucide-react**            | Einzige Icon-Quelle. Keine Emojis.         |
| Animation    | **framer-motion**           | Easing `cubic-bezier(0.16,1,0.3,1)`        |
| Karte        | **react-leaflet + leaflet** | Esri-Satellit + Labels (kein Key)          |
| Datum        | **date-fns**                | Countdown, Formatierung                    |
| Video/OG     | **Remotion**                | `remotion/` → `public/og.png`, `promo.mp4` |
| Formatierung | **Prettier**                | `.prettierrc`                              |
| Linting      | **ESLint** (flat)           | `eslint.config.mjs`                        |
| Hooks        | **Husky** pre-commit        | format + lint + typecheck                  |
| Deploy       | **Vercel**                  | Zero-Config, keine Env                     |

---

## Ordnerstruktur

```
app/                 Routes (App Router)
  page.tsx           Landing (/)
  map/ plans/ trips/ memories/   die vier App-Seiten
  globals.css        Design-Tokens + Basis-Styles
  robots.ts sitemap.ts  SEO
  icon.svg           Favicon (Marke)
components/          UI-Bausteine (handgeschrieben)
lib/
  types.ts           Datentypen (Place, Trip, Category, Status)
  config.ts          Reisedaten, Kategorien, Crew, Kartenzentrum
  store.tsx          Der EINE Context: useApp() (lokal, localStorage)
  filter.ts          Filter-Logik (rein)
  geo.ts             Distanz/Wochenend-Radius
  ics.ts             Kalender-Export (.ics)
  agentPrompts.ts    Fertige Prompts für "Copy für Agent"
data/                >>> INHALTE: places.ts + trips.ts <<<
remotion/            Compositions für OG-Image + Promo-Video
docs/
  DATEN-BEARBEITEN.md  LOKAL-BEARBEITEN.md
  features/          Ein Doc pro Feature (Pflicht) + _TEMPLATE.md + README.md
```

Nur Inhalte ändern (Orte/Trips) → **ausschließlich `data/`**.

---

## Datenmodell (`lib/types.ts`)

- `Place`: `id, name, category, lat, lng, status, note, addedBy, tripId?,
plannedDate?, visitedDate?, loves, createdAt`.
- `Trip`: `id, name, color, region, startDate?, endDate?, createdAt`.
- `Category`: `roadtrip | surf | hike | food | city | park | other`.
- `Status`: `wishlist | planned | visited`.

---

## API-Oberfläche (was Agenten tatsächlich aufrufen)

### `useApp()` — `lib/store.tsx` (der einzige globale Zustand)

Rückgabe (Auszug, alles typisiert):

- **Daten:** `places: Place[]`, `trips: Trip[]`, `loading: boolean`
- **Daten-Aktionen:** `add(input: NewPlace)`, `update(id, patch)`, `remove(id)`,
  `love(id)`, `advance(id, status)`, `resetToProjectData()`
- **Auswahl:** `selectedId`, `select(id | null)`
- **Filter:** `filters`, `setFilters(f)`, `tripFilter`, `setTripFilter(id | null)`,
  `filtered: Place[]` — **bereits gefiltert; immer diese Liste rendern, nie
  `places` selbst filtern.**
- **Add-Sheet:** `sheetOpen`, `sheetTrip`, `openSheet(tripId?)`, `closeSheet()`,
  `addMode`, `setAddMode`, `draft`, `setDraft`
- **Feier-Effekt:** `celebrate: boolean` (wird bei „visited" ausgelöst)

### `lib/filter.ts`

`applyFilters(places, filters): Place[]` · `filterCount(filters): number` ·
`EMPTY_FILTERS` · Typ `Filters` = `{ q, cats, statuses, person, tripId, weekendOnly }`.

### `lib/geo.ts`

`distanceFromBase(lat, lng)` · `haversineKm(aLat,aLng,bLat,bLng)` · `driveHours(km)`
· `isWeekendReachable(km)` (< ~4 h) · `fmtKm(km)`.

### `lib/ics.ts`

`buildIcs(places): string` · `downloadIcs(places, filename?)`.

### `lib/agentPrompts.ts`

`AGENT_CONTEXT` · `AGENT_STEPS` · `PROMPT_ADD_PLACE` · `PROMPT_ADD_TRIP` ·
`PROMPT_ALL`. In UI immer via `<CopyForAgent text={…} />`.

---

## Config-Stellschrauben (`lib/config.ts`)

| Export       | Bedeutung                                   |
| ------------ | ------------------------------------------- |
| `ARRIVAL`    | Startdatum (Countdown)                      |
| `DEPARTURE`  | Enddatum (Countdown/Fortschritt)            |
| `BASECAMP`   | Oxnard-Koordinaten (Referenz für Distanzen) |
| `US_VIEW`    | Karten-Startzentrum + Zoom                  |
| `CREW`       | Namen (Alperen, Justus)                     |
| `CATEGORIES` | Kategorie → `{ label, color, Icon }`        |
| `STATUSES`   | Status → `{ label, short, color }`          |

Orte/Trips stehen **nicht** hier, sondern in `data/`.

---

## Datei-für-Datei (Komponenten)

| Komponente           | Aufgabe                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| `AppChrome.tsx`      | Header-Nav (Desktop) + Bottom-Nav (Mobile) + FAB, mountet Sheet + Celebration; Landing bleibt bare |
| `MapCanvas.tsx`      | Leaflet-Karte (Esri-Satellit), Pins als lucide-SVG, `FlyTo`, Klick-zum-Pinnen                      |
| `Dashboard.tsx`      | Countdown + Fortschritt + Stat-Zahlen                                                              |
| `PlanBoard.tsx`      | Kanban Wishlist → Geplant → Erlebt                                                                 |
| `PlaceCard.tsx`      | Spot-Karte (Loves, Status, Distanz-Chip, Aktionen)                                                 |
| `Timeline.tsx`       | Erinnerungs-Timeline (visited)                                                                     |
| `TripsTab.tsx`       | Trip-Übersichtskarten                                                                              |
| `TripChips.tsx`      | Trip-Schnellfilter (horizontal)                                                                    |
| `FilterBar.tsx`      | Suche + Kategorie/Status/Person/Wochenend-Filter                                                   |
| `AddPlaceSheet.tsx`  | Tray zum Ort-Anlegen (Nominatim-Suche/Karten-Tap)                                                  |
| `Celebration.tsx`    | Icon-Konfetti bei „Erlebt"                                                                         |
| `AnimatedNumber.tsx` | Zählende Zahlen                                                                                    |
| `CopyForAgent.tsx`   | Wiederverwendbarer „Copy für Agent"-Button                                                         |

---

## Glossar (Domänenbegriffe)

- **Spot** = ein Ort (`Place`), Pin auf der Karte.
- **Trip** = Region/Reise, gruppiert Spots über `tripId`.
- **Status** = `wishlist` (Idee) → `planned` (geplant) → `visited` (erlebt).
- **Basecamp** = Oxnard, unsere Basis (`BASECAMP`).
- **Crew** = Alperen & Justus.
- **Wochenend-tauglich** = grob < 4 h Autofahrt ab Basecamp.

---

## Rezepte (häufige Aufgaben)

- **Neuer Ort** → nur `data/places.ts` (Zeile kopieren). Siehe
  `docs/DATEN-BEARBEITEN.md`.
- **Neuer Trip** → nur `data/trips.ts`.
- **Neue Kategorie** → `lib/types.ts` (`Category`) **und** `lib/config.ts`
  (`CATEGORIES`, Farbe + lucide-Icon).
- **Neue Route/Seite** → Ordner unter `app/`, `"use client"` + `useApp()`, in
  `components/AppChrome.tsx` (`NAV`) verlinken.
- **Neues Feature** → bauen, dann Doc nach Änderungs-Protokoll.

---

## Anti-Patterns (bitte NICHT)

- Emoji „nur diesmal". Nein.
- Ein Backend/eine API „nur für dieses eine Feature". Nein — local-first.
- Farbe direkt als Hex im JSX. Nutze Tokens/`CATEGORIES`.
- Zustand in einer neuen Lib oder per Prop-Drilling durchs halbe Baumwerk. Nutze
  `useApp()`.
- Gerade Anführungszeichen als deutsche Schlusszeichen **in JS-Strings** — das
  beendet den String (nutze `data/` schlicht ohne Quotes oder echte „…").
- Feature bauen, Doc „später". Später = nie.

---

## Befehle

```bash
npm install        # einmalig
npm run dev        # lokal (http://localhost:3000)
npm run check      # typecheck + lint + prettier-check (vor Commit)
npm run format     # automatisch formatieren
npm run build      # Produktions-Build (muss laufen)
```

## Deploy

Push auf `main` → Vercel deployed automatisch. **Keine Env-Variablen.**

## Wenn du feststeckst

1. `docs/features/README.md` — gibt es das Feature schon? Wie hängt es zusammen?
2. `lib/store.tsx` — wie fließt der Zustand?
3. `app/globals.css` — welche Farb-/Design-Tokens gibt es?
4. Immer noch unklar → im Doc offene Fragen notieren, klein anfangen, `npm run
check` als Sicherheitsnetz.
