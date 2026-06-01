"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { GrowthChart } from "./growth-chart";
import { projectGrowth } from "@/lib/games/projection";
import { formatKsh } from "@/lib/utils";

interface SliderConfig {
  key: "principal" | "annualContribution" | "years" | "ratePct";
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}

const SLIDERS: SliderConfig[] = [
  {
    key: "principal",
    label: "Starting amount",
    min: 0,
    max: 500000,
    step: 5000,
    format: formatKsh,
  },
  {
    key: "annualContribution",
    label: "Yearly top-up",
    min: 0,
    max: 200000,
    step: 5000,
    format: formatKsh,
  },
  {
    key: "years",
    label: "Years invested",
    min: 1,
    max: 50,
    step: 1,
    format: (v) => `${v} yrs`,
  },
  {
    key: "ratePct",
    label: "Annual return",
    min: 1,
    max: 16,
    step: 1,
    format: (v) => `${v}%`,
  },
];

export function CompoundSim() {
  const [params, setParams] = useState({
    principal: 20000,
    annualContribution: 36000,
    years: 25,
    ratePct: 10,
  });

  const points = useMemo(
    () =>
      projectGrowth({
        principal: params.principal,
        annualContribution: params.annualContribution,
        years: params.years,
        rate: params.ratePct / 100,
      }),
    [params],
  );

  const last = points.at(-1);
  const growth = last ? last.value - last.contributed : 0;

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h2 className="text-navy text-lg font-extrabold">Compound simulator</h2>
        <p className="text-muted text-sm">
          See how starting amount, top-ups, time and return drive your final fund.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="bg-navy/5 rounded-xl p-3">
          <p className="text-muted text-[11px] font-semibold uppercase">Final value</p>
          <p className="text-brand text-lg font-bold">{formatKsh(last?.value ?? 0)}</p>
        </div>
        <div className="bg-navy/5 rounded-xl p-3">
          <p className="text-muted text-[11px] font-semibold uppercase">
            Growth (earnings)
          </p>
          <p className="text-success text-lg font-bold">{formatKsh(growth)}</p>
        </div>
      </div>

      <GrowthChart points={points} />

      <div className="flex flex-col gap-3">
        {SLIDERS.map((s) => (
          <div key={s.key}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-navy font-semibold">{s.label}</span>
              <span className="text-navy font-bold">{s.format(params[s.key])}</span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={params[s.key]}
              onChange={(e) =>
                setParams((p) => ({ ...p, [s.key]: Number(e.target.value) }))
              }
              className="mt-1 w-full accent-[var(--liberty-blue)]"
              aria-label={s.label}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
