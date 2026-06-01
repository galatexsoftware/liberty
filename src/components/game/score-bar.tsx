import { Coins, GraduationCap, ShieldCheck, Smile } from "lucide-react";
import type { Scores } from "@/lib/game/types";
import { cn } from "@/lib/utils";

const META = {
  wealth: { label: "Wealth", icon: Coins, color: "bg-gold" },
  knowledge: { label: "Knowledge", icon: GraduationCap, color: "bg-brand" },
  protection: { label: "Protection", icon: ShieldCheck, color: "bg-teal" },
  happiness: { label: "Happiness", icon: Smile, color: "bg-coral" },
} as const;

const ORDER = ["wealth", "knowledge", "protection", "happiness"] as const;

export function ScoreBars({ scores }: { scores: Scores }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {ORDER.map((key) => {
        const { label, icon: Icon, color } = META[key];
        const value = scores[key];
        return (
          <div key={key} className="border-border bg-card rounded-xl border p-2.5">
            <div className="text-navy flex items-center justify-between text-xs font-semibold">
              <span className="inline-flex items-center gap-1">
                <Icon className="h-3.5 w-3.5" /> {label}
              </span>
              <span>{value}</span>
            </div>
            <div className="bg-navy/10 mt-1.5 h-1.5 w-full overflow-hidden rounded-full">
              <div
                className={cn("h-full rounded-full transition-all", color)}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
