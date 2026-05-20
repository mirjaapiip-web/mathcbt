import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Clock3,
  GraduationCap,
  RadioTower,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { LeaderboardList } from "@/components/leaderboard-list";
import { SectionHeading } from "@/components/section-heading";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { leaderboard } from "@/lib/mock-data";

const features = [
  {
    title: "Battle Langsung",
    description: "Room berlangsung dengan timer, status jawaban, dan leaderboard otomatis.",
    icon: RadioTower,
  },
  {
    title: "Soal Matematika SMA",
    description: "Aljabar, Trigonometri, Integral, Turunan, Matriks, Logaritma, dan Peluang.",
    icon: GraduationCap,
  },
  {
    title: "Generator Soal AI",
    description: "Admin dapat membuat paket soal sesuai kelas, topik, jumlah, dan tingkat kesulitan.",
    icon: BrainCircuit,
  },
  {
    title: "RLS Supabase",
    description: "Auth admin, data siswa tanpa email, storage import, dan realtime room memakai Supabase.",
    icon: ShieldCheck,
  },
];

export default function LandingPage() {
  return (
    <div className="exam-shell min-h-screen overflow-hidden">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
        <BrandLogo />
        <nav className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost">
            <Link href="/join">Masuk Room</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/admin">Admin</Link>
          </Button>
          <ThemeToggle />
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href="/join">Masuk</Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="mx-auto grid min-h-[calc(100vh-76px)] w-full max-w-7xl items-center gap-8 px-4 pb-10 pt-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-7">
            <Badge variant="default">Arena Kompetisi Matematika SMA</Badge>
            <div className="space-y-5">
              <h1 className="text-5xl font-black leading-[1.02] tracking-normal text-foreground md:text-7xl">
                MathBattle
              </h1>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                Latihan matematika terasa seperti pertandingan. Siswa cukup memasukkan nama,
                kelas, nomor absen, dan kode room untuk langsung bertanding.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/join">
                  Mulai Battle
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/admin">Dashboard Admin</Link>
              </Button>
            </div>
            <div className="grid max-w-xl grid-cols-3 gap-3">
              {[
                ["12", "Room aktif"],
                ["1.284", "Siswa"],
                ["348", "Soal AI"],
              ].map(([value, label]) => (
                <div key={label} className="glass-panel px-4 py-3">
                  <p className="text-2xl font-black text-primary">{value}</p>
                  <p className="text-xs font-semibold text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-8 top-8 -z-10 h-72 rounded-full bg-cyan-300/30 blur-3xl" />
            <div className="surface-card overflow-hidden p-3">
              <Image
                src="/images/mathbattle-dashboard-preview.png"
                alt="Pratinjau dashboard MathBattle"
                width={1600}
                height={1000}
                priority
                className="aspect-[16/10] w-full rounded-2xl object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-4 right-4 grid gap-3 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-glow backdrop-blur-xl dark:border-white/10 dark:bg-card/80 sm:left-auto sm:w-80">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Room berlangsung</p>
                  <p className="font-black">Battle Turunan Kilat</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-black text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                  <Clock3 className="size-4" aria-hidden />
                  14:58
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-14">
          <SectionHeading
            eyebrow="Fitur"
            title="Dibuat untuk kelas matematika yang kompetitif"
            description="Satu platform untuk latihan, room live, manajemen soal, dan hasil battle yang mudah dipantau."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="p-1">
                <CardHeader>
                  <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
                    <feature.icon className="size-6" aria-hidden />
                  </span>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-5">
            <Badge variant="warning">
              <Trophy className="mr-1 size-3" aria-hidden />
              Pratinjau Peringkat
            </Badge>
            <h2 className="text-3xl font-black tracking-normal md:text-4xl">
              Peringkat terasa hidup dari awal sampai akhir.
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Guru dapat memantau peserta secara langsung, sementara siswa melihat posisi mereka
              berubah saat jawaban terkirim.
            </p>
            <Button asChild variant="secondary">
              <Link href="/battle/MB2048">Lihat Simulasi Room</Link>
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Peringkat Teratas</CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardList entries={leaderboard} />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
