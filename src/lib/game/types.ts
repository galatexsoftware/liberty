/** Core domain types for the LifeVest Quest simulation. */

export type ScoreKey = "wealth" | "knowledge" | "protection" | "happiness";

export type DecisionType = "spend" | "save" | "invest" | "protect";

/** The four LifeVest risk-based portfolios. */
export type PortfolioId = "cash" | "conservative" | "balanced" | "aggressive";

export type PlayerAgeBand = "under_18" | "adult";

export type PointsType = "virtual" | "redeemable";

export interface Scores {
  wealth: number;
  knowledge: number;
  protection: number;
  happiness: number;
}

/** How the player splits the year's disposable money. Fractions sum to ~1. */
export interface YearlyAllocation {
  spend: number;
  save: number;
  invest: number;
  protect: number;
}

export interface ScoreEffect {
  wealth?: number;
  knowledge?: number;
  protection?: number;
  happiness?: number;
}

/** A choice presented within a life event. */
export interface EventChoice {
  id: string;
  label: string;
  /** Immediate cash delta (KShs); negative is a cost. */
  cash?: number;
  /** Permanent multiplier applied to future yearly income (e.g. 1.2). */
  incomeMultiplier?: number;
  scores?: ScoreEffect;
  /** Short explanation shown after choosing (the teaching moment). */
  insight?: string;
}

export type LifeEventCategory =
  | "job"
  | "emergency"
  | "education"
  | "business"
  | "family"
  | "windfall";

export interface LifeEvent {
  id: string;
  category: LifeEventCategory;
  title: string;
  description: string;
  /** Minimum/maximum in-game age this event is appropriate for. */
  minAge: number;
  maxAge: number;
  choices: EventChoice[];
  /** Where the event came from (telemetry + UI badge). */
  source: "ai" | "fallback";
}

export interface YearDecision {
  allocation: YearlyAllocation;
  /** Selected portfolio for the invest bucket. */
  portfolio: PortfolioId;
  eventChoiceId?: string;
}

export interface YearRecord {
  age: number;
  netWorth: number;
  scores: Scores;
  eventId: string;
  choiceId?: string;
  allocation: YearlyAllocation;
  investmentReturnPct: number;
}

export interface GameState {
  seed: number;
  rngState: number;
  startAge: number;
  endAge: number;
  age: number;
  /** Round number, 1-based. */
  year: number;
  cash: number;
  savings: number;
  investmentValue: number;
  /** Cumulative net of premiums/contributions, used for ROI display. */
  contributed: number;
  portfolio: PortfolioId;
  incomeMultiplier: number;
  scores: Scores;
  points: number;
  playerAgeBand: PlayerAgeBand;
  status: "active" | "completed";
  history: YearRecord[];
}

export interface GameConfig {
  seed?: string | number;
  startAge?: number;
  endAge?: number;
  playerAgeBand?: PlayerAgeBand;
  portfolio?: PortfolioId;
}

export interface YearOutcome {
  state: GameState;
  investmentReturnPct: number;
  pointsEarned: number;
  netWorthDelta: number;
  insights: string[];
}
