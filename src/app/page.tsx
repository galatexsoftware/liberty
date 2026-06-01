import Link from "next/link";
import { Coins, LineChart, ShieldCheck, Smile, Sparkles } from "lucide-react";
import { Wordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { isDemoMode } from "@/lib/env";

const pillars = [
  {
    icon: Coins,
    title: "Save & Spend",
    body: "Balance today's wants with tomorrow's goals, one year at a time.",
  },
  {
    icon: LineChart,
    title: "Invest & Grow",
    body: "Learn how LifeVest portfolios compound your money over decades.",
  },
  {
    icon: ShieldCheck,
    title: "Protect",
    body: "Insure against life's surprises so a bad year doesn't wipe you out.",
  },
  {
    icon: Smile,
    title: "Live Well",
    body: "Build wealth and knowledge without forgetting to enjoy the journey.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-12">
      <header className="flex items-center justify-between py-5">
        <Wordmark className="text-lg" />
        {isDemoMode && (
          <span className="bg-gold/20 text-navy rounded-full px-3 py-1 text-xs font-semibold">
            Demo mode
          </span>
        )}
      </header>

      <section className="bg-liberty-gradient relative mt-2 overflow-hidden rounded-3xl px-6 py-10 text-white shadow-lg">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" /> Powered by Liberty LifeVest
        </span>
        <h1 className="mt-4 text-3xl leading-tight font-extrabold text-balance">
          Grow a lifetime of wealth — one decision at a time.
        </h1>
        <p className="mt-3 text-sm text-white/85">
          Start at age 10. Every round is a year of life. Spend, save, invest and protect
          your way to a secure future while learning real money skills.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button asChild variant="gold" size="lg">
            <Link href="/play">Start your quest</Link>
          </Button>
          <div className="flex gap-3">
            <Button
              asChild
              variant="ghost"
              size="md"
              className="flex-1 text-white hover:bg-white/10"
            >
              <Link href="/mini-games">Mini-games</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="md"
              className="flex-1 text-white hover:bg-white/10"
            >
              <Link href="/learn">How it works</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-2 gap-3">
        {pillars.map(({ icon: Icon, title, body }) => (
          <Card key={title} className="flex flex-col gap-2">
            <span className="bg-brand/10 text-brand inline-flex h-10 w-10 items-center justify-center rounded-xl">
              <Icon className="h-5 w-5" />
            </span>
            <h2 className="text-navy font-bold">{title}</h2>
            <p className="text-muted text-xs">{body}</p>
          </Card>
        ))}
      </section>

      <section className="mt-8">
        <Card className="bg-navy text-white">
          <h2 className="text-lg font-bold">Play, learn, earn points</h2>
          <p className="mt-1 text-sm text-white/80">
            Under-18 players collect virtual investment points. Adults earn redeemable
            points toward real LifeVest rewards.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button asChild variant="gold" size="md">
              <Link href="/rewards">Rewards</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="md"
              className="text-white hover:bg-white/10"
            >
              <Link href="/leaderboard">Leaderboard</Link>
            </Button>
          </div>
        </Card>
      </section>

      <footer className="text-muted mt-auto pt-10 text-center text-xs">
        © {new Date().getFullYear()} Liberty Kenya · LifeVest Quest
      </footer>
    </main>
  );
}
