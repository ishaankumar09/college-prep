"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  HOME,
  STAR_META,
  distanceFromHome,
  miles,
  type College,
  type Level,
  type Stars,
} from "@/data/colleges";
import { useTheme } from "./theme";

export interface Selection {
  id: string;
  source: "card" | "pin";
}

interface Props {
  colleges: College[];
  selected: Selection | null;
  hovered: string | null;
  filter: Level | "all";
  onSelect: (sel: Selection | null) => void;
}

const TILES = {
  light: {
    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
  },
  dark: {
    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
  },
};

/* Leaflet paints SVG stroke attrs directly, so the route color is picked per
   theme here instead of via CSS variables. */
const LINE_COLOR = { light: "#2e6b46", dark: "#f683fa" };

const homeIcon = L.divIcon({
  className: "pin-wrap",
  html: `<div class="pin-home"><svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/></svg></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  tooltipAnchor: [0, -18],
});

/** Flies the map to a college when its card is clicked. */
function FlyController({
  target,
}: {
  target: { lat: number; lng: number } | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 8, { duration: 1.2 });
    }
  }, [target, map]);
  return null;
}

/** Clicking empty map space clears the selection. */
function ClickCatcher({ onClear }: { onClear: () => void }) {
  useMapEvents({ click: () => onClear() });
  return null;
}

function makeIcon(c: College, active: boolean, dim: boolean) {
  return L.divIcon({
    className: "pin-wrap",
    html: `<div class="pin pin--s${c.stars}${active ? " pin--active" : ""}${
      dim ? " pin--dim" : ""
    }"><span>${c.rank ?? "·"}</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 28],
    tooltipAnchor: [0, -26],
  });
}

export default function CollegeMap({
  colleges,
  selected,
  hovered,
  filter,
  onSelect,
}: Props) {
  const { theme } = useTheme();
  const [map, setMap] = useState<L.Map | null>(null);

  const bounds = useMemo(
    () =>
      L.latLngBounds([
        [HOME.lat, HOME.lng] as [number, number],
        ...colleges.map((c) => [c.lat, c.lng] as [number, number]),
      ]),
    [colleges]
  );

  const flyTarget = useMemo(() => {
    if (!selected || selected.source !== "card") return null;
    const c = colleges.find((x) => x.id === selected.id);
    return c ? { lat: c.lat, lng: c.lng } : null;
  }, [selected, colleges]);

  const starTiers: Stars[] = [5, 4, 3, 2, 1];

  return (
    <div className="map-frame">
      <MapContainer
        bounds={bounds}
        boundsOptions={{ padding: [46, 46] }}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom
        ref={setMap}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer key={theme} url={TILES[theme].url} />
        <ZoomControl position="topright" />
        <FlyController target={flyTarget} />
        <ClickCatcher onClear={() => onSelect(null)} />

        {colleges.map((c) => {
          const active = selected?.id === c.id || hovered === c.id;
          const dim = filter !== "all" && c.level !== filter;
          return (
            <Polyline
              key={`route-${c.id}`}
              positions={[
                [HOME.lat, HOME.lng],
                [c.lat, c.lng],
              ]}
              pathOptions={{
                color: LINE_COLOR[theme],
                weight: active ? 2 : 1.2,
                opacity: dim ? 0.06 : active ? 0.85 : 0.35,
                dashArray: "4 7",
                interactive: false,
              }}
            />
          );
        })}

        <Marker
          position={[HOME.lat, HOME.lng]}
          icon={homeIcon}
          zIndexOffset={2000}
        >
          <Tooltip direction="top" opacity={1}>
            <div className="map-tip__name">Home</div>
            <div className="map-tip__meta">{HOME.location}</div>
          </Tooltip>
        </Marker>

        {colleges.map((c) => {
          const active = selected?.id === c.id || hovered === c.id;
          const dim = filter !== "all" && c.level !== filter;
          return (
            <Marker
              key={c.id}
              position={[c.lat, c.lng]}
              icon={makeIcon(c, active, dim)}
              zIndexOffset={active ? 1000 : 0}
              eventHandlers={{
                click: () => onSelect({ id: c.id, source: "pin" }),
              }}
            >
              <Tooltip direction="top" opacity={1}>
                <div className="map-tip__name">
                  {c.rank ? `${c.rank}. ` : ""}
                  {c.name}
                </div>
                <div className="map-tip__meta">
                  {c.location} · {c.level.toLowerCase()} ·{" "}
                  {"★".repeat(c.stars)} · {miles(distanceFromHome(c))}
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="legend">
        <div className="legend__title">priority</div>
        <div className="legend__row">
          <span className="legend__dot" style={{ background: "var(--gold)" }} />
          <span>⌂ home · simi valley</span>
        </div>
        {starTiers.map((s) => (
          <div className="legend__row" key={s}>
            <span
              className="legend__dot"
              style={{ background: `var(--s${s})` }}
            />
            <span>
              {"★".repeat(s)} {STAR_META[s].label.toLowerCase()}
            </span>
          </div>
        ))}
        <button
          className="legend__recenter"
          onClick={() => map?.flyToBounds(bounds, { padding: [46, 46] })}
        >
          ↺ recenter
        </button>
      </div>
    </div>
  );
}
