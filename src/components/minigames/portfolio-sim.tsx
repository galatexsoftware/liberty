"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { GrowthChart } from "./growth-chart";
import { PORTFOLIO_LIST } from "@/lib/game/constants";
import type { PortfolioId } from "@/lib/game/types";
import {
  blendedReturn,
  blendedVolatility,
  normalizeWeights,
  projectGrowth,
  type PortfolioWeights,
} from "@/lib/games/projection";
import { formatKsh } from "@/lib/utils";

const PRINCIPAL = 50000;
const ANNUAL = 60000;
const YEARS = 30;

function riskLabel(vol: number): { label: string; color: string } {
  if (vol < 0.03) return { label: "Very low risk", color: "text-success" };
  if (vol < 0.07) return { label: "Low risk", color: "text-teal" };
  if (vol < 0.12) return { label: "Moderate risk", color: "text-gold" };
  return { label: "High risk", color: "text-coral" };
}

export function PortfolioSim() {
  const [weights, setWeights] = useState<PortfolioWeights>({
    cash: 10,
    conservative: 20,
    balanced: 45,
    aggressive: 25,
  });

  const norm = useMemo(() => normalizeWeights(weights), [weights]);
  const expReturn = useMemo(() => blendedReturn(weights), [weights]);
  const vol = useMemo(() => blendedVolatility(weights), [weights]);
  const points = useMemo(
    () =>
      projectGrowth({
        principal: PRINCIPAL,
        annualContribution: ANNUAL,
        years: YEARS,
        rate: expReturn,
      }),
    [expReturn],
  );
  const risk = riskLabel(vol);

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h2 className="text-navy text-lg font-extrabold">Portfolio mix</h2>
        <p className="text-muted text-sm">
          Mix the four LifeVest funds and see the expected return, risk and a 30-year
          projection update live.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-navy/5 rounded-xl p-2.5">
          <p className="text-muted text-[11px] font-semibold uppercase">Return</p>
          <p className="text-navy font-bold">{(expReturn * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-navy/5 rounded-xl p-2.5">
          <p className="text-muted text-[11px] font-semibold uppercase">Risk</p>
          <p className={`text-xs font-bold ${risk.color}`}>{risk.label}</p>
        </div>
        <div className="bg-navy/5 rounded-xl p-2.5">
          <p className="text-muted text-[11px] font-semibold uppercase">In 30y</p>
          <p className="text-brand text-xs font-bold">
            {formatKsh(points.at(-1)?.value ?? 0)}
          </p>
        </div>
      </div>

      <GrowthChart points={points} />

      <div className="flex flex-col gap-3">
        {PORTFOLIO_LIST.map((p) => {
          const pct = Math.round(norm[p.id as PortfolioId] * 100);
          return (
            <div key={p.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-navy font-semibold">{p.name}</span>
                <span className="text-navy font-bold">{pct}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={weights[p.id as PortfolioId]}
                onChange={(e) =>
                  setWeights((w) => ({ ...w, [p.id]: Number(e.target.value) }))
                }
                className="mt-1 w-full accent-[var(--liberty-blue)]"
                aria-label={`${p.name} weight`}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
