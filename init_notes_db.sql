-- Supabase Notes Database Initialization Script

-- Create notes table
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  content text,
  summary text,
  summarized_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.notes enable row level security;

-- Drop existing policies if any
drop policy if exists "read own notes" on public.notes;
drop policy if exists "modify own notes" on public.notes;

-- RLS Policy: Read own notes
create policy "read own notes" on public.notes
for select to authenticated
using (auth.uid() = user_id);

-- RLS Policy: Insert / Update / Delete own notes
create policy "modify own notes" on public.notes
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Trigger to automatically update updated_at timestamp
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_set_updated_at on public.notes;
create trigger trg_set_updated_at
before update on public.notes
for each row execute function public.set_updated_at();
