import { describe, expect, it } from "vitest";
import { achievementPoints, evaluateAchievements } from "./achievements";
import { createInitialState } from "./game/engine";
import type { GameState, YearRecord } from "./game/types";

function baseState(overrides: Partial<GameState> = {}): GameState {
  return { ...createInitialState({ seed: "test" }), ...overrides };
}

const yearRecord = (invest: number): YearRecord => ({
  age: 10,
  netWorth: 1000,
  scores: { wealth: 0, knowledge: 0, protection: 0, happiness: 0 },
  eventId: "e",
  allocation: { spend: 0.25, save: 0.25, invest, protect: 0.25 },
  investmentReturnPct: 0,
});

describe("evaluateAchievements", () => {
  it("unlocks first-year after one year played", () => {
    const state = baseState({ history: [yearRecord(0.25)] });
    expect(evaluateAchievements(state)).toContain("first-year");
    expect(evaluateAchievements(state)).toContain("first-invest");
  });

  it("unlocks finisher only when completed", () => {
    expect(evaluateAchievements(baseState({ status: "active" }))).not.toContain(
      "finisher",
    );
    expect(evaluateAchievements(baseState({ status: "completed" }))).toContain(
      "finisher",
    );
  });

  it("unlocks millionaire on high net worth", () => {
    const rich = baseState({ cash: 0, savings: 0, investmentValue: 1_500_000 });
    expect(evaluateAchievements(rich)).toContain("millionaire");
  });

  it("unlocks score-based achievements at thresholds", () => {
    const state = baseState({
      scores: { wealth: 80, knowledge: 75, protection: 65, happiness: 80 },
    });
    const ids = evaluateAchievements(state);
    expect(ids).toContain("protected");
    expect(ids).toContain("scholar");
    expect(ids).toContain("balanced-life");
  });
});

describe("achievementPoints", () => {
  it("sums points for known ids and ignores unknown", () => {
    expect(achievementPoints(["first-year", "decade"])).toBe(150);
    expect(achievementPoints(["nope"])).toBe(0);
  });
});
