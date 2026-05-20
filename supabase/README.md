# Supabase Setup

1. Create a new Supabase project.
2. Run `schema.sql` in the SQL editor.
3. Enable email/password authentication for admins.
4. Create one admin user in Supabase Auth, then insert the same user id into `public.admins`.
5. Copy `.env.example` to `.env.local` and fill in Supabase and OpenAI values.

Realtime tables are added to `supabase_realtime` in `schema.sql`:

- `rooms`
- `room_participants`
- `student_answers`
- `leaderboard`

Students join with only name, class, absentee number, and room code. Admins use Supabase Auth.
