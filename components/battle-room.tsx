"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Flag,
  ListChecks,
  RadioTower,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { MathFormula } from "@/components/math-formula";
import { RealtimeLeaderboard } from "@/components/realtime-leaderboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LeaderboardEntry, MathQuestion } from "@/lib/types";
import { cn, formatDuration } from "@/lib/utils";

type BattleRoomProps = {
  roomId: string;
  roomCode: string;
  title: string;
  questions: MathQuestion[];
  leaderboard: LeaderboardEntry[];
  timerSeconds: number;
};

export function BattleRoom({
  roomId,
  roomCode,
  title,
  questions,
  leaderboard,
  timerSeconds,
}: BattleRoomProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const answersRef = useRef<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  const score = useMemo(() => {
    return calculateScore(answers);
  }, [answers, questions]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    if (isFinished) {
      return;
    }

    const interval = window.setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          window.clearInterval(interval);
          finishBattle();
          return 0;
        }

        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  function selectAnswer(value: string) {
    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: value,
    }));
  }

  function calculateScore(answerSnapshot: Record<string, string>) {
    return questions.reduce((total, question) => {
      return answerSnapshot[question.id] === question.answer
        ? total + question.points
        : total;
    }, 0);
  }

  function finishBattle() {
    if (isFinished) {
      return;
    }

    setIsFinished(true);
    const finalAnswers = answersRef.current;
    const finalScore = calculateScore(finalAnswers);
    const correctCount = questions.filter(
      (question) => finalAnswers[question.id] === question.answer,
    ).length;

    if (finalScore >= 300) {
      void confetti({
        particleCount: 120,
        spread: 68,
        origin: { y: 0.7 },
      });
    }

    localStorage.setItem(
      "mathbattle_result",
      JSON.stringify({
        score: finalScore,
        correctCount,
        totalQuestions: questions.length,
        roomCode,
        answers: finalAnswers,
      }),
    );

    toast.success("Battle selesai. Nilai akhir siap ditampilkan.");
    router.push(
      `/result/demo-participant?score=${finalScore}&correct=${correctCount}&total=${questions.length}`,
    );
  }

  return (
    <div className="exam-shell">
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-4 py-4 lg:px-6">
        <header className="surface-card mb-4 flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">
                <RadioTower className="mr-1 size-3" aria-hidden />
                Berlangsung
              </Badge>
              <Badge variant="outline">Kode {roomCode}</Badge>
            </div>
            <h1 className="mt-2 text-xl font-black tracking-normal md:text-2xl">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center gap-2 rounded-2xl border border-border bg-white/70 px-4 py-3 font-black shadow-sm dark:bg-white/5",
                timeLeft <= 60 && "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300",
              )}
            >
              <Clock3 className="size-5" aria-hidden />
              <span className="tabular-nums">{formatDuration(timeLeft)}</span>
            </div>
            <Button variant="destructive" onClick={finishBattle}>
              <Flag aria-hidden />
              Selesai
            </Button>
          </div>
        </header>

        <main className="grid flex-1 gap-4 lg:grid-cols-[1fr_360px]">
          <section className="grid gap-4">
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-border bg-white/60 dark:bg-white/5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle>
                      Soal {currentIndex + 1} dari {questions.length}
                    </CardTitle>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">
                      {currentQuestion.topic} - {currentQuestion.difficulty}
                    </p>
                  </div>
                  <Badge variant="secondary">{currentQuestion.points} poin</Badge>
                </div>
                <Progress value={progress} />
              </CardHeader>
              <CardContent className="space-y-6 p-5 md:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-5"
                  >
                    <p className="text-xl font-bold leading-8 md:text-2xl">
                      {currentQuestion.question}
                    </p>
                    <MathFormula value={currentQuestion.formula} />

                    {currentQuestion.options?.length ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        {currentQuestion.options.map((option) => {
                          const selected = answers[currentQuestion.id] === option;

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => selectAnswer(option)}
                              className={cn(
                                "focus-ring flex min-h-16 items-center justify-between rounded-2xl border border-border bg-white/80 px-4 py-3 text-left text-base font-bold shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 dark:bg-white/5 dark:hover:bg-white/10",
                                selected &&
                                  "border-primary bg-blue-50 text-primary ring-2 ring-primary/20 dark:bg-blue-500/15",
                              )}
                            >
                              <span>{option}</span>
                              {selected ? <CheckCircle2 className="size-5" aria-hidden /> : null}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <input
                        className="focus-ring min-h-16 w-full rounded-2xl border border-input bg-white/80 px-5 text-lg font-bold shadow-sm dark:bg-white/5"
                        placeholder="Ketik jawaban singkat"
                        value={answers[currentQuestion.id] ?? ""}
                        onChange={(event) => selectAnswer(event.target.value)}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    variant="outline"
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
                  >
                    <ArrowLeft aria-hidden />
                    Sebelumnya
                  </Button>
                  <Button
                    onClick={() => {
                      if (currentIndex === questions.length - 1) {
                        finishBattle();
                      } else {
                        setCurrentIndex((value) => Math.min(questions.length - 1, value + 1));
                      }
                    }}
                  >
                    {currentIndex === questions.length - 1 ? "Kirim Jawaban" : "Soal Berikutnya"}
                    {currentIndex === questions.length - 1 ? (
                      <Send aria-hidden />
                    ) : (
                      <ArrowRight aria-hidden />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ListChecks className="size-5 text-primary" aria-hidden />
                  Status Jawaban
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                  {questions.map((question, index) => {
                    const answered = Boolean(answers[question.id]);
                    const active = index === currentIndex;

                    return (
                      <button
                        key={question.id}
                        type="button"
                        onClick={() => setCurrentIndex(index)}
                        className={cn(
                          "focus-ring aspect-square rounded-xl border text-sm font-black transition",
                          active && "border-primary bg-primary text-white",
                          !active && answered && "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300",
                          !active && !answered && "border-border bg-white/70 text-muted-foreground dark:bg-white/5",
                        )}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>

          <aside className="grid content-start gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Peringkat Langsung</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Leaderboard berubah otomatis saat peserta menjawab.
                </p>
              </CardHeader>
              <CardContent>
                <RealtimeLeaderboard
                  roomId={roomId}
                  initialEntries={leaderboard}
                  compact
                />
              </CardContent>
            </Card>

            <div className="glass-panel p-5">
              <p className="text-sm font-semibold text-muted-foreground">Nilai sementara</p>
              <p className="mt-2 text-4xl font-black tracking-normal text-primary">{score}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {answeredCount} dari {questions.length} soal sudah dijawab.
              </p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
