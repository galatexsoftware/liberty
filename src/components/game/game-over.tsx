import { Award, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreBars } from "./score-bar";
import { netWorth, overallScore } from "@/lib/game/engine";
import type { GameState } from "@/lib/game/types";
import { formatKsh } from "@/lib/utils";

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
          You earned <span className="font-extrabold">{state.points}</span> {pointsLabel}.
        </p>
      </div>

      <ScoreBars scores={state.scores} />

      <Button size="lg" variant="navy" onClick={onRestart}>
        <RotateCcw className="h-4 w-4" /> Play again
      </Button>
    </Card>
  );
}
