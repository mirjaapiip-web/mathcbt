import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { saveGeneratedQuestions } from "@/lib/supabase/queries";
import type { GeneratedQuestion } from "@/lib/types";

const requestSchema = z.object({
  topic: z.string().min(2),
  difficulty: z.enum(["Mudah", "Sedang", "Sulit"]),
  gradeLevel: z.enum(["X", "XI", "XII"]),
  count: z.coerce.number().int().min(1).max(20),
  saveToSupabase: z.boolean().optional().default(false),
});

const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    questions: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          question: { type: "string" },
          type: {
            type: "string",
            enum: ["multiple_choice", "short_answer", "true_false"],
          },
          options: {
            type: "array",
            items: { type: "string" },
          },
          answer: { type: "string" },
          explanation: { type: "string" },
          difficulty: {
            type: "string",
            enum: ["easy", "medium", "hard"],
          },
          topic: { type: "string" },
          gradeLevel: { type: "string", enum: ["X", "XI", "XII"] },
        },
        required: [
          "question",
          "type",
          "options",
          "answer",
          "explanation",
          "difficulty",
          "topic",
          "gradeLevel",
        ],
      },
    },
  },
  required: ["questions"],
} as const;

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Input generator belum lengkap.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      questions: buildFallbackQuestions(input),
      demo: true,
      message: "OPENAI_API_KEY belum diatur, jadi contoh soal demo digunakan.",
    });
  }

  const client = new OpenAI({ apiKey });

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL ?? "gpt-5.4-mini",
    input: [
      {
        role: "developer",
        content:
          "You generate rigorous Indonesian SMA mathematics questions. Return valid JSON only. Use Bahasa Indonesia for every student-facing field. Keep formulas in LaTeX where useful.",
      },
      {
        role: "user",
        content: `Buat ${input.count} soal matematika SMA kelas ${input.gradeLevel} untuk topik ${input.topic} dengan tingkat ${input.difficulty}. Campurkan pilihan ganda, jawaban singkat, dan benar/salah jika relevan. Setiap pembahasan harus singkat, benar, dan mudah dipahami siswa.`,
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "mathbattle_questions",
        strict: true,
        schema: outputSchema,
      },
    },
  });

  const text = response.output_text;

  if (!text) {
    return NextResponse.json(
      { message: "AI belum mengembalikan soal." },
      { status: 502 },
    );
  }

  const generated = JSON.parse(text) as { questions: GeneratedQuestion[] };

  if (input.saveToSupabase) {
    await saveGeneratedQuestions(input, generated.questions);
  }

  return NextResponse.json({
    questions: generated.questions,
    demo: false,
  });
}

function buildFallbackQuestions(input: z.infer<typeof requestSchema>) {
  const difficultyMap = {
    Mudah: "easy",
    Sedang: "medium",
    Sulit: "hard",
  } as const;

  return Array.from({ length: input.count }, (_, index) => {
    const number = index + 1;
    return {
      question: `Soal demo ${number}: Tentukan nilai x yang memenuhi 2x + ${number} = ${
        10 + number
      }.`,
      type: "multiple_choice",
      options: ["3", "4", "5", "6"],
      answer: "5",
      explanation: `Kurangi kedua ruas dengan ${number}, lalu bagi dengan 2 sehingga x = 5.`,
      difficulty: difficultyMap[input.difficulty],
      topic: input.topic,
      gradeLevel: input.gradeLevel,
    };
  });
}
