"use client";

import { motion } from "framer-motion";
import { Heart, Camera, ImageOff } from "lucide-react";
import { CATEGORIES } from "@/lib/config";
import type { Place } from "@/lib/types";

export default function Timeline({
  places,
  onFocus,
  onAdd,
}: {
  places: Place[];
  onFocus: (id: string) => void;
  onAdd: () => void;
}) {
  const memories = places
    .filter((p) => p.status === "visited")
    .sort((a, b) => {
      const da = a.visitedDate || a.createdAt;
      const db = b.visitedDate || b.createdAt;
      return db.localeCompare(da);
    });

  if (memories.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <motion.span
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-[var(--text-dim)]"
        >
          <ImageOff size={40} strokeWidth={1.6} />
        </motion.span>
        <p className="font-display text-xl">Noch keine Erinnerungen</p>
        <p className="max-w-xs text-sm text-[var(--text-muted)]">
          Setzt einen Spot auf <span className="text-[var(--teal)]">Erlebt</span>, dann
          taucht er hier in eurer Timeline auf.
        </p>
        <button
          onClick={onAdd}
          className="mt-2 rounded-full px-5 py-2 text-sm font-medium text-white"
          style={{ background: "var(--sunset)" }}
        >
          Ersten Spot hinzufügen
        </button>
      </div>
    );
  }

  return (
    <div className="relative ml-3 border-l border-[var(--border)] pl-6">
      {memories.map((p, i) => {
        const cat = CATEGORIES[p.category];
        const CatIcon = cat.Icon;
        const date = p.visitedDate || p.createdAt;
        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.03 }}
            className="relative pb-8"
          >
            <span
              className="absolute top-1 -left-[32px] grid h-6 w-6 place-items-center rounded-full border-2"
              style={{
                borderColor: cat.color,
                background: "var(--surface-solid)",
                color: cat.color,
              }}
            >
              <CatIcon size={12} strokeWidth={2.4} />
            </span>

            <button
              onClick={() => onFocus(p.id)}
              className="glass block w-full rounded-2xl p-4 text-left transition hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between gap-2">
                <time className="text-xs tracking-wider text-[var(--text-dim)] uppercase">
                  {new Date(date).toLocaleDateString("de-DE", {
                    weekday: "short",
                    day: "2-digit",
                    month: "long",
                  })}
                </time>
                {p.loves > 0 && (
                  <span className="flex items-center gap-1 text-xs text-[var(--rose)]">
                    <Heart size={12} className="fill-current" />
                    {p.loves}
                  </span>
                )}
              </div>
              <h3 className="font-display mt-1 text-xl">{p.name}</h3>
              {p.note && (
                <p className="mt-1 text-sm text-[var(--text-muted)]">{p.note}</p>
              )}
              <div className="mt-2 flex items-center gap-1 text-xs text-[var(--text-dim)]">
                <Camera size={12} /> {p.addedBy}
              </div>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
