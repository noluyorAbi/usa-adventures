"use client";

/**
 * App-Zustand — komplett LOKAL. Kein Backend, keine Credentials.
 *
 * Quelle der Wahrheit: data/places.ts + data/trips.ts (im Projekt, editierbar).
 * Zusätzlich speichert der Browser Änderungen in localStorage, damit nichts
 * verloren geht während man rumklickt. "Auf Projektdaten zurücksetzen" leert das.
 *
 * Merge-Logik: neue Seed-Spots aus dem Repo erscheinen auch, wenn localStorage
 * schon ältere Daten hat. User-Änderungen an bekannten IDs und neu angelegte
 * Spots bleiben erhalten.
 *
 * Alles läuft über einen React-Context: components rufen `useApp()`.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PLACES } from "@/data/places";
import { TRIPS } from "@/data/trips";
import { EMPTY_FILTERS, applyFilters, type Filters } from "@/lib/filter";
import type { NewPlace, Place, Status, Trip } from "@/lib/types";

const LS_KEY = "oxnard.places.v7";

function makeId() {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

/** Project seeds + local overrides + user-created spots. */
function mergePlaces(project: Place[], local: Place[]): Place[] {
  const localById = new Map(local.map((p) => [p.id, p]));
  const projectIds = new Set(project.map((p) => p.id));
  const merged = project.map((p) => localById.get(p.id) ?? p);
  for (const p of local) {
    if (!projectIds.has(p.id)) merged.push(p);
  }
  return merged;
}

function readLocal(): Place[] {
  if (typeof window === "undefined") return PLACES;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) {
      // migrate from previous key if present
      const legacy = window.localStorage.getItem("oxnard.places.v6");
      if (legacy) {
        const old = JSON.parse(legacy) as Place[];
        return mergePlaces(PLACES, old);
      }
      return PLACES;
    }
    return mergePlaces(PLACES, JSON.parse(raw) as Place[]);
  } catch {
    return PLACES;
  }
}

function writeLocal(places: Place[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(places));
}

interface AppState {
  places: Place[];
  trips: Trip[];
  loading: boolean;

  // data actions
  add: (input: NewPlace) => Place;
  update: (id: string, patch: Partial<Place>) => void;
  remove: (id: string) => void;
  love: (id: string) => void;
  advance: (id: string, next: Status) => void;
  resetToProjectData: () => void;

  // ui: selection
  selectedId: string | null;
  select: (id: string | null) => void;

  // ui: filters
  filters: Filters;
  setFilters: (f: Filters) => void;
  tripFilter: string | null;
  setTripFilter: (id: string | null) => void;
  filtered: Place[];

  // ui: add sheet
  sheetOpen: boolean;
  sheetTrip: string | null;
  openSheet: (tripId?: string | null) => void;
  closeSheet: () => void;
  addMode: boolean;
  setAddMode: (v: boolean) => void;
  draft: { lat: number; lng: number } | null;
  setDraft: (d: { lat: number; lng: number } | null) => void;

  // ui: celebration
  celebrate: boolean;

  // ui: spot detail modal
  modalId: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [places, setPlaces] = useState<Place[]>(PLACES);
  const [loading, setLoading] = useState(true);
  const hydrated = useRef(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [tripFilter, setTripFilter] = useState<string | null>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetTrip, setSheetTrip] = useState<string | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [draft, setDraft] = useState<{ lat: number; lng: number } | null>(null);

  const [celebrate, setCelebrate] = useState(false);
  const celebrateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fireCelebrate = useCallback(() => {
    setCelebrate(true);
    if (celebrateTimer.current) clearTimeout(celebrateTimer.current);
    celebrateTimer.current = setTimeout(() => setCelebrate(false), 1600);
  }, []);

  useEffect(() => {
    setPlaces(readLocal());
    hydrated.current = true;
    setLoading(false);
  }, []);

  useEffect(() => {
    if (hydrated.current) writeLocal(places);
  }, [places]);

  const add = useCallback(
    (input: NewPlace) => {
      const place: Place = {
        ...input,
        id: makeId(),
        loves: 0,
        createdAt: new Date().toISOString(),
      };
      setPlaces((prev) => [...prev, place]);
      if (place.status === "visited") fireCelebrate();
      return place;
    },
    [fireCelebrate],
  );

  const update = useCallback((id: string, patch: Partial<Place>) => {
    setPlaces((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const remove = useCallback((id: string) => {
    setPlaces((prev) => prev.filter((x) => x.id !== id));
    setSelectedId((s) => (s === id ? null : s));
  }, []);

  const love = useCallback((id: string) => {
    setPlaces((prev) =>
      prev.map((x) => (x.id === id ? { ...x, loves: x.loves + 1 } : x)),
    );
  }, []);

  const advance = useCallback(
    (id: string, next: Status) => {
      update(id, {
        status: next,
        visitedDate:
          next === "visited" ? new Date().toISOString().slice(0, 10) : undefined,
      });
      if (next === "visited") fireCelebrate();
    },
    [update, fireCelebrate],
  );

  const resetToProjectData = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(LS_KEY);
      window.localStorage.removeItem("oxnard.places.v6");
    }
    setPlaces(PLACES);
  }, []);

  const openSheet = useCallback((tripId: string | null = null) => {
    setSheetTrip(tripId);
    setSheetOpen(true);
  }, []);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const [modalId, setModalId] = useState<string | null>(null);
  const openModal = useCallback((id: string) => setModalId(id), []);
  const closeModal = useCallback(() => setModalId(null), []);

  const combinedFilters = useMemo<Filters>(
    () => ({ ...filters, tripId: tripFilter }),
    [filters, tripFilter],
  );
  const filtered = useMemo(
    () => applyFilters(places, combinedFilters),
    [places, combinedFilters],
  );

  const value: AppState = {
    places,
    trips: TRIPS,
    loading,
    add,
    update,
    remove,
    love,
    advance,
    resetToProjectData,
    selectedId,
    select: setSelectedId,
    filters,
    setFilters,
    tripFilter,
    setTripFilter,
    filtered,
    sheetOpen,
    sheetTrip,
    openSheet,
    closeSheet,
    addMode,
    setAddMode,
    draft,
    setDraft,
    celebrate,
    modalId,
    openModal,
    closeModal,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within <AppProvider>");
  return ctx;
}
