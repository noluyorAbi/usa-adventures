# Daten bearbeiten (ohne Coding-Stress)

Alle Inhalte der App liegen in zwei Dateien. Du musst **nur diese zwei** anfassen,
um Orte und Trips zu ändern. Nichts anderes.

- `data/places.ts` — die Orte/Spots (Pins auf der Karte)
- `data/trips.ts` — die Trips/Regionen

Nach dem Speichern zeigt die App die Änderung sofort (wenn `npm run dev` läuft:
Browser aktualisiert sich selbst).

---

## Einen Ort hinzufügen

Öffne `data/places.ts`. Kopiere eine bestehende Zeile `{ ... }`, füge sie
darunter ein, ändere die Werte:

```ts
{
  id: "spot-santa-cruz",        // eindeutig, klein, mit Bindestrich
  name: "Santa Cruz",           // Anzeigename
  category: "surf",             // roadtrip | surf | hike | food | city | park | other
  lat: 36.9741,                 // Koordinaten: siehe unten
  lng: -122.0308,
  status: "wishlist",           // wishlist | planned | visited
  note: "Boardwalk und Surfen.",
  addedBy: "Justus",            // Alperen | Justus | dein Name
  tripId: "trip-pch",           // welche Reise? id aus data/trips.ts, oder null
  plannedDate: null,            // "2026-11-05" oder null
  visitedDate: null,            // "2026-11-05" oder null
  loves: 0,
  createdAt: "2026-10-02T00:00:00Z",
},
```

**Koordinaten finden:** Google Maps öffnen, auf den Ort **rechtsklicken**, oben
stehen zwei Zahlen (z. B. `36.9741, -122.0308`). Erste Zahl = `lat`, zweite = `lng`.

---

## Einen Trip hinzufügen

Öffne `data/trips.ts`. Gleiche Idee:

```ts
{
  id: "trip-alaska",            // die id kommt bei Orten ins Feld tripId
  name: "Alaska",
  color: "#2f9be0",             // Farbe aussuchen: https://coolors.co
  region: "Anchorage · Denali", // kurzer Untertitel
  startDate: null,              // "2026-12-01" oder null
  endDate: null,
  createdAt: "2026-10-02T00:00:00Z",
},
```

---

## Regeln, damit nichts bricht

- Immer ein **Komma** am Ende jeder Zeile `{ ... },`.
- Texte in **Anführungszeichen** `"so"`.
- `category` und `status` nur mit den erlaubten Wörtern oben.
- **Keine Emojis** im Text — die App nutzt bewusst nur Icons.
- Im Zweifel: kopiere eine funktionierende Zeile und ändere nur die Werte.

Wenn du magst, lass danach `npm run check` laufen — das sagt dir, ob alles passt.
