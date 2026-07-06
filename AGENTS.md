# AGENTS.md — Regeln für KI-Agenten (Copilot, Claude, Cursor, …)

Wir entwickeln dieses Projekt **gemeinsam per Vibe-Coding** weiter: einer mit
Informatik-Background, einer, der über KI-Agenten einsteigt. Damit beide sauber
beitragen können, nichts kaputtgeht und alles konsistent bleibt, hält sich **jeder
Agent an diese Regeln**. Lies sie komplett, bevor du Code änderst.

---

## Das Projekt in einem Satz

Eine lokale, deploybare Reise-Web-App (USA + Hawaii) mit interaktiver Karte,
Trips, Plan-Board und Erinnerungs-Timeline. Kein Backend, kein Login, keine
Datenbank — alle Daten liegen als Dateien **im Projekt**.

---

## HARTE REGELN (nicht verhandelbar)

1. **KEINE Emojis. Niemals. Nirgends.** Nicht im UI, nicht im Code, nicht in
   Commits, nicht in Doku. Stattdessen **immer Icons aus `lucide-react`**. Das
   ist eine bewusste Design-Entscheidung des Projekts.
2. **Kein Backend, keine externen Dienste, keine Credentials.** Kein Supabase,
   Firebase, keine Datenbank, keine API-Keys, keine `.env`-Geheimnisse. Wenn ein
   Feature „Speichern“ braucht: es lebt in `data/*.ts` (geteilt, via Git) oder im
   `localStorage` des Browsers (siehe `lib/store.tsx`). Niemals Secrets committen.
3. **TypeScript, strikt.** Kein `any` (Warnung). Typen kommen aus `lib/types.ts`.
4. **Vor „fertig“: `npm run check` muss grün sein** (Typecheck + Lint + Prettier)
   und `npm run build` muss durchlaufen.
5. **Styling nur über Tailwind-Utilities + CSS-Variablen** aus `app/globals.css`
   (z. B. `var(--sky)`, `var(--terra)`, `var(--text-muted)`). Farben für
   Kategorien kommen aus `lib/config.ts` (`CATEGORIES`). Keine wahllosen Hex-Codes
   verstreuen.
6. **Icons: nur `lucide-react`.** Vorher prüfen, ob der Name existiert (manche
   heißen anders, z. B. gibt es kein `Github`/`Palmtree` in dieser Version).
   Import testen mit `npm run typecheck`.
7. **State: genau ein Context** in `lib/store.tsx`, benutzt über `useApp()`. Keine
   neuen State-Libraries (kein Redux, Zustand, Jotai …).
8. **Animationen: `framer-motion`**, Standard-Easing `cubic-bezier(0.16,1,0.3,1)`.
9. **Sprache:** UI-Texte auf **Deutsch**. Code (Variablen, Funktionen, Dateinamen)
   auf **Englisch**. Kommentare dürfen deutsch sein (die Crew liest sie).
10. **Client vs Server:** `"use client"` nur oben in Dateien, die Hooks/State/
    Interaktivität brauchen. Sonst Server Component lassen.

---

## Tech-Stack (was wir benutzen)

| Bereich      | Wahl                           | Notiz                                 |
| ------------ | ------------------------------ | ------------------------------------- |
| Framework    | **Next.js 16** (App Router)    | Routes = Ordner in `app/`             |
| Sprache      | **TypeScript** (strict)        | Typen in `lib/types.ts`               |
| UI-Lib       | **React 19**                   | Functional Components + Hooks         |
| Styling      | **Tailwind CSS v4**            | Tokens/Variablen in `app/globals.css` |
| Icons        | **lucide-react**               | Einzige Icon-Quelle. Keine Emojis.    |
| Animation    | **framer-motion**              | Easing `cubic-bezier(0.16,1,0.3,1)`   |
| Karte        | **react-leaflet + leaflet**    | Esri-Satellit + Labels (kein Key)     |
| Datum        | **date-fns**                   | Countdown, Formatierung               |
| Fonts        | **next/font** (Fraunces+Geist) | Fraunces = Display, Geist = Text      |
| Formatierung | **Prettier**                   | `.prettierrc`, `npm run format`       |
| Linting      | **ESLint** (flat config)       | `eslint.config.mjs`, `npm run lint`   |
| Deploy       | **Vercel**                     | Zero-Config, keine Env-Variablen      |

