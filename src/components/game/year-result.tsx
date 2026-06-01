import { Lightbulb, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { YearOutcome } from "@/lib/game/types";
import { formatKsh } from "@/lib/utils";

export function YearResult({
  outcome,
  onContinue,
}: {
  outcome: YearOutcome;
  onContinue: () => void;
}) {
  const up = outcome.netWorthDelta >= 0;
  const returnPct = outcome.investmentReturnPct * 100;
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-navy text-lg font-extrabold">Year complete</h2>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-navy/5 rounded-xl p-3">
          <p className="text-muted text-[11px] font-semibold uppercase">Net worth</p>
          <p
            className={
              up
                ? "text-success inline-flex items-center gap-1 font-bold"
                : "text-coral inline-flex items-center gap-1 font-bold"
            }
          >
            {up ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {up ? "+" : ""}
            {formatKsh(outcome.netWorthDelta)}
          </p>
        </div>
        <div className="bg-navy/5 rounded-xl p-3">
          <p className="text-muted text-[11px] font-semibold uppercase">Return</p>
          <p className="text-navy font-bold">{returnPct.toFixed(1)}%</p>
        </div>
        <div className="bg-navy/5 rounded-xl p-3">
          <p className="text-muted text-[11px] font-semibold uppercase">Points</p>
          <p className="text-gold font-bold">+{outcome.pointsEarned}</p>
        </div>
      </div>

      {outcome.insights.length > 0 && (
        <div className="flex flex-col gap-2">
          {outcome.insights.map((insight, i) => (
            <div
              key={i}
              className="bg-gold/10 text-navy flex items-start gap-2 rounded-xl p-3 text-sm"
            >
              <Lightbulb className="text-gold mt-0.5 h-4 w-4 shrink-0" />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      )}

      <Button size="lg" onClick={onContinue}>
        Continue
      </Button>
    </Card>
  );
}
