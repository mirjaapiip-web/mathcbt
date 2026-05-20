-- MathBattle Supabase schema
-- Run this file in the Supabase SQL editor or through `supabase db push`.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.question_type as enum ('multiple_choice', 'short_answer', 'true_false');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.difficulty_level as enum ('easy', 'medium', 'hard');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.room_status as enum ('draft', 'waiting', 'live', 'ended');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  school_name text,
  role text not null default 'admin' check (role = 'admin'),
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
  title text not null,
  description text,
  grade_level text not null check (grade_level in ('X', 'XI', 'XII')),
  topic text not null,
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
  title text not null,
  code text not null unique,
  status public.room_status not null default 'draft',
  timer_seconds integer not null default 900 check (timer_seconds between 60 and 7200),
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

create index if not exists rooms_code_idx on public.rooms (code);
create index if not exists room_participants_room_idx on public.room_participants (room_id);
create index if not exists student_answers_room_idx on public.student_answers (room_id);
create index if not exists leaderboard_room_rank_idx on public.leaderboard (room_id, rank nulls last, score desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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
returns text
language plpgsql
as $$
declare
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text := '';
begin
  for i in 1..6 loop
    code := code || substr(alphabet, floor(random() * length(alphabet) + 1)::integer, 1);
  end loop;
  return code;
end;
$$;

create or replace function public.refresh_leaderboard_row()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.leaderboard (
    room_id,
    participant_id,
    student_id,
    display_name,
    class_name,
    score,
    correct_count,
    updated_at
  )
  select
    rp.room_id,
    rp.id,
    s.id,
    s.name,
    s.class_name,
    coalesce(sum(sa.score_awarded), 0)::integer,
    coalesce(sum(case when sa.is_correct then 1 else 0 end), 0)::integer,
    now()
  from public.room_participants rp
  join public.students s on s.id = rp.student_id
  left join public.student_answers sa on sa.participant_id = rp.id
  where rp.id = new.participant_id
  group by rp.room_id, rp.id, s.id, s.name, s.class_name
  on conflict (room_id, participant_id)
  do update set
    score = excluded.score,
    correct_count = excluded.correct_count,
    updated_at = now();

  update public.room_participants rp
  set current_score = lb.score, last_seen_at = now()
  from public.leaderboard lb
  where lb.participant_id = rp.id
    and rp.id = new.participant_id;

  return new;
end;
$$;

drop trigger if exists refresh_leaderboard_after_answer on public.student_answers;
create trigger refresh_leaderboard_after_answer
after insert or update on public.student_answers
for each row execute function public.refresh_leaderboard_row();

alter table public.admins enable row level security;
alter table public.students enable row level security;
alter table public.question_packages enable row level security;
alter table public.questions enable row level security;
alter table public.rooms enable row level security;
alter table public.room_participants enable row level security;
alter table public.student_answers enable row level security;
alter table public.battle_results enable row level security;
alter table public.leaderboard enable row level security;

drop policy if exists "Admins can read own profile" on public.admins;
create policy "Admins can read own profile"
on public.admins for select
to authenticated
using (id = auth.uid());

drop policy if exists "Admins can update own profile" on public.admins;
create policy "Admins can update own profile"
on public.admins for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Authenticated users can create admin profile" on public.admins;
create policy "Authenticated users can create admin profile"
on public.admins for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "Students can join without account" on public.students;
create policy "Students can join without account"
on public.students for insert
to anon
with check (true);

drop policy if exists "Admins can read students in own rooms" on public.students;
create policy "Admins can read students in own rooms"
on public.students for select
to authenticated
using (
  exists (
    select 1
    from public.room_participants rp
    join public.rooms r on r.id = rp.room_id
    where rp.student_id = students.id
      and r.admin_id = auth.uid()
  )
);

drop policy if exists "Active room students are visible for leaderboard" on public.students;
create policy "Active room students are visible for leaderboard"
on public.students for select
to anon
using (
  exists (
    select 1
    from public.room_participants rp
    join public.rooms r on r.id = rp.room_id
    where rp.student_id = students.id
      and r.status in ('waiting', 'live', 'ended')
  )
);

drop policy if exists "Admins manage own packages" on public.question_packages;
create policy "Admins manage own packages"
on public.question_packages for all
to authenticated
using (admin_id = auth.uid())
with check (admin_id = auth.uid());

drop policy if exists "Admins manage own questions" on public.questions;
create policy "Admins manage own questions"
on public.questions for all
to authenticated
using (admin_id = auth.uid() or exists (
  select 1 from public.question_packages qp
  where qp.id = questions.package_id and qp.admin_id = auth.uid()
))
with check (admin_id = auth.uid() or exists (
  select 1 from public.question_packages qp
  where qp.id = questions.package_id and qp.admin_id = auth.uid()
));

drop policy if exists "Admins manage own rooms" on public.rooms;
create policy "Admins manage own rooms"
on public.rooms for all
to authenticated
using (admin_id = auth.uid())
with check (admin_id = auth.uid());

drop policy if exists "Students can find open rooms by code" on public.rooms;
create policy "Students can find open rooms by code"
on public.rooms for select
to anon
using (status in ('waiting', 'live'));

drop policy if exists "Students can enter open rooms" on public.room_participants;
create policy "Students can enter open rooms"
on public.room_participants for insert
to anon
with check (
  exists (
    select 1
    from public.rooms r
    where r.id = room_id
      and r.status in ('waiting', 'live')
  )
);

drop policy if exists "Active participants are visible in room" on public.room_participants;
create policy "Active participants are visible in room"
on public.room_participants for select
to anon
using (
  exists (
    select 1
    from public.rooms r
    where r.id = room_id
      and r.status in ('waiting', 'live', 'ended')
  )
);

drop policy if exists "Admins can read own participants" on public.room_participants;
create policy "Admins can read own participants"
on public.room_participants for select
to authenticated
using (
  exists (
    select 1 from public.rooms r
    where r.id = room_id and r.admin_id = auth.uid()
  )
);

drop policy if exists "Participants can submit answers while live" on public.student_answers;
create policy "Participants can submit answers while live"
on public.student_answers for insert
to anon
with check (
  exists (
    select 1
    from public.rooms r
    join public.room_participants rp on rp.room_id = r.id
    where r.id = student_answers.room_id
      and rp.id = student_answers.participant_id
      and r.status = 'live'
  )
);

drop policy if exists "Ended room answer review is visible" on public.student_answers;
create policy "Ended room answer review is visible"
on public.student_answers for select
to anon
using (
  exists (
    select 1
    from public.rooms r
    where r.id = room_id
      and r.status = 'ended'
  )
);

drop policy if exists "Admins can read own room answers" on public.student_answers;
create policy "Admins can read own room answers"
on public.student_answers for select
to authenticated
using (
  exists (
    select 1 from public.rooms r
    where r.id = room_id and r.admin_id = auth.uid()
  )
);

drop policy if exists "Ended room results are visible" on public.battle_results;
create policy "Ended room results are visible"
on public.battle_results for select
to anon
using (
  exists (
    select 1 from public.rooms r
    where r.id = room_id and r.status = 'ended'
  )
);

drop policy if exists "Admins can read own results" on public.battle_results;
create policy "Admins can read own results"
on public.battle_results for select
to authenticated
using (
  exists (
    select 1 from public.rooms r
    where r.id = room_id and r.admin_id = auth.uid()
  )
);

drop policy if exists "Leaderboard is visible for open rooms" on public.leaderboard;
create policy "Leaderboard is visible for open rooms"
on public.leaderboard for select
to anon
using (
  exists (
    select 1 from public.rooms r
    where r.id = room_id and r.status in ('waiting', 'live', 'ended')
  )
);

drop policy if exists "Admins can read own leaderboard" on public.leaderboard;
create policy "Admins can read own leaderboard"
on public.leaderboard for select
to authenticated
using (
  exists (
    select 1 from public.rooms r
    where r.id = room_id and r.admin_id = auth.uid()
  )
);

insert into storage.buckets (id, name, public)
values ('question-imports', 'question-imports', false)
on conflict (id) do nothing;

drop policy if exists "Admins can upload question imports" on storage.objects;
create policy "Admins can upload question imports"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'question-imports'
  and exists (select 1 from public.admins a where a.id = auth.uid())
);

drop policy if exists "Admins can read own question imports" on storage.objects;
create policy "Admins can read own question imports"
on storage.objects for select
to authenticated
using (
  bucket_id = 'question-imports'
  and owner = auth.uid()
);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'rooms'
  ) then
    alter publication supabase_realtime add table public.rooms;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'room_participants'
  ) then
    alter publication supabase_realtime add table public.room_participants;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'student_answers'
  ) then
    alter publication supabase_realtime add table public.student_answers;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'leaderboard'
  ) then
    alter publication supabase_realtime add table public.leaderboard;
  end if;
end $$;
