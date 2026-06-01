"use client";

import { useEffect, useState } from "react";
import { Crown, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  buildLeaderboard,
  DEMO_COMPETITORS,
  type LeaderboardEntry,
} from "@/lib/leaderboard";
import { loadProgress } from "@/lib/data/local-progress";
import { cn, formatKsh } from "@/lib/utils";

export function LeaderboardView() {
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);

  useEffect(() => {
    let active = true;

    void (async () => {
      let base: LeaderboardEntry[] = DEMO_COMPETITORS;
      try {
        const res = await fetch("/api/leaderboard");
        if (res.ok) {
          const data = (await res.json()) as { entries: LeaderboardEntry[] };
          if (data.entries?.length) base = data.entries;
        }
      } catch {
        // fall back to demo competitors
      }

      // Merge in the local player's best run as "You".
      const progress = loadProgress();
      const merged = [...base];
      if (progress.bestScore > 0) {
        merged.push({
          userId: "you",
          name: "You",
          score: Math.round(progress.bestScore),
          netWorth: progress.bestNetWorth,
          isYou: true,
        });
      }

      if (active) setEntries(buildLeaderboard(merged));
    })();

    return () => {
      active = false;
    };
  }, []);

  if (!entries) {
    return (
      <Card className="text-muted flex items-center justify-center gap-2 py-10">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading leaderboard…
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry) => (
        <Card
          key={entry.userId}
          className={cn(
            "flex items-center gap-3 py-3",
            entry.isYou && "border-brand bg-brand/5",
          )}
        >
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
              entry.rank === 1 ? "bg-gold/20 text-gold" : "bg-navy/5 text-navy",
            )}
          >
            {entry.rank === 1 ? <Crown className="h-4 w-4" /> : entry.rank}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-navy truncate font-semibold">{entry.name}</p>
            <p className="text-muted text-xs">{formatKsh(entry.netWorth)}</p>
          </div>
          <span className="text-brand text-lg font-extrabold">{entry.score}</span>
        </Card>
      ))}
    </div>
  );
}
