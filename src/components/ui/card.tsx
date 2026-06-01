import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border-border bg-card rounded-2xl border p-5 shadow-sm", className)}
      {...props}
    />
  );
}
