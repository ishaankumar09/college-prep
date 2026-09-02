"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ACTIVE, CUT, LEVELS, type Level } from "@/data/colleges";
import CollegeCard from "./CollegeCard";
import type { Selection } from "./CollegeMap";

const CollegeMap = dynamic(() => import("./CollegeMap"), {
  ssr: false,
  loading: () => <div className="map-frame map-loading">plotting pins…</div>,
});

type Filter = Level | "all";

export default function HubClient() {
  const [filter, setFilter] = useState<Filter>("all");
  const [sel, setSel] = useState<Selection | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const cardEls = useRef<Record<string, HTMLElement | null>>({});

  // A pin click scrolls the matching card into view.
  useEffect(() => {
    if (sel?.source === "pin") {
      cardEls.current[sel.id]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [sel]);

  const shown = filter === "all" ? ACTIVE : ACTIVE.filter((c) => c.level === filter);

  const counts: Record<Filter, number> = {
    all: ACTIVE.length,
    Reach: ACTIVE.filter((c) => c.level === "Reach").length,
    Target: ACTIVE.filter((c) => c.level === "Target").length,
    Safety: ACTIVE.filter((c) => c.level === "Safety").length,
  };

  return (
    <>
      <div className="chips">
        {(["all", ...LEVELS] as Filter[]).map((f) => (
          <button
            key={f}
            className={`chip${filter === f ? " chip--active" : ""}`}
            onClick={() => {
              setFilter(f);
              setSel(null);
            }}
          >
            {f === "all" ? "everything" : f.toLowerCase()}
            <span className="chip__count">{counts[f]}</span>
          </button>
        ))}
      </div>

      <div className="hub">
        <div className="cards">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((c, i) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 30,
                  delay: i * 0.02,
                }}
              >
                <CollegeCard
                  college={c}
                  selected={sel?.id === c.id}
                  onSelect={() => setSel({ id: c.id, source: "card" })}
                  onHover={(h) => setHovered(h ? c.id : null)}
                  cardRef={(el) => {
                    cardEls.current[c.id] = el;
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {filter === "all" && CUT.length > 0 && (
            <section className="cut">
              <div className="cut__head">the cut list</div>
              <div className="cards">
                {CUT.map((c) => (
                  <CollegeCard key={c.id} college={c} selected={false} compact />
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="map-col">
          <CollegeMap
            colleges={ACTIVE}
            selected={sel}
            hovered={hovered}
            filter={filter}
            onSelect={setSel}
          />
        </div>
      </div>
    </>
  );
}
