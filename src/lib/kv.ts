import { kv } from "@vercel/kv";
import { GolferScore, StoredSnapshot, ManualOverride } from "@/types";

const KEY_SNAPSHOT = (round: number) => `masters:snapshot:r${round}`;
const KEY_OVERRIDES = "masters:overrides";

export async function saveRoundSnapshot(
  round: number,
  golfers: GolferScore[]
): Promise<boolean> {
  try {
    const snapshot: StoredSnapshot = {
      timestamp: new Date().toISOString(),
      round,
      golfers,
    };
    await kv.set(KEY_SNAPSHOT(round), JSON.stringify(snapshot));
    return true;
  } catch {
    return false;
  }
}

export async function getSnapshot(
  round: number
): Promise<StoredSnapshot | null> {
  try {
    const raw = await kv.get<string>(KEY_SNAPSHOT(round));
    if (!raw) return null;
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
}

export async function getOverrides(): Promise<ManualOverride[]> {
  try {
    const raw = await kv.get<string>(KEY_OVERRIDES);
    if (!raw) return [];
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveOverrides(
  overrides: ManualOverride[]
): Promise<boolean> {
  try {
    await kv.set(KEY_OVERRIDES, JSON.stringify(overrides));
    return true;
  } catch {
    return false;
  }
}
