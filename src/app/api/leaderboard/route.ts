import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEMO_COMPETITORS, type LeaderboardEntry } from "@/lib/leaderboard";
import type { LeaderboardRow } from "@/lib/db/types";

/**
 * Returns leaderboard entries. Uses the Supabase `leaderboard` view when a
 * service-role key is configured; otherwise serves demo competitors so the
 * board is never empty in demo mode.
 */
export async function GET() {
  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ entries: DEMO_COMPETITORS, demo: true });
  }

  const { data, error } = await admin
    .from("leaderboard")
    .select("*")
    .order("best_score", { ascending: false })
    .limit(50);

  if (error || !data) {
    return NextResponse.json({ entries: DEMO_COMPETITORS, demo: true });
  }

  const entries: LeaderboardEntry[] = (data as LeaderboardRow[]).map((row) => ({
    userId: row.user_id,
    name: row.display_name || row.username || "Player",
    score: row.best_score,
    netWorth: row.best_net_worth,
  }));

  return NextResponse.json({ entries, demo: false });
}
