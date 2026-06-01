"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Flame, RotateCcw, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QUIZ_BANK, shuffle, type QuizQuestion } from "@/lib/games/quiz-bank";
import { cn } from "@/lib/utils";

const QUESTION_SECONDS = 15;
const ROUND_SIZE = 5;

type Phase = "playing" | "answered" | "over";

export function QuizGame() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS);

  const start = () => {
    setQuestions(shuffle(QUIZ_BANK).slice(0, ROUND_SIZE));
    setIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setPicked(null);
    setTimeLeft(QUESTION_SECONDS);
    setPhase("playing");
  };

  // Initialize once.
  useEffect(() => {
    setQuestions(shuffle(QUIZ_BANK).slice(0, ROUND_SIZE));
  }, []);

  const current = questions[index];

  // Per-question countdown; timing out counts as a wrong answer.
  useEffect(() => {
    if (phase !== "playing" || !current) return;
    if (timeLeft <= 0) {
      reveal(null);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase, current]);

  const reveal = (choice: number | null) => {
    if (phase !== "playing" || !current) return;
    setPicked(choice);
    const correct = choice === current.answer;
    if (correct) {
      const timeBonus = Math.max(0, timeLeft);
      setScore((s) => s + 100 + timeBonus * 5);
      setStreak((st) => {
        const next = st + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
    setPhase("answered");
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      setPhase("over");
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
    setTimeLeft(QUESTION_SECONDS);
    setPhase("playing");
  };

  const progress = useMemo(
    () => (questions.length ? ((index + 1) / questions.length) * 100 : 0),
    [index, questions.length],
  );

  if (!current && phase !== "over") {
    return <Card className="text-muted py-10 text-center">Loading questions…</Card>;
  }

  if (phase === "over") {
    return (
      <Card className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-navy text-xl font-extrabold">Quiz complete!</h2>
        <p className="text-brand text-5xl font-extrabold">{score}</p>
        <p className="text-muted text-sm">
          Best streak: <span className="text-navy font-bold">{bestStreak}</span> in a row
        </p>
        <Button onClick={start}>
          <RotateCcw className="h-4 w-4" /> Play again
        </Button>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-4">
      <div className="text-navy flex items-center justify-between text-sm font-semibold">
        <span>
          Question {index + 1}/{questions.length}
        </span>
        <span className="inline-flex items-center gap-3">
          {streak > 1 && (
            <span className="text-coral inline-flex items-center gap-1">
              <Flame className="h-4 w-4" />
              {streak}
            </span>
          )}
          <span className={cn(timeLeft <= 5 ? "text-coral" : "text-muted")}>
            {timeLeft}s
          </span>
        </span>
      </div>

      <div className="bg-navy/10 h-1.5 w-full overflow-hidden rounded-full">
        <div
          className="bg-brand h-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h3 className="text-navy text-lg font-extrabold">{current.question}</h3>

      <div className="flex flex-col gap-2">
        {current.options.map((option, i) => {
          const isAnswer = i === current.answer;
          const isPicked = i === picked;
          const answered = phase === "answered";
          return (
            <button
              key={i}
              disabled={answered}
              onClick={() => reveal(i)}
              className={cn(
                "flex items-center justify-between rounded-xl border-2 p-3 text-left text-sm font-medium transition-colors",
                !answered && "border-border hover:border-brand hover:bg-brand/5",
                answered && isAnswer && "border-success bg-success/10 text-navy",
                answered && isPicked && !isAnswer && "border-coral bg-coral/10 text-navy",
                answered && !isAnswer && !isPicked && "border-border opacity-60",
              )}
            >
              <span>{option}</span>
              {answered && isAnswer && (
                <CheckCircle2 className="text-success h-5 w-5 shrink-0" />
              )}
              {answered && isPicked && !isAnswer && (
                <XCircle className="text-coral h-5 w-5 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {phase === "answered" && (
        <div className="flex flex-col gap-3">
          <div className="bg-gold/10 text-navy rounded-xl p-3 text-sm">
            {current.explanation}
          </div>
          <Button onClick={next}>
            {index + 1 >= questions.length ? "See results" : "Next question"}
          </Button>
        </div>
      )}
    </Card>
  );
}
