export interface LeaderboardEntry {
  userId: string;
  name: string;
  score: number;
  netWorth: number;
  /** Filled in by `buildLeaderboard`. */
  rank?: number;
  isYou?: boolean;
}

/** Demo competitors so the leaderboard is lively before real users exist. */
export const DEMO_COMPETITORS: LeaderboardEntry[] = [
  { userId: "demo-1", name: "Amani W.", score: 87, netWorth: 4_200_000 },
  { userId: "demo-2", name: "Brian O.", score: 81, netWorth: 3_350_000 },
  { userId: "demo-3", name: "Cynthia K.", score: 76, netWorth: 2_700_000 },
  { userId: "demo-4", name: "David M.", score: 68, netWorth: 1_900_000 },
  { userId: "demo-5", name: "Esther N.", score: 61, netWorth: 1_250_000 },
  { userId: "demo-6", name: "Faraji L.", score: 54, netWorth: 820_000 },
];

/**
 * Sort entries by score (net worth as tiebreaker), assign 1-based ranks.
 * Pure so it can be unit-tested and reused on server or client.
 */
export function buildLeaderboard(
  entries: readonly LeaderboardEntry[],
): LeaderboardEntry[] {
  return [...entries]
    .sort((a, b) => b.score - a.score || b.netWorth - a.netWorth)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
}
