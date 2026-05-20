import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_USERNAME = "adminmath";
const ADMIN_PASSWORD = "adminhebat";
// This is the email mapped to the admin account in Supabase Auth
const ADMIN_EMAIL = "adminmath@mathbattle.app";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };

  if (body.username !== ADMIN_USERNAME || body.password !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { message: "Username atau kata sandi salah." },
      { status: 401 },
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json(
      { message: "Konfigurasi server belum lengkap." },
      { status: 500 },
    );
  }

  const adminClient = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Try to sign in with Supabase Auth — admin account must exist
  const { data: signInData, error: signInError } = await adminClient.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  if (signInError || !signInData.session) {
    return NextResponse.json(
      { message: "Gagal masuk ke akun admin. Pastikan akun sudah dibuat di Supabase.", detail: signInError?.message },
      { status: 401 },
    );
  }

  return NextResponse.json({
    ok: true,
    access_token: signInData.session.access_token,
    refresh_token: signInData.session.refresh_token,
  });
}
