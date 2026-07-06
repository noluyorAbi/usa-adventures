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
