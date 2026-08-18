"use client";

/**
 * Kamera und Ausrüstung.
 *
 * Die Frage ist nicht, welche Kamera die beste ist, sondern welche man
 * sechs Monate lang täglich mitnimmt und wo man sie kauft. Der zweite
 * Teil ist der überraschende: seit DJI auf der FCC Covered List steht,
 * entscheidet das Kaufland über Preis, Verfügbarkeit und Reparatur.
 */

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Check,
  ChevronDown,
  HardDrive,
  Info,
  ShieldAlert,
  Wallet,
} from "lucide-react";
import { KAMERA_OPTIONEN } from "@/data/gear";
import { REISETAGE, SPEICHER_SZENARIEN, summe } from "@/lib/gear";
import type { KameraOption, PreisQuelle } from "@/lib/types";

const QUELLE_LABEL: Record<PreisQuelle, string> = {
  bestaetigt: "belegt",
  schaetzung: "geschätzt",
  uebernommen: "übernommen",
};

const US_LABEL: Record<KameraOption["usStatus"], { text: string; ton: string }> = {
  offiziell: { text: "in den USA erhältlich", ton: "var(--teal)" },
  gesperrt: { text: "in den USA gesperrt", ton: "var(--terra)" },
  "zu-pruefen": { text: "US-Status offen", ton: "var(--text-dim)" },
};

function Preis({
  wert,
  waehrung,
  quelle,
}: {
  wert?: number;
  waehrung: "EUR" | "USD";
  quelle?: PreisQuelle;
}) {
  if (wert === undefined)
    return <span className="text-xs text-[var(--text-dim)]">nicht erhältlich</span>;
  return (
    <span className="flex items-baseline justify-end gap-1.5">
      {quelle && (
        <span
          className="rounded-full px-1.5 py-0.5 text-[10px]"
          style={{
            background:
              quelle === "bestaetigt"
                ? "color-mix(in srgb, var(--teal) 14%, transparent)"
                : "color-mix(in srgb, var(--text-dim) 14%, transparent)",
            color: quelle === "bestaetigt" ? "var(--teal)" : "var(--text-dim)",
          }}
        >
          {QUELLE_LABEL[quelle]}
        </span>
      )}
      <span className="tabular-nums">
        {wert.toLocaleString("de-DE")} {waehrung}
      </span>
    </span>
  );
}

