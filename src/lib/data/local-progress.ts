"use client";

import type { GameState, PlayerAgeBand } from "@/lib/game/types";
import { netWorth, overallScore } from "@/lib/game/engine";
import { achievementPoints, evaluateAchievements } from "@/lib/achievements";
import { dailyRewardPoints, nextStreak, pointsTypeFor } from "@/lib/points";

/**
 * Demo-mode progress store (localStorage). When Supabase is configured this is
 * replaced by server-authoritative reads/writes; the shapes intentionally match
 * the `points_ledger` / `user_achievements` / `daily_claims` tables.
 */
export interface LocalProgress {
  pointsVirtual: number;
  pointsRedeemable: number;
  achievements: string[];
  bestScore: number;
  bestNetWorth: number;
  lastClaimDate: string | null;
  streak: number;
}

const KEY = "lifevest-quest:progress";

const EMPTY: LocalProgress = {
  pointsVirtual: 0,
  pointsRedeemable: 0,
  achievements: [],
  bestScore: 0,
  bestNetWorth: 0,
  lastClaimDate: null,
  streak: 0,
};

export function loadProgress(): LocalProgress {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<LocalProgress>) };
  } catch {
    return { ...EMPTY };
  }
}

export function saveProgress(progress: LocalProgress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(progress));
}

export interface RunRecorded {
  newAchievements: string[];
  pointsAdded: number;
}

/** Record a completed run: bank points, unlock achievements, track best score. */
export function recordRun(state: GameState): RunRecorded {
  const progress = loadProgress();
  const unlocked = evaluateAchievements(state);
  const newAchievements = unlocked.filter((id) => !progress.achievements.includes(id));

  const runPoints = Math.max(0, Math.round(state.points));
  const bonus = achievementPoints(newAchievements);
  const pointsAdded = runPoints + bonus;

  const bucket = pointsTypeFor(state.playerAgeBand);
  if (bucket === "redeemable") progress.pointsRedeemable += pointsAdded;
  else progress.pointsVirtual += pointsAdded;

  progress.achievements = [...progress.achievements, ...newAchievements];
  progress.bestScore = Math.max(progress.bestScore, overallScore(state));
  progress.bestNetWorth = Math.max(progress.bestNetWorth, netWorth(state));

  saveProgress(progress);
  return { newAchievements, pointsAdded };
}

function daysBetween(a: string, b: string): number {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(ms / 86_400_000);
}

export interface DailyClaim {
  claimed: boolean;
  points: number;
  streak: number;
  alreadyClaimedToday: boolean;
}

/** Claim today's daily reward (idempotent per calendar day). */
export function claimDaily(
  ageBand: PlayerAgeBand,
  today = new Date().toISOString().slice(0, 10),
): DailyClaim {
  const progress = loadProgress();
  const last = progress.lastClaimDate;
  const elapsed = last ? daysBetween(last, today) : Infinity;

  if (last && elapsed <= 0) {
    return {
      claimed: false,
      points: 0,
      streak: progress.streak,
      alreadyClaimedToday: true,
    };
  }

  const streak = last ? nextStreak(progress.streak, elapsed) : 1;
  const points = dailyRewardPoints(streak);
  if (pointsTypeFor(ageBand) === "redeemable") progress.pointsRedeemable += points;
  else progress.pointsVirtual += points;
  progress.streak = streak;
  progress.lastClaimDate = today;
  saveProgress(progress);

  return { claimed: true, points, streak, alreadyClaimedToday: false };
}
