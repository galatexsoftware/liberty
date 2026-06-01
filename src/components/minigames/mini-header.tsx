import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Wordmark } from "@/components/brand/logo";

export function MiniHeader({ backHref = "/mini-games" }: { backHref?: string }) {
  return (
    <header className="flex items-center justify-between py-4">
      <Link href={backHref} className="text-navy inline-flex items-center gap-1 text-sm">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <Wordmark className="text-base" />
    </header>
  );
}
