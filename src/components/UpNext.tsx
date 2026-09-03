"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { daysUntil, fmtDue, upNext } from "@/data/tasks";
import { useTasks, useUnlock } from "./useTasks";

export default function UpNext() {
  const { unlocked, passcode, lock } = useUnlock();
  const router = useRouter();
  const { tasks, loaded, toggle } = useTasks(passcode, lock);

  const next = upNext(tasks, 4);
  const finished = tasks.filter((t) => t.done).length;

  return (
    <aside className="upnext">
      <div className="upnext__head">
        <span className="upnext__title">up next</span>
        <span className="upnext__progress">
          {loaded && tasks.length > 0 ? `${finished}/${tasks.length} done` : " "}
        </span>
        <Link href="/checklist" className="upnext__link">
          checklist →
        </Link>
      </div>

      {!loaded ? (
        <div className="upnext__empty">loading…</div>
      ) : next.length === 0 ? (
        <div className="upnext__empty">
          {tasks.length === 0
            ? "No tasks yet — add some on the checklist."
            : "Nothing left. Go touch grass."}
        </div>
      ) : (
        <ul className="upnext__list">
          {next.map((t) => {
            const days = t.due ? daysUntil(t.due) : null;
            const tone =
              days !== null && days < 0
                ? " due--over"
                : days !== null && days <= 7
                  ? " due--soon"
                  : "";
            return (
              <li key={t.id} className="upnext__item">
                <button
                  className="check check--sm"
                  role="checkbox"
                  aria-checked={false}
                  aria-label={unlocked ? `Mark ${t.title} done` : "Unlock the checklist"}
                  onClick={() => (unlocked ? toggle(t.id) : router.push("/checklist"))}
                >
                  <svg viewBox="0 0 16 16">
                    <path d="M3 8.5l3.2 3L13 4.5" />
                  </svg>
                </button>
                <span className="upnext__task">{t.title}</span>
                {t.due && (
                  <span className={`due${tone}`}>
                    {fmtDue(t.due)}
                    {days !== null && (
                      <span className="due__rel">
                        · {days < 0 ? `${-days}d late` : days === 0 ? "today" : `${days}d`}
                      </span>
                    )}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
