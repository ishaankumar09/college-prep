"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ACTIVE, COLLEGES } from "@/data/colleges";
import {
  daysUntil,
  fmtDue,
  groupByMonth,
  type Task,
  type TaskInput,
} from "@/data/tasks";
import { useTasks, useUnlock } from "./useTasks";

function collegeName(id?: string) {
  return id ? COLLEGES.find((c) => c.id === id)?.name : undefined;
}

export function DueChip({ task }: { task: Task }) {
  if (!task.due) return null;
  const days = daysUntil(task.due);
  let tone = "";
  let rel = `${days}d`;
  if (task.done) {
    rel = "";
  } else if (days < 0) {
    tone = " due--over";
    rel = `${-days}d late`;
  } else if (days === 0) {
    tone = " due--soon";
    rel = "today";
  } else if (days <= 7) {
    tone = " due--soon";
  }
  return (
    <span className={`due${tone}`}>
      {fmtDue(task.due)}
      {rel && <span className="due__rel">· {rel}</span>}
    </span>
  );
}

export function UnlockModal({
  onUnlock,
  onClose,
}: {
  onUnlock: (code: string) => Promise<boolean>;
  onClose: () => void;
}) {
  const [code, setCode] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const ok = await onUnlock(code);
    setBusy(false);
    if (ok) {
      onClose();
      return;
    }
    setError(true);
    setShake(true);
    setCode("");
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="modal" onClick={onClose}>
      <form
        className={`lock__card${shake ? " lock__card--shake" : ""}`}
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="hero__overline">edit access</p>
        <h2 className="lock__title">
          Who goes <em>there</em>?
        </h2>
        <p className="lock__sub">Passcode to add, check off, or delete tasks.</p>
        <input
          className="lock__input"
          type="password"
          autoFocus
          autoComplete="off"
          placeholder="passcode"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
        />
        <button className="btn btn--solid lock__btn" type="submit" disabled={busy}>
          {busy ? "checking…" : "unlock"}
        </button>
        <div className="lock__error" aria-live="polite">
          {error ? "nope." : " "}
        </div>
        <button type="button" className="lock__close" onClick={onClose}>
          never mind
        </button>
      </form>
    </div>
  );
}

function AddTask({ onAdd }: { onAdd: (t: TaskInput) => Promise<boolean> }) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [due, setDue] = useState("");
  const [college, setCollege] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || busy) return;
    setBusy(true);
    const ok = await onAdd({
      title,
      detail: detail || undefined,
      due: due || undefined,
      college: college || undefined,
    });
    setBusy(false);
    if (ok) {
      setTitle("");
      setDetail("");
      setDue("");
      setCollege("");
    }
  };

  return (
    <form className="add" onSubmit={submit}>
      <input
        className="input add__title"
        placeholder="What needs doing?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={200}
      />
      <div className="add__row">
        <input
          className="input"
          placeholder="note (optional)"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          maxLength={500}
        />
        <input
          className="input"
          type="date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
          aria-label="Due date"
        />
        <select
          className="input"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          aria-label="School"
        >
          <option value="">no school</option>
          {ACTIVE.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          className="btn btn--solid"
          type="submit"
          disabled={busy || !title.trim()}
        >
          + add
        </button>
      </div>
    </form>
  );
}

export default function ChecklistClient() {
  const { unlocked, passcode, unlock, lock, loaded: authLoaded } = useUnlock();
  const [modal, setModal] = useState(false);
  const { tasks, loaded, persistent, configured, error, add, toggle, remove } = useTasks(
    passcode,
    () => {
      lock();
      setModal(true);
    }
  );

  const total = tasks.length;
  const finished = tasks.filter((t) => t.done).length;
  const pctDone = total ? Math.round((finished / total) * 100) : 0;
  const groups = groupByMonth(tasks);
  const requireUnlock = () => setModal(true);
  const onTap = (id: string) => (unlocked ? toggle(id) : requireUnlock());

  return (
    <div className="page">
      <div className="checklist__head">
        <div>
          <p className="hero__overline">
            {!authLoaded ? " " : unlocked ? "unlocked · editing" : "read only · locked"}
          </p>
          <h1>
            The <em>Lock-In</em> List.
          </h1>
          <p className="page__sub">
            {!loaded
              ? "loading…"
              : total === 0
                ? "Nothing here yet."
                : finished === total
                  ? "Everything's done. Go touch grass."
                  : `${finished} of ${total} done. ${total - finished} to go.`}
          </p>
        </div>
        {authLoaded &&
          configured &&
          (unlocked ? (
            <button className="btn checklist__lock" onClick={lock} title="Lock editing">
              🔒 lock
            </button>
          ) : (
            <button className="btn btn--solid checklist__lock" onClick={requireUnlock}>
              🔓 unlock to edit
            </button>
          ))}
      </div>

      {loaded && !persistent && (
        <div className="banner">
          No database connected — tasks will vanish when the server restarts. Add
          the Upstash env vars (see .env.example) and redeploy.
        </div>
      )}
      {loaded && !configured && (
        <div className="banner banner--err">
          Editing is disabled: no CHECKLIST_PASSCODE is set in the environment. Add it
          to .env.local (or the host env settings) and restart.
        </div>
      )}
      {error && <div className="banner banner--err">{error}</div>}

      {total > 0 && (
        <div
          className="progress"
          role="progressbar"
          aria-valuenow={pctDone}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="progress__bar" style={{ width: `${pctDone}%` }} />
          <span className="progress__label">{pctDone}%</span>
        </div>
      )}

      {unlocked && <AddTask onAdd={add} />}

      {loaded && total === 0 && (
        <div className="empty">
          {unlocked
            ? "Add your first task above."
            : configured
              ? "Unlock to add the first task."
              : "Set a passcode to start adding tasks."}
        </div>
      )}

      {groups.map((g) => {
        const groupDone = g.tasks.filter((t) => t.done).length;
        return (
          <section className="tgroup" key={g.key}>
            <div className="tgroup__head">
              <span className="tgroup__title">{g.label}</span>
              <span className="tgroup__count">
                {groupDone}/{g.tasks.length}
              </span>
            </div>
            <ul className="tlist">
              <AnimatePresence initial={false}>
                {g.tasks.map((t) => {
                  const school = collegeName(t.college);
                  return (
                    <motion.li
                      key={t.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className={`task${t.done ? " task--done" : ""}`}
                    >
                      <button
                        className="check"
                        role="checkbox"
                        aria-checked={t.done}
                        aria-label={t.title}
                        onClick={() => onTap(t.id)}
                      >
                        <svg viewBox="0 0 16 16">
                          <path d="M3 8.5l3.2 3L13 4.5" />
                        </svg>
                      </button>
                      <div className="task__body" onClick={() => onTap(t.id)}>
                        <div className="task__title">{t.title}</div>
                        {t.detail && <div className="task__detail">{t.detail}</div>}
                      </div>
                      <div className="task__meta">
                        {school && <span className="tag">{school}</span>}
                        <DueChip task={t} />
                        {unlocked && (
                          <button
                            className="task__del"
                            aria-label={`Delete ${t.title}`}
                            title="Delete"
                            onClick={() => remove(t.id)}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </section>
        );
      })}

      {modal && <UnlockModal onUnlock={unlock} onClose={() => setModal(false)} />}
    </div>
  );
}