export default function GearPlanner() {
  const [offen, setOffen] = useState<string | null>("cam-pocket3-combo");

  const kostenDe = useMemo(() => summe("kaufen-de"), []);

  return (
    <div className="flex flex-col gap-5">
      {/* ── Der FCC-Punkt ───────────────────────────────────────────── */}
      <section className="card flex flex-col gap-3 rounded-3xl p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <ShieldAlert size={16} style={{ color: "var(--terra)" }} />
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
              Der Punkt, den man leicht übersieht
            </p>
            <h2 className="font-display text-2xl">DJI kauft man in Deutschland</h2>
          </div>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          Seit dem 22.12.2025 steht DJI auf der Covered List der FCC. Geräte mit
          bestehender Zulassung bleiben in den USA verkäuflich, das sind Pocket 3,
          Action 5 Pro und Nano. Alles Neuere bekommt keine Zulassung mehr:{" "}
          <strong>Pocket 4 und Pocket 4P dürfen dort nicht verkauft werden.</strong> Auf
          Amazon US tauchen sie nur über Graumarkt-Importeure zu rund 980 USD auf, gegen
          599 EUR in Deutschland.
        </p>
        <p className="text-sm text-[var(--text-muted)]">
          Drei Folgen für diese Reise. <strong>Erstens</strong>, wer eine Pocket 4 oder
          4P will, kauft sie vor dem 10.09. in Deutschland oder gar nicht.{" "}
          <strong>Zweitens</strong>, es gibt drüben für diese Modelle keinen
          DJI-Service: geht sie kaputt, ist sie sechs Monate kaputt.{" "}
          <strong>Drittens</strong>, auch das Pocket-3-Combo ist in Deutschland
          günstiger. Für DJI lohnt sich das Warten auf die USA also in keinem Fall.
        </p>
        <div className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-white/60 p-4">
          <Info size={16} className="mt-0.5 shrink-0 text-[var(--text-dim)]" />
          <p className="text-xs text-[var(--text-muted)]">
            Umgekehrt gilt das nicht: eine in Deutschland gekaufte Kamera im eigenen
            Gepäck in die USA mitzunehmen ist etwas anderes, als sie dort zu verkaufen.
            Das Verbot zielt auf Verkauf und Einfuhr zum Verkauf. Keine Rechtsberatung,
            praktisch aber unproblematisch. Für den Rückweg gilt die andere Regel: was
            drüben gekauft wird und zusammen über 430 EUR liegt, gehört bei der Einreise
            nach Deutschland angemeldet, darüber werden 19 Prozent Einfuhrumsatzsteuer
            fällig.
          </p>
        </div>
      </section>

      {/* ── Der Vergleich ───────────────────────────────────────────── */}
      <section className="card flex flex-col gap-3 rounded-3xl p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Camera size={16} className="text-[var(--text-dim)]" />
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
              Die Kandidaten
            </p>
            <h2 className="font-display text-2xl">Acht Optionen, eine Empfehlung</h2>
          </div>
        </div>

        <ul className="flex flex-col gap-2">
          {KAMERA_OPTIONEN.map((k) => {
            const auf = offen === k.id;
            const us = US_LABEL[k.usStatus];
            return (
              <li
                key={k.id}
                className="overflow-hidden rounded-2xl border bg-white/60"
                style={{
                  borderColor:
                    k.urteil === "empfehlung" ? "var(--sky)" : "var(--border)",
                }}
              >
                <button
                  onClick={() => setOffen(auf ? null : k.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
                    style={{
                      background:
                        k.urteil === "empfehlung"
                          ? "color-mix(in srgb, var(--sky) 16%, transparent)"
                          : "transparent",
                      color:
                        k.urteil === "empfehlung" ? "var(--sky)" : "var(--text-dim)",
                    }}
                  >
                    {k.urteil === "empfehlung" ? (
                      <Check size={15} />
                    ) : (
                      <Camera size={15} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{k.name}</span>
                    <span className="block truncate text-xs text-[var(--text-muted)]">
                      {k.typ} · <span style={{ color: us.ton }}>{us.text}</span>
                    </span>
                  </span>
                  <span className="hidden shrink-0 text-right text-sm sm:block">
                    {k.preisDe !== undefined && (
                      <span className="block tabular-nums">{k.preisDe} EUR</span>
                    )}
                    {k.preisUs !== undefined && (
                      <span className="block text-xs text-[var(--text-dim)] tabular-nums">
                        {k.preisUs} USD
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    size={16}
                    className="shrink-0 text-[var(--text-dim)] transition"
                    style={{ transform: auf ? "rotate(180deg)" : undefined }}
                  />
                </button>

                {auf && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-[var(--border)] px-4 py-3"
                  >
                    <p className="text-sm text-[var(--text-muted)]">{k.begruendung}</p>
                    <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs text-[var(--text-dim)]">Kann sie</dt>
                        <dd className="text-sm">{k.staerke}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[var(--text-dim)]">
                          Kann sie nicht
                        </dt>
                        <dd className="text-sm">{k.schwaeche}</dd>
                      </div>
                    </dl>
                    <div className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
                      <span className="flex items-baseline justify-between gap-2 border-t border-[var(--border)] pt-1.5">
                        <span className="text-xs text-[var(--text-dim)]">
                          Deutschland
                        </span>
                        <Preis wert={k.preisDe} waehrung="EUR" quelle={k.quelleDe} />
                      </span>
                      <span className="flex items-baseline justify-between gap-2 border-t border-[var(--border)] pt-1.5">
                        <span className="text-xs text-[var(--text-dim)]">USA</span>
                        <Preis wert={k.preisUs} waehrung="USD" quelle={k.quelleUs} />
                      </span>
                    </div>
                  </motion.div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-start gap-3 text-xs text-[var(--text-dim)]">
          <Info size={14} className="mt-0.5 shrink-0" />
          <p>
            US-Preise am 17.08.2026 nachgelesen, deutsche Preise aus der eigenen
            Vorrecherche vom 14. und 17.08.2026 übernommen und hier nicht nachgeprüft.
            Angebote schlecht bewerteter Marketplace-Händler sind bewusst nicht als
            Kaufpreis angesetzt.{" "}
            <strong>Die beiden Spalten sind nicht direkt vergleichbar:</strong> deutsche
            Preise enthalten die Mehrwertsteuer, US-Preise nicht, dort kommen in Ventura
            County rund 7,75 Prozent an der Kasse dazu, und ein Wechselkurs steckt
            ohnehin dazwischen. Die Richtung stimmt, die Differenz in Euro ist eine
            Näherung.
          </p>
        </div>
      </section>

      {/* ── Speicher ────────────────────────────────────────────────── */}
      <section className="card flex flex-col gap-3 rounded-3xl p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <HardDrive size={16} className="text-[var(--text-dim)]" />
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
              Woran Reisefilme wirklich scheitern
            </p>
            <h2 className="font-display text-2xl">
              Wie viel Speicher {REISETAGE} Tage brauchen
            </h2>
          </div>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          Gerechnet mit behaltener Minute pro Tag, dreifach für das, was weggeworfen
          wird, und 0,75 bis 1,0 GB je Minute in 4K.
        </p>
        <ul className="grid gap-2 sm:grid-cols-3">
          {SPEICHER_SZENARIEN.map((s) => (
            <li
              key={s.minutenProTag}
              className="rounded-2xl border border-[var(--border)] bg-white/60 p-4"
            >
              <p className="text-xs text-[var(--text-dim)]">
                {s.minutenProTag} Minute{s.minutenProTag === 1 ? "" : "n"} pro Tag
              </p>
              <p className="font-display text-2xl">
                {s.gbMin} bis {s.gbMax} GB
              </p>
            </li>
          ))}
        </ul>
        <p className="text-sm text-[var(--text-muted)]">
          Daraus folgt das Vorgehen: zwei 256-GB-Karten im Wechsel, jede Woche auf den
          Laptop und von dort auf die SSD. Karten nie im Auto lassen. In Kalifornien
          wird der Innenraum im Sommer heiß genug, um Elektronik zu beschädigen, und ein
          Autoeinbruch trifft zuerst den Rucksack im Fußraum.
        </p>
      </section>

      {/* ── Budget und Zeitpunkt ────────────────────────────────────── */}
      <section className="card flex flex-col gap-3 rounded-3xl p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Wallet size={16} className="text-[var(--text-dim)]" />
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
              Gegen die Reisekasse gerechnet
            </p>
            <h2 className="font-display text-2xl">Wann kaufen</h2>
          </div>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          Der erste Monat läuft komplett aus eigener Tasche. Die erste Zahlung am 02.10.
          deckt nur rund fünf Arbeitstage, das erste volle Gehalt kommt am 16.10. Die{" "}
          {kostenDe} EUR vor dem Abflug erhöhen also die Entnahme aus dem Depot und
          konkurrieren direkt mit Kaution und Erstausstattung.
        </p>
        <ul className="flex flex-col gap-2">
          <li className="rounded-2xl border border-[var(--border)] bg-white/60 p-4">
            <p className="text-sm font-medium">
              Weg A, vor dem Abflug in Deutschland kaufen
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {kostenDe} EUR jetzt. Dafür ist die Kamera beim Abflug dabei, im
              Ankunftsfenster, beim Konzert am 07.10. und in Austin. Genau die Wochen,
              die man später im Kurzfilm sehen will.
            </p>
          </li>
          <li className="rounded-2xl border border-[var(--border)] bg-white/60 p-4">
            <p className="text-sm font-medium">Weg B, drüben nach dem 16.10. kaufen</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Schont die Reisekasse um {kostenDe} EUR, kostet aber die ersten fünf
              Wochen und ist bei DJI teurer, weil das Combo drüben rund 150 EUR mehr
              kostet und die neueren Modelle dort gar nicht verkauft werden.
            </p>
          </li>
          <li
            className="rounded-2xl border p-4"
            style={{
              borderColor: "var(--sky)",
              background: "color-mix(in srgb, var(--sky) 7%, transparent)",
            }}
          >
            <p className="text-sm font-medium">
              Weg C, Kompromiss: Pocket 3 Standard statt Combo
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              299 statt 399 EUR, also 100 EUR gespart. Mikrofon und Akkugriff fehlen
              dann. Wer die Reisekasse wirklich schonen muss, spart hier und nicht am
              Zeitpunkt.
            </p>
          </li>
        </ul>
        <div className="flex items-start gap-3 text-xs text-[var(--text-dim)]">
          <Info size={14} className="mt-0.5 shrink-0" />
          <p>
            Der Kurzfilm braucht später kein weiteres Werkzeug: dieses Projekt hat unter{" "}
            <code>remotion/</code> bereits ein Remotion-Setup, mit dem sich aus Clips
            und Titeln ein fertiges Video rendern lässt.
          </p>
        </div>
      </section>

      {/* ── Was die Liste nicht kaufen kann ─────────────────────────── */}
      <section className="card flex flex-col gap-3 rounded-3xl p-5 sm:p-6">
        <div>
          <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
            Zwei Sachen, die keine Kaufliste löst
          </p>
          <h2 className="font-display text-2xl">Woran es am Ende wirklich hängt</h2>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          <strong>Erstens, das wöchentliche Ritual.</strong> Zwanzig Minuten am Sonntag:
          Karte leeren, Ordner nach Datum und Ort benennen, auf die SSD spiegeln. Wer
          das drei Wochen auslässt, hat im März 2 TB unsortierte Dateien und schneidet
          den Film nie. Das entscheidet mehr über das Ergebnis als jede Kamera in der
          Liste darüber.
        </p>
        <p className="text-sm text-[var(--text-muted)]">
          <strong>Zweitens, das Langweilige filmen.</strong> Der Parkplatz vor dem
          Gebäude in Oxnard, die Küche in Camarillo, der Weg zum Auto, der Kollege beim
          Kaffee. In fünf Jahren ist genau das wertvoll, nicht der zwanzigste
          Sonnenuntergang. Sonnenuntergänge filmt man ohnehin von allein.
        </p>
        <p className="text-sm text-[var(--text-muted)]">
          <strong>Und die Aufteilung zu zweit.</strong> Justus fährt dieselbe Strecke.
          Zwei Pockets sind verschwendetes Geld, eine Pocket und eine Action 5 Pro
          decken zusammen Stadt und Wasser ab, kosten pro Kopf weniger und ergeben am
          Ende doppelt so viel Material für denselben Film. Das ist vor dem Kauf ein
          Zweiminutengespräch wert.
        </p>
      </section>
    </div>
  );
}
