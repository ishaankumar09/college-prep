import { COLLEGES } from "@/data/colleges";
import type { TaskInput } from "@/data/tasks";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export type TaskPatch = Partial<TaskInput> & { done?: boolean };

type Result = { ok: true; value: TaskPatch } | { ok: false; error: string };

/** Validates + trims a create (partial=false) or update (partial=true) body. */
export function cleanTaskInput(body: unknown, partial = false): Result {
  if (!body || typeof body !== "object") return { ok: false, error: "bad body" };
  const b = body as Record<string, unknown>;
  const out: TaskPatch = {};

  if ("title" in b || !partial) {
    const title = typeof b.title === "string" ? b.title.trim() : "";
    if (!title) return { ok: false, error: "title required" };
    if (title.length > 200) return { ok: false, error: "title too long" };
    out.title = title;
  }
  if ("detail" in b) {
    if (b.detail != null && typeof b.detail !== "string") return { ok: false, error: "bad detail" };
    const d = ((b.detail as string | null) ?? "").trim();
    if (d.length > 500) return { ok: false, error: "detail too long" };
    out.detail = d || undefined;
  }
  if ("due" in b) {
    const d = b.due;
    if (d && (typeof d !== "string" || !DATE.test(d))) return { ok: false, error: "bad date" };
    out.due = d ? (d as string) : undefined;
  }
  if ("college" in b) {
    const c = b.college;
    if (c && (typeof c !== "string" || !COLLEGES.some((x) => x.id === c)))
      return { ok: false, error: "unknown college" };
    out.college = c ? (c as string) : undefined;
  }
  if ("done" in b) {
    if (typeof b.done !== "boolean") return { ok: false, error: "bad done flag" };
    out.done = b.done;
  }
  return { ok: true, value: out };
}
