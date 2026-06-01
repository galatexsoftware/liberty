import type { LifeEvent } from "./types";
import { nextRandom } from "./rng";

/**
 * Curated, age-appropriate life events. Used directly in demo mode and as the
 * deterministic fallback whenever the AI generator is unavailable or returns
 * invalid data. Each choice teaches a concrete money lesson via `insight`.
 */
export const FALLBACK_EVENTS: LifeEvent[] = [
  {
    id: "fb-allowance-gift",
    category: "family",
    title: "Birthday gift",
    description: "Aunt Wanjiru gives you KShs 3,000 for your birthday!",
    minAge: 10,
    maxAge: 17,
    source: "fallback",
    choices: [
      {
        id: "save-it",
        label: "Save most of it",
        cash: 3000,
        scores: { knowledge: 4, happiness: 2 },
        insight: "Saving gifts early builds the habit that grows real wealth.",
      },
      {
        id: "treat",
        label: "Treat yourself & friends",
        cash: 500,
        scores: { happiness: 8, knowledge: 1 },
        insight: "Enjoying money is fine — just balance fun with the future.",
      },
    ],
  },
  {
    id: "fb-school-club",
    category: "education",
    title: "Money club at school",
    description: "Your school starts a savings club. Joining costs a small fee.",
    minAge: 10,
    maxAge: 17,
    source: "fallback",
    choices: [
      {
        id: "join",
        label: "Join the club",
        cash: -300,
        scores: { knowledge: 10, happiness: 2 },
        insight: "Learning about money young pays off for the rest of your life.",
      },
      {
        id: "skip",
        label: "Skip it for now",
        scores: { happiness: 1 },
        insight: "Free or cheap financial education is rarely a bad deal.",
      },
    ],
  },
  {
    id: "fb-first-job",
    category: "job",
    title: "First real job",
    description: "You're offered your first salaried job. Two paths open up.",
    minAge: 18,
    maxAge: 26,
    source: "fallback",
    choices: [
      {
        id: "stable",
        label: "Stable job, steady pay",
        cash: 20000,
        incomeMultiplier: 1.1,
        scores: { wealth: 4, happiness: 3 },
        insight: "Stable income makes it easier to plan and invest consistently.",
      },
      {
        id: "startup",
        label: "Risky startup, higher upside",
        cash: 10000,
        incomeMultiplier: 1.25,
        scores: { wealth: 2, knowledge: 5, happiness: 1 },
        insight: "Higher upside often means higher risk — protect yourself first.",
      },
    ],
  },
  {
    id: "fb-medical",
    category: "emergency",
    title: "Medical emergency",
    description: "A health scare lands you with an unexpected hospital bill.",
    minAge: 16,
    maxAge: 65,
    source: "fallback",
    choices: [
      {
        id: "pay",
        label: "Pay the bill",
        cash: -25000,
        scores: { happiness: -6, knowledge: 3 },
        insight: "Emergencies are when protection (insurance) saves your wealth.",
      },
    ],
  },
  {
    id: "fb-business",
    category: "business",
    title: "Side business idea",
    description: "A friend invites you to co-found a small business.",
    minAge: 20,
    maxAge: 55,
    source: "fallback",
    choices: [
      {
        id: "invest-in",
        label: "Invest savings into it",
        cash: -40000,
        incomeMultiplier: 1.2,
        scores: { wealth: 3, knowledge: 6, happiness: 2 },
        insight: "Diversify — don't put everything into one venture.",
      },
      {
        id: "decline",
        label: "Politely decline",
        scores: { knowledge: 1 },
        insight: "Saying no to risk you don't understand is a valid choice.",
      },
    ],
  },
  {
    id: "fb-family-support",
    category: "family",
    title: "Family needs help",
    description: "A relative asks for financial support during a tough time.",
    minAge: 22,
    maxAge: 65,
    source: "fallback",
    choices: [
      {
        id: "help",
        label: "Help generously",
        cash: -15000,
        scores: { happiness: 6, knowledge: 1 },
        insight: "An emergency fund lets you help others without hurting yourself.",
      },
      {
        id: "help-little",
        label: "Help a little",
        cash: -5000,
        scores: { happiness: 3, knowledge: 2 },
        insight: "Budgeting for giving keeps both your heart and wallet healthy.",
      },
    ],
  },
  {
    id: "fb-promotion",
    category: "job",
    title: "Promotion!",
    description: "Your hard work pays off with a promotion and a raise.",
    minAge: 25,
    maxAge: 60,
    source: "fallback",
    choices: [
      {
        id: "lifestyle",
        label: "Upgrade your lifestyle",
        cash: 30000,
        scores: { happiness: 7, wealth: 1 },
        insight: "Lifestyle creep can quietly eat a raise — invest some of it.",
      },
      {
        id: "invest-raise",
        label: "Invest most of the raise",
        cash: 40000,
        incomeMultiplier: 1.05,
        scores: { wealth: 5, knowledge: 4, happiness: 2 },
        insight: "Investing raises instead of spending them compounds powerfully.",
      },
    ],
  },
  {
    id: "fb-windfall",
    category: "windfall",
    title: "Bonus payout",
    description: "You receive an unexpected year-end bonus.",
    minAge: 18,
    maxAge: 65,
    source: "fallback",
    choices: [
      {
        id: "topup",
        label: "Top up your LifeVest portfolio",
        cash: 25000,
        scores: { wealth: 4, knowledge: 3 },
        insight: "Lump-sum top-ups accelerate compound growth.",
      },
    ],
  },
  {
    id: "fb-school-fees",
    category: "education",
    title: "Further studies",
    description: "You can enrol in a course that boosts your earning power.",
    minAge: 18,
    maxAge: 40,
    source: "fallback",
    choices: [
      {
        id: "enrol",
        label: "Pay for the course",
        cash: -35000,
        incomeMultiplier: 1.15,
        scores: { knowledge: 8, happiness: 1 },
        insight: "Investing in skills often returns more than any portfolio.",
      },
      {
        id: "postpone",
        label: "Postpone for now",
        scores: { happiness: -1 },
        insight: "Timing matters, but don't postpone growth indefinitely.",
      },
    ],
  },
];

/** Events valid for a given in-game age. */
export function eventsForAge(age: number): LifeEvent[] {
  return FALLBACK_EVENTS.filter((e) => age >= e.minAge && age <= e.maxAge);
}

/** Deterministically pick a fallback event for the current age. */
export function pickFallbackEvent(rngState: number, age: number): [number, LifeEvent] {
  const pool = eventsForAge(age);
  const candidates = pool.length > 0 ? pool : FALLBACK_EVENTS;
  const [next, value] = nextRandom(rngState);
  const index = Math.floor(value * candidates.length) % candidates.length;
  return [next, candidates[index]];
}
