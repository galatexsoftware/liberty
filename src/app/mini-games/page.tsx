import Link from "next/link";
import { ArrowLeft, Brain, Coins, PieChart, TrendingUp } from "lucide-react";
import { Wordmark } from "@/components/brand/logo";
import { Card } from "@/components/ui/card";

const GAMES = [
  {
    href: "/mini-games/runner",
    title: "Coin Runner",
    description: "Run, jump and collect coins & investment tokens.",
    icon: Coins,
    color: "text-gold",
  },
  {
    href: "/mini-games/quiz",
    title: "Money Quiz",
    description: "Beat the clock, build streaks, learn the why.",
    icon: Brain,
    color: "text-brand",
  },
  {
    href: "/mini-games/portfolio",
    title: "Portfolio Mixer",
    description: "Blend the 4 LifeVest funds; see risk vs reward.",
    icon: PieChart,
    color: "text-teal",
  },
  {
    href: "/mini-games/compound",
    title: "Compound Simulator",
    description: "Watch time and returns grow your money.",
    icon: TrendingUp,
    color: "text-success",
  },
];

export default function MiniGamesHub() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-12">
      <header className="flex items-center justify-between py-4">
        <Link href="/" className="text-navy inline-flex items-center gap-1 text-sm">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
        <Wordmark className="text-base" />
      </header>

      <h1 className="text-navy mt-2 text-2xl font-extrabold">Mini-games</h1>
      <p className="text-muted mt-1 text-sm">
        Quick games that build real money skills — and earn you points.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {GAMES.map(({ href, title, description, icon: Icon, color }) => (
          <Link key={href} href={href}>
            <Card className="hover:border-brand flex items-center gap-4 transition-colors">
              <div className="bg-navy/5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <div>
                <h2 className="text-navy font-bold">{title}</h2>
                <p className="text-muted text-sm">{description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
