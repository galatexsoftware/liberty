import type { PortfolioId } from "./types";

export const START_AGE = 10;
export const END_AGE = 65;

/** Starting cash (KShs) — a modest childhood nest egg. */
export const STARTING_CASH = 5000;

export const STARTING_SCORES = {
  wealth: 20,
  knowledge: 10,
  protection: 5,
  happiness: 60,
} as const;

/**
 * LifeVest-style portfolios. Expected real return + volatility are annual and
 * intentionally simplified for teaching (not financial advice). `minPremium`
 * mirrors the real plan's note that conservative suits premiums below KShs 5k.
 */
export interface PortfolioDef {
  id: PortfolioId;
  name: string;
  blurb: string;
  expectedReturn: number;
  volatility: number;
  /** 0..1 — how much an emergency shock is amplified (risk). */
  downsideExposure: number;
}

export const PORTFOLIOS: Record<PortfolioId, PortfolioDef> = {
  cash: {
    id: "cash",
    name: "Cash Fund",
    blurb: "Safest. Money-market style returns, almost no ups and downs.",
    expectedReturn: 0.04,
    volatility: 0.01,
    downsideExposure: 0.1,
  },
  conservative: {
    id: "conservative",
    name: "Conservative",
    blurb: "Low risk. Steady, gentle growth — good when you're starting out.",
    expectedReturn: 0.07,
    volatility: 0.05,
    downsideExposure: 0.3,
  },
  balanced: {
    id: "balanced",
    name: "Balanced",
    blurb: "Moderate risk and reward. A mix of safety and growth.",
    expectedReturn: 0.1,
    volatility: 0.1,
    downsideExposure: 0.55,
  },
  aggressive: {
    id: "aggressive",
    name: "Aggressive",
    blurb: "Higher risk, higher potential. Bigger swings, bigger long-term growth.",
    expectedReturn: 0.14,
    volatility: 0.18,
    downsideExposure: 0.85,
  },
};

export const PORTFOLIO_LIST = Object.values(PORTFOLIOS);

/** Annual interest on the savings bucket. */
export const SAVINGS_RATE = 0.03;

/** LifeVest basic life cover floor (KShs). */
export const LIFE_COVER_FLOOR = 100000;

/** Score bounds. */
export const SCORE_MIN = 0;
export const SCORE_MAX = 100;

/** Yearly decay applied to happiness and protection (use it or lose it). */
export const HAPPINESS_DECAY = 4;
export const PROTECTION_DECAY = 6;
