import { BildNachweis } from "@/components/GearBild";
import GearDruck from "@/components/GearDruck";
import GearFoto from "@/components/GearFoto";
import GearKombo from "@/components/GearKombo";
import GearLokal from "@/components/GearLokal";
import GearPlanner from "@/components/GearPlanner";
import GearShop from "@/components/GearShop";

const NAV = [
  { href: "#kaufen", label: "Kaufen" },
  { href: "#kombi", label: "Kombis + SWOT" },
  { href: "#foto", label: "Fotokamera" },
  { href: "#gebraucht", label: "Gebraucht MUC" },
  { href: "#druck", label: "3D-Druck" },
  { href: "#hintergrund", label: "Warum so" },
];

export default function GearPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-6 pb-28 sm:px-6 sm:pb-10">
      <header className="flex flex-col gap-3">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl">Kamera</h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--text-muted)]">
            Sechs Monate dokumentieren, am Ende ein Kurzfilm und ein Instagram, das
            nicht nach Handy aussieht. Oben die Auswahl mit Preisen und Raten, ein Klick
            pro Kauf. Darunter, was der Drucker übernimmt, und warum es genau diese
            Teile sind.
          </p>
        </div>
        <nav aria-label="Abschnitte" className="flex flex-wrap gap-2">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-full border border-[var(--border-strong)] px-3 py-1 text-xs text-[var(--text-muted)] transition-colors duration-150 hover:border-[var(--sky)] hover:text-[var(--text)]"
            >
              {n.label}
            </a>
          ))}
        </nav>
      </header>

      <section id="kaufen" className="scroll-mt-4">
        <GearShop />
      </section>

      <section id="kombi" className="scroll-mt-4 pt-6">
        <GearKombo />
      </section>

      <section id="foto" className="scroll-mt-4 pt-6">
        <GearFoto />
      </section>

      <section id="gebraucht" className="scroll-mt-4 pt-6">
        <GearLokal />
      </section>

      <section id="druck" className="scroll-mt-4 pt-6">
        <GearDruck />
      </section>

      <section id="hintergrund" className="scroll-mt-4 pt-6">
        <GearPlanner />
      </section>

      <BildNachweis />
    </main>
  );
}
