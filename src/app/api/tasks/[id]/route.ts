import { NextResponse } from "next/server";
import { authorized } from "@/lib/auth";
import { getStore } from "@/lib/store";
import { cleanTaskInput } from "@/lib/validate";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** Partial update (done flag, title, due, …) — needs the x-passcode header. */
export async function PATCH(req: Request, { params }: Ctx) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "locked" }, { status: 401 });
  }
  const { id } = await params;
  const store = await getStore();
  const existing = await store.get(id);
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const parsed = cleanTaskInput(await req.json().catch(() => null), true);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const task = { ...existing, ...parsed.value };
  await store.put(task);
  return NextResponse.json({ task });
}

export async function DELETE(req: Request, { params }: Ctx) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "locked" }, { status: 401 });
  }
  const { id } = await params;
  const store = await getStore();
  await store.del(id);
  return NextResponse.json({ ok: true });
}
