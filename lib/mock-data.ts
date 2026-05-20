import type {
  AdminMetric,
  BattleRoom,
  LeaderboardEntry,
  MathQuestion,
  PerformancePoint,
} from "@/lib/types";

export const battleTopics = [
  "Aljabar",
  "Trigonometri",
  "Integral",
  "Turunan",
  "Matriks",
  "Logaritma",
  "Peluang",
];

export const adminMetrics: AdminMetric[] = [
  {
    label: "Total Siswa",
    value: "1.284",
    delta: "+18% minggu ini",
    tone: "blue",
  },
  {
    label: "Room Aktif",
    value: "12",
    delta: "4 sedang live",
    tone: "cyan",
  },
  {
    label: "Rata-rata Nilai",
    value: "82,6",
    delta: "+6,4 dari bulan lalu",
    tone: "green",
  },
  {
    label: "Soal AI",
    value: "348",
    delta: "42 siap review",
    tone: "amber",
  },
];

export const rooms: BattleRoom[] = [
  {
    id: "room-1",
    code: "MB2048",
    title: "Battle Turunan Kilat",
    topic: "Turunan",
    gradeLevel: "XI",
    status: "Berlangsung",
    participantCount: 36,
    timerSeconds: 900,
    startsAt: "10.30 WIB",
  },
  {
    id: "room-2",
    code: "TRIG21",
    title: "Trigonometri Nasional",
    topic: "Trigonometri",
    gradeLevel: "X",
    status: "Menunggu",
    participantCount: 18,
    timerSeconds: 1200,
    startsAt: "13.00 WIB",
  },
  {
    id: "room-3",
    code: "INT512",
    title: "Integral Challenge",
    topic: "Integral",
    gradeLevel: "XII",
    status: "Selesai",
    participantCount: 44,
    timerSeconds: 1500,
    startsAt: "Kemarin",
  },
];

export const questions: MathQuestion[] = [
  {
    id: "q-1",
    packageId: "pkg-1",
    type: "Pilihan Ganda",
    topic: "Turunan",
    gradeLevel: "XI",
    difficulty: "Sedang",
    question: "Jika fungsi berikut diberikan, berapakah nilai turunannya pada x = 2?",
    formula: "f(x)=3x^2-4x+7",
    options: ["8", "10", "12", "14"],
    answer: "8",
    explanation:
      "Turunan f(x) adalah 6x - 4. Ketika x = 2, nilainya 12 - 4 = 8.",
    points: 100,
  },
  {
    id: "q-2",
    packageId: "pkg-1",
    type: "Pilihan Ganda",
    topic: "Logaritma",
    gradeLevel: "X",
    difficulty: "Mudah",
    question: "Sederhanakan bentuk logaritma berikut.",
    formula: "\\log_2 32",
    options: ["4", "5", "6", "8"],
    answer: "5",
    explanation:
      "Karena 2 pangkat 5 sama dengan 32, maka log basis 2 dari 32 adalah 5.",
    points: 80,
  },
  {
    id: "q-3",
    packageId: "pkg-1",
    type: "Pilihan Ganda",
    topic: "Trigonometri",
    gradeLevel: "X",
    difficulty: "Sedang",
    question: "Nilai dari ekspresi trigonometri berikut adalah ...",
    formula: "\\sin^2 30^\\circ + \\cos^2 30^\\circ",
    options: ["0", "1/2", "1", "2"],
    answer: "1",
    explanation:
      "Identitas dasar trigonometri menyatakan sin kuadrat theta ditambah cos kuadrat theta selalu sama dengan 1.",
    points: 100,
  },
  {
    id: "q-4",
    packageId: "pkg-1",
    type: "Jawaban Singkat",
    topic: "Matriks",
    gradeLevel: "XI",
    difficulty: "Sulit",
    question: "Tentukan determinan matriks A.",
    formula: "A=\\begin{pmatrix}2 & 5\\\\1 & 3\\end{pmatrix}",
    answer: "1",
    explanation: "Determinan matriks 2x2 adalah ad - bc, sehingga 2(3) - 5(1) = 1.",
    points: 120,
  },
  {
    id: "q-5",
    packageId: "pkg-1",
    type: "Benar/Salah",
    topic: "Peluang",
    gradeLevel: "XII",
    difficulty: "Sedang",
    question:
      "Pernyataan berikut benar atau salah: peluang dua kejadian saling lepas terjadi bersamaan adalah 0.",
    options: ["Benar", "Salah"],
    answer: "Benar",
    explanation:
      "Dua kejadian saling lepas tidak memiliki irisan, sehingga peluang keduanya terjadi bersamaan adalah 0.",
    points: 90,
  },
];

export const leaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Nadia Putri",
    className: "XI IPA 2",
    score: 890,
    correct: 9,
    answerSpeed: "07:41",
    trend: "up",
  },
  {
    rank: 2,
    name: "Arkan Pradana",
    className: "XI IPA 1",
    score: 840,
    correct: 8,
    answerSpeed: "08:12",
    trend: "same",
  },
  {
    rank: 3,
    name: "Dewi Lestari",
    className: "XII MIPA 3",
    score: 790,
    correct: 8,
    answerSpeed: "08:49",
    trend: "up",
  },
  {
    rank: 4,
    name: "Bima Saputra",
    className: "X IPA 4",
    score: 760,
    correct: 7,
    answerSpeed: "09:20",
    trend: "down",
  },
];

export const performanceSeries: PerformancePoint[] = [
  { label: "Aljabar", nilai: 86, rataRata: 74 },
  { label: "Trigono", nilai: 78, rataRata: 70 },
  { label: "Turunan", nilai: 92, rataRata: 76 },
  { label: "Integral", nilai: 74, rataRata: 68 },
  { label: "Matriks", nilai: 88, rataRata: 73 },
  { label: "Peluang", nilai: 81, rataRata: 72 },
];

export const packageRows = [
  {
    title: "Paket Battle Turunan SMA XI",
    topic: "Turunan",
    questions: 20,
    difficulty: "Sedang",
    updatedAt: "18 Mei 2026",
  },
  {
    title: "Latihan Logaritma Cepat",
    topic: "Logaritma",
    questions: 15,
    difficulty: "Mudah",
    updatedAt: "17 Mei 2026",
  },
  {
    title: "Integral dan Luas Daerah",
    topic: "Integral",
    questions: 24,
    difficulty: "Sulit",
    updatedAt: "16 Mei 2026",
  },
];
