"use client";

import { useMemo, useState } from "react";
import {
  COLLEGES,
  LEVELS,
  distanceFromHome,
  miles,
  moneyFull,
  pct,
  type College,
} from "@/data/colleges";

type SortKey =
  | "rank"
  | "name"
  | "location"
  | "distance"
  | "level"
  | "appType"
  | "stars"
  | "acceptRate"
  | "avgSat"
  | "sfRatio"
  | "students"
  | "tuition";

const APP_ORDER = ["REA", "EA", "RD"];

function sortValue(c: College, key: SortKey): number | string {
  switch (key) {
    case "rank":
      return c.rank ?? 999;
    case "distance":
      return distanceFromHome(c);
    case "level":
      return LEVELS.indexOf(c.level);
    case "appType":
      return APP_ORDER.indexOf(c.appType);
    case "avgSat":
      return c.avgSat ?? -1;
    case "sfRatio":
      return parseInt(c.sfRatio, 10);
    case "name":
    case "location":
      return c[key].toLowerCase();
    default:
      return c[key];
  }
}

const COLUMNS: { key: SortKey | null; label: string }[] = [
  { key: "rank", label: "#" },
  { key: "name", label: "college" },
  { key: "location", label: "location" },
  { key: "distance", label: "from home" },
  { key: "level", label: "level" },
  { key: "appType", label: "app" },
  { key: "stars", label: "priority" },
  { key: null, label: "majors" },
  { key: "acceptRate", label: "accept" },
  { key: "avgSat", label: "avg sat" },
  { key: "sfRatio", label: "s:f" },
  { key: "students", label: "students" },
  { key: "tuition", label: "cost/yr" },
  { key: null, label: "notes" },
  { key: null, label: "links" },
];

export default function BreakdownTable() {
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [asc, setAsc] = useState(true);

  const rows = useMemo(() => {
    const sorted = [...COLLEGES].sort((a, b) => {
      const va = sortValue(a, sortKey);
      const vb = sortValue(b, sortKey);
      const cmp =
        typeof va === "string"
          ? va.localeCompare(vb as string)
          : (va as number) - (vb as number);
      return asc ? cmp : -cmp;
    });
    return sorted;
  }, [sortKey, asc]);

  const onSort = (key: SortKey) => {
    if (key === sortKey) {
      setAsc(!asc);
    } else {
      setSortKey(key);
      setAsc(true);
    }
  };

  return (
    <div className="table-wrap">
      <table className="bd-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.label}
                className={col.key === sortKey ? "sorted" : undefined}
                onClick={col.key ? () => onSort(col.key as SortKey) : undefined}
                style={col.key ? undefined : { cursor: "default" }}
              >
                {col.label}
                {col.key === sortKey ? (asc ? " ↑" : " ↓") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id} className={c.applying === "No" ? "cut-row" : undefined}>
              <td className="num">{c.rank ?? "—"}</td>
              <td className="college-cell">
                {c.name}
                {c.applying === "Maybe" && (
                  <span className="tag tag--maybe" style={{ marginLeft: 8 }}>
                    maybe
                  </span>
                )}
                {c.applying === "No" && (
                  <span className="tag" style={{ marginLeft: 8 }}>
                    cut
                  </span>
                )}
              </td>
              <td className="muted">{c.location}</td>
              <td className="num">{miles(distanceFromHome(c))}</td>
              <td>{c.level}</td>
              <td className="num">{c.appType}</td>
              <td>
                <span className={`stars stars--s${c.stars}`}>
                  {"★".repeat(c.stars)}
                  <span className="dim">{"★".repeat(5 - c.stars)}</span>
                </span>
              </td>
              <td className="muted">
                {c.major1} × {c.major2}
              </td>
              <td className="num">{pct(c.acceptRate)}</td>
              <td className="num">{c.avgSat ?? "—"}</td>
              <td className="num">{c.sfRatio}</td>
              <td className="num">{c.students.toLocaleString("en-US")}</td>
              <td className="num">{moneyFull(c.tuition)}</td>
              <td className="muted">{c.notes ?? ""}</td>
              <td>
                <a
                  className="mini-link"
                  href={c.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  site
                </a>
                <a
                  className="mini-link"
                  href={c.portal}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  portal
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
