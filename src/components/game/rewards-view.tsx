"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Gift, Sparkles, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  claimDaily,
  loadProgress,
  saveProgress,
  type LocalProgress,
} from "@/lib/data/local-progress";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { REWARD_CATALOGUE } from "@/lib/rewards";
import type { PlayerAgeBand } from "@/lib/game/types";

const today = () => new Date().toISOString().slice(0, 10);

export function RewardsView() {
  const [progress, setProgress] = useState<LocalProgress | null>(null);
  const [ageBand, setAgeBand] = useState<PlayerAgeBand>("under_18");
  const [requested, setRequested] = useState<string[]>([]);
  const [claimMsg, setClaimMsg] = useState<string | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!progress) {
    return <Card className="text-muted py-10 text-center">Loading…</Card>;
  }

  const claimedToday = progress.lastClaimDate === today();

  const onClaim = () => {
    const result = claimDaily(ageBand);
    setProgress(loadProgress());
    setClaimMsg(
      result.alreadyClaimedToday
        ? "Already claimed today — come back tomorrow!"
        : `+${result.points} points · ${result.streak}-day streak 🔥`,
    );
  };

  const onRedeem = (id: string, cost: number) => {
    if (progress.pointsRedeemable < cost) return;
    const updated: LocalProgress = {
      ...progress,
      pointsRedeemable: progress.pointsRedeemable - cost,
    };
    saveProgress(updated);
    setProgress(updated);
    setRequested((r) => [...r, id]);
  };

  const unlocked = progress.achievements.length;

  return (
    <div className="flex flex-col gap-5">
      {/* Points balance */}
      <Card className="bg-navy text-white">
        <p className="text-xs font-semibold text-white/70 uppercase">Your points</p>
        <div className="mt-1 flex items-end gap-6">
          <div>
            <p className="text-gold text-3xl font-extrabold">
              {progress.pointsRedeemable}
            </p>
            <p className="text-xs text-white/70">redeemable</p>
          </div>
          <div>
            <p className="text-teal text-3xl font-extrabold">{progress.pointsVirtual}</p>
            <p className="text-xs text-white/70">virtual</p>
          </div>
        </div>
      </Card>

      {/* Daily reward */}
      <Card className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Gift className="text-coral h-5 w-5" />
          <h2 className="text-navy font-bold">Daily reward</h2>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted">I am:</span>
          <div className="border-border flex overflow-hidden rounded-lg border">
            {(["under_18", "adult"] as PlayerAgeBand[]).map((band) => (
              <button
                key={band}
                onClick={() => setAgeBand(band)}
                className={`px-3 py-1 text-xs font-semibold ${
                  ageBand === band ? "bg-brand text-white" : "text-navy bg-white"
                }`}
              >
                {band === "under_18" ? "Under 18" : "Adult"}
              </button>
            ))}
          </div>
        </div>
        <Button onClick={onClaim} disabled={claimedToday} variant="gold">
          <Sparkles className="h-4 w-4" />
          {claimedToday ? "Claimed today" : "Claim daily reward"}
        </Button>
        {claimMsg && <p className="text-navy text-center text-sm">{claimMsg}</p>}
      </Card>

      {/* Achievements progress */}
      <Card className="flex items-center gap-3">
        <Trophy className="text-gold h-6 w-6" />
        <div className="flex-1">
          <p className="text-navy font-bold">Achievements</p>
          <p className="text-muted text-xs">
            {unlocked} of {ACHIEVEMENTS.length} unlocked
          </p>
        </div>
        <span className="text-brand text-lg font-extrabold">
          {Math.round((unlocked / ACHIEVEMENTS.length) * 100)}%
        </span>
      </Card>

      {/* Rewards catalogue */}
      <div>
        <h2 className="text-navy mb-2 font-bold">Rewards store</h2>
        <p className="text-muted mb-3 text-xs">
          Adults redeem points for real rewards (subject to Liberty approval).
        </p>
        <div className="flex flex-col gap-2">
          {REWARD_CATALOGUE.map((reward) => {
            const isRequested = requested.includes(reward.id);
            const affordable = progress.pointsRedeemable >= reward.costPoints;
            return (
              <Card key={reward.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-navy font-semibold">{reward.name}</p>
                  <p className="text-muted truncate text-xs">{reward.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-gold text-sm font-bold">{reward.costPoints} pts</p>
                  {isRequested ? (
                    <span className="text-success inline-flex items-center gap-1 text-xs font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Requested
                    </span>
                  ) : (
                    <button
                      onClick={() => onRedeem(reward.id, reward.costPoints)}
                      disabled={!affordable}
                      className="text-brand text-xs font-semibold disabled:opacity-40"
                    >
                      Redeem
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
