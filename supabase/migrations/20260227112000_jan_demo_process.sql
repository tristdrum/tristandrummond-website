-- Jan process demo (optional persistence)
-- Tables are prefixed jan_demo_ per project requirement.

create extension if not exists pgcrypto;

create table if not exists public.jan_demo_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  is_seed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.jan_demo_processes (
  id uuid primary key default gen_random_uuid(),
  case_ref text not null unique,
  title text not null,
  client text not null,
  stage_id text not null,
  owner_user_id uuid references public.jan_demo_users(id) on delete set null,
  skip_next boolean not null default false,
  notify_client boolean not null default false,
  needs_review boolean not null default true,
  requires_signature boolean not null default false,
  documents jsonb not null default '[]'::jsonb,
  signature text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jan_demo_activity (
  id bigint generated always as identity primary key,
  process_id uuid not null references public.jan_demo_processes(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists jan_demo_processes_stage_idx on public.jan_demo_processes(stage_id);
create index if not exists jan_demo_activity_process_idx on public.jan_demo_activity(process_id, created_at desc);

-- Seed users (idempotent by name+role)
insert into public.jan_demo_users (name, role, is_seed)
select seed.name, seed.role, true
from (
  values
    ('Lebo M.', 'Intake Agent'),
    ('Jan K.', 'Ops Lead'),
    ('Priya N.', 'Compliance Officer'),
    ('Siyanda P.', 'Client Success')
) as seed(name, role)
where not exists (
  select 1 from public.jan_demo_users u where u.name = seed.name and u.role = seed.role
);

-- Seed processes
with seeded_users as (
  select name, id from public.jan_demo_users
),
process_seed(case_ref, title, client, stage_id, owner_name, notify_client, needs_review, requires_signature, documents, signature) as (
  values
    (
      'JAN-101',
      'Retail Onboarding Automation',
      'BrightMart',
      'intake',
      'Lebo M.',
      true,
      true,
      true,
      '["requirements-brief.pdf"]'::jsonb,
      null
    ),
    (
      'JAN-102',
      'Insurance Claims Routing',
      'Northline Insure',
      'qualification',
      'Jan K.',
      false,
      true,
      false,
      '[]'::jsonb,
      null
    ),
    (
      'JAN-103',
      'Municipal Permit Workflow',
      'Eastborough Council',
      'approval',
      'Priya N.',
      true,
      true,
      true,
      '["risk-register.xlsx"]'::jsonb,
      'Pending signature'
    )
)
insert into public.jan_demo_processes (
  case_ref,
  title,
  client,
  stage_id,
  owner_user_id,
  notify_client,
  needs_review,
  requires_signature,
  documents,
  signature
)
select
  p.case_ref,
  p.title,
  p.client,
  p.stage_id,
  u.id,
  p.notify_client,
  p.needs_review,
  p.requires_signature,
  p.documents,
  p.signature
from process_seed p
left join seeded_users u on u.name = p.owner_name
where not exists (
  select 1 from public.jan_demo_processes existing where existing.case_ref = p.case_ref
);
