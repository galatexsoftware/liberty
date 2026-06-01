import { MiniHeader } from "@/components/minigames/mini-header";
import { QuizGame } from "@/components/minigames/quiz-game";

export default function QuizPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-12">
      <MiniHeader />
      <QuizGame />
    </main>
  );
}
