import type { ProjectionPoint } from "@/lib/games/projection";
import { formatKsh } from "@/lib/utils";

const W = 320;
const H = 160;
const PAD = 4;

function buildPath(points: ProjectionPoint[], max: number, key: "value" | "contributed") {
  const n = points.length;
  if (n === 0) return "";
  return points
    .map((p, i) => {
      const x = PAD + (i / (n - 1 || 1)) * (W - PAD * 2);
      const y = H - PAD - (p[key] / max) * (H - PAD * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

/** Compact SVG area chart: invested vs. projected fund value over time. */
export function GrowthChart({ points }: { points: ProjectionPoint[] }) {
  const max = Math.max(1, ...points.map((p) => p.value));
  const valuePath = buildPath(points, max, "value");
  const contributedPath = buildPath(points, max, "contributed");
  const areaPath = `${valuePath} L${W - PAD},${H - PAD} L${PAD},${H - PAD} Z`;
  const last = points.at(-1);

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Projected growth chart"
      >
        <defs>
          <linearGradient id="growthFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--liberty-blue)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--liberty-blue)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#growthFill)" />
        <path d={valuePath} fill="none" stroke="var(--liberty-blue)" strokeWidth="2.5" />
        <path
          d={contributedPath}
          fill="none"
          stroke="var(--muted)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
      </svg>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 border-t border-dashed border-[var(--muted)]" />
          Invested {last ? formatKsh(last.contributed) : ""}
        </span>
        <span className="text-brand inline-flex items-center gap-1.5 font-semibold">
          <span className="bg-brand inline-block h-0.5 w-4" />
          Value {last ? formatKsh(last.value) : ""}
        </span>
      </div>
    </div>
  );
}
