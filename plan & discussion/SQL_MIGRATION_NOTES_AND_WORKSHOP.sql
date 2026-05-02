-- ════════════════════════════════════════════════════════════════════
-- Migration: course_notes + workshop_state
-- Run this in the Supabase SQL editor (or via the CLI).
-- ════════════════════════════════════════════════════════════════════

-- ── 1. course_notes ──────────────────────────────────────────────────
-- One note per (user, course). Free-form text, autosaved from the
-- collapsible side drawer in each course page.

create table if not exists public.course_notes (
  user_id    uuid not null references auth.users(id) on delete cascade,
  course_id  int  not null,
  content    text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

alter table public.course_notes enable row level security;

drop policy if exists "course_notes_select_own" on public.course_notes;
drop policy if exists "course_notes_insert_own" on public.course_notes;
drop policy if exists "course_notes_update_own" on public.course_notes;
drop policy if exists "course_notes_delete_own" on public.course_notes;

create policy "course_notes_select_own" on public.course_notes
  for select using (auth.uid() = user_id);
create policy "course_notes_insert_own" on public.course_notes
  for insert with check (auth.uid() = user_id);
create policy "course_notes_update_own" on public.course_notes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "course_notes_delete_own" on public.course_notes
  for delete using (auth.uid() = user_id);

-- Auto-bump updated_at on update
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists course_notes_touch on public.course_notes;
create trigger course_notes_touch before update on public.course_notes
  for each row execute function public.touch_updated_at();


-- ── 2. workshop_state ────────────────────────────────────────────────
-- Generic per-field key/value store for partial workshop progress.
-- Lets users pause mid-workshop without losing inputs or AI feedback.
-- Examples:
--   workshop_key='course1_pico'   field_key='inputs.p'    value='"adults with HFrEF"'
--   workshop_key='course1_pico'   field_key='scenario'    value='"A"'
--   workshop_key='webr_advanced'  field_key='advHistory'  value='[{...}, {...}]'

create table if not exists public.workshop_state (
  user_id      uuid not null references auth.users(id) on delete cascade,
  workshop_key text not null,
  field_key    text not null,
  value        jsonb not null,
  updated_at   timestamptz not null default now(),
  primary key (user_id, workshop_key, field_key)
);

alter table public.workshop_state enable row level security;

drop policy if exists "workshop_state_select_own" on public.workshop_state;
drop policy if exists "workshop_state_insert_own" on public.workshop_state;
drop policy if exists "workshop_state_update_own" on public.workshop_state;
drop policy if exists "workshop_state_delete_own" on public.workshop_state;

create policy "workshop_state_select_own" on public.workshop_state
  for select using (auth.uid() = user_id);
create policy "workshop_state_insert_own" on public.workshop_state
  for insert with check (auth.uid() = user_id);
create policy "workshop_state_update_own" on public.workshop_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workshop_state_delete_own" on public.workshop_state
  for delete using (auth.uid() = user_id);

drop trigger if exists workshop_state_touch on public.workshop_state;
create trigger workshop_state_touch before update on public.workshop_state
  for each row execute function public.touch_updated_at();
