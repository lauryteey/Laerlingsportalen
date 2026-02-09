-- Users table with email and password
create table if not exists "users" (
  "id" uuid primary key default gen_random_uuid(),
  "email" text not null unique,
  "password" text not null
);

-- Add index on email for faster lookups
create index if not exists users_email_idx on "users" ("email");

-- Add RLS (Row Level Security) policies if needed
alter table "users" enable row level security;
