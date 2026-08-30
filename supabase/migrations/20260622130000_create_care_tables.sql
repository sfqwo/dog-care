create table public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  breed text,
  birthdate date,
  species text,
  gender text,
  current_weight numeric(6, 2) check (current_weight is null or current_weight > 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.feedings (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  occurred_at timestamptz not null,
  grams numeric(8, 2) not null check (grams > 0),
  food text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.walks (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  started_at timestamptz not null,
  duration_min integer not null check (duration_min > 0),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vet_visits (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  scheduled_at timestamptz not null,
  title text not null check (length(trim(title)) > 0),
  clinic text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, pet_id)
);

create table public.weight_entries (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  measured_at timestamptz not null,
  weight numeric(6, 2) not null check (weight > 0),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.wellness_entries (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  observed_at timestamptz not null,
  appetite text not null check (appetite in ('normal', 'reduced', 'none', 'increased')),
  activity text not null check (activity in ('normal', 'reduced', 'low', 'high')),
  stool text not null check (stool in ('normal', 'soft', 'diarrhea', 'constipation')),
  vomiting boolean not null default false,
  itching boolean not null default false,
  temperature numeric(4, 1),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  title text not null check (length(trim(title)) > 0),
  due_at timestamptz not null,
  category text not null check (category in ('walk', 'feeding', 'vet', 'treatment', 'birthday', 'other')),
  repeat text not null default 'none' check (repeat in ('none', 'daily', 'weekly', 'monthly', 'yearly')),
  repeat_until timestamptz,
  yearly_month smallint check (yearly_month between 1 and 12),
  yearly_day smallint check (yearly_day between 1 and 31),
  note text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (repeat_until is null or repeat_until >= due_at),
  unique (id, pet_id)
);

create table public.medication_courses (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  reminder_id uuid unique,
  name text not null check (length(trim(name)) > 0),
  dosage text not null check (length(trim(dosage)) > 0),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  dose_time time not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at >= starts_at),
  constraint medication_courses_reminder_pet_fk
    foreign key (reminder_id, pet_id)
    references public.reminders (id, pet_id)
    on delete set null (reminder_id)
);

create table public.completed_tasks (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  title text not null check (length(trim(title)) > 0),
  completed_at timestamptz not null,
  source text not null check (source in ('reminder', 'feeding', 'walk', 'vet')),
  category text check (category is null or category in ('walk', 'feeding', 'vet', 'treatment', 'birthday', 'other')),
  note text,
  detail text,
  source_ref_id uuid,
  created_at timestamptz not null default now()
);

create table public.medical_documents (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  visit_id uuid,
  document_type text not null check (document_type in ('analysis', 'prescription', 'conclusion', 'passport', 'other')),
  document_at timestamptz not null,
  title text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint medical_documents_visit_pet_fk
    foreign key (visit_id, pet_id)
    references public.vet_visits (id, pet_id)
    on delete set null (visit_id),
  unique (id, pet_id)
);

create table public.medical_document_files (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.medical_documents (id) on delete cascade,
  storage_path text not null,
  file_name text,
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  unique (document_id, storage_path)
);

create table public.vet_passports (
  pet_id uuid primary key references public.pets (id) on delete cascade,
  health_notes text,
  contraindication_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vet_vaccinations (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  vaccine_type text not null check (vaccine_type in ('core', 'rabies', 'lepto', 'optional')),
  administered_on date,
  vaccine_name text,
  manufacturer text,
  batch_number text,
  valid_until date,
  clinic text,
  reaction_notes text,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vet_treatments (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  treatment_type text not null check (treatment_type in ('deworming', 'ectoparasites')),
  administered_on date,
  product text,
  dose text,
  notes text,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vet_allergies (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  symptom_trigger text,
  reaction text,
  notes text,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index pets_owner_id_idx on public.pets (owner_id);
create index feedings_pet_occurred_at_idx on public.feedings (pet_id, occurred_at desc);
create index walks_pet_started_at_idx on public.walks (pet_id, started_at desc);
create index vet_visits_pet_scheduled_at_idx on public.vet_visits (pet_id, scheduled_at desc);
create index weight_entries_pet_measured_at_idx on public.weight_entries (pet_id, measured_at desc);
create index wellness_entries_pet_observed_at_idx on public.wellness_entries (pet_id, observed_at desc);
create index reminders_pet_due_at_idx on public.reminders (pet_id, due_at);
create index medication_courses_pet_starts_at_idx on public.medication_courses (pet_id, starts_at desc);
create index completed_tasks_pet_completed_at_idx on public.completed_tasks (pet_id, completed_at desc);
create index medical_documents_pet_document_at_idx on public.medical_documents (pet_id, document_at desc);
create index medical_document_files_document_id_idx on public.medical_document_files (document_id);
create index vet_vaccinations_pet_type_idx on public.vet_vaccinations (pet_id, vaccine_type, sort_order);
create index vet_treatments_pet_type_idx on public.vet_treatments (pet_id, treatment_type, sort_order);
create index vet_allergies_pet_id_idx on public.vet_allergies (pet_id, sort_order);

create function public.owns_pet(target_pet_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.pets
    where id = target_pet_id
      and owner_id = (select auth.uid())
  );
$$;

revoke all on function public.owns_pet(uuid) from public;
grant execute on function public.owns_pet(uuid) to authenticated;

alter table public.pets enable row level security;
alter table public.feedings enable row level security;
alter table public.walks enable row level security;
alter table public.vet_visits enable row level security;
alter table public.weight_entries enable row level security;
alter table public.wellness_entries enable row level security;
alter table public.reminders enable row level security;
alter table public.medication_courses enable row level security;
alter table public.completed_tasks enable row level security;
alter table public.medical_documents enable row level security;
alter table public.medical_document_files enable row level security;
alter table public.vet_passports enable row level security;
alter table public.vet_vaccinations enable row level security;
alter table public.vet_treatments enable row level security;
alter table public.vet_allergies enable row level security;

create policy "Users can manage their own pets"
on public.pets
for all
to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy "Users can manage feedings for their pets"
on public.feedings for all to authenticated
using (public.owns_pet(pet_id))
with check (public.owns_pet(pet_id));

create policy "Users can manage walks for their pets"
on public.walks for all to authenticated
using (public.owns_pet(pet_id))
with check (public.owns_pet(pet_id));

create policy "Users can manage vet visits for their pets"
on public.vet_visits for all to authenticated
using (public.owns_pet(pet_id))
with check (public.owns_pet(pet_id));

create policy "Users can manage weight entries for their pets"
on public.weight_entries for all to authenticated
using (public.owns_pet(pet_id))
with check (public.owns_pet(pet_id));

create policy "Users can manage wellness entries for their pets"
on public.wellness_entries for all to authenticated
using (public.owns_pet(pet_id))
with check (public.owns_pet(pet_id));

create policy "Users can manage reminders for their pets"
on public.reminders for all to authenticated
using (public.owns_pet(pet_id))
with check (public.owns_pet(pet_id));

create policy "Users can manage medication courses for their pets"
on public.medication_courses for all to authenticated
using (public.owns_pet(pet_id))
with check (public.owns_pet(pet_id));

create policy "Users can manage completed tasks for their pets"
on public.completed_tasks for all to authenticated
using (public.owns_pet(pet_id))
with check (public.owns_pet(pet_id));

create policy "Users can manage medical documents for their pets"
on public.medical_documents for all to authenticated
using (public.owns_pet(pet_id))
with check (public.owns_pet(pet_id));

create policy "Users can manage files for their medical documents"
on public.medical_document_files for all to authenticated
using (
  exists (
    select 1
    from public.medical_documents as document
    where document.id = medical_document_files.document_id
      and public.owns_pet(document.pet_id)
  )
)
with check (
  exists (
    select 1
    from public.medical_documents as document
    where document.id = medical_document_files.document_id
      and public.owns_pet(document.pet_id)
  )
);

create policy "Users can manage vet passports for their pets"
on public.vet_passports for all to authenticated
using (public.owns_pet(pet_id))
with check (public.owns_pet(pet_id));

create policy "Users can manage vaccinations for their pets"
on public.vet_vaccinations for all to authenticated
using (public.owns_pet(pet_id))
with check (public.owns_pet(pet_id));

create policy "Users can manage treatments for their pets"
on public.vet_treatments for all to authenticated
using (public.owns_pet(pet_id))
with check (public.owns_pet(pet_id));

create policy "Users can manage allergies for their pets"
on public.vet_allergies for all to authenticated
using (public.owns_pet(pet_id))
with check (public.owns_pet(pet_id));

grant select, insert, update, delete on
  public.pets,
  public.feedings,
  public.walks,
  public.vet_visits,
  public.weight_entries,
  public.wellness_entries,
  public.reminders,
  public.medication_courses,
  public.completed_tasks,
  public.medical_documents,
  public.medical_document_files,
  public.vet_passports,
  public.vet_vaccinations,
  public.vet_treatments,
  public.vet_allergies
to authenticated;

create trigger pets_set_updated_at before update on public.pets
for each row execute function public.set_updated_at();
create trigger feedings_set_updated_at before update on public.feedings
for each row execute function public.set_updated_at();
create trigger walks_set_updated_at before update on public.walks
for each row execute function public.set_updated_at();
create trigger vet_visits_set_updated_at before update on public.vet_visits
for each row execute function public.set_updated_at();
create trigger weight_entries_set_updated_at before update on public.weight_entries
for each row execute function public.set_updated_at();
create trigger wellness_entries_set_updated_at before update on public.wellness_entries
for each row execute function public.set_updated_at();
create trigger reminders_set_updated_at before update on public.reminders
for each row execute function public.set_updated_at();
create trigger medication_courses_set_updated_at before update on public.medication_courses
for each row execute function public.set_updated_at();
create trigger medical_documents_set_updated_at before update on public.medical_documents
for each row execute function public.set_updated_at();
create trigger vet_passports_set_updated_at before update on public.vet_passports
for each row execute function public.set_updated_at();
create trigger vet_vaccinations_set_updated_at before update on public.vet_vaccinations
for each row execute function public.set_updated_at();
create trigger vet_treatments_set_updated_at before update on public.vet_treatments
for each row execute function public.set_updated_at();
create trigger vet_allergies_set_updated_at before update on public.vet_allergies
for each row execute function public.set_updated_at();
