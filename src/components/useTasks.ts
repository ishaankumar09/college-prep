"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Task, TaskInput } from "@/data/tasks";

const PASS_KEY = "ch-pass";

/** Passcode gate. Verified server-side; remembered for this tab session. */
export function useUnlock() {
  const [passcode, setPasscode] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      setPasscode(sessionStorage.getItem(PASS_KEY));
    } catch {}
    setLoaded(true);
  }, []);

  const unlock = useCallback(async (code: string) => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (!res.ok) return false;
    setPasscode(code);
    try {
      sessionStorage.setItem(PASS_KEY, code);
    } catch {}
    return true;
  }, []);

  const lock = useCallback(() => {
    setPasscode(null);
    try {
      sessionStorage.removeItem(PASS_KEY);
    } catch {}
  }, []);

  return { unlocked: passcode !== null, passcode, unlock, lock, loaded };
}

/** Tasks from the backend. Writes need the passcode; a 401 calls onUnauthorized. */
export function useTasks(passcode: string | null, onUnauthorized?: () => void) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [persistent, setPersistent] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unauthRef = useRef(onUnauthorized);
  unauthRef.current = onUnauthorized;

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/tasks", { cache: "no-store" });
      if (!r.ok) throw new Error();
      const j = await r.json();
      setTasks(j.tasks);
      setPersistent(j.persistent);
      setConfigured(j.configured !== false);
      setError(null);
    } catch {
      setError("could not reach the task server");
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [refresh]);

  const send = useCallback(
    async (url: string, method: string, body?: unknown) => {
      const r = await fetch(url, {
        method,
        headers: {
          "content-type": "application/json",
          "x-passcode": passcode ?? "",
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      if (r.status === 401) {
        setError("passcode rejected — unlock again");
        unauthRef.current?.();
        return null;
      }
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setError(j.error ?? "request failed");
        return null;
      }
      setError(null);
      return r;
    },
    [passcode]
  );

  const add = useCallback(
    async (input: TaskInput) => {
      const r = await send("/api/tasks", "POST", input);
      if (!r) return false;
      const { task } = await r.json();
      setTasks((p) => [...p, task]);
      return true;
    },
    [send]
  );

  const toggle = useCallback(
    async (id: string) => {
      const cur = tasks.find((t) => t.id === id);
      if (!cur) return;
      const done = !cur.done;
      setTasks((p) => p.map((t) => (t.id === id ? { ...t, done } : t)));
      const r = await send(`/api/tasks/${id}`, "PATCH", { done });
      if (!r) {
        setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: cur.done } : t)));
      }
    },
    [send, tasks]
  );

  const remove = useCallback(
    async (id: string) => {
      const prev = tasks;
      setTasks((p) => p.filter((t) => t.id !== id));
      const r = await send(`/api/tasks/${id}`, "DELETE");
      if (!r) setTasks(prev);
    },
    [send, tasks]
  );

  return { tasks, loaded, persistent, configured, error, add, toggle, remove, refresh };
}
