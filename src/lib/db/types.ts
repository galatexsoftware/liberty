/**
 * Hand-authored row types mirroring supabase/migrations. These describe the
 * shapes the data layer reads/writes; once live, `supabase gen types` can
 * replace this file with generated types.
 */
import type { PortfolioId, Scores } from "@/lib/game/types";

export type AgeBand = "under_18" | "adult";
export type UserRole = "player" | "staff" | "admin";
export type RunStatus = "active" | "completed" | "abandoned";
export type PointsType = "virtual" | "redeemable";
export type RedemptionStatus = "pending" | "approved" | "rejected" | "fulfilled";

export interface ProfileRow {
  id: string;
  username: string | null;
  display_name: string | null;
  age_band: AgeBand;
  role: UserRole;
  family_id: string | null;
  school_id: string | null;
  referral_code: string;
  referred_by: string | null;
  created_at: string;
}

export interface GameRunRow {
  id: string;
  user_id: string;
  seed: number;
  start_age: number;
  end_age: number;
  status: RunStatus;
  final_age: number | null;
  net_worth: number;
  scores: Scores;
  overall_score: number;
  points_earned: number;
  created_at: string;
  completed_at: string | null;
}

export interface PointsLedgerRow {
  id: string;
  user_id: string;
  delta: number;
  type: PointsType;
  reason: string;
  ref_table: string | null;
  ref_id: string | null;
  created_at: string;
}

export interface RewardRow {
  id: string;
  name: string;
  description: string | null;
  cost_points: number;
  stock: number | null;
  active: boolean;
  requires_approval: boolean;
  created_at: string;
}

export interface RewardRedemptionRow {
  id: string;
  user_id: string;
  reward_id: string;
  status: RedemptionStatus;
  points_spent: number;
  created_at: string;
  decided_by: string | null;
  decided_at: string | null;
}

export interface LeaderboardRow {
  user_id: string;
  display_name: string | null;
  username: string | null;
  school_id: string | null;
  school_name: string | null;
  family_id: string | null;
  best_score: number;
  best_net_worth: number;
  runs: number;
}

export interface PortfolioRow {
  id: PortfolioId;
  name: string;
  blurb: string;
  expected_return: number;
  volatility: number;
  downside_exposure: number;
  sort_order: number;
}
