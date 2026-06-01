"use client";

import { useMemo, useState } from "react";
import { PiggyBank, ShoppingBag, ShieldCheck, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PORTFOLIO_LIST } from "@/lib/game/constants";
import type { PortfolioId, YearlyAllocation } from "@/lib/game/types";
import { cn, formatKsh } from "@/lib/utils";

const BUCKETS = [
  { key: "spend", label: "Spend", icon: ShoppingBag, hint: "Enjoy life now" },
  { key: "save", label: "Save", icon: PiggyBank, hint: "Safe & liquid" },
  { key: "invest", label: "Invest", icon: TrendingUp, hint: "Grow long-term" },
  { key: "protect", label: "Protect", icon: ShieldCheck, hint: "Insure risk" },
] as const;

type BucketKey = (typeof BUCKETS)[number]["key"];

export function AllocationPanel({
  disposable,
  defaultPortfolio,
  onConfirm,
}: {
  disposable: number;
  defaultPortfolio: PortfolioId;
  onConfirm: (allocation: YearlyAllocation, portfolio: PortfolioId) => void;
}) {
  const [weights, setWeights] = useState<Record<BucketKey, number>>({
    spend: 25,
    save: 25,
    invest: 35,
    protect: 15,
  });
  const [portfolio, setPortfolio] = useState<PortfolioId>(defaultPortfolio);

  const total = weights.spend + weights.save + weights.invest + weights.protect;

  const fractions = useMemo<YearlyAllocation>(() => {
    const t = total || 1;
    return {
      spend: weights.spend / t,
      save: weights.save / t,
      invest: weights.invest / t,
      protect: weights.protect / t,
    };
  }, [weights, total]);

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h2 className="text-navy text-lg font-extrabold">Plan your year</h2>
        <p className="text-muted text-sm">
          You have <span className="text-navy font-bold">{formatKsh(disposable)}</span> to
          allocate.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {BUCKETS.map(({ key, label, icon: Icon, hint }) => {
          const pct = Math.round(fractions[key] * 100);
          return (
            <div key={key}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-navy inline-flex items-center gap-1.5 font-semibold">
                  <Icon className="text-brand h-4 w-4" /> {label}
                  <span className="text-muted text-xs font-normal">· {hint}</span>
                </span>
                <span className="text-navy font-bold">
                  {pct}% · {formatKsh(disposable * fractions[key])}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={weights[key]}
                onChange={(e) =>
                  setWeights((w) => ({ ...w, [key]: Number(e.target.value) }))
                }
                className="mt-1 w-full accent-[var(--liberty-blue)]"
                aria-label={`${label} allocation`}
              />
            </div>
          );
        })}
      </div>

      <div>
        <p className="text-navy mb-2 text-sm font-semibold">Investment portfolio</p>
        <div className="grid grid-cols-2 gap-2">
          {PORTFOLIO_LIST.map((p) => (
            <button
              key={p.id}
              onClick={() => setPortfolio(p.id)}
              className={cn(
                "rounded-xl border-2 p-2.5 text-left transition-colors",
                portfolio === p.id
                  ? "border-brand bg-brand/5"
                  : "border-border hover:border-brand/40",
              )}
            >
              <p className="text-navy text-sm font-bold">{p.name}</p>
              <p className="text-muted mt-0.5 text-[11px] leading-snug">{p.blurb}</p>
            </button>
          ))}
        </div>
      </div>

      <Button size="lg" onClick={() => onConfirm(fractions, portfolio)}>
        Confirm & advance a year
      </Button>
    </Card>
  );
}
