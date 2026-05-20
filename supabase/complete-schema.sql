-- ============================================================
-- MathBattle: Complete & Robust Setup Script
-- Run this ENTIRE script in the Supabase SQL Editor
-- ============================================================

-- 1. Extensions
create extension if not exists "pgcrypto";

-- 2. Enum types
do $$ begin
  create type public.question_type as enum ('multiple_choice', 'short_answer', 'true_false');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.difficulty_level as enum ('easy', 'medium', 'hard');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.room_status as enum ('draft', 'waiting', 'live', 'ended');
exception when duplicate_object then null; end $$;

-- 3. Base Tables Creation (Creates if completely missing)
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  class_name text not null check (char_length(class_name) between 1 and 30),
  absentee_number text not null check (char_length(absentee_number) between 1 and 10),
  device_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.question_packages (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.admins(id) on delete set null,
  title text not null default '',
  description text,
  topic text not null default '',
  total_questions integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  package_id uuid references public.question_packages(id) on delete set null,
  admin_id uuid references public.admins(id) on delete set null,
  type public.question_type not null,
  topic text not null,
  grade_level text not null check (grade_level in ('X', 'XI', 'XII')),
  difficulty public.difficulty_level not null default 'medium',
  question_text text not null,
  formula_tex text,
  options jsonb not null default '[]'::jsonb,
  answer jsonb not null,
  explanation text not null,
  points integer not null default 100 check (points > 0),
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.admins(id) on delete cascade,
  package_id uuid references public.question_packages(id) on delete set null,
  status public.room_status not null default 'draft',
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.room_participants (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  status text not null default 'joined' check (status in ('joined', 'answering', 'submitted', 'left')),
  current_score integer not null default 0,
  joined_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique (room_id, student_id)
);

create table if not exists public.student_answers (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  participant_id uuid not null references public.room_participants(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  answer jsonb not null,
  is_correct boolean,
  score_awarded integer not null default 0,
  response_time_ms integer not null default 0,
  answered_at timestamptz not null default now(),
  unique (participant_id, question_id)
);

create table if not exists public.battle_results (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  participant_id uuid not null references public.room_participants(id) on delete cascade,
  total_score integer not null default 0,
  correct_count integer not null default 0,
  wrong_count integer not null default 0,
  unanswered_count integer not null default 0,
  rank integer,
  duration_seconds integer,
  completed_at timestamptz not null default now(),
  unique (room_id, participant_id)
);

create table if not exists public.leaderboard (
  room_id uuid not null references public.rooms(id) on delete cascade,
  participant_id uuid not null references public.room_participants(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  display_name text not null,
  class_name text not null,
  score integer not null default 0,
  correct_count integer not null default 0,
  rank integer,
  updated_at timestamptz not null default now(),
  primary key (room_id, participant_id)
);

-- 4. Alter Tables (Ensures ALL missing columns are added if the table already existed but was incomplete)
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS school_name text;
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'admin' CHECK (role = 'admin');

ALTER TABLE public.students ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT '';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS class_name text NOT NULL DEFAULT '';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS absentee_number text NOT NULL DEFAULT '';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS device_id text;

ALTER TABLE public.question_packages ADD COLUMN IF NOT EXISTS title text NOT NULL DEFAULT '';
ALTER TABLE public.question_packages ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.question_packages ADD COLUMN IF NOT EXISTS grade_level text NOT NULL DEFAULT 'X' CHECK (grade_level IN ('X', 'XI', 'XII'));
ALTER TABLE public.question_packages ADD COLUMN IF NOT EXISTS topic text NOT NULL DEFAULT '';
ALTER TABLE public.question_packages ADD COLUMN IF NOT EXISTS total_questions integer NOT NULL DEFAULT 0;
ALTER TABLE public.question_packages ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS title text NOT NULL DEFAULT '';
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS code text NOT NULL DEFAULT '';
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS timer_seconds integer NOT NULL DEFAULT 900 CHECK (timer_seconds BETWEEN 60 AND 7200);
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS topic text NOT NULL DEFAULT '';
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS grade_level text NOT NULL DEFAULT 'X';
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS question_text text NOT NULL DEFAULT '';
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS formula_tex text;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS options jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS answer jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS explanation text NOT NULL DEFAULT '';
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS points integer NOT NULL DEFAULT 100;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';

ALTER TABLE public.room_participants ADD COLUMN IF NOT EXISTS current_score integer NOT NULL DEFAULT 0;
ALTER TABLE public.room_participants ADD COLUMN IF NOT EXISTS joined_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.room_participants ADD COLUMN IF NOT EXISTS last_seen_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.student_answers ADD COLUMN IF NOT EXISTS answer jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.student_answers ADD COLUMN IF NOT EXISTS is_correct boolean;
ALTER TABLE public.student_answers ADD COLUMN IF NOT EXISTS score_awarded integer NOT NULL DEFAULT 0;
ALTER TABLE public.student_answers ADD COLUMN IF NOT EXISTS response_time_ms integer NOT NULL DEFAULT 0;
ALTER TABLE public.student_answers ADD COLUMN IF NOT EXISTS answered_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.battle_results ADD COLUMN IF NOT EXISTS total_score integer NOT NULL DEFAULT 0;
ALTER TABLE public.battle_results ADD COLUMN IF NOT EXISTS correct_count integer NOT NULL DEFAULT 0;
ALTER TABLE public.battle_results ADD COLUMN IF NOT EXISTS wrong_count integer NOT NULL DEFAULT 0;
ALTER TABLE public.battle_results ADD COLUMN IF NOT EXISTS unanswered_count integer NOT NULL DEFAULT 0;
ALTER TABLE public.battle_results ADD COLUMN IF NOT EXISTS rank integer;
ALTER TABLE public.battle_results ADD COLUMN IF NOT EXISTS duration_seconds integer;
ALTER TABLE public.battle_results ADD COLUMN IF NOT EXISTS completed_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.leaderboard ADD COLUMN IF NOT EXISTS display_name text NOT NULL DEFAULT '';
ALTER TABLE public.leaderboard ADD COLUMN IF NOT EXISTS class_name text NOT NULL DEFAULT '';
ALTER TABLE public.leaderboard ADD COLUMN IF NOT EXISTS score integer NOT NULL DEFAULT 0;
ALTER TABLE public.leaderboard ADD COLUMN IF NOT EXISTS correct_count integer NOT NULL DEFAULT 0;
ALTER TABLE public.leaderboard ADD COLUMN IF NOT EXISTS rank integer;
ALTER TABLE public.leaderboard ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Unique constraint on rooms code
DO $$ BEGIN
  ALTER TABLE public.rooms ADD CONSTRAINT rooms_code_key UNIQUE (code);
EXCEPTION WHEN duplicate_table THEN NULL; END $$;

-- 5. Indexes
create index if not exists rooms_code_idx on public.rooms (code);
create index if not exists room_participants_room_idx on public.room_participants (room_id);
create index if not exists student_answers_room_idx on public.student_answers (room_id);
create index if not exists leaderboard_room_rank_idx on public.leaderboard (room_id, rank nulls last, score desc);

-- 6. Functions & Triggers
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists question_packages_updated_at on public.question_packages;
create trigger question_packages_updated_at
before update on public.question_packages
for each row execute function public.set_updated_at();

drop trigger if exists questions_updated_at on public.questions;
create trigger questions_updated_at
before update on public.questions
for each row execute function public.set_updated_at();

drop trigger if exists rooms_updated_at on public.rooms;
create trigger rooms_updated_at
before update on public.rooms
for each row execute function public.set_updated_at();

create or replace function public.generate_room_code()
returns text language plpgsql as $$
declare
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text := '';
begin
  for i in 1..6 loop
    code := code || substr(alphabet, floor(random() * length(alphabet) + 1)::integer, 1);
  end loop;
  return code;
end; $$;

create or replace function public.refresh_leaderboard_row()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.leaderboard (
    room_id, participant_id, student_id, display_name, class_name, score, correct_count, updated_at
  )
  select
    rp.room_id, rp.id, s.id, s.name, s.class_name,
    coalesce(sum(sa.score_awarded), 0)::integer,
    coalesce(sum(case when sa.is_correct then 1 else 0 end), 0)::integer,
    now()
  from public.room_participants rp
  join public.students s on s.id = rp.student_id
  left join public.student_answers sa on sa.participant_id = rp.id
  where rp.id = new.participant_id
  group by rp.room_id, rp.id, s.id, s.name, s.class_name
  on conflict (room_id, participant_id) do update set
    score = excluded.score,
    correct_count = excluded.correct_count,
    updated_at = now();

  update public.room_participants rp
  set current_score = lb.score, last_seen_at = now()
  from public.leaderboard lb
  where lb.participant_id = rp.id and rp.id = new.participant_id;

  return new;
end; $$;

drop trigger if exists refresh_leaderboard_after_answer on public.student_answers;
create trigger refresh_leaderboard_after_answer
after insert or update on public.student_answers
for each row execute function public.refresh_leaderboard_row();

-- 7. Enable RLS
alter table public.admins enable row level security;
alter table public.students enable row level security;
alter table public.question_packages enable row level security;
alter table public.questions enable row level security;
alter table public.rooms enable row level security;
alter table public.room_participants enable row level security;
alter table public.student_answers enable row level security;
alter table public.battle_results enable row level security;
alter table public.leaderboard enable row level security;

-- 8. Admin User Setup (links your Auth user to the admins profile table)
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS email text;

INSERT INTO public.admins (id, email, full_name, school_name, role)
SELECT id, 'adminmath@mathbattle.app', 'Admin MathBattle', 'MathBattle Platform', 'admin'
FROM auth.users
WHERE email = 'adminmath@mathbattle.app'
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  school_name = EXCLUDED.school_name,
  role = EXCLUDED.role;

-- Done!
select 'Schema completely fixed and updated!' as status;
