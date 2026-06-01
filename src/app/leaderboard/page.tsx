import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Wordmark } from "@/components/brand/logo";
import { LeaderboardView } from "@/components/game/leaderboard-view";

export default function LeaderboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-12">
      <header className="flex items-center justify-between py-4">
        <Link href="/" className="text-navy inline-flex items-center gap-1 text-sm">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
        <Wordmark className="text-base" />
      </header>

      <h1 className="text-navy mt-2 text-2xl font-extrabold">Leaderboard</h1>
      <p className="text-muted mt-1 text-sm">
        Top life scores across LifeVest Quest. Finish a full life to climb the ranks.
      </p>

      <div className="mt-5">
        <LeaderboardView />
      </div>
    </main>
  );
}
