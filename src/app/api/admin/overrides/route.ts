import { NextRequest, NextResponse } from "next/server";
import { ManualOverride } from "@/types";
import { saveOverrides } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    return NextResponse.json(
      { error: "Admin endpoint not configured" },
      { status: 503 }
    );
  }

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (token !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { overrides?: ManualOverride[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(body.overrides)) {
    return NextResponse.json(
      { error: "Body must contain an overrides array" },
      { status: 400 }
    );
  }

  const saved = await saveOverrides(body.overrides);
  if (!saved) {
    return NextResponse.json(
      { error: "Failed to save overrides — KV may be unavailable" },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, count: body.overrides.length });
}
