# Feature / Change: Copy-für-Agent-Prompts

> Fertige Prompts, die man mit einem Klick kopiert und in seinen KI-Agenten
> (Copilot/Cursor/Claude) einfügt — auf der Landing (Setup) und kontextuell in der
> App (Ort/Trip anlegen).

**Datum:** 2026-07-07 · **Von:** Claude (Agent)

## 1. Warum der Change (Motivation)

Der nicht-technische Kollege soll nicht raten müssen. Statt Anleitungen zu lesen,
kopiert er einen fertigen Prompt und sein Agent erledigt/erklärt den Schritt. Senkt
die Einstiegshürde massiv.

## 2. Was es tut

- Landing: pro Tutorial-Schritt ein **Copy für Agent**-Button + ein prominenter
  **„Kompletten Setup-Prompt kopieren"** (alle 6 Schritte am Stück).
- App: kontextuelle Buttons an den passenden Funktionen — im Add-Sheet („Ort per
  Agent") und auf `/trips` („Trip per Agent").

## 3. Wie es umgesetzt ist

- `lib/agentPrompts.ts` hält alle Texte zentral: `AGENT_CONTEXT` (Projekt +
  Regeln), `AGENT_STEPS` (die 6 Schritte mit `prompt`), `PROMPT_ADD_PLACE`,
  `PROMPT_ADD_TRIP`, `PROMPT_ALL` (Master).
- `components/CopyForAgent.tsx` ist ein wiederverwendbarer Button (Varianten
  `full | compact | primary`), der per `navigator.clipboard` kopiert (mit Fallback)
  und kurz „Kopiert" zeigt.
- Landing (`app/page.tsx`), `components/AddPlaceSheet.tsx` und `app/trips/page.tsx`
  importieren Prompt + Button.

## 4. Warum diese Entscheidung (Alternativen & Trade-offs)

- **Zentral in `lib/agentPrompts.ts`** statt Text in jeder Komponente: eine Quelle,
  kein Drift, leicht erweiterbar. Prompts enthalten bewusst „darf Rückfragen
  stellen", damit der Agent den Nutzer führt statt blind zu raten.
- Bewusst **kein** eingebauter Chat/kein API-Call an ein LLM — das würde Keys/
  Backend brauchen (verstößt gegen local-first). Wir liefern nur den Prompt-Text.

## 5. Dateien

| Datei                          | Rolle                            |
| ------------------------------ | -------------------------------- |
| `lib/agentPrompts.ts`          | alle Prompt-Texte zentral        |
| `components/CopyForAgent.tsx`  | wiederverwendbarer Kopier-Button |
| `app/page.tsx`                 | Landing: Steps + Master-Button   |
| `components/AddPlaceSheet.tsx` | „Ort per Agent"                  |
| `app/trips/page.tsx`           | „Trip per Agent"                 |

## 6. So erweitert man es (für Agenten)

Neuen Prompt: Konstante in `lib/agentPrompts.ts` ergänzen (mit `AGENT_CONTEXT`
prefixen), dann `<CopyForAgent text={PROMPT_X} />` an der passenden Stelle rendern.

## 7. Was in Zukunft besser machbar wäre

- Prompts mehrsprachig (falls jemand mit englischem Agenten arbeitet).
- „Copy für Agent" auch bei weiteren Aktionen (Kategorie anlegen, Feature bauen).
- Optionaler Deep-Link, der den Prompt direkt in ein Agenten-Tool öffnet (sobald es
  dafür stabile URLs gibt).

## 8. Fallstricke / Annahmen

- `navigator.clipboard` braucht HTTPS/localhost; deshalb der `execCommand`-Fallback.
- In JS-Strings keine geraden `"` als deutsche Schlusszeichen (beendet den String).
  In Prompt-Texten Quotes sparsam/escaped halten.

## 9. Regeln-Check

- [x] Nur lucide-Icons, keine Emojis
- [x] Kein Backend/keine Secrets (nur Text in die Zwischenablage)
- [x] `npm run check` grün
- [x] docs/features/README.md-Tabelle aktualisiert
