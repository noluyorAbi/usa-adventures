"use client";

import Link from "next/link";
import { differenceInCalendarDays } from "date-fns";
import { motion } from "framer-motion";
import {
  Mountain,
  Map,
  ListChecks,
  Route,
  Clock,
  ArrowRight,
  MapPin,
  Compass,
  ExternalLink,
  WifiOff,
  Code2,
  Download,
  Terminal,
  FolderOpen,
  Pencil,
  Rocket,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { ARRIVAL, DEPARTURE, CREW } from "@/lib/config";

const EASE = [0.16, 1, 0.3, 1] as const;
const REPO = "https://github.com/noluyorAbi/usa-adventures";

const STEPS = [
  {
    Icon: Download,
    title: "Node.js installieren",
    desc: "Einmalig von nodejs.org die LTS-Version laden und installieren. Das ist die Basis, damit alles läuft.",
  },
  {
    Icon: Code2,
    title: "Repo holen",
    desc: "Auf GitHub oben rechts auf „Code“ → „Download ZIP“, entpacken. (Oder mit git klonen, wenn du magst.)",
  },
  {
    Icon: Terminal,
    title: "Starten",
    desc: "Ordner im Terminal öffnen, einmal „npm install“, dann „npm run dev“. Browser auf localhost:3000.",
  },
  {
    Icon: FolderOpen,
    title: "Inhalte finden",
    desc: "Alles Editierbare liegt im Ordner „data/“: places.ts (Orte) und trips.ts (Reisen). Nur die anfassen.",
  },
  {
    Icon: Pencil,
    title: "Ändern & speichern",
    desc: "Eine Zeile kopieren, Werte anpassen, speichern. Der Browser aktualisiert sich selbst. Fertig.",
  },
  {
    Icon: Rocket,
    title: "Online stellen",
    desc: "Änderung committen und pushen — Vercel deployed automatisch. Nach ein paar Sekunden ist es live.",
  },
];

const FEATURES = [
  {
    href: "/map",
    Icon: Map,
    title: "Interaktive Karte",
    desc: "Jeder Spot als Pin über die ganzen USA + Hawaii. Kategorien, Status, Klick für Details.",
  },
  {
    href: "/plans",
    Icon: ListChecks,
    title: "Plan-Board",
    desc: "Von der Idee über geplant bis erlebt. Herzchen-Voting, damit ihr priorisiert.",
  },
  {
    href: "/trips",
    Icon: Route,
    title: "Trips & Regionen",
    desc: "Sechs große Routen: SoCal, PCH, Südwesten, Hawaii, Ostküste, Rockies.",
  },
  {
    href: "/memories",
    Icon: Clock,
    title: "Erinnerungen",
    desc: "Was ihr erlebt habt, als Timeline. Wird mit jedem Spot voller.",
  },
] as const;

function useCountdown() {
  const now = new Date();
  const total = differenceInCalendarDays(DEPARTURE, ARRIVAL);
  const toStart = differenceInCalendarDays(ARRIVAL, now);
  const sinceStart = differenceInCalendarDays(now, ARRIVAL);
  if (toStart > 0) return { label: "Tage bis USA", value: toStart };
  if (sinceStart >= total) return { label: "Tage erlebt", value: total };
  return { label: `Tag ${sinceStart + 1} von ${total}`, value: total - sinceStart };
}

export default function Landing() {
  const { places, trips } = useApp();
  const c = useCountdown();
  const visited = places.filter((p) => p.status === "visited").length;

  return (
    <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
      {/* cloud accents */}
      <div className="cloud top-24 left-[6%] h-24 w-56 opacity-70" />
      <div className="cloud top-52 right-[10%] h-16 w-40 opacity-60" />

      {/* Nav */}
      <header className="flex items-center justify-between py-5">
        <div className="flex items-center gap-2">
          <span
            className="grid h-9 w-9 place-items-center rounded-xl text-white"
            style={{ background: "var(--sky-grad)" }}
          >
            <Mountain size={18} strokeWidth={2.2} />
          </span>
          <span className="font-display text-lg">
            USA<span className="text-[var(--text-dim)]">/</span>Adventures
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/trips"
            className="hidden rounded-full px-4 py-2 text-sm text-[var(--text-muted)] transition hover:text-[var(--text)] sm:block"
          >
            Trips
          </Link>
          <Link
            href="/map"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white"
            style={{ background: "var(--sky-grad)" }}
          >
            App öffnen <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex flex-col items-center gap-6 pt-10 pb-10 text-center sm:pt-16">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/70 px-4 py-1.5 text-sm text-[var(--text-muted)] backdrop-blur"
        >
          <MapPin size={14} className="text-[var(--terra)]" /> Basis: Oxnard,
          Kalifornien
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.05 }}
          className="font-display text-5xl leading-[1.02] sm:text-7xl"
        >
          Sechs Monate quer
          <br />
          durch die <span className="text-gradient">USA</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
          className="max-w-xl text-lg text-[var(--text-muted)]"
        >
          Alperen &amp; Justus, ein Praktikum, ein Kontinent. Das hier ist unser
          geteiltes Reisegehirn: Karte, Trips, Pläne und Erinnerungen an einem Ort.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/map"
            className="flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white shadow-[0_16px_36px_-12px_rgba(242,104,63,0.5)]"
            style={{ background: "var(--sun-grad)" }}
          >
            Karte öffnen <ArrowRight size={17} />
          </Link>
          <Link
            href="/trips"
            className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/70 px-6 py-3 font-medium backdrop-blur transition hover:border-[var(--sky)]"
          >
            <Compass size={17} /> Trips ansehen
          </Link>
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/70 px-6 py-3 font-medium backdrop-blur transition hover:border-[var(--ink)]"
          >
            <Code2 size={17} /> Code auf GitHub
          </a>
        </motion.div>

        {/* live stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}
          className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <Stat value={c.value} label={c.label} accent="var(--terra)" />
          <Stat value={places.length} label="Spots" accent="var(--sky)" />
          <Stat value={trips.length} label="Trips" accent="var(--indigo)" />
          <Stat value={visited} label="Erlebt" accent="var(--teal)" />
        </motion.div>
      </section>

      {/* Promo video */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: EASE }}
        className="pb-6"
      >
        <div className="overflow-hidden rounded-3xl border border-[var(--border)] shadow-[var(--shadow-float)]">
          <video
            className="aspect-video w-full"
            src="/promo.mp4"
            poster="/promo-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </motion.section>

      {/* Features */}
      <section className="grid gap-4 py-8 sm:grid-cols-2">
        {FEATURES.map(({ href, Icon, title, desc }, i) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, ease: EASE, delay: i * 0.05 }}
          >
            <Link
              href={href}
              className="card group flex h-full flex-col gap-3 rounded-3xl p-6 transition hover:-translate-y-1"
            >
              <span
                className="grid h-11 w-11 place-items-center rounded-2xl text-white"
                style={{ background: "var(--sky-grad)" }}
              >
                <Icon size={20} strokeWidth={2.2} />
              </span>
              <h3 className="font-display text-xl">{title}</h3>
              <p className="text-sm text-[var(--text-muted)]">{desc}</p>
              <span className="mt-auto flex items-center gap-1 pt-2 text-sm text-[var(--sky)]">
                Öffnen{" "}
                <ArrowRight
                  size={14}
                  className="transition group-hover:translate-x-1"
                />
              </span>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Trips strip */}
      <section className="flex flex-col gap-4 py-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl">Die Routen</h2>
          <Link
            href="/trips"
            className="flex items-center gap-1 text-sm text-[var(--sky)]"
          >
            Alle Trips <ArrowRight size={14} />
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {trips.map((t) => (
            <Link
              key={t.id}
              href="/trips"
              className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 text-sm backdrop-blur transition hover:-translate-y-0.5"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: t.color }}
              />
              {t.name}
              <span className="text-[var(--text-dim)]">
                {places.filter((p) => p.tripId === t.id).length}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Mitmachen / Tutorial für Laien */}
      <section className="flex flex-col gap-6 py-8">
        <div className="flex flex-col gap-1">
          <span className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
            Für alle, auch ohne Coding
          </span>
          <h2 className="font-display text-3xl">Selbst bearbeiten in 6 Schritten</h2>
          <p className="max-w-2xl text-[var(--text-muted)]">
            Du musst kein Programmierer sein. Orte und Trips ändert man in zwei Dateien
            im Ordner <code className="rounded bg-black/[0.05] px-1">data/</code>. So
            gehst du vor:
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, ease: EASE, delay: i * 0.04 }}
              className="card flex flex-col gap-3 rounded-2xl p-5"
            >
              <div className="flex items-center gap-3">
                <span
                  className="grid h-9 w-9 place-items-center rounded-xl text-white"
                  style={{ background: "var(--sky-grad)" }}
                >
                  <Icon size={17} strokeWidth={2.2} />
                </span>
                <span className="font-display text-lg">
                  <span className="text-[var(--text-dim)]">{i + 1}.</span> {title}
                </span>
              </div>
              <p className="text-sm text-[var(--text-muted)]">{desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white"
            style={{ background: "var(--sky-grad)" }}
          >
            <Code2 size={16} /> Repo auf GitHub
          </a>
          <a
            href={`${REPO}/blob/main/docs/LOKAL-BEARBEITEN.md`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/70 px-5 py-2.5 text-sm font-medium backdrop-blur transition hover:border-[var(--sky)]"
          >
            <FolderOpen size={16} /> Komplette Anleitung
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 flex flex-col gap-4 border-t border-[var(--border)] py-8 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white/60 px-3 py-1">
            <WifiOff size={13} /> 100% lokal, kein Login
          </span>
          <span>Crew: {CREW.join(" & ")}</span>
        </div>
        <a
          href={REPO}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 transition hover:text-[var(--text)]"
        >
          <ExternalLink size={15} /> Repo &amp; Docs
        </a>
      </footer>
    </div>
  );
}

function Stat({
  value,
  label,
  accent,
}: {
  value: number;
  label: string;
  accent: string;
}) {
  return (
    <div className="card flex flex-col items-center gap-0.5 rounded-2xl px-5 py-4">
      <span className="font-display text-3xl leading-none" style={{ color: accent }}>
        {value}
      </span>
      <span className="text-xs tracking-wider text-[var(--text-dim)] uppercase">
        {label}
      </span>
    </div>
  );
}
