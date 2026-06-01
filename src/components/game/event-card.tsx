import { Sparkles } from "lucide-react";
import type { LifeEvent } from "@/lib/game/types";
import { Card } from "@/components/ui/card";
import { formatKsh } from "@/lib/utils";

const CATEGORY_LABEL: Record<LifeEvent["category"], string> = {
  job: "Career",
  emergency: "Emergency",
  education: "Education",
  business: "Business",
  family: "Family",
  windfall: "Windfall",
};

export function EventCard({
  event,
  onChoose,
}: {
  event: LifeEvent;
  onChoose: (choiceId: string) => void;
}) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="bg-brand/10 text-brand rounded-full px-3 py-1 text-xs font-semibold">
          {CATEGORY_LABEL[event.category]}
        </span>
        {event.source === "ai" && (
          <span className="text-muted inline-flex items-center gap-1 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" /> AI event
          </span>
        )}
      </div>

      <div>
        <h2 className="text-navy text-lg font-extrabold">{event.title}</h2>
        <p className="text-muted mt-1 text-sm">{event.description}</p>
      </div>

      <div className="flex flex-col gap-2">
        {event.choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => onChoose(choice.id)}
            className="group border-border hover:border-brand hover:bg-brand/5 rounded-xl border-2 p-3 text-left transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-navy font-semibold">{choice.label}</span>
              {typeof choice.cash === "number" && choice.cash !== 0 && (
                <span
                  className={
                    choice.cash > 0
                      ? "text-success text-sm font-bold"
                      : "text-coral text-sm font-bold"
                  }
                >
                  {choice.cash > 0 ? "+" : ""}
                  {formatKsh(choice.cash)}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
