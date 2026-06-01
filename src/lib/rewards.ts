export interface RewardItem {
  id: string;
  name: string;
  description: string;
  costPoints: number;
}

/** Mirrors the adult redeemable catalogue in supabase/seed.sql `rewards`. */
export const REWARD_CATALOGUE: RewardItem[] = [
  {
    id: "airtime-500",
    name: "KShs 500 airtime",
    description: "Redeem points for mobile airtime.",
    costPoints: 2000,
  },
  {
    id: "lifevest-topup",
    name: "LifeVest starter top-up",
    description: "KShs 1,000 added to a new LifeVest plan.",
    costPoints: 5000,
  },
  {
    id: "water-bottle",
    name: "Liberty water bottle",
    description: "Eco flask with the Liberty flame.",
    costPoints: 1500,
  },
  {
    id: "advisor-call",
    name: "Financial planning session",
    description: "30-min call with a Liberty advisor.",
    costPoints: 3000,
  },
];
