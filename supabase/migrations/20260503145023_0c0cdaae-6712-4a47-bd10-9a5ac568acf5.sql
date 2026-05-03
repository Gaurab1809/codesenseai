create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Untitled analysis',
  language text not null default 'javascript',
  code text not null,
  ai_response text,
  output_lang text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.analyses enable row level security;

create policy "own select" on public.analyses for select using (auth.uid() = user_id);
create policy "own insert" on public.analyses for insert with check (auth.uid() = user_id);
create policy "own update" on public.analyses for update using (auth.uid() = user_id);
create policy "own delete" on public.analyses for delete using (auth.uid() = user_id);

create index analyses_user_created_idx on public.analyses(user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger analyses_set_updated_at before update on public.analyses
for each row execute function public.set_updated_at();