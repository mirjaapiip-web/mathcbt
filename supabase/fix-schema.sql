-- ============================================================
-- MathBattle: QUICK FIX SQL
-- Paste this in: https://supabase.com/dashboard/project/oizltcomzvplcbsmqbbz/sql/new
-- Then click RUN
-- ============================================================

-- Fix admins table
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS school_name text;
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'admin' CHECK (role = 'admin');

-- Fix question_packages table
ALTER TABLE public.question_packages ADD COLUMN IF NOT EXISTS admin_id uuid REFERENCES public.admins(id) ON DELETE SET NULL;
ALTER TABLE public.question_packages ADD COLUMN IF NOT EXISTS title text NOT NULL DEFAULT '';
ALTER TABLE public.question_packages ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.question_packages ADD COLUMN IF NOT EXISTS grade_level text NOT NULL DEFAULT 'X' CHECK (grade_level IN ('X', 'XI', 'XII'));
ALTER TABLE public.question_packages ADD COLUMN IF NOT EXISTS topic text NOT NULL DEFAULT '';
ALTER TABLE public.question_packages ADD COLUMN IF NOT EXISTS total_questions integer NOT NULL DEFAULT 0;
ALTER TABLE public.question_packages ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Fix rooms table
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS title text NOT NULL DEFAULT '';
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS code text NOT NULL DEFAULT '';
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS timer_seconds integer NOT NULL DEFAULT 900 CHECK (timer_seconds BETWEEN 60 AND 7200);
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Add unique constraint on code (ignore if already exists)
DO $$ BEGIN
  ALTER TABLE public.rooms ADD CONSTRAINT rooms_code_key UNIQUE (code);
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS rooms_code_idx ON public.rooms (code);
CREATE INDEX IF NOT EXISTS room_participants_room_idx ON public.room_participants (room_id);
CREATE INDEX IF NOT EXISTS student_answers_room_idx ON public.student_answers (room_id);

-- set_updated_at function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN new.updated_at = now(); RETURN new; END;
$$;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS rooms_updated_at ON public.rooms;
CREATE TRIGGER rooms_updated_at BEFORE UPDATE ON public.rooms
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS question_packages_updated_at ON public.question_packages;
CREATE TRIGGER question_packages_updated_at BEFORE UPDATE ON public.question_packages
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Now insert the admin profile row (user was already created via API)
INSERT INTO public.admins (id, full_name, school_name, role)
SELECT id, 'Admin MathBattle', 'MathBattle Platform', 'admin'
FROM auth.users
WHERE email = 'adminmath@mathbattle.app'
ON CONFLICT (id) DO UPDATE SET
  school_name = EXCLUDED.school_name,
  role = EXCLUDED.role;

-- Verify
SELECT 'Fix complete!' AS status,
  (SELECT COUNT(*) FROM public.admins) AS admin_count,
  (SELECT COUNT(*) FROM auth.users WHERE email = 'adminmath@mathbattle.app') AS auth_user_count;
