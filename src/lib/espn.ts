import { GolferScore, GolferStatus, TournamentInfo } from "@/types";

const ESPN_SCOREBOARD_URL =
  "https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard";

interface ESPNLinescore {
  value: number;
  displayValue: string;
  period: number;
  linescores?: Array<{ value: number }>;
}

interface ESPNCompetitor {
  id: string;
  order: number;
  score: string;
  status?: { type?: { name?: string } };
  athlete: {
    fullName: string;
    displayName: string;
    shortName: string;
    flag?: { alt?: string };
  };
  linescores?: ESPNLinescore[];
}

interface ESPNCompetition {
  id: string;
  status: {
    type: { name: string; state: string; description: string };
  };
  competitors: ESPNCompetitor[];
}

interface ESPNEvent {
  id: string;
  name: string;
  shortName: string;
  competitions: ESPNCompetition[];
}

interface ESPNResponse {
  events?: ESPNEvent[];
}

function parseScoreToPar(scoreStr: string): number {
  if (!scoreStr || scoreStr === "E") return 0;
  return parseInt(scoreStr, 10);
}

function detectThru(
  competitor: ESPNCompetitor,
  currentRound: number
): string {
  const linescores = competitor.linescores;
  if (!linescores || linescores.length === 0) return "-";

  // Find the current round's linescore
  const roundScore = linescores.find((ls) => ls.period === currentRound);
  if (!roundScore) return "-";

  // If there are hole-level linescores, count them for "thru"
  if (roundScore.linescores && roundScore.linescores.length > 0) {
    const holes = roundScore.linescores.length;
    if (holes >= 18) return "F";
    return `${holes}`;
  }

  // If round is complete (has a value), mark as finished
  if (roundScore.value > 0) return "F";

  return "-";
}

function detectCurrentRound(competition: ESPNCompetition): number {
  const desc = competition.status?.type?.description || "";
  const match = desc.match(/Round (\d)/);
  if (match) return parseInt(match[1], 10);
  // Default: check linescores of first competitor
  const first = competition.competitors?.[0];
  if (first?.linescores) return first.linescores.length || 1;
  return 1;
}

function detectTodayScore(
  competitor: ESPNCompetitor,
  currentRound: number
): string {
  const linescores = competitor.linescores;
  if (!linescores) return "-";
  const roundScore = linescores.find((ls) => ls.period === currentRound);
  if (!roundScore) return "-";
  return roundScore.displayValue || "-";
}

function detectStatus(
  competitor: ESPNCompetitor
): GolferStatus {
  const statusName = competitor.status?.type?.name;
  if (statusName === "STATUS_CUT") return "cut";
  if (statusName === "STATUS_WITHDRAWN") return "withdrawn";
  return "active";
}

export async function fetchESPNScores(): Promise<{
  tournament: TournamentInfo;
  golfers: GolferScore[];
}> {
  const res = await fetch(ESPN_SCOREBOARD_URL, {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error(`ESPN API returned ${res.status}`);
  }

  const data: ESPNResponse = await res.json();

  // Find the Masters event (or fallback to first event)
  const event = data.events?.find(
    (e) =>
      e.name?.toLowerCase().includes("masters") ||
      e.shortName?.toLowerCase().includes("masters")
  ) || data.events?.[0];

  if (!event || !event.competitions?.[0]) {
    return {
      tournament: {
        name: "The Masters 2026",
        status: "Waiting for data",
        currentRound: 1,
        lastUpdated: new Date().toISOString(),
      },
      golfers: [],
    };
  }

  const competition = event.competitions[0];
  const currentRound = detectCurrentRound(competition);

  const golfers: GolferScore[] = competition.competitors.map((comp) => {
    const scoreToPar = parseScoreToPar(comp.score);
    const status = detectStatus(comp);

    return {
      name: comp.athlete.fullName,
      position: comp.order,
      positionDisplay: status === "cut" ? "MC" : `${comp.order}`,
      scoreToPar,
      scoreToParDisplay:
        scoreToPar === 0 ? "E" : scoreToPar > 0 ? `+${scoreToPar}` : `${scoreToPar}`,
      today: detectTodayScore(comp, currentRound),
      thru: status === "cut" ? "-" : detectThru(comp, currentRound),
      currentRound,
      status,
      country: comp.athlete.flag?.alt,
    };
  });

  return {
    tournament: {
      name: event.name || "The Masters 2026",
      status: competition.status?.type?.description || "Unknown",
      currentRound,
      lastUpdated: new Date().toISOString(),
    },
    golfers,
  };
}
