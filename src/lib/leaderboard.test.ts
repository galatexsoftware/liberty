import { describe, expect, it } from "vitest";
import { buildLeaderboard, type LeaderboardEntry } from "./leaderboard";

const e = (userId: string, score: number, netWorth: number): LeaderboardEntry => ({
  userId,
  name: userId,
  score,
  netWorth,
});

describe("buildLeaderboard", () => {
  it("ranks by score descending", () => {
    const board = buildLeaderboard([e("a", 50, 100), e("b", 80, 100), e("c", 65, 100)]);
    expect(board.map((x) => x.userId)).toEqual(["b", "c", "a"]);
    expect(board[0].rank).toBe(1);
    expect(board[2].rank).toBe(3);
  });

  it("breaks ties by net worth", () => {
    const board = buildLeaderboard([e("a", 70, 100), e("b", 70, 500)]);
    expect(board[0].userId).toBe("b");
  });

  it("does not mutate the input array", () => {
    const input = [e("a", 10, 1), e("b", 20, 1)];
    const copy = [...input];
    buildLeaderboard(input);
    expect(input).toEqual(copy);
  });
});
