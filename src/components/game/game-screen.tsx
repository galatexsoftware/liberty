"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Coins, Loader2 } from "lucide-react";
import { Wordmark } from "@/components/brand/logo";
import { Card } from "@/components/ui/card";
import { ScoreBars } from "./score-bar";
import { EventCard } from "./event-card";
import { AllocationPanel } from "./allocation-panel";
import { YearResult } from "./year-result";
import { GameOver } from "./game-over";
import {
  createInitialState,
  incomeForAge,
  netWorth,
  resolveYear,
} from "@/lib/game/engine";
import { pickFallbackEvent } from "@/lib/game/events";
import { clearGame, loadGame, saveGame } from "@/lib/game/storage";
import type {
  GameState,
  LifeEvent,
  PortfolioId,
  YearlyAllocation,
  YearOutcome,
} from "@/lib/game/types";
import { formatKsh } from "@/lib/utils";

type Phase = "loading" | "event" | "allocate" | "result" | "over";

async function fetchEvent(state: GameState): Promise<LifeEvent> {
  const seed = `${state.seed}-${state.year}`;
  try {
    const res = await fetch("/api/life-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        age: state.age,
        ageBand: state.playerAgeBand,
        seed,
        recentTitles: state.history.slice(-4).map((h) => h.eventId),
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as { event: LifeEvent };
      if (data.event) return data.event;
    }
  } catch {
    // fall through to deterministic fallback
  }
  const [, event] = pickFallbackEvent(state.rngState, state.age);
  return event;
}

export function GameScreen() {
  const [state, setState] = useState<GameState | null>(null);
  const [event, setEvent] = useState<LifeEvent | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [choiceId, setChoiceId] = useState<string | undefined>();
  const [outcome, setOutcome] = useState<YearOutcome | null>(null);
  const started = useRef(false);

  const startEvent = useCallback(async (s: GameState) => {
    setPhase("loading");
    const e = await fetchEvent(s);
    setEvent(e);
    setChoiceId(undefined);
    setPhase("event");
  }, []);

  // Initialize once: resume a saved run or start a new one.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const existing = loadGame();
    const initial = existing ?? createInitialState();
    setState(initial);
    if (initial.status === "completed") {
      setPhase("over");
    } else {
      void startEvent(initial);
    }
  }, [startEvent]);

  const handleConfirm = (allocation: YearlyAllocation, portfolio: PortfolioId) => {
    if (!state || !event) return;
    const result = resolveYear(state, event, {
      allocation,
      portfolio,
      eventChoiceId: choiceId,
    });
    setOutcome(result);
    setState(result.state);
    saveGame(result.state);
    setPhase("result");
  };

  const handleContinue = () => {
    if (!state) return;
    if (state.status === "completed") {
      setPhase("over");
    } else {
      void startEvent(state);
    }
  };

  const handleRestart = () => {
    clearGame();
    const fresh = createInitialState();
    setState(fresh);
    setOutcome(null);
    void startEvent(fresh);
  };

  const disposablePreview = (() => {
    if (!state) return 0;
    const choice = event?.choices.find((c) => c.id === choiceId);
    const income = Math.round(incomeForAge(state.age) * state.incomeMultiplier);
    return Math.max(0, state.cash + income + (choice?.cash ?? 0));
  })();

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-12">
      <header className="flex items-center justify-between py-4">
        <Link href="/" className="text-navy inline-flex items-center gap-1 text-sm">
          <ArrowLeft className="h-4 w-4" /> Exit
        </Link>
        <Wordmark className="text-base" />
      </header>

      {state && phase !== "over" && (
        <Card className="mb-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted text-xs font-semibold uppercase">Age</p>
              <p className="text-navy text-2xl font-extrabold">{state.age}</p>
            </div>
            <div className="text-right">
              <p className="text-muted text-xs font-semibold uppercase">Net worth</p>
              <p className="text-navy text-lg font-bold">{formatKsh(netWorth(state))}</p>
            </div>
            <div className="text-right">
              <p className="text-muted text-xs font-semibold uppercase">Points</p>
              <p className="text-gold inline-flex items-center gap-1 text-lg font-bold">
                <Coins className="h-4 w-4" />
                {state.points}
              </p>
            </div>
          </div>
          <ScoreBars scores={state.scores} />
        </Card>
      )}

      {phase === "loading" && (
        <Card className="text-muted flex flex-col items-center gap-3 py-12">
          <Loader2 className="text-brand h-6 w-6 animate-spin" />
          <p className="text-sm">Loading your next year…</p>
        </Card>
      )}

      {phase === "event" && event && (
        <EventCard
          event={event}
          onChoose={(id) => {
            setChoiceId(id);
            setPhase("allocate");
          }}
        />
      )}

      {phase === "allocate" && state && (
        <AllocationPanel
          disposable={disposablePreview}
          defaultPortfolio={state.portfolio}
          onConfirm={handleConfirm}
        />
      )}

      {phase === "result" && outcome && (
        <YearResult outcome={outcome} onContinue={handleContinue} />
      )}

      {phase === "over" && state && <GameOver state={state} onRestart={handleRestart} />}
    </main>
  );
}
