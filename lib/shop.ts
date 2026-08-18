import { FINANZIERUNGEN, FOTOKAMERAS, KAUF } from "@/data/shop";
import type { Angebot, Finanzierung, KaufProdukt, RatenArt } from "./types";

/**
 * Rechnung hinter dem Einkauf.
 *
 * Drei Zahlen zählen: was sofort fällig ist (geht gegen die Reisekasse),
 * was monatlich vom deutschen Konto abgeht, während das Stipendium
 * pausiert, und was das über die Laufzeit insgesamt kostet.
 */

export const RATEN_LABEL: Record<RatenArt, string> = {
  mm0: "0 % Finanzierung",
  klarna: "Klarna",
  paypal: "PayPal Raten",
  otto: "Otto Ratenkauf",
  keine: "Vollzahlung",
};

/** Auswahl, die die Seite im localStorage hält. */
export interface ShopAuswahl {
  /** Welche Pocket-Variante, oder keine */
  kamera: "k-combo" | "k-standard" | null;
  finanzierung: string;
  /** Zubehör-Produkt-IDs, die im Korb liegen */
  zubehoer: string[];
  /** Tasche wird gedruckt statt gekauft */
  drucken: boolean;
  /** Fotokamera-ID oder null */
  foto: string | null;
  fotoRaten: boolean;
  /** Abgehakt: gekauft */
  gekauft: string[];
}

export const AUSWAHL_STANDARD: ShopAuswahl = {
  kamera: "k-combo",
  finanzierung: "mm0-18",
  zubehoer: ["k-sd", "k-tasche"],
  drucken: false,
  foto: null,
  fotoRaten: true,
  gekauft: [],
};

export const SHOP_LS_KEY = "usa.shop.v1";

export function produkt(id: string): KaufProdukt | undefined {
  return KAUF.find((k) => k.id === id);
}

export function finanzierung(id: string): Finanzierung {
  return FINANZIERUNGEN.find((f) => f.id === id) ?? FINANZIERUNGEN[0];
}

/** Bestes Angebot: günstigster Shop, der die gewünschte Ratenart bietet. */
export function bestesAngebot(
  p: KaufProdukt,
  braucht: RatenArt | null,
): Angebot | undefined {
  const passend = braucht
    ? p.angebote.filter((a) => a.raten.includes(braucht))
    : p.angebote;
  const pool = passend.length ? passend : p.angebote;
  return [...pool].sort((a, b) => a.preis - b.preis)[0];
}

/** Annuität: gleiche Monatsrate bei effektivem Jahreszins. */
export function monatsrate(betrag: number, monate: number, effZins: number): number {
  if (monate <= 0) return 0;
  if (effZins <= 0) return betrag / monate;
  const r = Math.pow(1 + effZins / 100, 1 / 12) - 1;
  return (betrag * r) / (1 - Math.pow(1 + r, -monate));
}

export interface ShopSumme {
  sofort: number;
  monatlich: number;
  monate: number;
  gesamt: number;
  zinsen: number;
  kameraPreis: number;
  kameraShop?: Angebot;
  fotoPreis: number;
  fotoMonatlich: number;
}

/** PayPal Raten für Gebraucht: Zins ist im Checkout, hier neutral gerechnet und so ausgewiesen. */
export const FOTO_RATEN_MONATE = 12;

export function summe(a: ShopAuswahl): ShopSumme {
  const fin = finanzierung(a.finanzierung);
  const kam = a.kamera ? produkt(a.kamera) : undefined;
  const kameraShop = kam ? bestesAngebot(kam, fin.braucht) : undefined;
  const kameraPreis = kameraShop?.preis ?? 0;

  let sofort = 0;
  let monatlich = 0;
  let monate = 0;

  if (kameraPreis > 0) {
    if (fin.monate === 0) sofort += kameraPreis;
    else {
      monatlich += monatsrate(kameraPreis, fin.monate, fin.zins);
      monate = Math.max(monate, fin.monate);
    }
  }

  for (const id of a.zubehoer) {
    const p = produkt(id);
    if (!p) continue;
    if (a.drucken && p.druckErsatz) continue;
    const best = bestesAngebot(p, null);
    sofort += (best?.preis ?? 0) * (p.menge ?? 1);
  }

  const foto = a.foto ? FOTOKAMERAS.find((f) => f.id === a.foto) : undefined;
  const fotoPreis = foto?.gebrauchtVon ?? 0;
  let fotoMonatlich = 0;
  if (fotoPreis > 0) {
    if (a.fotoRaten) {
      fotoMonatlich = fotoPreis / FOTO_RATEN_MONATE;
      monatlich += fotoMonatlich;
      monate = Math.max(monate, FOTO_RATEN_MONATE);
    } else sofort += fotoPreis;
  }

  const kameraGesamt = fin.monate
    ? monatsrate(kameraPreis, fin.monate, fin.zins) * fin.monate
    : kameraPreis;
  const zinsen = Math.max(0, kameraGesamt - kameraPreis);
  const gesamt = sofort + kameraGesamt + (a.fotoRaten ? fotoPreis : 0);

  return {
    sofort,
    monatlich,
    monate,
    gesamt,
    zinsen,
    kameraPreis,
    kameraShop,
    fotoPreis,
    fotoMonatlich,
  };
}
