import { NextResponse } from "next/server";
import https from "https";
import { GolferScore, ManualOverride } from "@/types";
import { saveRoundSnapshot, getSnapshot, getOverrides } from "@/lib/kv";
import { detectMissingGolfers, mergeGolfers } from "@/lib/cut-detection";

export const dynamic = "force-dynamic";
export const maxDuration = 10;

// Server-side cache: avoid hitting ESPN on every client poll
let cachedResponse: ReturnType<typeof NextResponse.json> | null = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 30_000;

const ESPN_URL =
  "https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard";

function fetchJSON(url: string): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timeout")), 8000);
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk: string) => (data += chunk));
        res.on("end", () => {
          clearTimeout(timer);
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error("Invalid JSON"));
          }
        });
      })
      .on("error", (e) => {
        clearTimeout(timer);
        reject(e);
      });
  });
}

/**
 * Parse manual overrides from the SCORE_OVERRIDES env var (JSON array fallback).
 */
function getEnvOverrides(): ManualOverride[] {
  const raw = process.env.SCORE_OVERRIDES;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET() {
  if (cachedResponse && Date.now() < cacheExpiry) {
    return cachedResponse;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any = await fetchJSON(ESPN_URL);

    const event =
      raw.events?.find(
        (e: { name?: string }) =>
          e.name?.toLowerCase().includes("masters")
      ) || raw.events?.[0];

    if (!event?.competitions?.[0]) {
      return NextResponse.json({
        tournament: {
          name: "The Masters 2026",
          status: "No event data",
          currentRound: 1,
          lastUpdated: new Date().toISOString(),
        },
        golfers: [],
      });
    }

    const comp = event.competitions[0];
    const statusDesc = comp.status?.type?.description || "Unknown";
    const roundMatch = statusDesc.match(/Round (\d)/);
    const currentRound = roundMatch ? parseInt(roundMatch[1], 10) : 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const golfers: GolferScore[] = comp.competitors.map((c: any) => {
      const scoreStr = c.score || "E";
      const scoreToPar =
        scoreStr === "E" ? 0 : parseInt(scoreStr, 10) || 0;

      // Detect thru
      let thru = "-";
      if (c.linescores) {
        const roundScore = c.linescores.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (ls: any) => ls.period === currentRound
        );
        if (roundScore?.linescores?.length) {
          const holes = roundScore.linescores.length;
          thru = holes >= 18 ? "F" : `${holes}`;
        } else if (roundScore?.value > 0) {
          thru = "F";
        }
      }

      // Detect today's score
      let today = "-";
      if (c.linescores) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const roundScore = c.linescores.find((ls: any) => ls.period === currentRound);
        if (roundScore?.displayValue) {
          today = roundScore.displayValue;
        }
      }

      const isCut = c.status?.type?.name === "STATUS_CUT";
      const isWD = c.status?.type?.name === "STATUS_WITHDRAWN";

      return {
        name: c.athlete.fullName,
        position: c.order,
        positionDisplay: isCut ? "MC" : `${c.order}`,
        scoreToPar,
        scoreToParDisplay:
          scoreToPar === 0
            ? "E"
            : scoreToPar > 0
            ? `+${scoreToPar}`
            : `${scoreToPar}`,
        today,
        thru: isCut || isWD ? "-" : thru,
        currentRound,
        status: isCut ? "cut" : isWD ? "withdrawn" : "active",
        country: c.athlete.flag?.alt || "",
      };
    });

    // Always snapshot current golfers (aggressive snapshotting from R1 onwards)
    if (currentRound >= 1) {
      await saveRoundSnapshot(currentRound, golfers);
    }

    // After R2, merge in any golfers that ESPN has dropped (cut golfers)
    let finalGolfers = golfers;
    if (currentRound > 2) {
      const r2Snapshot = await getSnapshot(2);
      if (r2Snapshot) {
        const missing = detectMissingGolfers(golfers, r2Snapshot);
        if (missing.length > 0) {
          // Fetch KV overrides and merge with env overrides
          const kvOverrides = await getOverrides();
          const envOverrides = getEnvOverrides();
          // KV overrides take precedence over env overrides
          const overrideNames = new Set(kvOverrides.map((o) => o.name.toLowerCase()));
          const mergedOverrides = [
            ...kvOverrides,
            ...envOverrides.filter((o) => !overrideNames.has(o.name.toLowerCase())),
          ];
          finalGolfers = mergeGolfers(golfers, missing, mergedOverrides);
        }
      }
    }

    // Apply overrides even if no cut merge was needed (e.g. score corrections in R1-R2)
    if (currentRound <= 2) {
      const kvOverrides = await getOverrides();
      const envOverrides = getEnvOverrides();
      const overrideNames = new Set(kvOverrides.map((o) => o.name.toLowerCase()));
      const mergedOverrides = [
        ...kvOverrides,
        ...envOverrides.filter((o) => !overrideNames.has(o.name.toLowerCase())),
      ];
      if (mergedOverrides.length > 0) {
        finalGolfers = mergeGolfers(finalGolfers, [], mergedOverrides);
      }
    }

    const response = NextResponse.json(
      {
        tournament: {
          name: event.name || "The Masters 2026",
          status: statusDesc,
          currentRound,
          lastUpdated: new Date().toISOString(),
        },
        golfers: finalGolfers,
      },
      {
        headers: {
          "Cache-Control": "s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
    cachedResponse = response;
    cacheExpiry = Date.now() + CACHE_TTL_MS;
    return response;
  } catch (error) {
    console.error("ESPN fetch error:", error);
    return NextResponse.json({
      tournament: {
        name: "The Masters 2026",
        status: "Error loading scores - retrying...",
        currentRound: 1,
        lastUpdated: new Date().toISOString(),
      },
      golfers: [],
    });
  }
}
