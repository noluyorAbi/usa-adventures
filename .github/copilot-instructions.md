# GitHub Copilot — Projektregeln

Du hilfst bei **USA Adventures**, einer lokalen Reise-Web-App (Next.js). Die
vollständigen Regeln stehen in [`AGENTS.md`](../AGENTS.md) — lies sie. Hier die
wichtigsten, unverhandelbaren Punkte:

- **KEINE Emojis.** Überall nur Icons aus `lucide-react`. Bewusste Design-Wahl.
- **Kein Backend, keine Datenbank, keine API-Keys, keine `.env`-Secrets.** Alles
  lokal. Daten leben in `data/places.ts` und `data/trips.ts`.
- **TypeScript strikt**, kein `any`. Typen aus `lib/types.ts`.
- **Styling** nur mit Tailwind-Utilities + CSS-Variablen aus `app/globals.css`
  (`var(--sky)`, `var(--terra)`, …). Kategorie-Farben aus `lib/config.ts`.
- **Globaler State** ausschließlich über `useApp()` aus `lib/store.tsx`. Keine
  neue State-Library.
- **UI-Text auf Deutsch**, Code (Bezeichner) auf Englisch.
- Vor „fertig“: `npm run check` muss grün sein, `npm run build` muss laufen.
  Ein pre-commit Hook (Husky) formatiert + lintet + typecheckt automatisch.

## Dokumentieren ist Pflicht (Selbstpflege)

Bei **jeder** Änderung ein Doc in `docs/features/<name>.md` (Vorlage
`docs/features/_TEMPLATE.md`) anlegen/aktualisieren, mit: **Warum** der Change,
**Was** es tut, **Wie**, **Warum diese Entscheidung**, **Was in Zukunft besser**,
Dateien, Fallstricke, Datum. Danach `docs/features/README.md` verlinken und bei
Kernänderungen `AGENTS.md` + `CLAUDE.md` aktualisieren. Details:
[`AGENTS.md`](../AGENTS.md) → Abschnitt „Änderungs-Protokoll“.

Inhalte ändern (neue Orte/Trips) passiert **nur** in `data/` — siehe
[`docs/DATEN-BEARBEITEN.md`](../docs/DATEN-BEARBEITEN.md).
