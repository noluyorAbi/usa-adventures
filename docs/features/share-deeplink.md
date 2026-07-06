# Feature: Spot teilen (Deep-Link)

> Jeder Spot hat einen teilbaren Link `/map?spot=<id>`, der den Pin direkt öffnet.
> Der Teilen-Button kopiert ihn in die Zwischenablage.

## Status

Umgesetzt.

## Warum (Nutzen)

"Schau dir das an" per WhatsApp: der Empfänger landet direkt auf dem richtigen
Pin, statt selbst suchen zu müssen.

## Dateien

| Datei              | Rolle                                                                |
| ------------------ | -------------------------------------------------------------------- |
| `app/map/page.tsx` | liest `?spot=` beim Laden (`useEffect`) + `share()`-Button im Detail |

## So funktioniert es

Beim Mount liest ein `useEffect` `window.location.search` nach `spot`. Passt die
ID zu einem Spot, wird er ausgewählt (und angeflogen). Ein `useRef` sorgt dafür,
dass das nur einmal passiert. Der Teilen-Button baut
`${origin}/map?spot=${id}` und kopiert per `navigator.clipboard`.

## So erweitert man es (für Agenten)

- Deep-Links für Trips: analog `?trip=<id>` lesen und `setTripFilter` setzen.
- Bewusst KEIN `useSearchParams` (bräuchte eine Suspense-Boundary); wir lesen
  `window.location` direkt im Effect — einfacher und ohne Extra-Wrapper.

## Warum diese Entscheidung

`window.location` im Effect statt `useSearchParams`, weil letzteres eine
Suspense-Boundary erzwingt — unnötiger Wrapper für einen simplen Lookup. Der
`useRef`-Guard verhindert, dass spätere `places`-Änderungen erneut auswählen.

## Was in Zukunft besser wäre

- Web-Share-API (`navigator.share`) auf Mobile statt nur Copy.
- Zusätzlich `?trip=` und `?filter=` Deep-Links.

## Fallstricke

Nur clientseitig (die App ist statisch). Der Link funktioniert erst, wenn die
Seite geladen und der Store hydratisiert ist — deshalb die Effect-Abhängigkeit
auf `places`.

## Regeln-Check

- [x] Nur lucide-Icons, keine Emojis
- [x] Kein Backend/keine Secrets
- [x] `npm run check` grün
