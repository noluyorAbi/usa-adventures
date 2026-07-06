# CLAUDE.md

Diese Datei existiert nur, weil **Claude Code sie automatisch lädt**. Sie
**dupliziert keine Regeln** — das würde mit `AGENTS.md` auseinanderlaufen.

## Single Source of Truth: AGENTS.md

Alle verbindlichen Regeln, Architektur, das Änderungs-Protokoll und die Definition
of Done stehen in **[`AGENTS.md`](AGENTS.md)**. Lies sie zuerst und vollständig.
`.github/copilot-instructions.md` (für VS Code / GitHub Copilot) verweist ebenfalls
dorthin. So gibt es genau eine Quelle, kein Clash.

## Claude-spezifische Notizen (nur hier sinnvoll)

- Der pre-commit Hook (Husky) läuft auch bei deinen Commits: `prettier --write`,
  `eslint --fix`, `tsc --noEmit`. Schlägt etwas fehl, wird der Commit gestoppt —
  behebe die Ursache, umgehe den Hook nicht.
- Bei größerer Arbeit: erst die relevanten `docs/features/*` lesen, dann `lib/
store.tsx`. Nicht blind editieren.
- Halte dich strikt an das **Änderungs-Protokoll** aus `AGENTS.md`: jede Änderung
  bekommt ein Feature-Doc (Warum / Was / Wie / Warum diese Entscheidung / Zukunft).

Kurz: **AGENTS.md ist maßgeblich. Diese Datei schickt dich nur dorthin.**
