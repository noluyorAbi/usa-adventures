/**
 * Herkunft und Lizenz jedes Produktbildes unter public/images/gear/.
 *
 * Die Seite weist die Quelle direkt am Bild aus, deshalb steht hier zu
 * jeder Datei, woher sie kommt. Wikimedia-Commons-Bilder sind frei
 * lizenziert, Herstellerbilder sind Pressematerial des Herstellers und
 * werden nur zur Produktkennzeichnung verwendet.
 *
 * Neues Bild: Datei nach der id benennen (k-combo.jpg), hier eintragen.
 */

export interface BildQuelle {
  /** Kurzlabel, das am Bild steht */
  kurz: string;
  quelle: string;
  lizenz: string;
  url?: string;
}

export const BILD_QUELLEN: Record<string, BildQuelle> = {
  "f-a6400.jpg": {
    kurz: "Commons",
    quelle: "Wikimedia Commons, 2022-02-17 Sony alpha 6400 IMG20220217210008.jpg",
    lizenz: "CC BY-SA 3.0 de, Eckhard Henkel",
    url: "https://commons.wikimedia.org/wiki/File:2022-02-17_Sony_alpha_6400_IMG20220217210008.jpg",
  },
  "f-g7x.jpg": {
    kurz: "Commons",
    quelle: "Wikimedia Commons, Canon G7X Mark III von vorne 2026-03-13.jpg",
    lizenz: "CC BY-SA 4.0, Strubbl",
    url: "https://commons.wikimedia.org/wiki/File:Canon_G7X_Mark_III_von_vorne_2026-03-13.jpg",
  },
  "f-gr3.jpg": {
    kurz: "Commons",
    quelle: "Wikimedia Commons, Ricoh GR III (5).jpg",
    lizenz: "CC BY-SA 4.0, Stephan van Helden",
    url: "https://commons.wikimedia.org/wiki/File:Ricoh_GR_III_(5).jpg",
  },
  "f-r50.jpg": {
    kurz: "Commons",
    quelle: "Wikimedia Commons, Canon EOS R50+RF-S 55-210mm f5-7.1 IS STM.jpg",
    lizenz: "CC BY-SA 4.0, Dinkun Chen",
    url: "https://commons.wikimedia.org/wiki/File:Canon_EOS_R50%2BRF-S_55-210mm_f5-7.1_IS_STM.jpg",
  },
  "f-rx100va.jpg": {
    kurz: "Commons",
    quelle: "Wikimedia Commons, Sony Cyber-shot DSC-RX100 01.jpg",
    lizenz: "CC BY 2.0, Hiroshi UZU from Saitama, Japan",
    url: "https://commons.wikimedia.org/wiki/File:Sony_Cyber-shot_DSC-RX100_01.jpg",
  },
  "f-x100.jpg": {
    kurz: "Commons",
    quelle: "Wikimedia Commons, Fujifilm X100V 9 feb 2020b.jpg",
    lizenz: "CC BY-SA 4.0, 昼落ち",
    url: "https://commons.wikimedia.org/wiki/File:Fujifilm_X100V_9_feb_2020b.jpg",
  },
  "f-xm5.jpg": {
    kurz: "Commons",
    quelle: "Wikimedia Commons, Fujifilm X-M5 18 oct 2024a.jpg",
    lizenz: "CC0, 昼落ち",
    url: "https://commons.wikimedia.org/wiki/File:Fujifilm_X-M5_18_oct_2024a.jpg",
  },
  "f-xt30.jpg": {
    kurz: "Commons",
    quelle: "Wikimedia Commons, Fujifilm X-T30 II.jpg",
    lizenz: "CC BY 2.0, Henry Söderlund",
    url: "https://commons.wikimedia.org/wiki/File:Fujifilm_X-T30_II.jpg",
  },
  "f-z30.jpg": {
    kurz: "Commons",
    quelle: "Wikimedia Commons, Nikon Z30.jpg",
    lizenz: "CC BY-SA 4.0, Phiarc",
    url: "https://commons.wikimedia.org/wiki/File:Nikon_Z30.jpg",
  },
  "k-combo.jpg": {
    kurz: "Commons",
    quelle: "Wikimedia Commons, DJI Osmo Pocket 3 - 1.jpg",
    lizenz: "CC BY-SA 4.0, Kyu3a",
    url: "https://commons.wikimedia.org/wiki/File:DJI_Osmo_Pocket_3_-_1.jpg",
  },
  "k-p4p-vlog.jpg": {
    kurz: "Commons",
    quelle: "Wikimedia Commons, DJI Osmo Pocket 4P - 2.jpg",
    lizenz: "CC BY-SA 4.0, Kyu3a",
    url: "https://commons.wikimedia.org/wiki/File:DJI_Osmo_Pocket_4P_-_2.jpg",
  },
  "k-sd.jpg": {
    kurz: "Commons",
    quelle: "Wikimedia Commons, MicroSD card 2GB focus-stacked.jpg",
    lizenz: "CC BY-SA 3.0, Afrank99",
    url: "https://commons.wikimedia.org/wiki/File:MicroSD_card_2GB_focus-stacked.jpg",
  },
  "k-standard.jpg": {
    kurz: "Commons",
    quelle: "Wikimedia Commons, DJI Osmo Pocket 3 - 4.jpg",
    lizenz: "CC BY-SA 4.0, Kyu3a",
    url: "https://commons.wikimedia.org/wiki/File:DJI_Osmo_Pocket_3_-_4.jpg",
  },
};
