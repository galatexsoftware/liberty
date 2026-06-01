import { PORTFOLIOS } from "@/lib/game/constants";
import type { PortfolioId } from "@/lib/game/types";

export type PortfolioWeights = Record<PortfolioId, number>;

/** Normalize weights to sum to 1 (returns equal split if all zero). */
export function normalizeWeights(weights: PortfolioWeights): PortfolioWeights {
  const total =
    weights.cash + weights.conservative + weights.balanced + weights.aggressive;
  if (total <= 0) {
    return { cash: 0.25, conservative: 0.25, balanced: 0.25, aggressive: 0.25 };
  }
  return {
    cash: weights.cash / total,
    conservative: weights.conservative / total,
    balanced: weights.balanced / total,
    aggressive: weights.aggressive / total,
  };
}

/** Weighted expected annual return for a portfolio mix. */
export function blendedReturn(weights: PortfolioWeights): number {
  const w = normalizeWeights(weights);
  return (
    w.cash * PORTFOLIOS.cash.expectedReturn +
    w.conservative * PORTFOLIOS.conservative.expectedReturn +
    w.balanced * PORTFOLIOS.balanced.expectedReturn +
    w.aggressive * PORTFOLIOS.aggressive.expectedReturn
  );
}

/** Weighted volatility — a simple proxy for how bumpy the ride is. */
export function blendedVolatility(weights: PortfolioWeights): number {
  const w = normalizeWeights(weights);
  return (
    w.cash * PORTFOLIOS.cash.volatility +
    w.conservative * PORTFOLIOS.conservative.volatility +
    w.balanced * PORTFOLIOS.balanced.volatility +
    w.aggressive * PORTFOLIOS.aggressive.volatility
  );
}

export interface ProjectionInput {
  /** Starting lump sum (KShs). */
  principal: number;
  /** Recurring yearly contribution (KShs). */
  annualContribution: number;
  years: number;
  /** Annual growth rate, e.g. 0.1 for 10%. */
  rate: number;
}

export interface ProjectionPoint {
  year: number;
  /** Total value at the end of the year. */
  value: number;
  /** Cumulative amount actually contributed (principal + contributions). */
  contributed: number;
}

/**
 * Year-by-year compound projection with annual contributions made at the start
 * of each year. Deterministic — no randomness — so it can be charted and tested.
 */
export function projectGrowth({
  principal,
  annualContribution,
  years,
  rate,
}: ProjectionInput): ProjectionPoint[] {
  const points: ProjectionPoint[] = [];
  let value = principal;
  let contributed = principal;
  for (let year = 1; year <= years; year++) {
    value = (value + annualContribution) * (1 + rate);
    contributed += annualContribution;
    points.push({
      year,
      value: Math.round(value),
      contributed: Math.round(contributed),
    });
  }
  return points;
}
