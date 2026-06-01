import {
  END_AGE,
  HAPPINESS_DECAY,
  PORTFOLIOS,
  PROTECTION_DECAY,
  SAVINGS_RATE,
  SCORE_MAX,
  SCORE_MIN,
  START_AGE,
  STARTING_CASH,
  STARTING_SCORES,
} from "./constants";
import { hashSeed, nextRandom } from "./rng";
import type {
  GameConfig,
  GameState,
  LifeEvent,
  Scores,
  ScoreEffect,
  YearDecision,
  YearOutcome,
} from "./types";

const clampScore = (n: number): number =>
  Math.max(SCORE_MIN, Math.min(SCORE_MAX, Math.round(n)));

/** Net worth = liquid cash + savings + invested fund value. */
export function netWorth(state: GameState): number {
  return Math.round(state.cash + state.savings + state.investmentValue);
}

/** Expected net-worth benchmark for an age, used to derive the wealth score. */
export function ageBenchmark(age: number): number {
  return 60000 * (age - START_AGE + 1);
}

/** Simplified annual gross income (KShs) by life stage. */
export function incomeForAge(age: number): number {
  if (age < 14) return 6000;
  if (age < 18) return 12000;
  if (age < 23) return 120000;
  if (age < 30) return 300000;
  if (age < 45) return 600000;
  if (age < 60) return 800000;
  return 300000;
}

function applyScoreEffect(scores: Scores, effect: ScoreEffect | undefined): Scores {
  if (!effect) return scores;
  return {
    wealth: clampScore(scores.wealth + (effect.wealth ?? 0)),
    knowledge: clampScore(scores.knowledge + (effect.knowledge ?? 0)),
    protection: clampScore(scores.protection + (effect.protection ?? 0)),
    happiness: clampScore(scores.happiness + (effect.happiness ?? 0)),
  };
}

export function createInitialState(config: GameConfig = {}): GameState {
  const startAge = config.startAge ?? START_AGE;
  const seed = hashSeed(config.seed ?? Date.now());
  return {
    seed,
    rngState: seed,
    startAge,
    endAge: config.endAge ?? END_AGE,
    age: startAge,
    year: 1,
    cash: STARTING_CASH,
    savings: 0,
    investmentValue: 0,
    contributed: 0,
    portfolio: config.portfolio ?? "balanced",
    incomeMultiplier: 1,
    scores: { ...STARTING_SCORES },
    points: 0,
    playerAgeBand: config.playerAgeBand ?? "under_18",
    status: "active",
    history: [],
  };
}

/** Normalize allocation fractions so they never exceed the wallet. */
function normalizeAllocation(a: YearDecision["allocation"]) {
  const spend = Math.max(0, a.spend);
  const save = Math.max(0, a.save);
  const invest = Math.max(0, a.invest);
  const protect = Math.max(0, a.protect);
  const total = spend + save + invest + protect;
  if (total <= 1 || total === 0) return { spend, save, invest, protect };
  return {
    spend: spend / total,
    save: save / total,
    invest: invest / total,
    protect: protect / total,
  };
}

/**
 * Resolve one year given the player's decision and the active life event.
 * Pure: same inputs always produce the same output (RNG carried in state).
 */
