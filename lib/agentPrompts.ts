/**
 * Fertige Prompts zum Kopieren für den KI-Agenten des Kollegen (Copilot/Cursor/
 * Claude). Zentral hier, damit Landing UND App dieselben Texte nutzen.
 *
 * Jeder Prompt: Kontext + klare Aufgabe + Erlaubnis, Rückfragen zu stellen.
 */

export const AGENT_CONTEXT =
  'Kontext: Projekt "USA Adventures" (Next.js 16, TypeScript, Tailwind), Repo https://github.com/noluyorAbi/usa-adventures. Lokale Reise-App, komplett ohne Backend; Inhalte liegen in data/places.ts und data/trips.ts. Verbindliche Regeln in AGENTS.md (nur lucide-react-Icons statt Emojis, keine Secrets/kein Backend, npm run check muss grün sein, jede Änderung wird in docs/features/ dokumentiert). Ich bin Einsteiger und will vibe-coden.';

export interface AgentStep {
  key: string;
  title: string;
  desc: string;
  prompt: string;
}

export const AGENT_STEPS: AgentStep[] = [
  {
    key: "node",
    title: "Node.js installieren",
    desc: "Einmalig von nodejs.org die LTS-Version laden und installieren. Das ist die Basis, damit alles läuft.",
    prompt:
      AGENT_CONTEXT +
      "\n\nAufgabe: Hilf mir, Node.js (LTS) zu installieren. Frag mich zuerst, ob ich Windows oder macOS habe. Erkläre dann Schritt für Schritt in einfacher Sprache. Prüfe am Ende mit `node -v` und `npm -v`. Stell Rückfragen, wenn etwas unklar ist.",
  },
  {
    key: "clone",
    title: "Repo klonen",
    desc: "Mit git das Repo klonen (nicht als ZIP). Falls git fehlt, hilft dir dein Agent beim Installieren.",
    prompt:
      AGENT_CONTEXT +
      "\n\nAufgabe: Hilf mir, das Repo per git zu klonen (NICHT als ZIP herunterladen). Prüfe zuerst mit `git --version`, ob git installiert ist; falls nicht, führe mich durch die Installation (Windows/macOS). Dann `git clone https://github.com/noluyorAbi/usa-adventures.git`, und erkläre, wie ich in den Ordner wechsle (`cd usa-adventures`).",
  },
  {
    key: "start",
    title: "Starten",
    desc: "Im Projektordner einmal npm install, dann npm run dev. Browser auf localhost:3000.",
    prompt:
      AGENT_CONTEXT +
      "\n\nAufgabe: Bring das Projekt lokal zum Laufen. Führe mich durch: Terminal im Projektordner, `npm install`, dann `npm run dev`, danach http://localhost:3000. Erkläre jeden Befehl in einem Satz. Bei Fehlermeldung: frag nach dem genauen Text und hilf mir.",
  },
  {
    key: "find",
    title: "Inhalte finden",
    desc: "Alles Editierbare liegt im Ordner data/: places.ts (Orte) und trips.ts (Reisen).",
    prompt:
      AGENT_CONTEXT +
      "\n\nAufgabe: Erkläre mir die Projektstruktur einfach, Fokus auf `data/`. Sag mir klar: welche Datei für Orte (places.ts), welche für Trips (trips.ts), und welche ich NICHT anfasse. Lies vorher docs/DATEN-BEARBEITEN.md und AGENTS.md.",
  },
  {
    key: "edit",
    title: "Ändern & speichern",
    desc: "Eine Zeile kopieren, Werte anpassen, speichern. Der Browser aktualisiert sich selbst.",
    prompt:
      AGENT_CONTEXT +
      "\n\nAufgabe: Füge einen neuen Ort hinzu. Frag mich nach Name und ungefährem Ort (du besorgst lat/lng), Kategorie (roadtrip|surf|hike|food|city|park|other), Status (wishlist|planned|visited) und Trip. Trag ihn sauber in data/places.ts ein, gleiches Format wie bestehende Einträge, halte dich an AGENTS.md. Zeig mir die eingefügte Zeile.",
  },
  {
    key: "deploy",
    title: "Online stellen",
    desc: "Änderung committen und pushen — Vercel deployed automatisch.",
    prompt:
      AGENT_CONTEXT +
      '\n\nAufgabe: Hilf mir, meine Änderung online zu stellen: `git add -A`, `git commit -m "..."`, `git push` (ein pre-commit Hook formatiert/prüft automatisch). Erkläre, dass Vercel danach automatisch deployed und die Seite kurz darauf unter usa-adventures.vercel.app aktualisiert ist. Hilf bei Fehlermeldungen.',
  },
];

/** Ein neuer Ort — direkt aus der App heraus. */
export const PROMPT_ADD_PLACE =
  AGENT_CONTEXT +
  "\n\nAufgabe: Füge einen neuen Ort in data/places.ts hinzu. Frag mich nach Name, ungefährem Ort (du besorgst lat/lng), Kategorie (roadtrip|surf|hike|food|city|park|other), Status (wishlist|planned|visited) und Trip-Zugehörigkeit (id aus data/trips.ts oder null). Nutze exakt das Format der bestehenden Einträge und halte dich an AGENTS.md. Danach: Doc-Pflicht prüfen (nur nötig bei neuem Feature, nicht bei reinen Daten).";

/** Ein neuer Trip — direkt aus der App heraus. */
export const PROMPT_ADD_TRIP =
  AGENT_CONTEXT +
  "\n\nAufgabe: Lege einen neuen Trip in data/trips.ts an. Frag mich nach Name, kurzer Region-Beschreibung, Farbe (Hex) und optional Start-/Enddatum. Erzeuge eine eindeutige id (z.B. trip-alaska) und sag mir, dass ich diese id bei Orten ins Feld tripId eintragen kann. Format wie bestehende Einträge.";

/** Der komplette Onboarding-Prompt (alle Schritte auf einmal). */
export const PROMPT_ALL =
  AGENT_CONTEXT +
  "\n\nBitte begleite mich komplett beim Aufsetzen und ersten Bearbeiten dieses Projekts. Gehe die folgenden Schritte der Reihe nach mit mir durch, jeweils in einfacher Sprache, mit Rückfragen wo nötig, und warte nach jedem Schritt auf mein OK:\n\n" +
  AGENT_STEPS.map((s, i) => `${i + 1}. ${s.title}: ${s.desc}`).join("\n") +
  "\n\nWichtig: git clone statt ZIP-Download. Am Ende bin ich in der Lage, selbst Orte/Trips zu ändern und online zu stellen.";
