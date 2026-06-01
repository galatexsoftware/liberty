import { describe, expect, it } from "vitest";
import {
  createInitialState,
  incomeForAge,
  netWorth,
  overallScore,
  resolveYear,
} from "./engine";
import { pickFallbackEvent, FALLBACK_EVENTS } from "./events";
import type { LifeEvent, YearDecision } from "./types";

const investDecision: YearDecision = {
  allocation: { spend: 0.1, save: 0.1, invest: 0.7, protect: 0.1 },
  portfolio: "balanced",
};

const neutralEvent: LifeEvent = {
  id: "test-windfall",
  category: "windfall",
  title: "Test",
  description: "",
  minAge: 10,
  maxAge: 65,
  source: "fallback",
  choices: [{ id: "only", label: "ok", cash: 0 }],
};

describe("createInitialState", () => {
  it("starts at age 10 with deterministic seed", () => {
    const a = createInitialState({ seed: "abc" });
    const b = createInitialState({ seed: "abc" });
    expect(a.age).toBe(10);
    expect(a.seed).toBe(b.seed);
    expect(a.status).toBe("active");
  });

  it("respects the configured player age band", () => {
    expect(createInitialState({ playerAgeBand: "adult" }).playerAgeBand).toBe("adult");
  });
});

describe("incomeForAge", () => {
  it("increases across life stages then tapers near retirement", () => {
    expect(incomeForAge(10)).toBeLessThan(incomeForAge(25));
    expect(incomeForAge(50)).toBeGreaterThan(incomeForAge(62));
  });
});

describe("resolveYear", () => {
  it("is deterministic for the same inputs", () => {
    const s = createInitialState({ seed: "fixed" });
    const a = resolveYear(s, neutralEvent, investDecision);
    const b = resolveYear(s, neutralEvent, investDecision);
    expect(a.state.investmentValue).toBe(b.state.investmentValue);
    expect(a.investmentReturnPct).toBeCloseTo(b.investmentReturnPct);
  });

  it("advances age and year by one", () => {
    const s = createInitialState({ seed: "fixed" });
    const { state } = resolveYear(s, neutralEvent, investDecision);
    expect(state.age).toBe(s.age + 1);
    expect(state.year).toBe(s.year + 1);
    expect(state.history).toHaveLength(1);
  });

  it("moves invested money into the portfolio fund", () => {
    const s = createInitialState({ seed: "fixed" });
    const { state } = resolveYear(s, neutralEvent, investDecision);
    expect(state.investmentValue).toBeGreaterThan(0);
    expect(state.contributed).toBeGreaterThan(0);
  });

  it("raises happiness when spending and knowledge when investing", () => {
    const s = createInitialState({ seed: "fixed" });
    const spendHeavy = resolveYear(s, neutralEvent, {
      allocation: { spend: 0.9, save: 0, invest: 0.05, protect: 0.05 },
      portfolio: "balanced",
    });
    const investHeavy = resolveYear(s, neutralEvent, investDecision);
    expect(spendHeavy.state.scores.happiness).toBeGreaterThan(
      investHeavy.state.scores.happiness,
    );
    expect(investHeavy.state.scores.knowledge).toBeGreaterThan(
      spendHeavy.state.scores.knowledge,
    );
  });

  it("keeps all scores within 0..100", () => {
    let state = createInitialState({ seed: "bounds" });
    for (let i = 0; i < 40 && state.status === "active"; i++) {
      const [, event] = pickFallbackEvent(state.rngState, state.age);
      state = resolveYear(state, event, investDecision).state;
      for (const key of ["wealth", "knowledge", "protection", "happiness"] as const) {
        expect(state.scores[key]).toBeGreaterThanOrEqual(0);
        expect(state.scores[key]).toBeLessThanOrEqual(100);
      }
    }
  });

  it("completes the run at the end age", () => {
    let state = createInitialState({ seed: "finish", startAge: 63, endAge: 65 });
    let guard = 0;
    while (state.status === "active" && guard++ < 10) {
      const [, event] = pickFallbackEvent(state.rngState, state.age);
      state = resolveYear(state, event, investDecision).state;
    }
    expect(state.status).toBe("completed");
    expect(state.age).toBeGreaterThan(65);
  });

  it("protection reduces the net cash impact of an emergency", () => {
    const emergency = FALLBACK_EVENTS.find((e) => e.category === "emergency")!;
    const base = createInitialState({ seed: "emg" });
    const unprotected = { ...base, scores: { ...base.scores, protection: 0 } };
    const protectedState = { ...base, scores: { ...base.scores, protection: 100 } };
    const decision: YearDecision = {
      allocation: { spend: 0, save: 0, invest: 0, protect: 0 },
      portfolio: "cash",
    };
    const a = resolveYear(unprotected, emergency, decision);
    const b = resolveYear(protectedState, emergency, decision);
    expect(b.state.cash).toBeGreaterThan(a.state.cash);
  });
});

describe("overallScore & netWorth", () => {
  it("computes a 0..100 overall score", () => {
    const s = createInitialState({ seed: "x" });
    const score = overallScore(s);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("sums cash, savings and investments", () => {
    const s = createInitialState({ seed: "x" });
    expect(netWorth(s)).toBe(s.cash + s.savings + s.investmentValue);
  });
});
