-- Development seed data for local/manual testing.
-- Test login:
--   email: demo@dog-care.local
--   password: DogCareTest123!

create extension if not exists pgcrypto with schema extensions;

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) values (
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'demo@dog-care.local',
  extensions.crypt('DogCareTest123!', extensions.gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"owner_name": "Демо пользователь"}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
)
on conflict (id) do update set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = now();

insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) values (
  '00000000-0000-4000-8000-000000000011',
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001',
  '{"sub": "00000000-0000-4000-8000-000000000001", "email": "demo@dog-care.local", "email_verified": true, "phone_verified": false}'::jsonb,
  'email',
  now(),
  now(),
  now()
)
on conflict (provider, provider_id) do update set
  identity_data = excluded.identity_data,
  updated_at = now();

insert into public.profiles (
  id,
  owner_name,
  phone,
  birthdate
) values (
  '00000000-0000-4000-8000-000000000001',
  'Демо пользователь',
  '+7 999 000-00-00',
  '1995-01-15'
)
on conflict (id) do update set
  owner_name = excluded.owner_name,
  phone = excluded.phone,
  birthdate = excluded.birthdate;

insert into public.pets (
  id,
  owner_id,
  name,
  breed,
  birthdate,
  species,
  gender,
  current_weight,
  notes
) values (
  '00000000-0000-4000-8000-000000000101',
  '00000000-0000-4000-8000-000000000001',
  'Боня',
  'Корги',
  '2021-05-20',
  'dog',
  'female',
  11.40,
  'Тестовый питомец для разработки'
)
on conflict (id) do update set
  owner_id = excluded.owner_id,
  name = excluded.name,
  breed = excluded.breed,
  birthdate = excluded.birthdate,
  species = excluded.species,
  gender = excluded.gender,
  current_weight = excluded.current_weight,
  notes = excluded.notes;

insert into public.feedings (
  id,
  pet_id,
  occurred_at,
  grams,
  food
) values
  ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000101', now() - interval '5 hours', 120, 'Сухой корм'),
  ('00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000101', now() - interval '1 day 4 hours', 115, 'Сухой корм')
on conflict (id) do update set
  occurred_at = excluded.occurred_at,
  grams = excluded.grams,
  food = excluded.food;

insert into public.walks (
  id,
  pet_id,
  started_at,
  duration_min,
  note
) values
  ('00000000-0000-4000-8000-000000000301', '00000000-0000-4000-8000-000000000101', now() - interval '3 hours', 35, 'Парк'),
  ('00000000-0000-4000-8000-000000000302', '00000000-0000-4000-8000-000000000101', now() - interval '1 day 8 hours', 25, 'Утренняя прогулка')
on conflict (id) do update set
  started_at = excluded.started_at,
  duration_min = excluded.duration_min,
  note = excluded.note;

insert into public.vet_visits (
  id,
  pet_id,
  scheduled_at,
  title,
  clinic,
  note
) values (
  '00000000-0000-4000-8000-000000000401',
  '00000000-0000-4000-8000-000000000101',
  now() + interval '30 minutes',
  'Плановый осмотр',
  'VetCare',
  'Проверить уши и вес'
)
on conflict (id) do update set
  scheduled_at = excluded.scheduled_at,
  title = excluded.title,
  clinic = excluded.clinic,
  note = excluded.note;

insert into public.weight_entries (
  id,
  pet_id,
  measured_at,
  weight,
  note
) values
  ('00000000-0000-4000-8000-000000000501', '00000000-0000-4000-8000-000000000101', now() - interval '28 days', 11.00, 'Начало наблюдения'),
  ('00000000-0000-4000-8000-000000000502', '00000000-0000-4000-8000-000000000101', now() - interval '14 days', 11.20, null),
  ('00000000-0000-4000-8000-000000000503', '00000000-0000-4000-8000-000000000101', now(), 11.40, 'Без изменений по самочувствию')
on conflict (id) do update set
  measured_at = excluded.measured_at,
  weight = excluded.weight,
  note = excluded.note;

insert into public.wellness_entries (
  id,
  pet_id,
  observed_at,
  appetite,
  activity,
  stool,
  vomiting,
  itching,
  temperature,
  note
) values (
  '00000000-0000-4000-8000-000000000601',
  '00000000-0000-4000-8000-000000000101',
  now() - interval '2 hours',
  'normal',
  'normal',
  'normal',
  false,
  false,
  38.4,
  'Самочувствие обычное'
)
on conflict (id) do update set
  observed_at = excluded.observed_at,
  appetite = excluded.appetite,
  activity = excluded.activity,
  stool = excluded.stool,
  vomiting = excluded.vomiting,
  itching = excluded.itching,
  temperature = excluded.temperature,
  note = excluded.note;

insert into public.reminders (
  id,
  pet_id,
  title,
  due_at,
  category,
  repeat,
  note
) values
  ('00000000-0000-4000-8000-000000000701', '00000000-0000-4000-8000-000000000101', 'Вечернее кормление', now() + interval '2 hours', 'feeding', 'daily', null),
  ('00000000-0000-4000-8000-000000000702', '00000000-0000-4000-8000-000000000101', 'Проверить таблетки', now() + interval '4 hours', 'treatment', 'none', 'Разовое напоминание')
on conflict (id) do update set
  due_at = excluded.due_at,
  title = excluded.title,
  category = excluded.category,
  repeat = excluded.repeat,
  note = excluded.note;

insert into public.vet_passports (
  pet_id,
  health_notes,
  contraindication_notes
) values (
  '00000000-0000-4000-8000-000000000101',
  'Демо-запись ветпаспорта',
  null
)
on conflict (pet_id) do update set
  health_notes = excluded.health_notes,
  contraindication_notes = excluded.contraindication_notes;
