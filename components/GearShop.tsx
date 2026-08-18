"use client";

/**
 * Einkauf mit so wenig Reibung wie möglich.
 *
 * Oben steht immer, was die aktuelle Auswahl sofort kostet und was sie
 * monatlich vom deutschen Konto abzieht. Darunter vier Entscheidungen,
 * jede mit genau einem Kaufen-Knopf zum besten Shop, der die gewählte
 * Ratenart auch anbietet. Die Auswahl bleibt im localStorage, damit man
 * Stück für Stück abhaken kann.
 */

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Camera,
  Check,
  ChevronDown,
  CreditCard,
  ExternalLink,
  FileText,
  Info,
  Package,
  PartyPopper,
  Printer,
  Wallet,
} from "lucide-react";
import AnimatedNumber from "@/components/AnimatedNumber";
import GearBild from "@/components/GearBild";
import { FINANZIERUNGEN, FOTOKAMERAS, KAUF } from "@/data/shop";
import {
  AUSWAHL_STANDARD,
  FOTO_RATEN_MONATE,
  RATEN_LABEL,
  SHOP_LS_KEY,
  bestesAngebot,
  finanzierung,
  monatsrate,
  produkt,
  summe,
  type ShopAuswahl,
} from "@/lib/shop";
import type { Angebot, KaufProdukt } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

function useAuswahl() {
  const [a, setA] = useState<ShopAuswahl>(AUSWAHL_STANDARD);
  const [geladen, setGeladen] = useState(false);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SHOP_LS_KEY);
      if (raw)
        setA({ ...AUSWAHL_STANDARD, ...(JSON.parse(raw) as Partial<ShopAuswahl>) });
    } catch {
      /* kaputter Eintrag, Standard behalten */
    }
    setGeladen(true);
  }, []);
  useEffect(() => {
    if (geladen) window.localStorage.setItem(SHOP_LS_KEY, JSON.stringify(a));
  }, [a, geladen]);
  return [a, setA] as const;
}

/* ── Bausteine ─────────────────────────────────────────────────────── */

function Chip({
  aktiv,
  onClick,
  children,
  ton = "var(--sky)",
}: {
  aktiv: boolean;
  onClick: () => void;
  children: React.ReactNode;
  ton?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={aktiv}
      className="relative rounded-full border px-3.5 py-1.5 text-sm transition-[color,border-color,transform] duration-150 active:scale-[0.97]"
      style={{
        borderColor: aktiv ? ton : "var(--border-strong)",
        color: aktiv ? "#fff" : "var(--text)",
        background: aktiv ? ton : "transparent",
      }}
    >
      {children}
    </button>
  );
}

function RatenBadge({ art }: { art: Angebot["raten"][number] }) {
  const ton =
    art === "mm0"
      ? "var(--sage)"
      : art === "klarna"
        ? "var(--rose)"
        : art === "paypal"
          ? "var(--indigo)"
          : art === "otto"
            ? "var(--amber)"
            : "var(--text-dim)";
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase"
      style={{ background: `color-mix(in srgb, ${ton} 14%, transparent)`, color: ton }}
    >
      {RATEN_LABEL[art]}
    </span>
  );
}

function KaufenKnopf({
  href,
  label,
  primaer = true,
}: {
  href: string;
  label: string;
  primaer?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-[transform,box-shadow] duration-150 hover:-translate-y-px active:scale-[0.98]"
      style={
        primaer
          ? {
              background: "var(--sky-grad)",
              color: "#fff",
              boxShadow: "var(--shadow-sm)",
            }
          : {
              border: "1px solid var(--border-strong)",
              color: "var(--text)",
              background: "var(--surface-solid)",
            }
      }
    >
      {label}
      <ArrowUpRight size={15} />
    </a>
  );
}

