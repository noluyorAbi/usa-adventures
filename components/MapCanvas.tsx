"use client";

import { createElement, useEffect, useMemo } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { Flag, MapPin, Music } from "lucide-react";
import { CATEGORIES, US_VIEW } from "@/lib/config";
import { GESETZTE_EVENTS } from "@/data/events";
import { kostenJeEvent } from "@/lib/events";
import { parseIso } from "@/lib/vacation";
import type { FixedEvent, Place } from "@/lib/types";

function pinIcon(place: Place, selected: boolean) {
  const { color, Icon } = CATEGORIES[place.category];
  const glyphColor = place.status === "wishlist" ? color : "#fffdf8";
  const svg = renderToStaticMarkup(
    createElement(Icon, { size: 15, color: glyphColor, strokeWidth: 2.4 }),
  );
  return L.divIcon({
    className: "",
    html: `<div class="pin pin-${place.status}${
      selected ? " pin-selected" : ""
    }" style="--c:${color}">${svg}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 32],
  });
}

const ghostIcon = L.divIcon({
  className: "",
  html: `<div class="ghost-pin">${renderToStaticMarkup(
    createElement(MapPin, { size: 16, color: "#fffdf8", strokeWidth: 2.4 }),
  )}</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

function eventIcon(event: FixedEvent) {
  const svg = renderToStaticMarkup(
    createElement(event.kind === "motorsport" ? Flag : Music, {
      size: 15,
      color: "#fffdf8",
      strokeWidth: 2.4,
    }),
  );
  return L.divIcon({
    className: "",
    html: `<div class="event-pin" style="--c:${event.color}">${svg}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function kurzDatum(isoStr: string): string {
  const d = parseIso(isoStr);
  return `${String(d.getUTCDate()).padStart(2, "0")}.${String(
    d.getUTCMonth() + 1,
  ).padStart(2, "0")}.`;
}

/** Smoothly fly to the selected place. */
function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, Math.max(map.getZoom(), 8), { duration: 0.9 });
  }, [target, map]);
  return null;
}

/** Click-to-drop when in add mode. */
function ClickCatcher({
  active,
  onPick,
}: {
  active: boolean;
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (active) onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export interface MapCanvasProps {
  places: Place[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  addMode: boolean;
  draft: { lat: number; lng: number } | null;
  onPick: (lat: number, lng: number) => void;
}

export default function MapCanvas({
  places,
  selectedId,
  onSelect,
  addMode,
  draft,
  onPick,
}: MapCanvasProps) {
  const selected = places.find((p) => p.id === selectedId) ?? null;
  const target = useMemo<[number, number] | null>(
    () => (selected ? [selected.lat, selected.lng] : null),
    [selected],
  );

  // Feste Termine liegen ueber den Orten und werden nicht gefiltert: sie
  // gehoeren keiner Kategorie an und sollen immer sichtbar bleiben.
  const eventKosten = useMemo(() => kostenJeEvent(GESETZTE_EVENTS), []);

  return (
    <div className={addMode ? "map-cursor-add h-full w-full" : "h-full w-full"}>
      <MapContainer
        center={[US_VIEW.lat, US_VIEW.lng]}
        zoom={US_VIEW.zoom}
        minZoom={3}
        scrollWheelZoom
        zoomControl
        worldCopyJump
        className="h-full w-full"
        attributionControl={false}
      >
        {/* Geografische Karte: echtes Satelliten-/Geländebild statt Navi-Karte */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
        {/* dezente Beschriftung (Städte, Grenzen) darüber, damit man sich zurechtfindet */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
        <FlyTo target={target} />
        <ClickCatcher active={addMode} onPick={onPick} />

        {places.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={pinIcon(p, p.id === selectedId)}
            eventHandlers={{ click: () => onSelect(p.id) }}
          />
        ))}

        {eventKosten.map(({ event, usd, urlaubstage }) => (
          <Marker
            key={event.id}
            position={[event.lat, event.lng]}
            icon={eventIcon(event)}
            zIndexOffset={800}
          >
            <Popup>
              <span className="block text-[11px] tracking-[0.18em] uppercase opacity-60">
                Fester Termin
              </span>
              <strong className="block text-sm">{event.title}</strong>
              <span className="block text-xs opacity-80">
                {event.startDate === event.endDate
                  ? kurzDatum(event.startDate)
                  : `${kurzDatum(event.startDate)} bis ${kurzDatum(event.endDate)}`}
                {" · "}
                {event.venue}, {event.city}
              </span>
              <span className="mt-1 block text-xs">
                {usd.toLocaleString("de-DE")} USD je Person
                {" · "}
                {urlaubstage
                  ? `${urlaubstage} Urlaubstag${urlaubstage === 1 ? "" : "e"}`
                  : "kein Urlaub"}
              </span>
              <span className="mt-1 block text-xs opacity-70">{event.anreise}</span>
            </Popup>
          </Marker>
        ))}

        {draft && <Marker position={[draft.lat, draft.lng]} icon={ghostIcon} />}
      </MapContainer>
    </div>
  );
}
