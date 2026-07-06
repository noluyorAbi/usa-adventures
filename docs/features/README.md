# Features

Jedes Feature dieser App hat hier ein eigenes Doc — damit Menschen UND KI-Agenten
sofort verstehen, was es tut, welche Dateien dazugehören und wie man es erweitert.

## Umgesetzt

| Feature                              | Doc                                                |
| ------------------------------------ | -------------------------------------------------- |
| Distanz ab Oxnard + Wochenend-Radius | [distance-and-weekend.md](distance-and-weekend.md) |
| Überrasch uns (Zufalls-Spot)         | [surprise-me.md](surprise-me.md)                   |
| Spot teilen (Deep-Link `?spot=`)     | [share-deeplink.md](share-deeplink.md)             |
| Kalender-Export (.ics)               | [calendar-export.md](calendar-export.md)           |
| Copy-für-Agent-Prompts               | [agent-copy-prompts.md](agent-copy-prompts.md)     |

## Neues Feature hinzufügen (Pflicht-Ablauf für Agenten)

1. Feature bauen (Regeln aus [`../../AGENTS.md`](../../AGENTS.md) einhalten).
2. `_TEMPLATE.md` kopieren zu `docs/features/<name>.md`, ausfüllen.
3. In der Tabelle oben verlinken.
4. Falls neue Kern-Datei/Konzept: [`../../AGENTS.md`](../../AGENTS.md) und
   [`../../CLAUDE.md`](../../CLAUDE.md) aktualisieren.
5. `npm run check` grün, dann committen.

## Ideen-Backlog (noch nicht gebaut)

Bewusst offen gelassen, passen aber gut und bleiben lokal machbar:

- **US-Staaten-Sammlung** — pro Spot ein `state`-Feld; "X/50 Staaten besucht" als
  gamifizierte Stat.
- **Budget** — optionales `cost`-Feld je Spot; Summe pro Trip/gesamt.
- **Fotos** — `photoUrl` je Spot als Link auf ein extern gehostetes Bild (kein
  Upload, damit local-first bleibt).
- **Best-Time-to-Visit** — `bestMonths` je Spot; Hinweis "jetzt gute Zeit".
- **Print/Export als Markdown** — Trip als schöne Textliste exportieren.
- **Command-Palette** — Cmd/Ctrl-K zum schnellen Springen/Filtern.

Wer eines davon baut: Doc nicht vergessen.
