"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { Award, CheckCircle2, Medal, RotateCcw } from "lucide-react";
import Link from "next/link";
import { LeaderboardList } from "@/components/leaderboard-list";
import { PerformanceChart } from "@/components/charts/performance-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { leaderboard, performanceSeries } from "@/lib/mock-data";

export function ResultSummary() {
  const searchParams = useSearchParams();
  const score = Number(searchParams.get("score") ?? "420");
  const correct = Number(searchParams.get("correct") ?? "4");
  const total = Number(searchParams.get("total") ?? "5");
  const percentage = Math.round((correct / total) * 100);

  const rank = useMemo(() => {
    if (score >= 800) return 1;
    if (score >= 600) return 2;
    if (score >= 400) return 5;
    return 12;
  }, [score]);

  useEffect(() => {
    if (rank <= 3) {
      void confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.72 },
      });
    }
  }, [rank]);

  return (
    <div className="exam-shell min-h-screen px-4 py-6">
      <main className="mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[1fr_380px]">
        <section className="space-y-5">
          <div className="surface-card overflow-hidden">
            <div className="bg-exam-grid math-grid border-b border-border bg-white/60 p-6 dark:bg-white/5">
              <Badge variant={rank <= 3 ? "warning" : "default"}>Hasil Ujian</Badge>
              <h1 className="mt-4 text-3xl font-black tracking-normal md:text-5xl">
                Nilai Akhir MathBattle
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                Jawaban sudah direkap. Lihat peringkat, akurasi, dan topik yang perlu dilatih lagi.
              </p>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-3">
              <div className="rounded-2xl bg-blue-50 p-5 dark:bg-blue-500/10">
                <Award className="size-6 text-primary" aria-hidden />
                <p className="mt-4 text-sm font-semibold text-muted-foreground">Skor</p>
                <p className="text-4xl font-black tracking-normal text-primary">{score}</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-5 dark:bg-emerald-500/10">
                <CheckCircle2 className="size-6 text-emerald-600" aria-hidden />
                <p className="mt-4 text-sm font-semibold text-muted-foreground">Jawaban Benar</p>
                <p className="text-4xl font-black tracking-normal text-emerald-600">
                  {correct}/{total}
                </p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-5 dark:bg-amber-500/10">
                <Medal className="size-6 text-amber-600" aria-hidden />
                <p className="mt-4 text-sm font-semibold text-muted-foreground">Peringkat</p>
                <p className="text-4xl font-black tracking-normal text-amber-600">#{rank}</p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Grafik Performa</CardTitle>
              <p className="text-sm text-muted-foreground">
                Perbandingan nilai kamu dengan rata-rata peserta lain.
              </p>
            </CardHeader>
            <CardContent>
              <PerformanceChart data={performanceSeries} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review Jawaban</CardTitle>
              <p className="text-sm text-muted-foreground">
                Akurasi battle kamu berada di {percentage}%.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={percentage} />
              <div className="grid gap-3 md:grid-cols-2">
                {["Turunan", "Logaritma", "Trigonometri", "Matriks"].map((topic, index) => (
                  <div
                    key={topic}
                    className="rounded-2xl border border-border bg-white/70 p-4 dark:bg-white/5"
                  >
                    <p className="font-bold">{topic}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {index % 2 === 0
                        ? "Konsep kuat, pertahankan kecepatan."
                        : "Perlu ulang pembahasan dan latihan bertahap."}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Peringkat Room</CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardList entries={leaderboard} />
            </CardContent>
          </Card>

          <div className="glass-panel p-5">
            <p className="text-lg font-black">Latihan berikutnya</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Fokus pada soal dengan waktu jawab paling lama, lalu ulangi battle topik yang sama.
            </p>
            <Button asChild className="mt-5 w-full">
              <Link href="/join">
                <RotateCcw aria-hidden />
                Battle Lagi
              </Link>
            </Button>
          </div>
        </aside>
      </main>
    </div>
  );
}
