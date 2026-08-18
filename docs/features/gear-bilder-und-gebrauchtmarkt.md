# Feature / Change: Produktbilder auf der Kamera-Seite plus Gebrauchtmarkt München

> Jeder Vorschlag auf `/gear` hat jetzt ein Produktfoto, und ein eigener Block bewertet die Kleinanzeigen-Funde im Umkreis München gegen den Neukauf.

**Datum:** 2026-08-18 · **Von:** Claude (Session mit Alperen)

## 1. Warum der Change (Motivation)

Die Seite empfahl Geräte, die man nicht sieht. Wer zwischen a6400, X-T30 II und GR III wählt,
entscheidet auch nach Aussehen und Größe, und ein Kaufknopf ohne Bild wirkt wie eine Tabelle,
nicht wie ein Angebot. Zweitens fehlte die naheliegende Frage: lohnt es sich, das Zeug gebraucht
in München zu holen, statt es neu zu bestellen.

## 2. Was es tut

- **Produktfotos** an jeder Kamerakarte, jeder Zubehörzeile, jeder Fotokamera im Vergleich und
  an den Kleinanzeigen-Funden. Fehlt ein Bild, erscheint eine gestaltete Kachel mit passendem
  lucide-Icon statt eines kaputten Bildrahmens.
- **Bildnachweis** als aufklappbarer Block am Seitenende: Datei, Commons-Titel, Lizenz, Urheber,
  Link zur Quelle. Am Bild selbst erscheint beim Überfahren ein kleines Label.
- **Gebrauchtmarkt München** als eigener Abschnitt: sieben Funde im Umkreis 50 km, je mit Preis,
  Entfernung, Differenz zum Neupreis und einem Urteil (lohnt, grenzwertig, nein), Filter auf
  „nur was lohnt“ und Link auf die Kleinanzeigen-Suche statt auf eine Anzeige, die morgen weg ist.

## 3. Wie es umgesetzt ist

- `components/GearBild.tsx`: eine Komponente für alle Vorschauen. Props `bild`, `alt`, `art`
  (Icon-Fallback), `hoehe`, `breit`, `passform`. Bilder liegen unter `public/images/gear/` und
  heißen wie die id im Datensatz. `onError` schaltet auf den Fallback, damit ein fehlendes Bild
  die Karte nicht zerlegt. Exportiert zusätzlich `BildNachweis` für den Sammelnachweis.
- `data/imageCredits.ts`: `BILD_QUELLEN`, Datei zu Commons-Titel, Lizenz, Urheber und URL.
- Bilder wurden über die Commons-API gesucht, lokal gespeichert, auf 700 px Breite und
  JPEG-Qualität 78 gerechnet (13 Dateien, zusammen rund 890 KB).
- `data/shop.ts`: neues Feld `bild` bei `KaufProdukt`, `FotoKamera` und `LokalAngebot`, dazu die
  Konstanten `LOKAL` und `KLEINANZEIGEN_STAND`.
- `components/GearLokal.tsx`: Anzeige der Funde, Filter, Differenzrechnung gegen `neuPreis`.

## 4. Warum diese Entscheidung

- **Bilder lokal statt Hotlink:** Shops sperren fremde Einbindung oder ändern URLs; eine Seite
  mit halb kaputten Bildern wirkt schlimmer als eine ohne. Lokale Dateien laufen auch offline.
- **Wikimedia Commons statt Shop-Fotos:** frei lizenziert, mit nachweisbarem Urheber. Deshalb der
  Nachweisblock. Produktfotos der Händler wären rechtlich heikler und nicht nachweisbar.
- **Kein Bild für die Pocket 4:** Commons hat nur Fotos der 4P. Ein 4P-Bild als Pocket 4 auszugeben
  wäre falsch, also bleibt dort der Icon-Fallback.
- **Suchlinks statt Anzeigenlinks:** einzelne Kleinanzeigen verfallen, die Suche bleibt gültig.
- **Kein `next/image`:** das Projekt nutzt bereits plain `<img>` (siehe `SpotModal`), und ohne
  Bildoptimierungs-Server ist der Zusatznutzen gering.

## 5. Dateien

| Datei                      | Rolle                                       |
| -------------------------- | ------------------------------------------- |
| `components/GearBild.tsx`  | Vorschau plus Fallback plus Nachweis        |
| `data/imageCredits.ts`     | Herkunft und Lizenz je Datei                |
| `public/images/gear/`      | 13 Produktfotos, je unter 120 KB            |
| `components/GearLokal.tsx` | Gebrauchtmarkt München                      |
| `data/shop.ts`             | Feld `bild`, `LOKAL`, `KLEINANZEIGEN_STAND` |
| `lib/types.ts`             | `LokalAngebot`, `bild` an drei Typen        |
| `app/gear/page.tsx`        | Abschnitt `#gebraucht`, Nachweis am Ende    |

## 6. So erweitert man es

- Neues Bild: Datei nach der id benennen (`f-xyz.jpg`), nach `public/images/gear/` legen, in
  `BILD_QUELLEN` eintragen, im Datensatz `bild` setzen. Breite 700 px, unter 150 KB.
- Neuer Gebrauchtfund: Eintrag in `LOKAL`, `neuPreis` setzen, damit die Differenz stimmt, und
  `KLEINANZEIGEN_STAND` aktualisieren.

## 7. Was in Zukunft besser machbar wäre

- Ein Skript, das die Commons-Suche wiederholt und Bilder aktualisiert, liegt bisher nur im
  Arbeitsverzeichnis der Session, nicht im Repo.
- Die Kleinanzeigen-Funde sind eine Momentaufnahme und veralten. Automatisch geht nicht ohne
  Backend, deshalb Datum sichtbar und Links auf die Suche.

## 8. Fallstricke / Annahmen

- Commons-API drosselt hart (HTTP 429); Abrufe brauchen Backoff.
- Die Fotos zeigen das Modell, nicht das konkrete Angebot. Steht so auf der Seite.
- Bei der 4P sind die Bilder korrekt, bei der Pocket 4 fehlt bewusst eins.

## 9. Regeln-Check

- [x] Nur lucide-Icons, keine Emojis
- [x] Kein Backend/keine Secrets
- [x] `npm run check` grün, `npm run build` läuft
- [x] docs/features/README.md-Tabelle aktualisiert
