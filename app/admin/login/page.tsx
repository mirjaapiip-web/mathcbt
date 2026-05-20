import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Login Admin",
};

export default function AdminLoginPage() {
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
          <Badge variant="default">Supabase Auth</Badge>
          <h1 className="text-4xl font-black tracking-normal md:text-5xl">
            Masuk sebagai admin MathBattle.
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground">
            Admin menggunakan email dan kata sandi Supabase. Siswa tetap masuk tanpa email melalui
            kode room.
          </p>
          <div className="glass-panel p-5">
            <ShieldCheck className="size-8 text-primary" aria-hidden />
            <p className="mt-3 font-black">Row Level Security aktif</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Policy SQL membatasi akses admin ke room, soal, hasil, dan storage miliknya.
            </p>
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Login Admin</CardTitle>
            <p className="text-sm text-muted-foreground">
              Masuk menggunakan username dan kata sandi admin.
            </p>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-64" />}>
              <AdminLoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
