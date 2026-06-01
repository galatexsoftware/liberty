import { MiniHeader } from "@/components/minigames/mini-header";
import { PortfolioSim } from "@/components/minigames/portfolio-sim";

export default function PortfolioPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-12">
      <MiniHeader />
      <PortfolioSim />
    </main>
  );
}
