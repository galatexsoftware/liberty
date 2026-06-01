import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Wordmark } from "@/components/brand/logo";

const steps = [
  {
    n: 1,
    title: "Start at age 10",
    body: "You begin your financial journey young. Each round you play is one full year of life.",
  },
  {
    n: 2,
    title: "Make a decision each year",
    body: "Choose how to use your money: Spend, Save, Invest or Protect. Every choice has trade-offs.",
  },
  {
    n: 3,
    title: "Handle life's events",
    body: "Jobs, emergencies, school fees, business ideas and family moments appear as you grow.",
  },
  {
    n: 4,
    title: "Watch four scores",
    body: "Wealth, Knowledge, Protection and Happiness all matter. Balance them to win.",
  },
  {
    n: 5,
    title: "Let your money compound",
    body: "Investing in LifeVest portfolios grows your fund over time — patience pays off.",
  },
  {
    n: 6,
    title: "Earn points & rewards",
    body: "Collect achievements, climb leaderboards, and earn investment points.",
  },
];

export default function LearnPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-12">
      <header className="flex items-center justify-between py-5">
        <Link href="/" className="text-navy inline-flex items-center gap-1 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <Wordmark className="text-base" />
      </header>

      <h1 className="text-navy mt-2 text-2xl font-extrabold">How LifeVest Quest works</h1>
      <p className="text-muted mt-2 text-sm">
        Learn real money skills by living a whole life in minutes.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {steps.map((s) => (
          <Card key={s.n} className="flex items-start gap-3">
            <span className="bg-brand flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-white">
              {s.n}
            </span>
            <div>
              <h2 className="text-navy font-bold">{s.title}</h2>
              <p className="text-muted text-sm">{s.body}</p>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
