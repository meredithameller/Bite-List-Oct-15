-- Bite List: schema, row-level security, and new-user profile trigger.
-- Shared catalog tables (places, badges, quests, feed_items) are read-only for signed-in users.
-- User-owned tables are private to their owner via RLS.

-- ---------------------------------------------------------------- catalog
create table public.places (
  id text primary key,
  name text not null,
  city text not null check (city in ('Tampa', 'Nashville')),
  neighborhood text not null,
  lat double precision not null,
  lng double precision not null,
  cuisines text[] not null default '{}',
  price_tier smallint not null check (price_tier between 1 and 4),
  is_new_opening boolean not null default false,
  opened_on timestamptz not null
);
create index places_city_idx on public.places (city);

create table public.badges (
  id text primary key,
  name text not null,
  icon text not null,
  description text not null
);

create table public.quests (
  id text primary key,
  title text not null,
  description text not null,
  city text not null check (city in ('Tampa', 'Nashville')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  rules text[] not null default '{}',
  reward_points integer not null check (reward_points >= 0),
  badge_id text not null references public.badges (id),
  sponsor_name text,
  criteria jsonb not null
);
create index quests_badge_id_idx on public.quests (badge_id);

create table public.feed_items (
  id text primary key,
  place_id text not null references public.places (id),
  reason text not null,
  is_sponsored boolean not null default false,
  quest_id text references public.quests (id)
);
create index feed_items_place_id_idx on public.feed_items (place_id);
create index feed_items_quest_id_idx on public.feed_items (quest_id);

-- ---------------------------------------------------------------- user-owned
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  handle text not null,
  avatar_url text not null default '',
  home_city text not null default 'Tampa' check (home_city in ('Tampa', 'Nashville')),
  cuisines text[] not null default '{}',
  budget_tier smallint not null default 2 check (budget_tier between 1 and 4),
  dietary_needs text[] not null default '{}',
  is_creator boolean not null default true,
  has_onboarded boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  place_id text not null references public.places (id),
  visited_at timestamptz not null default now(),
  total_spend numeric(10, 2) not null default 0 check (total_spend >= 0 and total_spend <= 10000),
  worth_it text not null check (worth_it in ('yes', 'meh', 'no')),
  visibility text not null default 'friends' check (visibility in ('private', 'friends', 'public')),
  trip_tag text,
  photos text[] not null default '{}',
  is_sponsored boolean not null default false,
  sponsor_name text,
  notes text not null default '',
  created_at timestamptz not null default now(),
  check (not is_sponsored or coalesce(btrim(sponsor_name), '') <> '')
);
create index visits_user_visited_idx on public.visits (user_id, visited_at desc);
create index visits_place_id_idx on public.visits (place_id);

create table public.items (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references public.visits (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (btrim(name) <> ''),
  type text not null check (type in ('dish', 'drink')),
  price numeric(10, 2) check (price is null or (price >= 0 and price <= 10000)),
  rating smallint not null check (rating between 1 and 5),
  order_again boolean not null default false,
  note text not null default '',
  photo text,
  position smallint not null default 0
);
create index items_visit_id_idx on public.items (visit_id);
create index items_user_id_idx on public.items (user_id);

create table public.wishlist (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  place_id text not null references public.places (id),
  source text not null check (source in ('friend', 'social', 'press', 'other')),
  note text not null default '',
  added_at timestamptz not null default now(),
  primary key (user_id, place_id)
);
create index wishlist_place_id_idx on public.wishlist (place_id);

create table public.quest_starts (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  quest_id text not null references public.quests (id),
  started_at timestamptz not null default now(),
  primary key (user_id, quest_id)
);
create index quest_starts_quest_id_idx on public.quest_starts (quest_id);

create table public.feed_dismissals (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  feed_item_id text not null references public.feed_items (id),
  dismissed_at timestamptz not null default now(),
  primary key (user_id, feed_item_id)
);
create index feed_dismissals_feed_item_idx on public.feed_dismissals (feed_item_id);

-- ---------------------------------------------------------------- RLS
alter table public.places enable row level security;
alter table public.badges enable row level security;
alter table public.quests enable row level security;
alter table public.feed_items enable row level security;
alter table public.profiles enable row level security;
alter table public.visits enable row level security;
alter table public.items enable row level security;
alter table public.wishlist enable row level security;
alter table public.quest_starts enable row level security;
alter table public.feed_dismissals enable row level security;

-- Catalog: signed-in users can read, nobody can write from the client.
create policy "catalog read" on public.places for select to authenticated using (true);
create policy "catalog read" on public.badges for select to authenticated using (true);
create policy "catalog read" on public.quests for select to authenticated using (true);
create policy "catalog read" on public.feed_items for select to authenticated using (true);

-- Profiles: own row only (rows are created by the signup trigger).
create policy "own profile read" on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy "own profile update" on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Visits
create policy "own visits read" on public.visits for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "own visits insert" on public.visits for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "own visits update" on public.visits for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own visits delete" on public.visits for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Items: owned, and can only be attached to the owner's own visits.
create policy "own items read" on public.items for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "own items insert" on public.items for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.visits v
      where v.id = visit_id and v.user_id = (select auth.uid())
    )
  );
create policy "own items update" on public.items for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own items delete" on public.items for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Wishlist
create policy "own wishlist read" on public.wishlist for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "own wishlist insert" on public.wishlist for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "own wishlist update" on public.wishlist for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own wishlist delete" on public.wishlist for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Quest starts
create policy "own quest starts read" on public.quest_starts for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "own quest starts insert" on public.quest_starts for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "own quest starts delete" on public.quest_starts for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Feed dismissals
create policy "own dismissals read" on public.feed_dismissals for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "own dismissals insert" on public.feed_dismissals for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "own dismissals delete" on public.feed_dismissals for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------- Data API grants
-- Explicit grants so the tables work whatever the project's default exposure setting is.
-- anon gets nothing: the app requires sign-in.
revoke all on public.places, public.badges, public.quests, public.feed_items,
  public.profiles, public.visits, public.items, public.wishlist,
  public.quest_starts, public.feed_dismissals from anon;

grant select on public.places, public.badges, public.quests, public.feed_items to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.visits, public.items, public.wishlist to authenticated;
grant select, insert, delete on public.quest_starts, public.feed_dismissals to authenticated;

-- ---------------------------------------------------------------- signup trigger
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  display_name text := coalesce(nullif(btrim(new.raw_user_meta_data ->> 'name'), ''), split_part(new.email, '@', 1));
begin
  insert into public.profiles (id, name, handle)
  values (
    new.id,
    display_name,
    '@' || lower(regexp_replace(display_name, '[^a-zA-Z0-9]+', '.', 'g'))
  );
  return new;
end;
$$;

-- Only the trigger should run this; it must not be callable through the API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
