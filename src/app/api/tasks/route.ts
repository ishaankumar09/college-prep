import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { authorized, passcodeConfigured } from "@/lib/auth";
import { getStore } from "@/lib/store";
import { cleanTaskInput } from "@/lib/validate";
import type { Task } from "@/data/tasks";

export const dynamic = "force-dynamic";

/** Public read. */
export async function GET() {
  const store = await getStore();
  const tasks = await store.all();
  return NextResponse.json({
    tasks,
    persistent: store.persistent,
    backend: store.name,
    configured: passcodeConfigured(),
  });
}

/** Create — needs the x-passcode header. */
export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "locked" }, { status: 401 });
  }
  const parsed = cleanTaskInput(await req.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const task: Task = {
    id: randomUUID(),
    title: parsed.value.title!,
    detail: parsed.value.detail,
    due: parsed.value.due,
    college: parsed.value.college,
    done: false,
    createdAt: Date.now(),
  };
  const store = await getStore();
  await store.put(task);
  return NextResponse.json({ task }, { status: 201 });
}
