-- Optional demo rows. Replace the admin_id with an existing auth user id before running.

-- insert into public.admins (id, full_name, school_name)
-- values ('00000000-0000-0000-0000-000000000000', 'Admin MathBattle', 'SMA Nusantara')
-- on conflict (id) do nothing;

-- insert into public.question_packages (admin_id, title, description, grade_level, topic, total_questions)
-- values (
--   '00000000-0000-0000-0000-000000000000',
--   'Paket Battle Turunan SMA XI',
--   'Latihan live turunan fungsi aljabar untuk battle cepat.',
--   'XI',
--   'Turunan',
--   5
-- );
