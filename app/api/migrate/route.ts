import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// TEMPORARY migration endpoint — safe to remove after running once
// Secret prevents accidental re-runs
const MIGRATION_SECRET = "mathbattle-migrate-2026";

export async function POST(request: Request) {
  const { secret } = (await request.json()) as { secret?: string };
  if (secret !== MIGRATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const steps: string[] = [];
  const errors: string[] = [];

  // Helper: run a raw SQL statement via a stored-procedure trick
  // We use supabase.rpc with a one-time function we create inline
  async function runSQL(label: string, sql: string) {
    // We'll create a temp function, call it, then drop it
    const fnName = `_mb_migrate_${Date.now()}`;
    // Create function
    const createFn = `
      create or replace function public.${fnName}()
      returns text language plpgsql security definer as $$
      begin
        ${sql}
        return 'ok';
      end;
      $$;
    `;
    // We can't run arbitrary SQL via REST, so we'll use multiple targeted approaches
    // Instead, try ALTER TABLE via the schema endpoint
    steps.push(`Attempted: ${label}`);
  }

  // ─── Fix rooms table: add missing columns ───────────────────────────────────
  // Use PostgREST's undocumented /rpc feature won't work for DDL.
  // Instead, call a Postgres extension function that allows SQL execution.
  // Supabase exposes pg_net and related extensions, but not exec().

  // Best approach: use the Supabase auth admin endpoint to set up the admin user,
  // then instruct client to run the SQL through a script.

  // Create admin user via Supabase Auth Admin API
  const { data: adminUserData, error: adminUserError } = await supabase.auth.admin.createUser({
    email: "adminmath@mathbattle.app",
    password: "adminhebat",
    email_confirm: true,
    user_metadata: { username: "adminmath", full_name: "Admin MathBattle" },
  });

  if (adminUserError) {
    // If user already exists, try to update password
    if (adminUserError.message?.includes("already") || adminUserError.code === "email_exists") {
      // List users to find by email
      const { data: listData } = await supabase.auth.admin.listUsers();
      const existingUser = listData?.users?.find(u => u.email === "adminmath@mathbattle.app");
      if (existingUser) {
        const { error: updateErr } = await supabase.auth.admin.updateUserById(existingUser.id, {
          password: "adminhebat",
          email_confirm: true,
        });
        if (updateErr) {
          errors.push(`Update admin password: ${updateErr.message}`);
        } else {
          steps.push("Admin user password updated");
          // Ensure admins row exists
          await supabase.from("admins").upsert({
            id: existingUser.id,
            full_name: "Admin MathBattle",
            school_name: "MathBattle Platform",
            role: "admin",
          });
          steps.push("Admin profile upserted");
        }
      }
    } else {
      errors.push(`Create admin: ${adminUserError.message}`);
    }
  } else if (adminUserData?.user) {
    steps.push(`Admin user created: ${adminUserData.user.id}`);
    // Insert admin profile row
    const { error: profileErr } = await supabase.from("admins").upsert({
      id: adminUserData.user.id,
      full_name: "Admin MathBattle",
      school_name: "MathBattle Platform",
      role: "admin",
    });
    if (profileErr) {
      errors.push(`Admin profile: ${profileErr.message}`);
    } else {
      steps.push("Admin profile created");
    }
  }

  // Return instructions for the SQL that needs to be run manually
  const missingColumnsSql = `
-- Run this in Supabase SQL Editor to fix the rooms table:
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS title text NOT NULL DEFAULT '';
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS code text NOT NULL DEFAULT '';
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS timer_seconds integer NOT NULL DEFAULT 900;
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Add unique constraint on code (run separately if it fails):
DO $$ BEGIN
  ALTER TABLE public.rooms ADD CONSTRAINT rooms_code_key UNIQUE (code);
EXCEPTION WHEN duplicate_table THEN NULL; END $$;

-- Create index
CREATE INDEX IF NOT EXISTS rooms_code_idx ON public.rooms (code);

-- Setup triggers
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $fn$
BEGIN new.updated_at = now(); RETURN new; END;
$fn$;

DROP TRIGGER IF EXISTS rooms_updated_at ON public.rooms;
CREATE TRIGGER rooms_updated_at
BEFORE UPDATE ON public.rooms
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
`;

  return NextResponse.json({
    steps,
    errors,
    message: errors.length === 0
      ? "Admin user setup done! Now run the SQL below in Supabase SQL Editor."
      : "Partial success. Check errors and run the SQL below.",
    sqlToRun: missingColumnsSql,
  });
}
