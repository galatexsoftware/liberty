import type { PlayerAgeBand, PointsType } from "@/lib/game/types";

/** Under-18 players bank virtual points; adults bank redeemable points. */
export function pointsTypeFor(ageBand: PlayerAgeBand): PointsType {
  return ageBand === "adult" ? "redeemable" : "virtual";
}

export interface PointsEntry {
  delta: number;
  type: PointsType;
  reason: string;
}

export const DAILY_BASE_POINTS = 50;
export const DAILY_STREAK_BONUS = 10;
export const DAILY_MAX_STREAK = 7;

/** Points awarded for claiming the daily reward given the current streak. */
export function dailyRewardPoints(streak: number): number {
  const capped = Math.min(Math.max(streak, 1), DAILY_MAX_STREAK);
  return DAILY_BASE_POINTS + (capped - 1) * DAILY_STREAK_BONUS;
}

/** Next streak value given the days elapsed since the last claim. */
export function nextStreak(previousStreak: number, daysSinceLast: number): number {
  if (daysSinceLast <= 0) return previousStreak; // already claimed today
  if (daysSinceLast === 1) return previousStreak + 1; // consecutive day
  return 1; // streak broken
}

export const REFERRAL_REWARD_POINTS = 200;
