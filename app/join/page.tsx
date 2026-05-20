import Link from "next/link";
import { ArrowLeft, Clock3, KeyRound, UsersRound } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { StudentJoinForm } from "@/components/student-join-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Masuk Room",
};

const joinSteps = [
  {
    icon: KeyRound,
    title: "Kode room",
    text: "Dari admin",
  },
  {
    icon: UsersRound,
    title: "Data siswa",
    text: "Nama dan kelas",
  },
  {
    icon: Clock3,
    title: "Timer langsung",
    text: "Sinkron room",
  },
];

export default function StudentJoinPage() {
  return (
    <div className="exam-shell min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <BrandLogo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft aria-hidden />
              Beranda
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-6">
          <Badge variant="default">Portal Siswa</Badge>
          <h1 className="text-4xl font-black tracking-normal md:text-5xl">
            Masuk ke room battle tanpa registrasi email.
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground">
            Isi data identitas kelas dan kode room dari guru. Setelah masuk, timer dan soal akan
            muncul otomatis.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {joinSteps.map(({ icon: Icon, title, text }) => (
              <div key={title} className="glass-panel p-4">
                <Icon className="size-6 text-primary" aria-hidden />
                <p className="mt-3 font-bold">{title}</p>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Data Peserta</CardTitle>
            <p className="text-sm text-muted-foreground">
              Gunakan kode demo MB2048 untuk mencoba simulasi.
            </p>
          </CardHeader>
          <CardContent>
            <StudentJoinForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
