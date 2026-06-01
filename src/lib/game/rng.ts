/**
 * Deterministic, seedable PRNG (mulberry32). Keeping randomness reproducible
 * lets the scoring engine be fully unit-tested and lets a saved run replay
 * identically.
 */

/** Hash an arbitrary string/number into a 32-bit seed. */
export function hashSeed(input: string | number): number {
  const str = String(input);
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0 || 1;
}

/** Advance a 32-bit state and return [nextState, float in [0,1)]. */
export function nextRandom(state: number): [number, number] {
  let t = (state + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return [t >>> 0, value];
}

/** Pick an item from a list using a state; returns [nextState, item]. */
export function pickFrom<T>(state: number, items: readonly T[]): [number, T] {
  const [next, value] = nextRandom(state);
  const index = Math.floor(value * items.length) % items.length;
  return [next, items[index]];
}
