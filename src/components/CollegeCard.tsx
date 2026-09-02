"use client";

import {
  distanceFromHome,
  miles,
  money,
  pct,
  type College,
} from "@/data/colleges";

interface Props {
  college: College;
  selected: boolean;
  compact?: boolean;
  onSelect?: () => void;
  onHover?: (hovering: boolean) => void;
  cardRef?: (el: HTMLElement | null) => void;
}

export default function CollegeCard({
  college: c,
  selected,
  compact = false,
  onSelect,
  onHover,
  cardRef,
}: Props) {
  return (
    <article
      ref={cardRef}
      className={`card${selected ? " card--selected" : ""}`}
      onClick={onSelect}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      <div className="card__top">
        {c.rank !== null && (
          <div className="card__rank">{String(c.rank).padStart(2, "0")}</div>
        )}
        <div className="card__id">
          <h2 className="card__name">{c.name}</h2>
          <div className="card__loc">{c.location}</div>
        </div>
        <div className="card__badges">
          <span className={`stars stars--s${c.stars}`} title={`${c.stars}/5 priority`}>
            {"★".repeat(c.stars)}
            <span className="dim">{"★".repeat(5 - c.stars)}</span>
          </span>
          <div className="tags">
            {c.applying === "Maybe" && <span className="tag tag--maybe">maybe</span>}
            {c.applying === "No" && <span className="tag">cut</span>}
            <span className="tag">{c.level}</span>
            <span className="tag tag--app">{c.appType}</span>
          </div>
        </div>
      </div>

      <div className="card__majors">
        <span className="m">
          {c.major1} <span className="sep">×</span> {c.major2}
        </span>
        {c.notes && <span className="card__note">✦ {c.notes}</span>}
      </div>

      <p className="card__why">{c.whyFit}</p>

      {!compact && (
        <>
          <div className="card__stats">
            <div>
              <div className="stat__label">Accept</div>
              <div className="stat__value">{pct(c.acceptRate)}</div>
            </div>
            <div>
              <div className="stat__label">Avg SAT</div>
              <div className="stat__value">{c.avgSat ?? "—"}</div>
            </div>
            <div>
              <div className="stat__label">S:F ratio</div>
              <div className="stat__value">{c.sfRatio}</div>
            </div>
            <div>
              <div className="stat__label">Cost / yr</div>
              <div className="stat__value">{money(c.tuition)}</div>
            </div>
            <div>
              <div className="stat__label">From home</div>
              <div className="stat__value">{miles(distanceFromHome(c))}</div>
            </div>
          </div>

          <div className="card__foot">
            <a
              className="btn"
              href={c.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              website <span className="arrow">↗</span>
            </a>
            <a
              className="btn btn--solid"
              href={c.portal}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {c.portalName.toLowerCase()} <span className="arrow">↗</span>
            </a>
          </div>
        </>
      )}
    </article>
  );
}
