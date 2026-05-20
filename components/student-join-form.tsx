"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Hash, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type JoinFormState = {
  name: string;
  className: string;
  absenteeNumber: string;
  roomCode: string;
};

const initialState: JoinFormState = {
  name: "",
  className: "",
  absenteeNumber: "",
  roomCode: "MB2048",
};

export function StudentJoinForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rooms/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        roomCode?: string;
        participantId?: string;
        demo?: boolean;
        message?: string;
      };

      if (!response.ok || !payload.ok) {
        toast.error(payload.message ?? "Kode room belum valid.");
        return;
      }

      localStorage.setItem(
        "mathbattle_student",
        JSON.stringify({
          ...form,
          participantId: payload.participantId,
        }),
      );

      toast.success(payload.demo ? "Mode demo aktif. Masuk room simulasi." : "Berhasil masuk room.");
      router.push(`/battle/${payload.roomCode ?? form.roomCode.toUpperCase()}`);
    } catch {
      toast.error("Koneksi belum stabil. Coba lagi sebentar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Nama</Label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" />
            <Input
              id="name"
              required
              placeholder="Masukkan nama lengkap"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="pl-11"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="className">Kelas</Label>
          <Input
            id="className"
            required
            placeholder="XI IPA 2"
            value={form.className}
            onChange={(event) => setForm({ ...form, className: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="absenteeNumber">Nomor Absen</Label>
          <Input
            id="absenteeNumber"
            required
            inputMode="numeric"
            placeholder="12"
            value={form.absenteeNumber}
            onChange={(event) =>
              setForm({ ...form, absenteeNumber: event.target.value })
            }
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="roomCode">Kode Room</Label>
          <div className="relative">
            <Hash className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" />
            <Input
              id="roomCode"
              required
              placeholder="MB2048"
              value={form.roomCode}
              onChange={(event) =>
                setForm({ ...form, roomCode: event.target.value.toUpperCase() })
              }
              className="pl-11 font-black uppercase tracking-[0.16em]"
            />
          </div>
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Memproses..." : "Masuk Room"}
        <ArrowRight aria-hidden />
      </Button>
    </form>
  );
}
