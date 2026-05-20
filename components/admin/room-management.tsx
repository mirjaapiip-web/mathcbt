"use client";

import { useState } from "react";
import { Copy, DoorOpen, Play, Square, TimerReset } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { rooms } from "@/lib/mock-data";
import { generateRoomCode } from "@/lib/utils";

export function RoomManagement() {
  const [roomCode, setRoomCode] = useState(generateRoomCode());

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <Card>
        <CardHeader>
          <Badge variant="default">
            <DoorOpen className="mr-1 size-3" aria-hidden />
            Room System
          </Badge>
          <CardTitle>Buat Room Battle</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            Pilih paket soal, atur timer, lalu bagikan kode room ke siswa.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Judul Room</Label>
            <Input defaultValue="Battle Turunan Kilat" />
          </div>
          <div className="space-y-2">
            <Label>Paket Soal</Label>
            <select className="focus-ring h-11 w-full rounded-xl border border-input bg-white/80 px-4 text-sm font-semibold dark:bg-white/5">
              <option>Paket Battle Turunan SMA XI</option>
              <option>Latihan Logaritma Cepat</option>
              <option>Integral dan Luas Daerah</option>
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Timer</Label>
              <Input type="number" defaultValue={15} min={1} />
            </div>
            <div className="space-y-2">
              <Label>Kode Room</Label>
              <div className="flex gap-2">
                <Input readOnly value={roomCode} className="font-black tracking-[0.14em]" />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  title="Buat kode baru"
                  onClick={() => setRoomCode(generateRoomCode())}
                >
                  <TimerReset aria-hidden />
                </Button>
              </div>
            </div>
          </div>
          <Button className="w-full">
            <Play aria-hidden />
            Buat dan Mulai Room
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Room Aktif</CardTitle>
          <p className="text-sm text-muted-foreground">
            Monitor peserta, mulai battle, atau akhiri sesi secara langsung.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="rounded-2xl border border-border bg-white/70 p-4 dark:bg-white/5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
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
                  <p className="mt-3 text-lg font-black">{room.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {room.topic} - Kelas {room.gradeLevel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText(room.code);
                    toast.success("Kode room disalin.");
                  }}
                  className="focus-ring flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm font-black text-primary"
                >
                  {room.code}
                  <Copy className="size-4" aria-hidden />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-secondary p-3">
                  <p className="text-xs font-semibold text-muted-foreground">Peserta</p>
                  <p className="text-xl font-black">{room.participantCount}</p>
                </div>
                <div className="rounded-xl bg-secondary p-3">
                  <p className="text-xs font-semibold text-muted-foreground">Mulai</p>
                  <p className="text-xl font-black">{room.startsAt}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="secondary">
                  <Play aria-hidden />
                  Mulai
                </Button>
                <Button size="sm" variant="outline">
                  <Square aria-hidden />
                  Akhiri
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
