# Das Repo lokal bearbeiten (Schritt für Schritt, für Einsteiger)

Keine Angst, du brauchst keine Coding-Erfahrung. Diese Anleitung bringt das
Projekt auf deinen Rechner, du änderst Inhalte, und stellst es online.

---

## 1. Node.js installieren (einmalig)

Node.js ist das Programm, das die App laufen lässt.

- Gehe auf **https://nodejs.org** und lade die **LTS**-Version.
- Installiere sie wie ein normales Programm (weiter, weiter, fertig).

Test: Terminal öffnen (Mac: „Terminal“, Windows: „PowerShell“) und eingeben:

```bash
node -v
```

Wenn eine Versionsnummer erscheint (z. B. `v20...`), passt alles.

---

## 2. Das Projekt holen

**Einfachste Variante (ohne git):**

- Öffne das Repo auf GitHub.
- Grüner Button **„Code“** → **„Download ZIP“**.
- ZIP entpacken, z. B. auf den Schreibtisch.

**Oder mit git** (falls installiert):

```bash
git clone https://github.com/noluyorAbi/usa-adventures.git
```

---

## 3. Starten

Im Terminal in den Projektordner wechseln (Tipp: `cd ` schreiben und den Ordner
ins Terminal ziehen), dann:

```bash
npm install     # einmalig, lädt die Bausteine (dauert kurz)
npm run dev      # startet die App
```

Browser öffnen: **http://localhost:3000**. Die App läuft jetzt lokal auf deinem
Rechner. Änderungen siehst du sofort.

---

## 4. Inhalte ändern

Alles Editierbare liegt im Ordner **`data/`**:

- `data/places.ts` — die Orte (Pins auf der Karte)
- `data/trips.ts` — die Trips/Regionen

Öffne die Datei in einem Editor (Empfehlung: **VS Code**, kostenlos, mit GitHub
Copilot zum Vibe-Coden). Kopiere eine bestehende Zeile, ändere die Werte,
speichern. Der Browser aktualisiert sich selbst.

Genaue Feld-Erklärung: **[`DATEN-BEARBEITEN.md`](DATEN-BEARBEITEN.md)**.

---

## 5. Mit einem KI-Agenten arbeiten (Copilot etc.)

Der Agent kennt die Projektregeln automatisch über
[`AGENTS.md`](../AGENTS.md) und `.github/copilot-instructions.md`. Sag ihm einfach
in normaler Sprache, was du willst (z. B. „Füge einen Spot für Portland hinzu“).
Er hält sich an die Regeln (nur Icons, kein Backend, sauberer Code).

---

## 6. Online stellen

Wenn du mit git arbeitest:

```bash
git add -A
git commit -m "Neue Orte hinzugefügt"
git push
```

Beim Commit läuft automatisch eine Prüfung (Formatierung + Fehlercheck). Nach dem
Push **deployed Vercel automatisch** — nach ein paar Sekunden ist es live unter
`usa-adventures.vercel.app`.

Kein git? Dann lade deine geänderten Dateien direkt auf GitHub hoch (Datei
öffnen → Stift-Symbol → „Commit changes“). Auch das löst ein Deploy aus.

---

## Wenn mal was klemmt

- `npm run check` sagt dir, ob im Code etwas nicht stimmt.
- Fehlermeldung nicht verstanden? Kopiere sie in Copilot/ChatGPT und frag nach.
- Im Zweifel: eine funktionierende Zeile kopieren und nur die Werte ändern.
