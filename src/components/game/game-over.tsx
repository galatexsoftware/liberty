"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Award,
  Calendar,
  Flag,
  Gem,
  GraduationCap,
  type LucideIcon,
  RotateCcw,
  Scale,
  Shield,
  Sparkles,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreBars } from "./score-bar";
import { netWorth, overallScore } from "@/lib/game/engine";
import type { GameState } from "@/lib/game/types";
import { formatKsh } from "@/lib/utils";
import { ACHIEVEMENTS_BY_ID } from "@/lib/achievements";
import { recordRun, type RunRecorded } from "@/lib/data/local-progress";

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  calendar: Calendar,
  flag: Flag,
  "trending-up": TrendingUp,
  shield: Shield,
  "graduation-cap": GraduationCap,
  gem: Gem,
  scale: Scale,
};

export function GameOver({
  state,
  onRestart,
}: {
  state: GameState;
  onRestart: () => void;
}) {
  const score = overallScore(state);
  const pointsLabel =
    state.playerAgeBand === "adult" ? "redeemable points" : "virtual points";

  const [recorded, setRecorded] = useState<RunRecorded | null>(null);
  const saved = useRef(false);

  // Bank points + unlock achievements exactly once for this completed run.
  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    setRecorded(recordRun(state));
  }, [state]);

  const newAchievements = recorded?.newAchievements ?? [];

  return (
    <Card className="flex flex-col gap-5 text-center">
      <div className="bg-liberty-gradient -m-5 mb-0 rounded-t-2xl px-5 py-8 text-white">
        <Award className="text-gold mx-auto h-10 w-10" />
        <h2 className="mt-2 text-2xl font-extrabold">Life complete!</h2>
        <p className="mt-1 text-sm text-white/85">
          You reached age {state.age - 1} with a life score of
        </p>
        <p className="text-gold text-5xl font-extrabold">{score}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-left">
        <div className="bg-navy/5 rounded-xl p-3">
          <p className="text-muted text-xs font-semibold uppercase">Net worth</p>
          <p className="text-navy text-lg font-bold">{formatKsh(netWorth(state))}</p>
        </div>
        <div className="bg-navy/5 rounded-xl p-3">
          <p className="text-muted text-xs font-semibold uppercase">LifeVest fund</p>
          <p className="text-navy text-lg font-bold">
            {formatKsh(state.investmentValue)}
          </p>
        </div>
      </div>

      <div className="bg-gold/10 rounded-xl p-3">
        <p className="text-navy text-sm">
          You banked{" "}
          <span className="font-extrabold">{recorded?.pointsAdded ?? state.points}</span>{" "}
          {pointsLabel}
          {newAchievements.length > 0 && <> (incl. achievement bonuses)</>}.
        </p>
      </div>

      {newAchievements.length > 0 && (
        <div className="text-left">
          <h3 className="text-navy mb-2 flex items-center gap-1.5 text-sm font-bold">
            <Trophy className="text-gold h-4 w-4" /> Achievements unlocked
          </h3>
          <div className="flex flex-col gap-2">
            {newAchievements.map((id) => {
              const a = ACHIEVEMENTS_BY_ID[id];
              if (!a) return null;
              const Icon = ICONS[a.icon] ?? Sparkles;
              return (
                <div
                  key={id}
                  className="border-gold/40 bg-gold/5 flex items-center gap-3 rounded-xl border p-2.5"
                >
                  <span className="bg-gold/20 text-gold flex h-9 w-9 items-center justify-center rounded-lg">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-navy text-sm font-bold">{a.name}</p>
                    <p className="text-muted truncate text-xs">{a.description}</p>
                  </div>
                  <span className="text-gold text-xs font-bold">+{a.points}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ScoreBars scores={state.scores} />

      <div className="flex flex-col gap-2">
        <Button size="lg" variant="navy" onClick={onRestart}>
          <RotateCcw className="h-4 w-4" /> Play again
        </Button>
        <Button asChild variant="ghost" size="md">
          <Link href="/leaderboard">View leaderboard</Link>
        </Button>
      </div>
    </Card>
  );
}
