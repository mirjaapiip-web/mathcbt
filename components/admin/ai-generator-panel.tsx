"use client";

import { FormEvent, useState } from "react";
import { Bot, Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { MathFormula } from "@/components/math-formula";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Difficulty, GeneratedQuestion } from "@/lib/types";
import { battleTopics } from "@/lib/mock-data";

export function AiGeneratorPanel() {
  const [topic, setTopic] = useState("Turunan");
  const [difficulty, setDifficulty] = useState<Difficulty>("Sedang");
  const [gradeLevel, setGradeLevel] = useState<"X" | "XI" | "XII">("XI");
  const [count, setCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          difficulty,
          gradeLevel,
          count,
          saveToSupabase: false,
        }),
      });

      const payload = (await response.json()) as {
        questions?: GeneratedQuestion[];
        demo?: boolean;
        message?: string;
      };

      if (!response.ok || !payload.questions) {
        toast.error(payload.message ?? "Generator belum berhasil.");
        return;
      }

      setQuestions(payload.questions);
      toast.success(payload.demo ? "Soal demo berhasil dibuat." : "Soal AI berhasil dibuat.");
    } catch {
      toast.error("Generator belum dapat dihubungi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <Card>
        <CardHeader>
          <Badge variant="default">
            <Bot className="mr-1 size-3" aria-hidden />
            Generator
          </Badge>
          <CardTitle>Generate Soal AI</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            Atur topik, kelas, tingkat kesulitan, dan jumlah soal.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleGenerate}>
            <div className="space-y-2">
              <Label htmlFor="topic">Topik</Label>
              <select
                id="topic"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                className="focus-ring h-11 w-full rounded-xl border border-input bg-white/80 px-4 text-sm font-semibold dark:bg-white/5"
              >
                {battleTopics.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Tingkat</Label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(event) => setDifficulty(event.target.value as Difficulty)}
                  className="focus-ring h-11 w-full rounded-xl border border-input bg-white/80 px-4 text-sm font-semibold dark:bg-white/5"
                >
                  <option>Mudah</option>
                  <option>Sedang</option>
                  <option>Sulit</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Kelas</Label>
                <select
                  id="grade"
                  value={gradeLevel}
                  onChange={(event) =>
                    setGradeLevel(event.target.value as "X" | "XI" | "XII")
                  }
                  className="focus-ring h-11 w-full rounded-xl border border-input bg-white/80 px-4 text-sm font-semibold dark:bg-white/5"
                >
                  <option>X</option>
                  <option>XI</option>
                  <option>XII</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="count">Jumlah Soal</Label>
              <Input
                id="count"
                type="number"
                min={1}
                max={20}
                value={count}
                onChange={(event) => setCount(Number(event.target.value))}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Sparkles aria-hidden />
              {isLoading ? "Membuat soal..." : "Generate Soal AI"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hasil Generate</CardTitle>
          <p className="text-sm text-muted-foreground">
            Soal dapat direview sebelum disimpan ke paket soal.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="font-bold">Belum ada soal</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Klik generate untuk membuat daftar soal baru.
              </p>
            </div>
          ) : (
            questions.map((question, index) => (
              <div
                key={`${question.question}-${index}`}
                className="rounded-2xl border border-border bg-white/70 p-4 dark:bg-white/5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="outline">Soal {index + 1}</Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      void navigator.clipboard.writeText(JSON.stringify(question, null, 2));
                      toast.success("Soal disalin.");
                    }}
                  >
                    <Copy aria-hidden />
                    Salin
                  </Button>
                </div>
                <p className="mt-3 font-bold leading-7">{question.question}</p>
                {question.question.includes("\\") ? (
                  <MathFormula value={question.question} />
                ) : null}
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {question.options.map((option) => (
                    <div
                      key={option}
                      className="rounded-xl bg-secondary px-3 py-2 text-sm font-semibold"
                    >
                      {option}
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-sm">
                  <span className="font-bold">Jawaban:</span> {question.answer}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {question.explanation}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
