export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  /** Index into `options`. */
  answer: number;
  explanation: string;
  topic: "saving" | "investing" | "protection" | "planning";
}

/**
 * Curated financial-literacy questions. Used in demo mode and as the fallback
 * bank; PR4 will let an admin extend this set from Supabase.
 */
export const QUIZ_BANK: QuizQuestion[] = [
  {
    id: "q-compound",
    topic: "investing",
    question: "What is 'compound growth'?",
    options: [
      "Earning returns only on the money you put in",
      "Earning returns on both your money and past returns",
      "A fee charged every year",
      "Spending your savings slowly",
    ],
    answer: 1,
    explanation:
      "Compounding means your returns earn returns too — the earlier you start, the more it snowballs.",
  },
  {
    id: "q-emergency-fund",
    topic: "saving",
    question: "Why keep an emergency fund?",
    options: [
      "To buy luxury items",
      "To cover surprise costs without selling investments",
      "Because banks require it",
      "To avoid paying taxes",
    ],
    answer: 1,
    explanation:
      "An emergency fund lets you handle surprises without derailing your long-term investments.",
  },
  {
    id: "q-diversify",
    topic: "investing",
    question: "What does 'diversifying' your investments mean?",
    options: [
      "Putting everything into one hot stock",
      "Spreading money across different assets to reduce risk",
      "Only keeping cash",
      "Investing only when markets are high",
    ],
    answer: 1,
    explanation: "Spreading money around means one bad bet won't sink your whole plan.",
  },
  {
    id: "q-insurance",
    topic: "protection",
    question: "What is the main purpose of insurance?",
    options: [
      "To grow your wealth fastest",
      "To protect you financially when something goes wrong",
      "To avoid saving money",
      "To guarantee high returns",
    ],
    answer: 1,
    explanation:
      "Insurance transfers big, rare risks away from you — protecting the wealth you've built.",
  },
  {
    id: "q-inflation",
    topic: "planning",
    question: "Why can keeping all your money as cash be risky long-term?",
    options: [
      "Cash can be stolen only",
      "Inflation slowly reduces what cash can buy",
      "Cash earns the highest returns",
      "It isn't risky at all",
    ],
    answer: 1,
    explanation:
      "Inflation erodes cash's buying power over time, so some growth investing helps you keep up.",
  },
  {
    id: "q-start-early",
    topic: "investing",
    question: "Two people invest the same amount. Who usually ends with more?",
    options: [
      "The one who starts 10 years earlier",
      "The one who starts later",
      "They always end equal",
      "The one who checks prices daily",
    ],
    answer: 0,
    explanation:
      "Time in the market beats timing the market — starting early gives compounding more years to work.",
  },
  {
    id: "q-budget",
    topic: "planning",
    question: "A simple budgeting rule is to...",
    options: [
      "Spend first, save whatever is left",
      "Pay yourself first by saving before spending",
      "Never track your money",
      "Borrow to invest everything",
    ],
    answer: 1,
    explanation:
      "'Pay yourself first' means setting aside savings before spending — it makes saving automatic.",
  },
  {
    id: "q-risk-return",
    topic: "investing",
    question: "Generally, higher potential returns come with...",
    options: ["Lower risk", "Higher risk", "No risk", "Guaranteed profit"],
    answer: 1,
    explanation:
      "Risk and return go together — choose a portfolio that matches your goals and comfort.",
  },
];

/** Deterministic-ish shuffle helper (Fisher–Yates with Math.random). */
export function shuffle<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
