import { cn } from "@/lib/utils";

/**
 * Liberty-inspired flame mark rendered in a navy roundel. Used as the
 * LifeVest Quest app icon/wordmark. This is an original stylized flame, not
 * the official Liberty logo asset (to be swapped for brand assets when
 * provided).
 */
export function LibertyFlame({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-8 w-8", className)}
      role="img"
      aria-label="LifeVest Quest"
    >
      <circle cx="24" cy="24" r="24" fill="var(--liberty-navy)" />
      <path
        d="M24 9c2.6 4.7 1.2 7.6-0.7 10.3-1.7 2.4-3.6 4.7-3.6 7.9 0 1.7.7 3.2 1.8 4.3-3.9-.9-6.7-4.3-6.7-8.6 0-.9.1-1.7.4-2.5-1.8 1.6-2.9 3.9-2.9 6.6 0 5.8 4.9 10.5 11.1 10.5 6.5 0 11.4-4.4 11.4-10.7 0-6.8-5.2-9.9-7.6-15.4-1 .9-1.8 2-2.3 3.2C23.4 14.5 23.1 11.6 24 9Z"
        fill="#ffffff"
      />
      <path
        d="M24 27.5c1.7 1.6 2.6 3.3 2.6 5.1 0 2-1.6 3.4-3.4 3.4-2 0-3.5-1.4-3.5-3.3 0-1.7 1.2-3 2.2-4.2.7 1 1.9 1.2 2.1-.1Z"
        fill="var(--liberty-gold)"
      />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-extrabold", className)}>
      <LibertyFlame className="h-7 w-7" />
      <span className="leading-none">
        <span className="text-navy">LifeVest</span>{" "}
        <span className="text-brand">Quest</span>
      </span>
    </span>
  );
}
