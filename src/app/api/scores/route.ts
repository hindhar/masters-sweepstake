import { fetchESPNScores } from "@/lib/espn";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export async function GET() {
  try {
    const data = await fetchESPNScores();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Failed to fetch ESPN scores:", error);
    return NextResponse.json(
      {
        tournament: {
          name: "The Masters 2026",
          status: "Error fetching scores",
          currentRound: 1,
          lastUpdated: new Date().toISOString(),
        },
        golfers: [],
      },
      { status: 200 } // Return 200 with empty data so UI degrades gracefully
    );
  }
}
