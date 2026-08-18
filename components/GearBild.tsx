"use client";

/**
 * Produktvorschau. Bilder liegen lokal unter public/images/gear/, damit
 * nichts von fremden Servern nachgeladen wird und keine Hotlink-Sperre
 * die Seite löchrig macht. Fehlt ein Bild, kommt eine gestaltete Kachel
 * mit Icon statt eines kaputten Bildrahmens.
 */

import { useState } from "react";
import { Aperture, Camera, ImageOff, Package, Printer } from "lucide-react";
import { BILD_QUELLEN } from "@/data/imageCredits";

type Art = "kamera" | "foto" | "zubehoer" | "druck";

const ICON: Record<Art, typeof Camera> = {
  kamera: Camera,
  foto: Aperture,
  zubehoer: Package,
  druck: Printer,
};

export default function GearBild({
  bild,
  alt,
  art = "kamera",
  hoehe = "h-24",
  breit = false,
  passform = "cover",
}: {
  bild?: string;
  alt: string;
  art?: Art;
  /** Tailwind-Höhenklasse, damit Karten und Zeilen dieselbe Komponente nutzen */
  hoehe?: string;
  /** volle Breite statt quadratisch */
  breit?: boolean;
  /** freigestellte Produktfotos brauchen contain, Szenenfotos füllen besser */
  passform?: "cover" | "contain";
}) {
  const [kaputt, setKaputt] = useState(false);
  const Icon = ICON[art];
  const zeigen = bild && !kaputt;
  const quelle = bild ? BILD_QUELLEN[bild] : undefined;

  return (
    <figure
      className={`${hoehe} ${breit ? "w-full" : "aspect-square"} group/bild relative shrink-0 overflow-hidden rounded-xl border border-[var(--border)]`}
      style={{ background: "color-mix(in srgb, var(--sky) 7%, transparent)" }}
    >
      {zeigen ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/gear/${bild}`}
            alt={alt}
            loading="lazy"
            onError={() => setKaputt(true)}
            className={
              passform === "cover"
                ? "h-full w-full object-cover"
                : "h-full w-full object-contain p-1.5"
            }
          />
          {quelle && (
            <figcaption
              aria-hidden="true"
              className="absolute right-1 bottom-1 rounded-full bg-white/75 px-1.5 text-[9px] text-[var(--text-dim)] opacity-0 transition-opacity duration-150 group-hover/bild:opacity-100"
              title={`${quelle.quelle} · ${quelle.lizenz}`}
            >
              {quelle.kurz}
            </figcaption>
          )}
        </>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-[var(--text-dim)]">
          <Icon size={18} strokeWidth={1.6} />
          {kaputt && <ImageOff size={11} strokeWidth={1.6} />}
        </div>
      )}
    </figure>
  );
}

/** Sammelnachweis für alle Produktbilder, steht einmal am Seitenende. */
export function BildNachweis() {
  const eintraege = Object.entries(BILD_QUELLEN);
  if (!eintraege.length) return null;
  return (
    <details className="card rounded-3xl p-5 text-sm sm:p-6">
      <summary className="cursor-pointer text-[var(--text-muted)]">
        Bildnachweis, {eintraege.length} Produktfotos
      </summary>
      <ul className="mt-3 flex flex-col gap-1 text-xs text-[var(--text-dim)]">
        {eintraege.map(([datei, q]) => (
          <li key={datei}>
            <span className="text-[var(--text-muted)]">{datei}</span>: {q.quelle},{" "}
            {q.lizenz}
            {q.url && (
              <>
                {" "}
                <a
                  href={q.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--sky)] underline-offset-2 hover:underline"
                >
                  Quelle
                </a>
              </>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-[var(--text-dim)]">
        Alle Produktfotos stammen von Wikimedia Commons und liegen lokal im Projekt,
        damit die Seite nichts von fremden Servern nachlädt. Sie zeigen das Modell,
        nicht das konkrete Angebot.
      </p>
    </details>
  );
}
