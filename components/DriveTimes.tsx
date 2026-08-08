"use client";

/**
 * Fahrzeiten ab Camarillo.
 *
 * lib/geo.ts schätzt aus der Luftlinie. Für die Frage "geht das nach der
 * Arbeit noch" reicht das nicht, weil in Südkalifornien die Uhrzeit über die
 * Fahrzeit entscheidet und nicht die Entfernung.
 */

import { useState } from "react";
import { Car, Clock } from "lucide-react";
import { DRIVES, FEIERABEND_MINUTEN } from "@/data/drives";

function dauer(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} h` : `${h} h ${m}`;
}

type Sicht = "alle" | "feierabend" | "wochenende";

export default function DriveTimes() {
  const [sicht, setSicht] = useState<Sicht>("alle");

  const liste = DRIVES.filter((d) => {
    if (sicht === "feierabend") return d.normal <= FEIERABEND_MINUTEN;
    if (sicht === "wochenende") return d.normal > FEIERABEND_MINUTEN;
    return true;
  });

  return (
    <section className="card flex flex-col gap-4 rounded-3xl p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-2">
          <Car size={16} className="text-[var(--text-dim)]" />
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
              Ab Camarillo
            </p>
            <h2 className="font-display text-2xl">Wie lange fährt man wohin</h2>
          </div>
        </div>
        <div className="flex gap-1 rounded-full border border-[var(--border)] p-1">
          {(
            [
              ["alle", "Alle"],
              ["feierabend", "Nach der Arbeit"],
              ["wochenende", "Wochenende"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setSicht(k)}
              className="rounded-full px-3 py-1.5 text-xs transition"
              style={{
                background: sicht === k ? "var(--sky)" : "transparent",
                color: sicht === k ? "#fff" : "var(--text-muted)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {liste.map((d) => (
          <li
            key={d.id}
            className="rounded-2xl border border-[var(--border)] bg-white/60 px-3 py-2.5"
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="flex-1 text-sm font-medium">{d.ziel}</span>
              <span className="text-sm" style={{ color: "var(--teal)" }}>
                {dauer(d.normal)}
              </span>
              {d.rush !== null && (
                <span
                  className="flex items-center gap-1 text-xs"
                  style={{ color: "var(--terra)" }}
                >
                  <Clock size={11} />
                  bis {dauer(d.rush)}
                </span>
              )}
              <span className="text-xs text-[var(--text-dim)]">{d.km} km</span>
            </div>
            <p className="mt-0.5 text-xs text-[var(--text-dim)]">{d.route}</p>
            {d.note && (
              <p className="mt-1 text-xs text-[var(--text-muted)]">{d.note}</p>
            )}
          </li>
        ))}
      </ul>

      <p className="text-xs text-[var(--text-dim)]">
        Grüne Zeit ist freie Fahrt, rote der Berufsverkehr. Gerundete Erfahrungswerte,
        keine Live-Daten: die App bleibt lokal und fragt keine API.
      </p>
    </section>
  );
}