export function resolveYear(
  prev: GameState,
  event: LifeEvent,
  decision: YearDecision,
): YearOutcome {
  const insights: string[] = [];
  const startNetWorth = netWorth(prev);

  let cash = prev.cash;
  let savings = prev.savings;
  let investmentValue = prev.investmentValue;
  let contributed = prev.contributed;
  let incomeMultiplier = prev.incomeMultiplier;
  let scores: Scores = { ...prev.scores };
  let rngState = prev.rngState;

  // 1. Yearly income.
  cash += Math.round(incomeForAge(prev.age) * incomeMultiplier);

  // 2. Apply the chosen event outcome.
  const choice =
    event.choices.find((c) => c.id === decision.eventChoiceId) ?? event.choices[0];
  if (choice) {
    cash += choice.cash ?? 0;
    if (choice.incomeMultiplier) incomeMultiplier *= choice.incomeMultiplier;
    scores = applyScoreEffect(scores, choice.scores);
    if (choice.insight) insights.push(choice.insight);

    // Insurance payout: protection refunds part of an emergency cost.
    if (event.category === "emergency" && (choice.cash ?? 0) < 0) {
      const refund = Math.round(
        Math.abs(choice.cash ?? 0) * (scores.protection / 100) * 0.8,
      );
      if (refund > 0) {
        cash += refund;
        insights.push(
          `Your protection cushioned the blow — insurance covered KShs ${refund.toLocaleString()}.`,
        );
      }
    }
  }

  // 3. Allocate disposable cash across the four decisions.
  const alloc = normalizeAllocation(decision.allocation);
  const disposable = Math.max(0, cash);
  const spendAmt = disposable * alloc.spend;
  const saveAmt = disposable * alloc.save;
  const investAmt = disposable * alloc.invest;
  const protectAmt = disposable * alloc.protect;

  cash -= spendAmt + saveAmt + investAmt + protectAmt;
  savings += saveAmt;
  investmentValue += investAmt;
  contributed += investAmt + saveAmt;

  scores = applyScoreEffect(scores, {
    happiness: alloc.spend * 22,
    knowledge: alloc.invest * 10 + alloc.save * 3,
    protection: alloc.protect * 28,
  });

  // 4. Grow money. Investment return = expected ± volatility (seeded).
  const portfolio = PORTFOLIOS[decision.portfolio];
  const [afterRng, roll] = nextRandom(rngState);
  rngState = afterRng;
  let returnPct = portfolio.expectedReturn + (roll * 2 - 1) * portfolio.volatility;

  // Emergencies hit risky, unprotected portfolios harder.
  if (event.category === "emergency") {
    const shock = portfolio.downsideExposure * (1 - scores.protection / 100) * 0.15;
    returnPct -= shock;
  }

  investmentValue = Math.max(0, investmentValue * (1 + returnPct));
  savings = savings * (1 + SAVINGS_RATE);

  if (returnPct < 0) {
    insights.push(
      `Markets dipped ${(returnPct * 100).toFixed(1)}% — long-term investors stay the course.`,
    );
  }

  // 5. Decay (use-it-or-lose-it) on happiness and protection.
  scores.happiness = clampScore(scores.happiness - HAPPINESS_DECAY);
  scores.protection = clampScore(scores.protection - PROTECTION_DECAY);

  // 6. Wealth score from net worth vs age benchmark.
  const nw = Math.round(cash + savings + investmentValue);
  scores.wealth = clampScore((100 * nw) / ageBenchmark(prev.age + 1));

  // 7. Points (virtual or redeemable depending on the player's age band).
  const knowledgeDelta = scores.knowledge - prev.scores.knowledge;
  const growthGain = Math.max(0, investmentValue * returnPct);
  const pointsEarned = Math.max(
    0,
    Math.round(investAmt / 1000 + growthGain / 2000 + Math.max(0, knowledgeDelta)),
  );

  const age = prev.age + 1;
  const status: GameState["status"] = age > prev.endAge ? "completed" : "active";

  const state: GameState = {
    ...prev,
    rngState,
    age,
    year: prev.year + 1,
    cash: Math.round(cash),
    savings: Math.round(savings),
    investmentValue: Math.round(investmentValue),
    contributed: Math.round(contributed),
    portfolio: decision.portfolio,
    incomeMultiplier,
    scores,
    points: prev.points + pointsEarned,
    status,
    history: [
      ...prev.history,
      {
        age: prev.age,
        netWorth: nw,
        scores,
        eventId: event.id,
        choiceId: choice?.id,
        allocation: alloc,
        investmentReturnPct: returnPct,
      },
    ],
  };

  return {
    state,
    investmentReturnPct: returnPct,
    pointsEarned,
    netWorthDelta: nw - startNetWorth,
    insights,
  };
}

/** Overall 0–100 life score, the headline number on the summary screen. */
export function overallScore(state: GameState): number {
  const { wealth, knowledge, protection, happiness } = state.scores;
  return Math.round(
    wealth * 0.35 + knowledge * 0.25 + protection * 0.2 + happiness * 0.2,
  );
}
