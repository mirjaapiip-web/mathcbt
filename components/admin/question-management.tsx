"use client";

import { useMemo, useState } from "react";
import { FileUp, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { MathFormula } from "@/components/math-formula";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { packageRows, questions } from "@/lib/mock-data";
import type { Difficulty } from "@/lib/types";

export function QuestionManagement() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("Semua");
  const [difficulty, setDifficulty] = useState<Difficulty | "Semua">("Semua");

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesQuery = `${question.question} ${question.topic}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesTopic = topic === "Semua" || question.topic === topic;
      const matchesDifficulty =
        difficulty === "Semua" || question.difficulty === difficulty;

      return matchesQuery && matchesTopic && matchesDifficulty;
    });
  }, [difficulty, query, topic]);

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
      <section className="space-y-5">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Daftar Soal</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Cari, filter, edit, atau hapus soal dari paket aktif.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <FileUp aria-hidden />
                  Impor
                </Button>
                <Button>
                  <Plus aria-hidden />
                  Tambah Soal
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_160px_160px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" />
                <Input
                  placeholder="Cari soal atau topik"
                  className="pl-11"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <select
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                className="focus-ring h-11 rounded-xl border border-input bg-white/80 px-4 text-sm font-semibold dark:bg-white/5"
              >
                {["Semua", "Turunan", "Logaritma", "Trigonometri", "Matriks", "Peluang"].map(
                  (item) => (
                    <option key={item}>{item}</option>
                  ),
                )}
              </select>
              <select
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(event.target.value as Difficulty | "Semua")
                }
                className="focus-ring h-11 rounded-xl border border-input bg-white/80 px-4 text-sm font-semibold dark:bg-white/5"
              >
                {["Semua", "Mudah", "Sedang", "Sulit"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              {filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className="rounded-2xl border border-border bg-white/70 p-4 dark:bg-white/5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="default">{question.topic}</Badge>
                        <Badge variant="outline">{question.type}</Badge>
                        <Badge
                          variant={
                            question.difficulty === "Sulit"
                              ? "danger"
                              : question.difficulty === "Sedang"
                                ? "warning"
                                : "success"
                          }
                        >
                          {question.difficulty}
                        </Badge>
                      </div>
                      <p className="font-bold leading-7">{question.question}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" title="Edit soal">
                        <Pencil aria-hidden />
                      </Button>
                      <Button variant="outline" size="icon" title="Hapus soal">
                        <Trash2 aria-hidden />
                      </Button>
                    </div>
                  </div>
                  <MathFormula value={question.formula} className="mt-3" />
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {question.options?.map((option) => (
                      <div
                        key={option}
                        className="rounded-xl bg-secondary px-3 py-2 text-sm font-semibold"
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground">
              <span>
                Menampilkan {filteredQuestions.length} dari {questions.length} soal
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Sebelumnya
                </Button>
                <Button variant="outline" size="sm">
                  Berikutnya
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <aside className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Tambah Manual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Topik" defaultValue="Turunan" />
            <select className="focus-ring h-11 w-full rounded-xl border border-input bg-white/80 px-4 text-sm font-semibold dark:bg-white/5">
              <option>Pilihan Ganda</option>
              <option>Jawaban Singkat</option>
              <option>Benar/Salah</option>
            </select>
            <Textarea placeholder="Tulis soal dalam Bahasa Indonesia" />
            <Input placeholder="Formula LaTeX, opsional" />
            <Input placeholder="Jawaban benar" />
            <Textarea placeholder="Pembahasan" />
            <Button className="w-full">Simpan Soal</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paket Soal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {packageRows.map((row) => (
              <div
                key={row.title}
                className="rounded-2xl border border-border bg-white/70 p-4 dark:bg-white/5"
              >
                <p className="font-bold">{row.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {row.topic} - {row.questions} soal - {row.difficulty}
                </p>
                <p className="mt-2 text-xs font-semibold text-muted-foreground">
                  Diperbarui {row.updatedAt}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
