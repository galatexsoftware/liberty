import type { GameState, ScoreKey } from "@/lib/game/types";
import { netWorth } from "@/lib/game/engine";

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  /** lucide-react icon name (resolved in the UI). */
  icon: string;
  points: number;
}

/** Mirrors supabase/seed.sql `achievements`. Keep the two in sync. */
export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first-year",
    name: "First Steps",
    description: "Complete your first year of life.",
    icon: "sparkles",
    points: 50,
  },
  {
    id: "decade",
    name: "Decade Done",
    description: "Play through 10 years.",
    icon: "calendar",
    points: 100,
  },
  {
    id: "finisher",
    name: "Lifetime Achiever",
    description: "Reach age 65 and finish a full life.",
    icon: "flag",
    points: 300,
  },
  {
    id: "first-invest",
    name: "Investor",
    description: "Put money into a LifeVest portfolio.",
    icon: "trending-up",
    points: 75,
  },
  {
    id: "protected",
    name: "Well Protected",
    description: "Reach a Protection score of 60+.",
    icon: "shield",
    points: 100,
  },
  {
    id: "scholar",
    name: "Money Scholar",
    description: "Reach a Knowledge score of 70+.",
    icon: "graduation-cap",
    points: 100,
  },
  {
    id: "millionaire",
    name: "Millionaire",
    description: "Grow your net worth past KShs 1,000,000.",
    icon: "gem",
    points: 200,
  },
  {
    id: "balanced-life",
    name: "Balanced Life",
    description: "Finish with every score above 50.",
    icon: "scale",
    points: 250,
  },
];

export const ACHIEVEMENTS_BY_ID: Record<string, AchievementDef> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a]),
);

const SCORE_KEYS: ScoreKey[] = ["wealth", "knowledge", "protection", "happiness"];

/**
 * Pure evaluation of which achievements a game state satisfies. Server and
 * client share this so the displayed unlocks match what the server records.
 */
export function evaluateAchievements(state: GameState): string[] {
  const unlocked: string[] = [];
  const years = state.history.length;
  const invested =
    state.investmentValue > 0 || state.history.some((h) => h.allocation.invest > 0);
  const nw = netWorth(state);

  if (years >= 1) unlocked.push("first-year");
  if (years >= 10) unlocked.push("decade");
  if (state.status === "completed") unlocked.push("finisher");
  if (invested) unlocked.push("first-invest");
  if (state.scores.protection >= 60) unlocked.push("protected");
  if (state.scores.knowledge >= 70) unlocked.push("scholar");
  if (nw >= 1_000_000) unlocked.push("millionaire");
  if (SCORE_KEYS.every((k) => state.scores[k] > 50)) unlocked.push("balanced-life");

  return unlocked;
}

/** Total achievement bonus points for a set of unlocked ids. */
export function achievementPoints(ids: readonly string[]): number {
  return ids.reduce((sum, id) => sum + (ACHIEVEMENTS_BY_ID[id]?.points ?? 0), 0);
}
