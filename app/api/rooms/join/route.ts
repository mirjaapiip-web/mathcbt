import { NextResponse } from "next/server";
import { z } from "zod";
import { joinRoomAsStudent } from "@/lib/supabase/queries";

const joinSchema = z.object({
  name: z.string().min(2),
  className: z.string().min(1),
  absenteeNumber: z.string().min(1),
  roomCode: z.string().min(4),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = joinSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data masuk room belum lengkap." },
      { status: 400 },
    );
  }

  const result = await joinRoomAsStudent(parsed.data);

  if (!result.ok) {
    return NextResponse.json(
      { message: result.message ?? "Belum dapat masuk room." },
      { status: 404 },
    );
  }

  return NextResponse.json(result);
}
