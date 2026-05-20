// MathBattle Migration Script
// Run: node scripts/migrate.mjs
// This creates admin user and fixes the rooms table via Supabase Admin API

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://oizltcomzvplcbsmqbbz.supabase.co";
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pemx0Y29tenZwbGNic21xYmJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTA4OTIzMCwiZXhwIjoyMDk0NjY1MjMwfQ.oectumxOE-FbS2foNVwRTVaAwJ_2sSF8Wm6BcW_gegw";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log("🚀 MathBattle Migration Starting...\n");

// ─────────────────────────────────────────────────────────────────
// 1. Create admin user in Supabase Auth
// ─────────────────────────────────────────────────────────────────
console.log("👤 Setting up admin user (adminmath / adminhebat)...");
const ADMIN_EMAIL = "adminmath@mathbattle.app";
const ADMIN_PASSWORD = "adminhebat";

let adminUserId = null;

// Check if user already exists
const { data: listData, error: listErr } = await supabase.auth.admin.listUsers();
if (listErr) {
  console.error("  ❌ Could not list users:", listErr.message);
} else {
  const existing = listData?.users?.find((u) => u.email === ADMIN_EMAIL);
  if (existing) {
    adminUserId = existing.id;
    console.log("  ℹ️  Admin user already exists:", adminUserId);
    // Update password to make sure it's correct
    const { error: upErr } = await supabase.auth.admin.updateUserById(adminUserId, {
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });
    if (upErr) console.error("  ❌ Password update error:", upErr.message);
    else console.log("  ✅ Admin password reset to: adminhebat");
  } else {
    const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { username: "adminmath", full_name: "Admin MathBattle" },
    });
    if (createErr) {
      console.error("  ❌ Create user error:", createErr.message);
    } else {
      adminUserId = newUser.user.id;
      console.log("  ✅ Admin user created:", adminUserId);
    }
  }
}

// ─────────────────────────────────────────────────────────────────
// 2. Ensure admins table row exists
// ─────────────────────────────────────────────────────────────────
if (adminUserId) {
  console.log("\n📋 Creating admin profile row...");
  const { error: profileErr } = await supabase.from("admins").upsert(
    {
      id: adminUserId,
      full_name: "Admin MathBattle",
      school_name: "MathBattle Platform",
      role: "admin",
    },
    { onConflict: "id" }
  );
  if (profileErr) {
    console.error("  ❌ Admin profile error:", profileErr.message);
  } else {
    console.log("  ✅ Admin profile OK");
  }
}

// ─────────────────────────────────────────────────────────────────
// 3. Check & report rooms table status
// ─────────────────────────────────────────────────────────────────
console.log("\n🔍 Checking rooms table columns...");
const colsToCheck = ["id", "title", "code", "status", "timer_seconds", "updated_at"];
const missingCols = [];

for (const col of colsToCheck) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/rooms?select=${col}&limit=0`,
      {
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
        },
      }
    );
    if (res.ok) {
      console.log(`  ✅ Column "${col}" exists`);
    } else {
      const json = await res.json();
      if (json.message?.includes("does not exist")) {
        missingCols.push(col);
        console.log(`  ❌ Column "${col}" MISSING`);
      }
    }
  } catch {
    console.log(`  ⚠️  Could not check "${col}"`);
  }
}

// ─────────────────────────────────────────────────────────────────
// 4. Print the SQL needed to fix missing columns
// ─────────────────────────────────────────────────────────────────
if (missingCols.length > 0) {
  console.log("\n⚠️  ROOMS TABLE IS MISSING COLUMNS. Run this SQL in Supabase SQL Editor:");
  console.log("   https://supabase.com/dashboard/project/oizltcomzvplcbsmqbbz/sql/new\n");
  console.log("─".repeat(70));
  console.log(`-- Fix missing columns in rooms table
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS title text NOT NULL DEFAULT '';
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS code text NOT NULL DEFAULT '';
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS timer_seconds integer NOT NULL DEFAULT 900 CHECK (timer_seconds BETWEEN 60 AND 7200);
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Unique constraint on code
DO $$ BEGIN
  ALTER TABLE public.rooms ADD CONSTRAINT rooms_code_key UNIQUE (code);
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

-- Index
CREATE INDEX IF NOT EXISTS rooms_code_idx ON public.rooms (code);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $fn$
BEGIN new.updated_at = now(); RETURN new; END;
$fn$;

DROP TRIGGER IF EXISTS rooms_updated_at ON public.rooms;
CREATE TRIGGER rooms_updated_at
BEFORE UPDATE ON public.rooms
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

SELECT 'rooms table fixed!' AS status;`);
  console.log("─".repeat(70));
} else {
  console.log("\n✅ All rooms columns are present!");
}

console.log("\n✅ Migration script complete!");
