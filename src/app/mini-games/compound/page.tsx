import { MiniHeader } from "@/components/minigames/mini-header";
import { CompoundSim } from "@/components/minigames/compound-sim";

export default function CompoundPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-12">
      <MiniHeader />
      <CompoundSim />
    </main>
  );
}