Keine Component-Library (kein shadcn/MUI). Komponenten sind handgeschrieben in
`components/`. Wenn du eine brauchst, baue sie im gleichen Stil.

---

## Ordnerstruktur

```
app/                 Routes (Next.js App Router)
  layout.tsx         Root: Fonts + AppProvider + AppChrome
  page.tsx           Landing-Page (/)
  globals.css        Design-Tokens (Farben, Schatten) + Basis-Styles
  map/page.tsx       /map      -> Karte
  plans/page.tsx     /plans    -> Plan-Board
  trips/page.tsx     /trips    -> Trip-Übersicht
  memories/page.tsx  /memories -> Timeline
components/          Wiederverwendbare UI-Bausteine
lib/
  types.ts           Datentypen (Place, Trip, Category, Status)
  config.ts          Reisedaten, Kategorien, Crew, Kartenzentrum
  store.tsx          Der EINE Context (useApp) — lokal, localStorage
  filter.ts          Filter-Logik (rein, testbar)
data/                >>> HIER LIEGEN DIE INHALTE <<<
  places.ts          Alle Orte/Spots
  trips.ts           Alle Trips/Regionen
docs/                Anleitungen für Menschen
```

**Wenn jemand nur Inhalte ändern will (neue Orte, Trips), passiert das
ausschließlich in `data/`.** Kein anderer Code muss angefasst werden.

---

## Datenmodell (`lib/types.ts`)

- `Place`: ein Punkt auf der Karte. Felder: `id, name, category, lat, lng,
status, note, addedBy, tripId?, plannedDate?, visitedDate?, loves, createdAt`.
- `Trip`: eine Region/Reise. Felder: `id, name, color, region, startDate?,
endDate?, createdAt`.
- `Category`: `roadtrip | surf | hike | food | city | park | other`.
- `Status`: `wishlist | planned | visited`.

Orte werden über `tripId` einem Trip zugeordnet.

---

## Häufige Aufgaben (Rezepte)

**Neuen Ort hinzufügen** -> nur `data/places.ts`, eine Zeile kopieren, Werte
ändern. Details: `docs/DATEN-BEARBEITEN.md`.

**Neuen Trip hinzufügen** -> nur `data/trips.ts`.

**Neue Kategorie** -> `lib/types.ts` (`Category` erweitern) **und** `lib/config.ts`
(`CATEGORIES` erweitern, mit Farbe + `lucide-react`-Icon).

**Neue Route/Seite** -> Ordner unter `app/` anlegen (z. B. `app/budget/page.tsx`),
`"use client"` + `useApp()` benutzen, in `components/AppChrome.tsx` in `NAV`
verlinken.

**Neue Komponente** -> in `components/`, gleicher Stil (Tailwind-Tokens, Icons,
framer-motion). Reine Präsentation nimmt Props; globaler Zustand kommt aus
`useApp()`.

---

## Befehle

```bash
npm install        # einmalig
npm run dev        # lokal starten (http://localhost:3000)
npm run check      # Typecheck + Lint + Prettier-Check (VOR dem Commit)
npm run format     # Code automatisch formatieren
npm run build      # Produktions-Build (muss durchlaufen)
```

---

## Deploy (Vercel)

Repo mit Vercel verbinden, „Deploy“ klicken. **Keine Environment-Variablen
nötig.** Framework wird als Next.js erkannt. Fertig.

---

## Checkliste vor jedem „done“

- [ ] Keine Emojis eingebaut (nur `lucide-react`-Icons).
- [ ] Keine Secrets/Keys/externen Dienste hinzugefügt.
- [ ] `npm run check` ist grün.
- [ ] `npm run build` läuft durch.
- [ ] UI-Text deutsch, Code englisch.
- [ ] Neue Farben/Icons aus den bestehenden Tokens/Configs.
