export type UserRole = "admin" | "student";

export type Difficulty = "Mudah" | "Sedang" | "Sulit";

export type QuestionType = "Pilihan Ganda" | "Jawaban Singkat" | "Benar/Salah";

export type RoomStatus = "Menunggu" | "Berlangsung" | "Selesai";

export type StudentProfile = {
  id: string;
  name: string;
  className: string;
  absenteeNumber: string;
};

export type MathQuestion = {
  id: string;
  packageId: string;
  type: QuestionType;
  topic: string;
  gradeLevel: "X" | "XI" | "XII";
  difficulty: Difficulty;
  question: string;
  formula?: string;
  options?: string[];
  answer: string;
  explanation: string;
  points: number;
};

export type BattleRoom = {
  id: string;
  code: string;
  title: string;
  topic: string;
  gradeLevel: "X" | "XI" | "XII";
  status: RoomStatus;
  participantCount: number;
  timerSeconds: number;
  startsAt: string;
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  className: string;
  score: number;
  correct: number;
  answerSpeed: string;
  trend: "up" | "down" | "same";
};

export type PerformancePoint = {
  label: string;
  nilai: number;
  rataRata: number;
};

export type AdminMetric = {
  label: string;
  value: string;
  delta: string;
  tone: "blue" | "cyan" | "green" | "amber";
};

export type AiQuestionRequest = {
  topic: string;
  difficulty: Difficulty;
  gradeLevel: "X" | "XI" | "XII";
  count: number;
};

export type GeneratedQuestion = {
  question: string;
  type: "multiple_choice" | "short_answer" | "true_false";
  options: string[];
  answer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  gradeLevel: "X" | "XI" | "XII";
};