function Angebote({ p, markiert }: { p: KaufProdukt; markiert?: Angebot }) {
  const [auf, setAuf] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setAuf((v) => !v)}
        className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
        aria-expanded={auf}
      >
        {p.angebote.length === 1 ? "1 Angebot" : `${p.angebote.length} Angebote`}{" "}
        vergleichen
        {p.idealoMin !== undefined && (
          <span className="text-[var(--text-dim)]">
            {" "}
            · Idealo ab{" "}
            {p.idealoMin.toLocaleString("de-DE", { minimumFractionDigits: 2 })} EUR
          </span>
        )}
        <ChevronDown
          size={14}
          className="transition-transform duration-200"
          style={{ transform: auf ? "rotate(180deg)" : undefined }}
        />
      </button>
      <AnimatePresence initial={false}>
        {auf && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="overflow-hidden"
          >
            {[...p.angebote]
              .sort((x, y) => x.preis - y.preis)
              .map((o) => (
                <li
                  key={o.shop + o.url}
                  className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2 text-sm"
                  style={{
                    borderColor: o === markiert ? "var(--sky)" : "var(--border)",
                    background:
                      o === markiert
                        ? "color-mix(in srgb, var(--sky) 6%, transparent)"
                        : "transparent",
                  }}
                >
                  <span className="min-w-0 flex-1 truncate font-medium">{o.shop}</span>
                  {p.kaufgrenze !== undefined && o.preis <= p.kaufgrenze && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase"
                      style={{
                        background: "color-mix(in srgb, var(--sage) 14%, transparent)",
                        color: "var(--sage)",
                      }}
                    >
                      unter Kaufgrenze
                    </span>
                  )}
                  <span className="tabular-nums">
                    {o.preis.toLocaleString("de-DE", { minimumFractionDigits: 2 })} EUR
                  </span>
                  <span className="flex flex-wrap gap-1">
                    {o.raten.map((r) => (
                      <RatenBadge key={r} art={r} />
                    ))}
                  </span>
                  <a
                    href={o.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${o.shop} öffnen`}
                    className="text-[var(--sky)]"
                  >
                    <ExternalLink size={15} />
                  </a>
                  {o.hinweis && (
                    <span className="basis-full text-xs text-[var(--text-dim)]">
                      {o.hinweis}
                    </span>
                  )}
                </li>
              ))}
            {p.idealoUrl && (
              <li className="mt-2 text-xs">
                <a
                  href={p.idealoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--sky)] underline-offset-2 hover:underline"
                >
                  Alle Preise auf idealo.de
                </a>
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function Schritt({
  nr,
  titel,
  unterzeile,
  Icon,
  children,
}: {
  nr: number;
  titel: string;
  unterzeile: string;
  Icon: typeof Camera;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE, delay: 0.06 * nr }}
      className="card flex flex-col gap-4 rounded-3xl p-5 sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-medium"
          style={{
            background: "color-mix(in srgb, var(--sky) 12%, transparent)",
            color: "var(--sky-deep)",
          }}
        >
          {nr}
        </span>
        <div className="min-w-0">
          <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
            {unterzeile}
          </p>
          <h2 className="font-display flex items-center gap-2 text-2xl">
            {titel}
            <Icon size={16} className="text-[var(--text-dim)]" />
          </h2>
        </div>
      </div>
      {children}
    </motion.section>
  );
}

function Haken({
  an,
  onToggle,
  label,
}: {
  an: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={an}
      className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
    >
      <span
        className="grid h-5 w-5 place-items-center rounded-md border transition-colors duration-150"
        style={{
          borderColor: an ? "var(--sage)" : "var(--border-strong)",
          background: an ? "var(--sage)" : "transparent",
          color: "#fff",
        }}
      >
        <AnimatePresence>
          {an && (
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              <Check size={13} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {label}
    </button>
  );
}

/* ── Die Seite ─────────────────────────────────────────────────────── */

export default function GearShop() {
  const [a, setA] = useAuswahl();
  const s = useMemo(() => summe(a), [a]);
  const fin = finanzierung(a.finanzierung);
  const kam = a.kamera ? produkt(a.kamera) : undefined;

  const set = (patch: Partial<ShopAuswahl>) => setA((v) => ({ ...v, ...patch }));
  const toggleIn = (key: "zubehoer" | "gekauft", id: string) =>
    setA((v) => ({
      ...v,
      [key]: v[key].includes(id) ? v[key].filter((x) => x !== id) : [...v[key], id],
    }));

  const unterGrenze =
    !!kam &&
    kam.kaufgrenze !== undefined &&
    !!s.kameraShop &&
    s.kameraShop.preis <= kam.kaufgrenze;

  const foto = a.foto ? FOTOKAMERAS.find((f) => f.id === a.foto) : undefined;
  const picks = FOTOKAMERAS.filter((f) => f.urteil === "pick");

  /** Was zum Abhaken ansteht */
  const offenePosten = useMemo(() => {
    const ids: string[] = [];
    if (a.kamera) ids.push(a.kamera);
    for (const z of a.zubehoer) {
      const p = produkt(z);
      if (p && !(a.drucken && p.druckErsatz)) ids.push(z);
    }
    if (a.drucken) ids.push("druck-case");
    if (a.foto) ids.push(a.foto);
    return ids;
  }, [a]);
  const erledigt = offenePosten.filter((id) => a.gekauft.includes(id)).length;
  const fertig = offenePosten.length > 0 && erledigt === offenePosten.length;

  return (
    <div className="flex flex-col gap-5">
      {/* ── Summenleiste ─────────────────────────────────────────── */}
      <div className="sticky top-3 z-30">
        <motion.div
          layout
          className="card flex flex-wrap items-center gap-x-5 gap-y-2 rounded-3xl px-5 py-3"
          style={{ backdropFilter: "blur(10px)", background: "var(--surface)" }}
        >
          <div className="min-w-[7rem]">
            <p className="text-[10px] tracking-[0.18em] text-[var(--text-dim)] uppercase">
              Sofort
            </p>
            <p className="font-display text-2xl tabular-nums">
              <AnimatedNumber value={Math.round(s.sofort)} /> EUR
            </p>
          </div>
          <div className="min-w-[8rem]">
            <p className="text-[10px] tracking-[0.18em] text-[var(--text-dim)] uppercase">
              Pro Monat
            </p>
            <p className="font-display text-2xl tabular-nums">
              <AnimatedNumber value={Math.round(s.monatlich)} /> EUR
              {s.monate > 0 && (
                <span className="ml-1 text-xs text-[var(--text-dim)]">
                  × {s.monate}
                </span>
              )}
            </p>
          </div>
          <div className="hidden min-w-[7rem] sm:block">
            <p className="text-[10px] tracking-[0.18em] text-[var(--text-dim)] uppercase">
              Gesamt
            </p>
            <p className="font-display text-2xl tabular-nums">
              <AnimatedNumber value={Math.round(s.gesamt)} /> EUR
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right text-xs text-[var(--text-muted)]">
              <span className="tabular-nums">
                {erledigt}/{offenePosten.length}
              </span>{" "}
              gekauft
              <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-[var(--border)]">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "var(--sage)" }}
                  animate={{
                    width: offenePosten.length
                      ? `${(erledigt / offenePosten.length) * 100}%`
                      : "0%",
                  }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              </div>
            </div>
            {kam && s.kameraShop && (
              <KaufenKnopf
                href={s.kameraShop.url}
                label={`Kaufen bei ${s.kameraShop.shop}`}
              />
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {fertig && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", damping: 18, stiffness: 220 }}
            className="flex items-center gap-3 rounded-3xl border p-4"
            style={{
              borderColor: "var(--sage)",
              background: "color-mix(in srgb, var(--sage) 8%, transparent)",
            }}
          >
            <PartyPopper size={18} style={{ color: "var(--sage)" }} />
            <p className="text-sm">
              Alles gekauft. Jetzt zwei Wochen einarbeiten, auf 30 oder 60 Bilder pro
              Sekunde stellen, und ab dem 10.09. läuft die Kamera.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1 Kamera ────────────────────────────────────────────── */}
      <Schritt
        nr={1}
        titel="Die Kamera"
        unterzeile="Eine Entscheidung, alles andere folgt"
        Icon={Camera}
      >
        <div className="grid gap-2 sm:grid-cols-3">
          {KAUF.filter((k) => k.kategorie === "kamera" && k.wertung !== undefined).map(
            (k) => {
              const best = bestesAngebot(k, null);
              const ok =
                k.kaufgrenze !== undefined && !!best && best.preis <= k.kaufgrenze;
              const aktiv = a.kamera === k.id;
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => set({ kamera: k.id })}
                  aria-pressed={aktiv}
                  className="flex flex-col gap-1 rounded-2xl border p-3 text-left transition-[border-color,transform] duration-150 hover:-translate-y-px active:scale-[0.99]"
                  style={{
                    borderColor: aktiv ? "var(--sky)" : "var(--border)",
                    background: aktiv
                      ? "color-mix(in srgb, var(--sky) 6%, transparent)"
                      : "rgba(255,255,255,0.6)",
                  }}
                >
                  <GearBild
                    bild={k.bild}
                    alt={k.name}
                    art="kamera"
                    hoehe="h-28"
                    breit
                    passform="contain"
                  />
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium">{k.chip}</span>
                    <span className="font-display text-xl tabular-nums">
                      {k.wertung?.toLocaleString("de-DE")}
                      <span className="text-xs text-[var(--text-dim)]"> / 10</span>
                    </span>
                  </span>
                  <span className="text-xs text-[var(--text-muted)] tabular-nums">
                    ab {best?.preis.toLocaleString("de-DE")} EUR
                    {k.kaufgrenze !== undefined
                      ? ` · Grenze ${k.kaufgrenze}`
                      : " · nur mit Tele-Plan"}
                  </span>
                  <span
                    className="mt-1 w-fit rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase"
                    style={{
                      background: `color-mix(in srgb, ${ok ? "var(--sage)" : "var(--terra)"} 14%, transparent)`,
                      color: ok ? "var(--sage)" : "var(--terra)",
                    }}
                  >
                    {ok
                      ? "Analyse: kaufen"
                      : k.kaufgrenze !== undefined
                        ? "über Kaufgrenze"
                        : "nur bei 60-mm-Bedarf"}
                  </span>
                </button>
              );
            },
          )}
        </div>
        <p className="text-xs text-[var(--text-dim)]">
          Endwertung aus der Technikanalyse Pocket 3 / 4 / 4P vom 18.08.2026. Grün
          heißt: der beste seriöse Preis liegt unter der dort gesetzten Kaufgrenze.
        </p>
        <div className="flex flex-wrap gap-2">
          {KAUF.filter((k) => k.kategorie === "kamera").map((k) => (
            <Chip
              key={k.id}
              aktiv={a.kamera === k.id}
              onClick={() => set({ kamera: k.id })}
            >
              {k.chip} · {bestesAngebot(k, null)?.preis.toLocaleString("de-DE")} EUR
            </Chip>
          ))}
          <Chip
            aktiv={a.kamera === null}
            onClick={() => set({ kamera: null })}
            ton="var(--text-dim)"
          >
            Keine
          </Chip>
        </div>

        <AnimatePresence mode="wait">
          {kam && (
            <motion.div
              key={kam.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-white/60 p-4"
            >
              <div className="flex flex-wrap items-start gap-3">
                <GearBild bild={kam.bild} alt={kam.name} art="kamera" hoehe="h-28" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{kam.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{kam.kurz}</p>
                </div>
                {s.kameraShop && (
                  <div className="text-right">
                    <p className="font-display text-2xl tabular-nums">
                      {s.kameraShop.preis.toLocaleString("de-DE", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      EUR
                    </p>
                    <p className="text-xs text-[var(--text-dim)]">
                      {s.kameraShop.shop}
                      {fin.monate > 0 && (
                        <>
                          {" "}
                          · {fin.monate} ×{" "}
                          {monatsrate(
                            s.kameraShop.preis,
                            fin.monate,
                            fin.zins,
                          ).toLocaleString("de-DE", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          EUR
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>
              <p className="text-sm text-[var(--text-muted)]">{kam.warum}</p>
              {(kam.kaufgrenze !== undefined || kam.analyse) && (
                <div
                  className="flex flex-wrap items-start gap-3 rounded-xl border p-3"
                  style={{
                    borderColor: unterGrenze ? "var(--sage)" : "var(--terra)",
                    background: `color-mix(in srgb, ${unterGrenze ? "var(--sage)" : "var(--terra)"} 7%, transparent)`,
                  }}
                >
                  <FileText
                    size={16}
                    className="mt-0.5 shrink-0"
                    style={{ color: unterGrenze ? "var(--sage)" : "var(--terra)" }}
                  />
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="font-medium">
                      Technikanalyse 18.08.:{" "}
                      {kam.kaufgrenze !== undefined && (
                        <>
                          kaufen bis {kam.kaufgrenze} EUR
                          {s.kameraShop && (
                            <>
                              {" "}
                              · {s.kameraShop.shop} liegt{" "}
                              {unterGrenze ? "darunter" : "darüber"}
                            </>
                          )}
                        </>
                      )}
                      {kam.wertung !== undefined && (
                        <span className="text-[var(--text-muted)]">
                          {" "}
                          · Wertung {kam.wertung.toLocaleString("de-DE")} / 10
                        </span>
                      )}
                    </p>
                    {kam.analyse && (
                      <p className="mt-0.5 text-[var(--text-muted)]">{kam.analyse}</p>
                    )}
                    <a
                      href="/docs/DJI_Osmo_Pocket_3_4_4P_Technikvergleich.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-[var(--sky)] underline-offset-2 hover:underline"
                    >
                      Analyse als PDF <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3">
                {s.kameraShop && (
                  <KaufenKnopf
                    href={s.kameraShop.url}
                    label={`Kaufen bei ${s.kameraShop.shop}`}
                  />
                )}
                <Haken
                  an={a.gekauft.includes(kam.id)}
                  onToggle={() => toggleIn("gekauft", kam.id)}
                  label="gekauft"
                />
              </div>
              <Angebote p={kam} markiert={s.kameraShop} />
            </motion.div>
          )}
        </AnimatePresence>
      </Schritt>

      {/* ── 2 Zahlweise ─────────────────────────────────────────── */}
      <Schritt
        nr={2}
        titel="Wie zahlen"
        unterzeile="Klarna ist eine Zahlart im Shop, kein Link"
        Icon={CreditCard}
      >
        <div className="flex flex-wrap gap-2">
          {FINANZIERUNGEN.map((f) => {
            const geht =
              !kam ||
              !f.braucht ||
              kam.angebote.some((o) => o.raten.includes(f.braucht!));
            return (
              <Chip
                key={f.id}
                aktiv={a.finanzierung === f.id}
                onClick={() => geht && set({ finanzierung: f.id })}
                ton={f.zins === 0 ? "var(--sky)" : "var(--rose)"}
              >
                <span style={{ opacity: geht ? 1 : 0.4 }}>{f.label}</span>
              </Chip>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={fin.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="rounded-2xl border border-[var(--border)] bg-white/60 p-4"
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <p className="font-medium">
                {fin.label}
                {fin.anbieter && (
                  <span className="text-[var(--text-muted)]"> · {fin.anbieter}</span>
                )}
              </p>
              {fin.monate > 0 && s.kameraPreis > 0 && (
                <p className="text-sm tabular-nums">
                  {fin.monate} ×{" "}
                  {monatsrate(s.kameraPreis, fin.monate, fin.zins).toLocaleString(
                    "de-DE",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}{" "}
                  EUR
                  {s.zinsen > 0 && (
                    <span className="text-[var(--rose)]">
                      {" "}
                      · {Math.round(s.zinsen)} EUR Zinsen
                    </span>
                  )}
                </p>
              )}
            </div>
            <p className="mt-1 text-sm text-[var(--text-muted)]">{fin.hinweis}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-start gap-2 text-xs text-[var(--text-dim)]">
          <Info size={14} className="mt-0.5 shrink-0" />
          <p>
            Die Rate läuft vom deutschen Konto, während das Stipendium pausiert.
            MediaMarkt 0 % schlägt jede Klarna-Variante über 3 Monate. Konditionen laut{" "}
            <a
              className="underline underline-offset-2"
              href="https://www.mediamarkt.de/de/service/zahlung/finanzierung"
              target="_blank"
              rel="noopener noreferrer"
            >
              MediaMarkt
            </a>{" "}
            und{" "}
            <a
              className="underline underline-offset-2"
              href="https://www.klarna.com/de/zahlungsmethoden/ratenzahlung/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Klarna
            </a>
            , Stand 18.08.2026.
          </p>
        </div>
      </Schritt>

      {/* ── 3 Zubehör ───────────────────────────────────────────── */}
      <Schritt
        nr={3}
        titel="Karten und Schutz"
        unterzeile="Kleinbeträge, sofort bezahlt"
        Icon={Package}
      >
        <ul className="flex flex-col gap-2">
          {KAUF.filter((k) => k.kategorie !== "kamera").map((p) => {
            const drin = a.zubehoer.includes(p.id);
            const imSet = !!kam?.enthaelt?.includes(p.id);
            const gedruckt = a.drucken && !!p.druckErsatz;
            const best = bestesAngebot(p, null);
            return (
              <li
                key={p.id}
                className="rounded-2xl border bg-white/60 p-4 transition-colors duration-200"
                style={{
                  borderColor:
                    drin && !gedruckt ? "var(--border-strong)" : "var(--border)",
                }}
              >
                <div className="flex flex-wrap items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleIn("zubehoer", p.id)}
                    aria-pressed={drin}
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors duration-150"
                    style={{
                      borderColor: drin ? "var(--sky)" : "var(--border-strong)",
                      background: drin ? "var(--sky)" : "transparent",
                      color: "#fff",
                    }}
                    aria-label={drin ? "aus dem Korb nehmen" : "in den Korb"}
                  >
                    {drin && <Check size={13} />}
                  </button>
                  <GearBild
                    bild={p.bild}
                    alt={p.name}
                    art="zubehoer"
                    hoehe="h-16"
                    passform={p.id === "k-sd" ? "contain" : "cover"}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium" style={{ opacity: drin ? 1 : 0.55 }}>
                      {p.menge ? `${p.menge} × ` : ""}
                      {p.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">{p.kurz}</p>
                  </div>
                  <p
                    className="font-display text-xl tabular-nums"
                    style={{ opacity: drin ? 1 : 0.55 }}
                  >
                    {imSet ? (
                      <span className="text-[var(--sage)]">im Set</span>
                    ) : gedruckt ? (
                      <span className="text-[var(--sage)]">0 EUR</span>
                    ) : (
                      `${((best?.preis ?? 0) * (p.menge ?? 1)).toLocaleString("de-DE", { minimumFractionDigits: 2 })} EUR`
                    )}
                  </p>
                </div>
                <AnimatePresence initial={false}>
                  {drin && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.26, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 text-sm text-[var(--text-muted)]">{p.warum}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {p.druckErsatz && (
                          <button
                            type="button"
                            onClick={() => set({ drucken: !a.drucken })}
                            aria-pressed={a.drucken}
                            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors duration-150"
                            style={{
                              borderColor: a.drucken
                                ? "var(--sage)"
                                : "var(--border-strong)",
                              background: a.drucken
                                ? "color-mix(in srgb, var(--sage) 12%, transparent)"
                                : "transparent",
                              color: a.drucken ? "var(--sage)" : "var(--text)",
                            }}
                          >
                            <Printer size={14} />
                            {a.drucken ? "wird gedruckt" : "stattdessen drucken"}
                          </button>
                        )}
                        {!gedruckt && best && (
                          <KaufenKnopf
                            href={best.url}
                            label={`Kaufen, ${best.shop}`}
                            primaer={false}
                          />
                        )}
                        {gedruckt && (
                          <a
                            href="#druck"
                            className="text-sm text-[var(--sky)] underline-offset-2 hover:underline"
                          >
                            Zum Modell
                          </a>
                        )}
                        <Haken
                          an={a.gekauft.includes(gedruckt ? "druck-case" : p.id)}
                          onToggle={() =>
                            toggleIn("gekauft", gedruckt ? "druck-case" : p.id)
                          }
                          label={gedruckt ? "gedruckt" : "gekauft"}
                        />
                      </div>
                      {!gedruckt && (
                        <div className="mt-2">
                          <Angebote p={p} markiert={best} />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
        <div className="flex items-start gap-2 text-xs text-[var(--text-dim)]">
          <Info size={14} className="mt-0.5 shrink-0" />
          <p>
            Kein microSD-Leser nötig: das MacBook Pro 14 hat einen SD-Slot, der
            microSD-auf-SD-Adapter reicht.
          </p>
        </div>
      </Schritt>

      {/* ── 4 Fotokamera ────────────────────────────────────────── */}
      <Schritt
        nr={4}
        titel="Fotokamera dazu?"
        unterzeile="Für Instagram, gebraucht bevorzugt"
        Icon={Wallet}
      >
        <div className="flex flex-wrap gap-2">
          <Chip
            aktiv={a.foto === null}
            onClick={() => set({ foto: null })}
            ton="var(--text-dim)"
          >
            Keine, erst drüben entscheiden
          </Chip>
          {picks.map((f) => (
            <Chip
              key={f.id}
              aktiv={a.foto === f.id}
              onClick={() => set({ foto: f.id })}
            >
              {f.name} · ab {f.gebrauchtVon?.toLocaleString("de-DE")} EUR
            </Chip>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {foto ? (
            <motion.div
              key={foto.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-white/60 p-4"
            >
              <div className="flex flex-wrap items-start gap-3">
                <GearBild bild={foto.bild} alt={foto.name} art="foto" hoehe="h-28" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{foto.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {foto.sensor} · {foto.gewicht} · gebraucht {foto.gebraucht} EUR
                    {foto.unsicher && " (Preise nachprüfen)"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl tabular-nums">
                    {a.fotoRaten
                      ? `${Math.round(s.fotoMonatlich)} EUR/Mo`
                      : `${foto.gebrauchtVon?.toLocaleString("de-DE")} EUR`}
                  </p>
                  <p className="text-xs text-[var(--text-dim)]">
                    {a.fotoRaten
                      ? `${FOTO_RATEN_MONATE} Raten, Zins im Checkout`
                      : "sofort"}
                  </p>
                </div>
              </div>
              <p className="text-sm text-[var(--text-muted)]">
                <strong>Gut:</strong> {foto.gut} <strong>Aber:</strong> {foto.schlecht}
              </p>
              <div className="flex flex-wrap gap-2">
                <Chip aktiv={a.fotoRaten} onClick={() => set({ fotoRaten: true })}>
                  In Raten
                </Chip>
                <Chip aktiv={!a.fotoRaten} onClick={() => set({ fotoRaten: false })}>
                  Sofort
                </Chip>
              </div>
              <ul className="flex flex-wrap gap-2">
                {foto.kaufen.map((k, i) => (
                  <li key={k.url} className="flex items-center gap-2">
                    <KaufenKnopf href={k.url} label={k.label} primaer={i === 0} />
                    {k.raten
                      .filter((r) => r !== "keine")
                      .map((r) => (
                        <RatenBadge key={r} art={r} />
                      ))}
                  </li>
                ))}
              </ul>
              <Haken
                an={a.gekauft.includes(foto.id)}
                onToggle={() => toggleIn("gekauft", foto.id)}
                label="gekauft"
              />
            </motion.div>
          ) : (
            <motion.p
              key="keine"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-[var(--text-muted)]"
            >
              Ohne Fotokamera bleibt die Last bei der Pocket-Rate. Drüben nach dem
              16.10. bei MPB US kaufen geht auch, dort mit Klarna und im selben
              Preisband. Der Vergleich aller Kandidaten steht weiter unten.
            </motion.p>
          )}
        </AnimatePresence>
      </Schritt>
    </div>
  );
}
