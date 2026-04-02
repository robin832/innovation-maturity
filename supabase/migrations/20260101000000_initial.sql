-- Innovation Maturity Platform — Initial Schema
-- Stores all sessions, interactions, and AI-generated reports

create extension if not exists "uuid-ossp";

-- -------------------------------------------------------
-- Sessions: one row per company analysis started
-- -------------------------------------------------------
create table public.sessions (
  id               uuid primary key default gen_random_uuid(),
  company_name     text not null,
  company_type     text,                  -- 'industrial' | 'technology'
  data_confidence  text,                  -- 'high' | 'medium' | 'low'
  overall_score    numeric(3,1),
  created_at       timestamptz default now()
);

-- -------------------------------------------------------
-- Interaction events: page views, clicks, CTA interactions
-- -------------------------------------------------------
create table public.interaction_events (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid references public.sessions(id) on delete cascade,
  event_type   text not null,             -- e.g. 'page_view', 'cta_click', 'match_unlocked'
  event_data   jsonb,
  created_at   timestamptz default now()
);

-- -------------------------------------------------------
-- Reports: full AI output persisted per session
-- -------------------------------------------------------
create table public.reports (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid references public.sessions(id) on delete cascade,
  company_name  text not null,
  report_data   jsonb not null,           -- full CompanyAnalysis object
  matches_data  jsonb,                    -- full MatchesResult object
  created_at    timestamptz default now()
);

-- Indexes
create index on public.interaction_events(session_id);
create index on public.reports(session_id);
create index on public.reports(company_name);

-- Row Level Security (open for now — add auth later)
alter table public.sessions           enable row level security;
alter table public.interaction_events enable row level security;
alter table public.reports            enable row level security;

create policy "Allow all inserts" on public.sessions           for insert with check (true);
create policy "Allow all inserts" on public.interaction_events for insert with check (true);
create policy "Allow all inserts" on public.reports            for insert with check (true);
create policy "Allow all reads"   on public.sessions           for select using (true);
create policy "Allow all reads"   on public.interaction_events for select using (true);
create policy "Allow all reads"   on public.reports            for select using (true);
create policy "Allow all updates" on public.sessions           for update using (true);
