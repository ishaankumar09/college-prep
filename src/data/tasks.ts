/**
 * Shared task types + helpers, used on both client and server.
 * The tasks themselves live in the backend store — see src/lib/store.ts.
 */

export interface Task {
  id: string;
  title: string;
  detail?: string;
  /** ISO date, YYYY-MM-DD */
  due?: string;
  /** College id from colleges.ts — renders a chip on the row. */
  college?: string;
  done: boolean;
  createdAt: number;
}

export interface TaskInput {
  title: string;
  detail?: string;
  due?: string;
  college?: string;
}

/** "Nov 1" — deterministic between server and client. */
export function fmtDue(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Whole days from today (local) until the due date. Negative = overdue. */
export function daysUntil(iso: string, now: Date = new Date()): number {
  const due = new Date(`${iso}T00:00:00`);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}

/** Undone first, then by due date (undated last), then creation order. */
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const d = (a.due ?? "9999").localeCompare(b.due ?? "9999");
    return d !== 0 ? d : a.createdAt - b.createdAt;
  });
}

export function upNext(tasks: Task[], n = 4): Task[] {
  return sortTasks(tasks)
    .filter((t) => !t.done)
    .slice(0, n);
}

export interface TaskGroup {
  key: string;
  label: string;
  tasks: Task[];
}

/** Buckets tasks by due month ("November 2026"); undated ones go in "Someday". */
export function groupByMonth(tasks: Task[]): TaskGroup[] {
  const map = new Map<string, TaskGroup>();
  for (const t of sortTasks(tasks)) {
    const key = t.due ? t.due.slice(0, 7) : "9999";
    if (!map.has(key)) {
      const label = t.due
        ? new Date(`${t.due}T12:00:00`).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        : "Someday";
      map.set(key, { key, label, tasks: [] });
    }
    map.get(key)!.tasks.push(t);
  }
  return [...map.values()].sort((a, b) => a.key.localeCompare(b.key));
}
