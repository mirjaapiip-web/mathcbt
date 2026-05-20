import { ArrowDown, ArrowUp, Minus, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { LeaderboardEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

type LeaderboardListProps = {
  entries: LeaderboardEntry[];
  compact?: boolean;
};

const trendIcon = {
  up: ArrowUp,
  down: ArrowDown,
  same: Minus,
};

export function LeaderboardList({ entries, compact = false }: LeaderboardListProps) {
  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const Icon = trendIcon[entry.trend];
        return (
          <div
            key={`${entry.rank}-${entry.name}`}
            className={cn(
              "flex items-center gap-3 rounded-2xl border border-border bg-white/70 p-3 shadow-sm dark:bg-white/5",
              entry.rank === 1 && "border-amber-200 bg-amber-50/80 dark:border-amber-500/30 dark:bg-amber-500/10",
            )}
          >
            <div
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-sm font-black text-primary",
                entry.rank === 1 && "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
              )}
            >
              {entry.rank === 1 ? <Trophy className="size-5" aria-hidden /> : entry.rank}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{entry.name}</p>
              <p className="text-xs font-medium text-muted-foreground">{entry.className}</p>
            </div>
            {!compact ? (
              <Badge variant={entry.rank === 1 ? "warning" : "outline"}>
                {entry.correct} benar
              </Badge>
            ) : null}
            <div className="text-right">
              <p className="text-sm font-black text-primary">{entry.score}</p>
              <p className="text-xs text-muted-foreground">{entry.answerSpeed}</p>
            </div>
            <Icon
              className={cn(
                "size-4",
                entry.trend === "up" && "text-emerald-600",
                entry.trend === "down" && "text-rose-600",
                entry.trend === "same" && "text-muted-foreground",
              )}
              aria-hidden
            />
          </div>
        );
      })}
    </div>
  );
}
