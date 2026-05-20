import Link from "next/link";
import {
  Activity,
  Bot,
  DoorOpen,
  GraduationCap,
  Plus,
  Trophy,
  UsersRound,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { PerformanceChart } from "@/components/charts/performance-chart";
import { LeaderboardList } from "@/components/leaderboard-list";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminMetrics, leaderboard, performanceSeries, rooms } from "@/lib/mock-data";

export const metadata = {
  title: "Dashboard Admin",
};

const metricIcons = [UsersRound, DoorOpen, Activity, Bot];

export default function AdminDashboardPage() {
  return (
    <AdminShell active="dashboard">
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Badge variant="default">Dashboard Admin</Badge>
            <h1 className="mt-3 text-3xl font-black tracking-normal md:text-4xl">
              Monitor battle matematika hari ini
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Pantau total siswa, room aktif, performa topik, dan paket soal dari satu panel.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/admin/questions">
                <Plus aria-hidden />
                Tambah Soal
              </Link>
            </Button>
            <Button asChild>
              <Link href="/admin/rooms">
                <DoorOpen aria-hidden />
                Buat Room
              </Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {adminMetrics.map((metric, index) => (
            <StatCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              helper={metric.delta}
              tone={metric.tone}
              icon={metricIcons[index] ?? Activity}
            />
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_420px]">
          <Card>
            <CardHeader>
              <CardTitle>Grafik Performa</CardTitle>
              <p className="text-sm text-muted-foreground">
                Nilai siswa per topik dibandingkan rata-rata room.
              </p>
            </CardHeader>
            <CardContent>
              <PerformanceChart data={performanceSeries} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="size-5 text-amber-600" aria-hidden />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardList entries={leaderboard} compact />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {rooms.map((room) => (
            <Card key={room.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <Badge
                    variant={
                      room.status === "Berlangsung"
                        ? "success"
                        : room.status === "Menunggu"
                          ? "warning"
                          : "outline"
                    }
                  >
                    {room.status}
                  </Badge>
                  <span className="rounded-xl bg-secondary px-3 py-1 text-sm font-black text-primary">
                    {room.code}
                  </span>
                </div>
                <CardTitle>{room.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-secondary p-3">
                    <GraduationCap className="mb-2 size-5 text-primary" aria-hidden />
                    <p className="font-bold">Kelas {room.gradeLevel}</p>
                    <p className="text-muted-foreground">{room.topic}</p>
                  </div>
                  <div className="rounded-xl bg-secondary p-3">
                    <UsersRound className="mb-2 size-5 text-primary" aria-hidden />
                    <p className="font-bold">{room.participantCount} siswa</p>
                    <p className="text-muted-foreground">{room.startsAt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </AdminShell>
  );
}
