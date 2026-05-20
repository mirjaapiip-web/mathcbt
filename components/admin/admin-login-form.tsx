"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole, User } from "lucide-react";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        access_token?: string;
        refresh_token?: string;
        message?: string;
      };

      if (!response.ok || !payload.ok) {
        toast.error(payload.message ?? "Username atau kata sandi salah.");
        setIsSubmitting(false);
        return;
      }

      // Set the session in the browser Supabase client
      const supabase = createSupabaseBrowserClient();
      if (supabase && payload.access_token && payload.refresh_token) {
        await supabase.auth.setSession({
          access_token: payload.access_token,
          refresh_token: payload.refresh_token,
        });
      }

      toast.success("Berhasil masuk sebagai admin.");
      router.push(searchParams.get("next") ?? "/admin");
      router.refresh();
    } catch {
      toast.error("Koneksi ke server gagal.");
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="username">Username Admin</Label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" />
          <Input
            id="username"
            type="text"
            required
            placeholder="adminmath"
            className="pl-11"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Kata Sandi</Label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            required
            placeholder="Masukkan kata sandi"
            className="pl-11"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Memverifikasi..." : "Masuk Admin"}
      </Button>
    </form>
  );
}
