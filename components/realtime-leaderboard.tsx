"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { LeaderboardList } from "@/components/leaderboard-list";
import type { LeaderboardEntry } from "@/lib/types";

type RealtimeLeaderboardProps = {
  roomId: string;
  initialEntries: LeaderboardEntry[];
  compact?: boolean;
};

type LeaderboardRow = {
  display_name: string;
  class_name: string;
  score: number;
  correct_count: number;
  rank: number | null;
};

export function RealtimeLeaderboard({
  roomId,
  initialEntries,
  compact,
}: RealtimeLeaderboardProps) {
  const [rows, setRows] = useState<LeaderboardEntry[]>(initialEntries);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    if (!supabase || roomId.startsWith("demo")) {
      return;
    }

    const channel = supabase
      .channel(`leaderboard:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leaderboard",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const row = payload.new as LeaderboardRow;
          if (!row?.display_name) {
            return;
          }

          setRows((current) => {
            const next = current.filter((entry) => entry.name !== row.display_name);
            next.push({
              rank: row.rank ?? next.length + 1,
              name: row.display_name,
              className: row.class_name,
              score: row.score,
              correct: row.correct_count,
              answerSpeed: "Langsung",
              trend: "up",
            });

            return next
              .sort((a, b) => b.score - a.score)
              .map((entry, index) => ({ ...entry, rank: index + 1 }));
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [roomId]);

  const rankedRows = useMemo(
    () => rows.map((entry, index) => ({ ...entry, rank: index + 1 })),
    [rows],
  );

  return <LeaderboardList entries={rankedRows} compact={compact} />;
}
