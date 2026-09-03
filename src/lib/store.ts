/**
 * Task storage (server only).
 *   - Upstash Redis when UPSTASH_REDIS_REST_URL/TOKEN (or the Vercel KV_REST_API_* pair) are set
 *   - a JSON file in .data/ for local dev
 *   - in-memory as a last resort (serverless without a database) — flagged non-persistent
 */

import { Redis } from "@upstash/redis";
import { promises as fs } from "fs";
import path from "path";
import type { Task } from "@/data/tasks";

const KEY = "ch:tasks";

export interface Store {
  name: string;
  persistent: boolean;
  all(): Promise<Task[]>;
  get(id: string): Promise<Task | null>;
  put(task: Task): Promise<void>;
  del(id: string): Promise<void>;
}

function redisStore(url: string, token: string): Store {
  const redis = new Redis({ url, token });
  return {
    name: "upstash",
    persistent: true,
    async all() {
      const h = await redis.hgetall<Record<string, Task>>(KEY);
      return h ? Object.values(h) : [];
    },
    async get(id) {
      return (await redis.hget<Task>(KEY, id)) ?? null;
    },
    async put(task) {
      await redis.hset(KEY, { [task.id]: task });
    },
    async del(id) {
      await redis.hdel(KEY, id);
    },
  };
}

function fileStore(file: string): Store {
  const read = async (): Promise<Record<string, Task>> => {
    try {
      return JSON.parse(await fs.readFile(file, "utf8"));
    } catch {
      return {};
    }
  };
  const write = async (m: Record<string, Task>) => {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(m, null, 2));
  };
  return {
    name: "file",
    persistent: true,
    async all() {
      return Object.values(await read());
    },
    async get(id) {
      return (await read())[id] ?? null;
    },
    async put(task) {
      const m = await read();
      m[task.id] = task;
      await write(m);
    },
    async del(id) {
      const m = await read();
      delete m[id];
      await write(m);
    },
  };
}

function memoryStore(): Store {
  const m = new Map<string, Task>();
  return {
    name: "memory",
    persistent: false,
    async all() {
      return [...m.values()];
    },
    async get(id) {
      return m.get(id) ?? null;
    },
    async put(task) {
      m.set(task.id, task);
    },
    async del(id) {
      m.delete(id);
    },
  };
}

let cached: Store | null = null;

export async function getStore(): Promise<Store> {
  if (cached) return cached;

  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (url && token) {
    cached = redisStore(url, token);
    return cached;
  }

  // Local dev: JSON file. Serverless filesystems are read-only, so this
  // throws there and we fall through to memory.
  const dir = path.join(process.cwd(), ".data");
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.access(dir, fs.constants.W_OK);
    cached = fileStore(path.join(dir, "tasks.json"));
  } catch {
    cached = memoryStore();
  }
  return cached;
}
