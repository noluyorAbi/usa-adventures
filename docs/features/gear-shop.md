# Feature / Change: Kamera-Seite als Einkauf mit Raten, Fotokamera und 3D-Druck

> `/gear` ist jetzt ein Konfigurator: Auswahl treffen, Preise und Monatsrate live sehen, ein Klick zum besten Shop, abhaken. Dazu Fotokamera-Vergleich (neu und gebraucht) und die Liste, was der 3D-Drucker statt der Kreditkarte erledigt.

**Datum:** 2026-08-18 · **Von:** Claude (Session mit Alperen)

## 1. Warum der Change (Motivation)

Die alte Seite erklärte gut, warum die Pocket 3, aber der Kauf selbst hatte Reibung: Preise
aus dem Kopf, keine Links, keine Ratenrechnung, obwohl vor dem Abflug auf Raten gekauft
werden muss und das Stipendium im Aufenthalt pausiert. Außerdem fehlten zwei Fragen ganz:
welche Fotokamera für Instagram dazukommt und was der vorhandene 3D-Drucker ersetzen kann.

## 2. Was es tut

- **Summenleiste (sticky):** Sofort fällig, monatliche Rate mit Laufzeit, Gesamtkosten,
  Fortschritt „gekauft“, Primärknopf zum besten Shop. Zahlen animieren beim Ändern.
- **Schritt 1 Kamera:** Creator Combo, Standard oder keine. Zeigt Preis des besten Shops,
  Warum-Text, Kaufen-Knopf, „gekauft“-Haken, ausklappbarer Vergleich aller Angebote mit
  Ratenarten-Badges und Idealo-Link.
- **Schritt 2 Zahlweise:** Sofort, MediaMarkt 0 % (18/12), Klarna 3×, Klarna 12 Monate.
  Nicht anwendbare Optionen (Shop bietet die Ratenart nicht) sind abgeblendet. Der beste
  Shop wird nach gewählter Ratenart neu bestimmt.
- **Schritt 3 Zubehör:** microSD ×2 und Tasche als Korb-Toggles. Tasche kann „stattdessen
  drucken“ (0 EUR, verlinkt aufs Modell). Hinweis: MacBook Pro 14 hat SD-Slot, kein Leser.
- **Schritt 4 Fotokamera:** keine oder eine der drei Empfehlungen, Raten oder sofort,
  Kaufen-Links (rebuy, MPB, Kleinanzeigen, MediaMarkt neu).
- **Fotokameras im Vergleich:** alle Kandidaten mit Urteil, Neu- und Gebrauchtpreis, Filter
  „nur Empfehlungen“, plus Gebrauchthändler mit Klarna-Status.
- **3D-Druck:** 29 verlinkte Modelle, Kategorie-Filter, Material-Badge (ASA fürs Auto),
  Liste „nicht drucken“.
- **Warum so:** der bisherige GearPlanner (FCC, Kandidaten, Speicher, Zeitpunkt, Rituale).

### Nachtrag 18.08.2026: Technikanalyse Pocket 3 / 4 / 4P

Die PDF-Analyse `public/docs/DJI_Osmo_Pocket_3_4_4P_Technikvergleich.pdf` ist eingearbeitet:
`KaufProdukt` hat `kaufgrenze`, `wertung`, `analyse`, `enthaelt`, `chip`. Schritt 1 zeigt die
drei Endwertungen (P3 Creator 9,2, P4 Creator 8,4, 4P Vlog 6,9) als klickbare Karten, grün wenn
der beste seriöse Preis unter der Kaufgrenze liegt (P3 Standard 310, P3 Creator 410, P4 Creator
550, 4P nur mit Tele-Plan). Angebote unter der Grenze tragen ein Badge. Pocket 4 Creator und
4P Vlog sind als Kaufoptionen mit Angeboten ergänzt. Da das Creator Combo die Tragetasche
enthält (`enthaelt: ["k-tasche"]`), zählt die Tasche bei Combo-Wahl nicht mehr mit.

### Nachtrag 18.08.2026 abends: 4P-Sets, Licht und die USA-Frage

Recherche zu den offiziellen 4P-Sets ergab drei Dinge, die die Seite vorher falsch oder gar nicht
zeigte. Erstens enthalten **beide** 4P-Combos die magnetische DJI Fill Light, die am Gimbalkopf
sitzt, mitdreht und aus der Kamera gesteuert wird; das Licht ist also kein Argument fürs teure
Vlog Combo. Zweitens stehen beide Sets bei allen Händlern auf UVP (599 und 689), der zuvor
notierte Geizhals-Wert von 658,59 war eine Momentaufnahme. Drittens ist die 4P in den USA nicht
zugelassen, DJI Care Refresh gilt nur im Kaufland, und Käfige für die 4P sind in Deutschland noch
nicht lieferbar.

Umgesetzt: `k-p4p-standard` als vierte Kameraoption (599, Wertung 7,4), `k-p4p-vlog` auf 689
korrigiert, beide mit `enthaelt: ["k-tasche"]`, weil eine Tasche im Set liegt. Neuer Zubehörposten
`k-licht` (Ulanzi VL49 ab 20,76, VL66, DJI Fill Light einzeln 23,99), der nur bei der Pocket 3
gebraucht wird. Bei gewählter 4P erscheint ein Warnblock mit den drei Punkten oben, und der
3D-Druck-Abschnitt weist darauf hin, dass Pocket-3-Halter nicht auf die 4P passen.

### Nachtrag 18.08.2026 nachts: Kombinationen mit SWOT

