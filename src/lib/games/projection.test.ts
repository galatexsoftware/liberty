import { describe, expect, it } from "vitest";
import {
  blendedReturn,
  blendedVolatility,
  normalizeWeights,
  projectGrowth,
  type PortfolioWeights,
} from "./projection";

const weights = (w: Partial<PortfolioWeights>): PortfolioWeights => ({
  cash: 0,
  conservative: 0,
  balanced: 0,
  aggressive: 0,
  ...w,
});

describe("normalizeWeights", () => {
  it("normalizes to sum 1", () => {
    const n = normalizeWeights(weights({ cash: 1, aggressive: 1 }));
    expect(n.cash + n.conservative + n.balanced + n.aggressive).toBeCloseTo(1);
    expect(n.cash).toBeCloseTo(0.5);
  });

  it("falls back to an equal split when all zero", () => {
    const n = normalizeWeights(weights({}));
    expect(n.cash).toBeCloseTo(0.25);
  });
});

describe("blendedReturn / blendedVolatility", () => {
  it("ranks aggressive above cash on both return and volatility", () => {
    const allCash = weights({ cash: 1 });
    const allAggressive = weights({ aggressive: 1 });
    expect(blendedReturn(allAggressive)).toBeGreaterThan(blendedReturn(allCash));
    expect(blendedVolatility(allAggressive)).toBeGreaterThan(blendedVolatility(allCash));
  });

  it("a 50/50 mix sits between the two extremes", () => {
    const mix = blendedReturn(weights({ cash: 1, aggressive: 1 }));
    expect(mix).toBeGreaterThan(blendedReturn(weights({ cash: 1 })));
    expect(mix).toBeLessThan(blendedReturn(weights({ aggressive: 1 })));
  });
});

describe("projectGrowth", () => {
  it("compounds a lump sum with no contributions", () => {
    const [p] = projectGrowth({
      principal: 1000,
      annualContribution: 0,
      years: 1,
      rate: 0.1,
    });
    expect(p.value).toBe(1100);
    expect(p.contributed).toBe(1000);
  });

  it("grows value above total contributed over time", () => {
    const points = projectGrowth({
      principal: 10000,
      annualContribution: 12000,
      years: 20,
      rate: 0.1,
    });
    const last = points[points.length - 1];
    expect(points).toHaveLength(20);
    expect(last.value).toBeGreaterThan(last.contributed);
  });

  it("higher rate yields a higher ending value", () => {
    const base = { principal: 10000, annualContribution: 5000, years: 15 };
    const low = projectGrowth({ ...base, rate: 0.04 }).at(-1)!.value;
    const high = projectGrowth({ ...base, rate: 0.12 }).at(-1)!.value;
    expect(high).toBeGreaterThan(low);
  });
});
