import Link from "next/link";
import { ArrowLeft, Hammer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/brand/logo";

/**
 * Placeholder for the game screen. The full year-by-year game loop, scoring
 * engine and mini-games arrive in the next release (PR2/PR3).
 */
export default function PlayPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-12">
      <header className="flex items-center justify-between py-5">
        <Link href="/" className="text-navy inline-flex items-center gap-1 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <Wordmark className="text-base" />
      </header>

      <Card className="mt-6 flex flex-col items-center gap-4 py-12 text-center">
        <span className="bg-brand/10 text-brand flex h-16 w-16 items-center justify-center rounded-2xl">
          <Hammer className="h-8 w-8" />
        </span>
        <h1 className="text-navy text-xl font-extrabold">The quest is being built</h1>
        <p className="text-muted text-sm">
          The year-by-year game loop, scoring engine, AI life events and mini-games are
          landing in the next release.
        </p>
        <Button asChild variant="outline">
          <Link href="/learn">See how it will work</Link>
        </Button>
      </Card>
    </main>
  );
}
