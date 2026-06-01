import { MiniHeader } from "@/components/minigames/mini-header";
import { RunnerGame } from "@/components/minigames/runner-game";

export default function RunnerPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-12">
      <MiniHeader />
      <RunnerGame />
    </main>
  );
}
