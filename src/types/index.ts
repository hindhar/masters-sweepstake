export type GroupId = 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'G6' | 'G7' | 'G8';

export interface ParticipantPicks {
  id: string;
  name: string;
  picks: Record<GroupId, string>;
}

export type GolferStatus = 'active' | 'finished' | 'cut' | 'withdrawn';

export interface GolferScore {
  name: string;
  position: number;
  positionDisplay: string;
  scoreToPar: number;
  scoreToParDisplay: string;
  today: string;
  thru: string;
  currentRound: number;
  status: GolferStatus;
  country?: string;
}

export interface ParticipantGolferScore {
  group: GroupId;
  golferName: string;
  score: GolferScore | null;
  counting?: boolean; // true if this golfer is in the best 4 counting towards total
}

export interface ParticipantEntry {
  participant: ParticipantPicks;
  totalScore: number;
  totalScoreDisplay: string;
  position: number;
  positionDisplay: string;
  previousPosition?: number;
  movement: number;
  golferScores: ParticipantGolferScore[];
  bestGolfer: { name: string; score: number } | null;
  worstGolfer: { name: string; score: number } | null;
}

export interface TournamentInfo {
  name: string;
  status: string;
  currentRound: number;
  lastUpdated: string;
  roundComplete?: boolean;
  tournamentState?: TournamentState;
}

export type TournamentState =
  | "pre"
  | "r1_live"
  | "r1_complete"
  | "r2_live"
  | "r2_complete"
  | "r3_live"
  | "r3_complete"
  | "r4_live"
  | "final";

export interface StoredSnapshot {
  timestamp: string;
  round: number;
  golfers: GolferScore[];
}

export interface ManualOverride {
  name: string;
  scoreToPar: number;
  status: GolferStatus;
  reason: string;
}

export interface LeaderboardAPIResponse {
  tournament: TournamentInfo;
  golfers: GolferScore[];
}

export interface GolferInfo {
  name: string;
  group: GroupId;
  owgr?: number;
}

export interface FunStats {
  bestPick: { participant: string; golfer: string; score: number } | null;
  worstPick: { participant: string; golfer: string; score: number } | null;
  biggestMover: { participant: string; positions: number } | null;
  tightestRace: { count: number; scoreDiff: number } | null;
  mostPopularGolfer: { name: string; pickedBy: number; score: number } | null;
  contrarianHero: { participant: string; golfer: string; pickedBy: number; score: number } | null;
}
