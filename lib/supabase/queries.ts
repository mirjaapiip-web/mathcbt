import { createSupabaseServiceClient } from "@/lib/supabase/server";
import type { AiQuestionRequest, GeneratedQuestion } from "@/lib/types";

export async function joinRoomAsStudent(input: {
  name: string;
  className: string;
  absenteeNumber: string;
  roomCode: string;
}) {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Koneksi database belum tersedia.",
    };
  }

  const roomCode = input.roomCode.trim().toUpperCase();
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, code, status")
    .eq("code", roomCode)
    .in("status", ["waiting", "live"])
    .single();

  if (roomError || !room) {
    return {
      ok: false,
      message: "Kode room tidak ditemukan atau battle sudah selesai.",
    };
  }

  const { data: student, error: studentError } = await supabase
    .from("students")
    .insert({
      name: input.name,
      class_name: input.className,
      absentee_number: input.absenteeNumber,
    })
    .select("id")
    .single();

  if (studentError || !student) {
    return {
      ok: false,
      message: "Data siswa belum dapat disimpan.",
    };
  }

  const { data: participant, error: participantError } = await supabase
    .from("room_participants")
    .insert({
      room_id: room.id,
      student_id: student.id,
      status: "joined",
    })
    .select("id")
    .single();

  if (participantError || !participant) {
    return {
      ok: false,
      message: "Siswa belum dapat masuk ke room.",
    };
  }

  return {
    ok: true,
    demo: false,
    participantId: participant.id as string,
    roomCode,
  };
}

export async function saveGeneratedQuestions(
  request: AiQuestionRequest,
  questions: GeneratedQuestion[],
) {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return { ok: false, message: "Koneksi database belum tersedia." };
  }

  const rows = questions.map((question) => ({
    type:
      question.type === "multiple_choice"
        ? "multiple_choice"
        : question.type === "short_answer"
          ? "short_answer"
          : "true_false",
    topic: request.topic,
    grade_level: request.gradeLevel,
    difficulty:
      request.difficulty === "Mudah"
        ? "easy"
        : request.difficulty === "Sedang"
          ? "medium"
          : "hard",
    question_text: question.question,
    options: question.options,
    answer: { value: question.answer },
    explanation: question.explanation,
    points: request.difficulty === "Sulit" ? 120 : request.difficulty === "Sedang" ? 100 : 80,
    tags: ["ai-generated", request.topic.toLowerCase()],
  }));

  const { error } = await supabase.from("questions").insert(rows);

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, demo: false };
}
