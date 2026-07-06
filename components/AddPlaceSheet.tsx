"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Search, X, Loader2, Crosshair } from "lucide-react";
import { CATEGORIES, STATUSES, CREW } from "@/lib/config";
import { useApp } from "@/lib/store";
import { PROMPT_ADD_PLACE } from "@/lib/agentPrompts";
import CopyForAgent from "./CopyForAgent";
import type { Category, Status } from "@/lib/types";

interface GeoHit {
  display_name: string;
  lat: string;
  lon: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function AddPlaceSheet() {
  const {
    trips,
    sheetOpen,
    sheetTrip,
    closeSheet,
    add,
    addMode,
    setAddMode,
    draft,
    setDraft,
  } = useApp();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("roadtrip");
  const [status, setStatus] = useState<Status>("wishlist");
  const [addedBy, setAddedBy] = useState(CREW[0]);
  const [note, setNote] = useState("");
  const [plannedDate, setPlannedDate] = useState("");
  const [tripId, setTripId] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [hits, setHits] = useState<GeoHit[]>([]);
  const [searching, setSearching] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // sync trip default + reset on close
  useEffect(() => {
    if (sheetOpen) {
      setTripId(sheetTrip);
    } else {
      setName("");
      setNote("");
      setPlannedDate("");
      setQ("");
      setHits([]);
      setDraft(null);
      setAddMode(false);
    }
  }, [sheetOpen, sheetTrip, setDraft, setAddMode]);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    if (q.trim().length < 3) {
      setHits([]);
      return;
    }
    debounce.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(q)}`,
          { headers: { "Accept-Language": "de,en" } },
        );
        setHits(await res.json());
      } catch {
        setHits([]);
      } finally {
        setSearching(false);
      }
    }, 350);
  }, [q]);

  function pickHit(h: GeoHit) {
    setDraft({ lat: parseFloat(h.lat), lng: parseFloat(h.lon) });
    if (!name) setName(h.display_name.split(",")[0]);
    setHits([]);
    setQ(h.display_name.split(",").slice(0, 2).join(", "));
  }

  const canSave = Boolean(name.trim() && draft);

  function submit() {
    if (!canSave || !draft) return;
    add({
      name: name.trim(),
      category,
      status,
      addedBy,
      note: note.trim(),
      tripId,
      lat: draft.lat,
      lng: draft.lng,
      plannedDate: plannedDate || null,
      visitedDate: status === "visited" ? new Date().toISOString().slice(0, 10) : null,
      photoUrl: null,
    });
    closeSheet();
  }

  return (
    <AnimatePresence>
      {sheetOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[1100] bg-[#0d2136]/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSheet}
          />
          <motion.aside
            className="fixed inset-x-0 bottom-0 z-[1200] flex max-h-[90vh] flex-col gap-5 overflow-y-auto rounded-t-3xl bg-[var(--surface-solid)] p-6 shadow-[0_-20px_60px_-20px_rgba(20,60,110,0.4)] sm:inset-y-0 sm:right-0 sm:left-auto sm:max-h-none sm:w-[440px] sm:rounded-none sm:rounded-l-3xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.42, ease: EASE }}
          >
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.2em] text-[var(--text-dim)] uppercase">
                  Neuer Ort
                </p>
                <h2 className="font-display text-2xl">Wohin geht&apos;s?</h2>
              </div>
              <button
                onClick={closeSheet}
                className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] text-[var(--text-muted)] transition hover:bg-black/[0.04]"
                aria-label="Schließen"
              >
                <X size={18} />
              </button>
            </header>

            {/* Location */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[var(--text-muted)]">Ort finden</label>
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--text-dim)]"
                />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="z.B. Yosemite, Waikiki…"
                  className="w-full rounded-xl border border-[var(--border)] bg-black/[0.03] py-2.5 pr-9 pl-9 text-sm outline-none focus:border-[var(--sky)]"
                />
                {searching && (
                  <Loader2
                    size={16}
                    className="absolute top-1/2 right-3 -translate-y-1/2 animate-spin text-[var(--text-dim)]"
                  />
                )}
              </div>

              <AnimatePresence>
                {hits.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-solid)]"
                  >
                    {hits.map((h, i) => (
                      <li key={i}>
                        <button
                          onClick={() => pickHit(h)}
                          className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm transition hover:bg-black/[0.04]"
                        >
                          <MapPin
                            size={14}
                            className="mt-0.5 shrink-0 text-[var(--sky)]"
                          />
                          <span className="line-clamp-2 text-[var(--text-muted)]">
                            {h.display_name}
                          </span>
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>

              <button
                onClick={() => setAddMode(!addMode)}
                className="flex items-center justify-center gap-2 rounded-xl border py-2 text-sm transition"
                style={
                  addMode
                    ? {
                        borderColor: "var(--sky)",
                        background: "color-mix(in srgb, var(--sky) 12%, transparent)",
                        color: "var(--sky)",
                      }
                    : { borderColor: "var(--border)", color: "var(--text-muted)" }
                }
              >
                <Crosshair size={15} />
                {addMode ? "Tippe auf die Karte…" : "Auf Karte tippen"}
              </button>

              {draft && (
                <p className="flex items-center gap-1 text-xs text-[var(--teal)]">
                  <MapPin size={12} strokeWidth={2.4} />
                  {draft.lat.toFixed(4)}, {draft.lng.toFixed(4)} gesetzt
                </p>
              )}
            </div>

            {/* Name */}
            <Field label="Name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Wie nennen wir den Spot?"
                className="w-full rounded-xl border border-[var(--border)] bg-black/[0.03] px-3 py-2.5 text-sm outline-none focus:border-[var(--sky)]"
              />
            </Field>

            {/* Category */}
            <Field label="Kategorie">
              <div className="flex flex-wrap gap-2">
                {(Object.keys(CATEGORIES) as Category[]).map((c) => {
                  const active = category === c;
                  const ChipIcon = CATEGORIES[c].Icon;
                  return (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition"
                      style={{
                        borderColor: active ? CATEGORIES[c].color : "var(--border)",
                        background: active
                          ? `color-mix(in srgb, ${CATEGORIES[c].color} 14%, transparent)`
                          : "transparent",
                        color: active ? CATEGORIES[c].color : "var(--text-muted)",
                      }}
                    >
                      <ChipIcon size={14} strokeWidth={2.2} />
                      {CATEGORIES[c].label}
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* Status */}
            <Field label="Status">
              <div className="grid grid-cols-3 gap-1 rounded-xl border border-[var(--border)] p-1">
                {(Object.keys(STATUSES) as Status[]).map((s) => {
                  const active = status === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className="relative rounded-lg py-2 text-sm transition"
                      style={{ color: active ? "#fff" : "var(--text-muted)" }}
                    >
                      {active && (
                        <motion.span
                          layoutId="status-pill"
                          className="absolute inset-0 rounded-lg"
                          style={{ background: STATUSES[s].color }}
                          transition={{ duration: 0.3, ease: EASE }}
                        />
                      )}
                      <span className="relative z-10">{STATUSES[s].short}</span>
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* Trip */}
            <Field label="Trip / Region">
              <div className="flex flex-wrap gap-2">
                <TripChip
                  on={tripId === null}
                  color="#8496a8"
                  onClick={() => setTripId(null)}
                >
                  Kein Trip
                </TripChip>
                {trips.map((t) => (
                  <TripChip
                    key={t.id}
                    on={tripId === t.id}
                    color={t.color}
                    onClick={() => setTripId(t.id)}
                  >
                    {t.name}
                  </TripChip>
                ))}
              </div>
            </Field>

            {status !== "visited" && (
              <Field label="Wann? (optional)">
                <input
                  type="date"
                  value={plannedDate}
                  onChange={(e) => setPlannedDate(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-black/[0.03] px-3 py-2.5 text-sm [color-scheme:light] outline-none focus:border-[var(--sky)]"
                />
              </Field>
            )}

            {/* Note */}
            <Field label="Notiz">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Warum hierher? Tipp, Erinnerung…"
                className="w-full resize-none rounded-xl border border-[var(--border)] bg-black/[0.03] px-3 py-2.5 text-sm outline-none focus:border-[var(--sky)]"
              />
            </Field>

            {/* Who */}
            <Field label="Von wem?">
              <div className="flex flex-wrap gap-2">
                {CREW.map((c) => (
                  <TripChip
                    key={c}
                    on={addedBy === c}
                    color="#6a68d4"
                    onClick={() => setAddedBy(c)}
                  >
                    {c}
                  </TripChip>
                ))}
                <input
                  value={CREW.includes(addedBy) ? "" : addedBy}
                  onChange={(e) => setAddedBy(e.target.value || CREW[0])}
                  placeholder="Gast…"
                  className="w-24 rounded-full border border-[var(--border)] bg-black/[0.03] px-3 py-1.5 text-sm outline-none focus:border-[var(--indigo)]"
                />
              </div>
            </Field>

            <button
              disabled={!canSave}
              onClick={submit}
              className="mt-1 rounded-xl py-3 text-center font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: canSave ? "var(--sun-grad)" : "rgba(20,60,110,0.15)",
              }}
            >
              {draft ? "Zur Karte hinzufügen" : "Erst Ort wählen"}
            </button>

            <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4 text-sm text-[var(--text-muted)]">
              <span>Lieber vom Agenten machen lassen?</span>
              <CopyForAgent
                text={PROMPT_ADD_PLACE}
                label="Prompt kopieren"
                variant="compact"
              />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-[var(--text-muted)]">{label}</label>
      {children}
    </div>
  );
}

function TripChip({
  on,
  color,
  onClick,
  children,
}: {
  on: boolean;
  color: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border px-3 py-1.5 text-sm transition"
      style={{
        borderColor: on ? color : "var(--border)",
        background: on
          ? `color-mix(in srgb, ${color} 14%, transparent)`
          : "transparent",
        color: on ? color : "var(--text-muted)",
      }}
    >
      {children}
    </button>
  );
}