Die Seite verglich Videokameras und Fotokameras getrennt, obwohl die Entscheidung gekoppelt ist:
kommt eine echte Fotokamera dazu, übernimmt sie Tele, Porträt und Standbild, und genau dafür
kostet die 4P ihren Aufpreis. Neuer Abschnitt `#kombi` mit sechs Paarungen, je einer SWOT aus
Stärken, Schwächen, Chancen und Risiken, Gesamtpreis und Monatsrate.

Typ `Kombo` in `lib/types.ts`, Daten in `KOMBOS` (`data/shop.ts`), Rechnung `komboSumme()` in
`lib/shop.ts`: der Videoteil läuft über die 0-Prozent-Finanzierung, wo der Shop sie anbietet,
sonst über Klarna mit 13,27 Prozent, der Fototeil über zwölf PayPal-Raten. Damit nutzt der
Abschnitt dieselbe Rechnung wie der Konfigurator und kann ihm nicht widersprechen.

Empfehlung ist Pocket 3 Creator plus Fujifilm X-T30 II gebraucht, rund 1.099 EUR und etwa 81 EUR
im Monat. Die 4P-Kombination ist bewusst als „möglich“ geführt, mit der Doppelabdeckung als
Schwäche und der fehlenden US-Zulassung als Risiko.

## 3. Wie es umgesetzt ist

- `data/shop.ts`: `FINANZIERUNGEN`, `KAUF` (Produkte mit `angebote[]`), `FOTOKAMERAS`,
  `GEBRAUCHT_HAENDLER`, `DRUCKE`, `NICHT_DRUCKEN`. Preise mit `quelle` und `unsicher`.
- `lib/shop.ts`: `ShopAuswahl` (localStorage `usa.shop.v1`), `bestesAngebot(produkt,
ratenart)`, `monatsrate()` (Annuität bei effektivem Jahreszins), `summe()` liefert sofort,
  monatlich, Laufzeit, gesamt, Zinsen.
- `components/GearShop.tsx`: Konfigurator, hält die Auswahl in einem lokalen Hook mit
  localStorage (Seiten-Zustand, nicht App-Zustand, deshalb nicht im `useApp()`-Store).
- `components/GearFoto.tsx`, `components/GearDruck.tsx`: reine Anzeige mit Filter/Accordion.
- `app/gear/page.tsx`: Server Component, Anker-Navigation, setzt die vier Blöcke zusammen.
- `components/GearPlanner.tsx`: Empfehlungs-Kopf und Kauflisten entfernt (jetzt in GearShop).

## 4. Warum diese Entscheidung

- **Klarna als Zahlart, nicht als Link:** Es gibt keine Klarna-Deep-Links. Deshalb pro
  Angebot `raten: RatenArt[]` und Link auf die Shop-Produktseite; der Konfigurator wählt den
  günstigsten Shop, der die gewünschte Ratenart hat.
- **MediaMarkt 0 % vor Klarna:** 0 % über 18 Monate schlägt 13,27 % Klarna. Klarna bleibt
  als Fallback wählbar.
- **Gebrauchtkauf mit neutralem Zins:** PayPal-Raten-Zins steht erst im Checkout, wird als
  „Zins im Checkout“ ausgewiesen statt erfunden.
- **Kein Backend:** alles statisch in `data/`, Auswahl im localStorage.

## 5. Dateien

| Datei                        | Rolle                                                                   |
| ---------------------------- | ----------------------------------------------------------------------- |
| `data/shop.ts`               | Angebote, Finanzierungen, Fotokameras, Drucke                           |
| `lib/shop.ts`                | Auswahl-Typ, Ratenrechnung, bester Shop                                 |
| `lib/types.ts`               | `Angebot`, `KaufProdukt`, `Finanzierung`, `FotoKamera`, `DruckModell` … |
| `components/GearShop.tsx`    | Konfigurator und Summenleiste                                           |
| `components/GearFoto.tsx`    | Fotokamera-Vergleich und Händler                                        |
| `components/GearDruck.tsx`   | 3D-Druck-Liste                                                          |
| `components/GearPlanner.tsx` | Hintergrund (gekürzt)                                                   |
| `app/gear/page.tsx`          | Zusammenbau                                                             |
| `data/gear.ts`               | `g-leser` auf Adapter geändert                                          |

## 6. So erweitert man es

- Neues Angebot: in `data/shop.ts` beim Produkt an `angebote[]` hängen, `raten` setzen.
- Neue Zahlweise: `FINANZIERUNGEN` ergänzen, `braucht` auf die passende `RatenArt`.
- Neues Druckmodell: `DRUCKE`, `kategorie` aus `DruckKategorie`; mit `ersetzt: <produktId>`
  wird es zum Druck-Ersatz eines Kaufprodukts (das Produkt braucht `druckErsatz`).
- Preisstand aktualisieren: Datum im Kopf von `data/shop.ts` und in den Hinweistexten.

## 7. Was in Zukunft besser machbar wäre

- Mehr als ein druckbarer Ersatz (aktuell nur die Tasche über `a.drucken`).
- Zinsen für PayPal Raten, wenn bekannt.
- Preise automatisch prüfen geht nicht (kein Backend, idealo blockiert), also Datumsstempel.

## 8. Fallstricke / Annahmen

- Idealo-Tiefstpreis der Combo ist AliExpress (327 EUR); als Kaufpreis gilt der DE-Bestpreis.
- Fotokamera-Preise mit `unsicher: true` sind Kleinanzeigen-/MPB-Momentaufnahmen.
- `set-state-in-effect`-Warnung im localStorage-Hook, gleiche Konstruktion wie `lib/store.tsx`.

## 9. Regeln-Check

- [x] Nur lucide-Icons, keine Emojis
- [x] Kein Backend/keine Secrets
- [x] `npm run check` grün, `npm run build` läuft
- [x] docs/features/README.md-Tabelle aktualisiert
