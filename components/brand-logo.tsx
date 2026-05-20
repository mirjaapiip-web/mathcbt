import Link from "next/link";
import { Sigma } from "lucide-react";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  compact?: boolean;
};

export function BrandLogo({ className, compact = false }: BrandLogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <span className="grid size-11 place-items-center rounded-2xl bg-primary text-white shadow-exam">
        <Sigma className="size-6" aria-hidden />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-lg font-black tracking-normal">MathBattle</span>
          <span className="block text-xs font-semibold text-muted-foreground">
            Arena Matematika SMA
          </span>
        </span>
      )}
    </Link>
  );
}
