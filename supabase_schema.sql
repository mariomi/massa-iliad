-- Supabase schema for Iliad Ambassador app
-- Features: stores, regions, memberships, shifts, time entries, sales, products, comments
-- Roles: admin (global), manager (by region/store), agent (store)

-- Extensions
create extension if not exists pgcrypto;
create extension if not exists citext;

-- Enums
do $$ begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type app_role as enum ('admin','manager','agent');
  end if;
  if not exists (select 1 from pg_type where typname = 'store_role') then
    create type store_role as enum ('manager','staff','viewer');
  end if;
  if not exists (select 1 from pg_type where typname = 'product_category') then
    create type product_category as enum ('SIM','FIBRE','ACCESSORY');
  end if;
end $$;

-- Helper timestamps
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Profiles (application roles)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext unique,
  full_name text,
  app_role app_role not null default 'agent',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_profiles_updated_at
before update on public.profiles for each row execute function set_updated_at();

-- Regions
create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_regions_updated_at
before update on public.regions for each row execute function set_updated_at();

-- Stores
create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  region_id uuid references public.regions(id) on delete set null,
  name text not null,
  address text,
  timezone text not null default 'Europe/Rome',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_stores_region on public.stores(region_id);
create index if not exists idx_stores_active on public.stores(active);
create trigger trg_stores_updated_at
before update on public.stores for each row execute function set_updated_at();

-- Region managers (user -> region)
create table if not exists public.region_managers (
  user_id uuid not null references auth.users(id) on delete cascade,
  region_id uuid not null references public.regions(id) on delete cascade,
  primary key (user_id, region_id)
);
create index if not exists idx_region_managers_region on public.region_managers(region_id);

-- Store memberships (user -> store + role)
create table if not exists public.store_memberships (
  user_id uuid not null references auth.users(id) on delete cascade,
  store_id uuid not null references public.stores(id) on delete cascade,
  role store_role not null default 'viewer',
  created_at timestamptz not null default now(),
  primary key (user_id, store_id)
);
create index if not exists idx_store_memberships_store on public.store_memberships(store_id);
create index if not exists idx_store_memberships_user on public.store_memberships(user_id);

-- Shifts (planned work)
create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  start_at timestamptz not null,
  end_at timestamptz not null,
  published boolean not null default false,
  note text,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_shift_time check (end_at > start_at)
);
create index if not exists idx_shifts_store_time on public.shifts(store_id, start_at, end_at);
create trigger trg_shifts_updated_at
before update on public.shifts for each row execute function set_updated_at();

-- Shift assignments (who is planned)
create table if not exists public.shift_assignments (
  shift_id uuid not null references public.shifts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  primary key (shift_id, user_id)
);
create index if not exists idx_shift_assignments_user on public.shift_assignments(user_id);

-- Shift comments (agents/managers can comment)
create table if not exists public.shift_comments (
  id uuid primary key default gen_random_uuid(),
  shift_id uuid not null references public.shifts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_shift_comments_shift on public.shift_comments(shift_id);

-- Time entries (clock in/out)
create table if not exists public.time_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  store_id uuid not null references public.stores(id) on delete cascade,
  shift_id uuid references public.shifts(id) on delete set null,
  clock_in_at timestamptz not null,
  clock_out_at timestamptz,
  duration_minutes int generated always as (
    case when clock_out_at is not null then ceil(extract(epoch from (clock_out_at - clock_in_at)) / 60.0)::int else null end
  ) stored,
  source text not null default 'mobile',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_time_entry_times check (clock_out_at is null or clock_out_at > clock_in_at)
);
create index if not exists idx_time_entries_user_time on public.time_entries(user_id, clock_in_at);
create index if not exists idx_time_entries_store_time on public.time_entries(store_id, clock_in_at);
create unique index if not exists uq_time_entries_open_per_user on public.time_entries(user_id) where clock_out_at is null;
create trigger trg_time_entries_updated_at
before update on public.time_entries for each row execute function set_updated_at();

-- Products (SIM, FIBRE, etc.)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  category product_category not null,
  subtype text,
  unit_price numeric(10,2) not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_products_category on public.products(category);
create trigger trg_products_updated_at
before update on public.products for each row execute function set_updated_at();

-- Sales
create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  sold_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists idx_sales_store_time on public.sales(store_id, sold_at desc);

create table if not exists public.sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.sales(id) on delete cascade,
  product_id uuid not null references public.products(id),
  qty int not null check (qty > 0),
  unit_price numeric(10,2) not null,
  meta jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists idx_sale_items_sale on public.sale_items(sale_id);

-- Views: hours (from shift assignments)
create or replace view public.vw_hours_by_user as
select sa.user_id,
       s.store_id,
       date_trunc('day', s.start_at) as day,
       sum(extract(epoch from (s.end_at - s.start_at)) / 3600.0) as hours_planned
from public.shift_assignments sa
join public.shifts s on s.id = sa.shift_id
group by sa.user_id, s.store_id, date_trunc('day', s.start_at);

-- RBAC helper functions
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.app_role = 'admin'
  );
$$;

create or replace function public.is_region_manager(p_region_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.region_managers rm where rm.user_id = auth.uid() and rm.region_id = p_region_id
  );
$$;

create or replace function public.is_store_member(p_store_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.store_memberships m where m.user_id = auth.uid() and m.store_id = p_store_id
  ) or exists (
    select 1 from public.stores st join public.region_managers rm on rm.region_id = st.region_id
    where st.id = p_store_id and rm.user_id = auth.uid()
  ) or public.is_admin();
$$;

create or replace function public.is_store_manager(p_store_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.store_memberships m where m.user_id = auth.uid() and m.store_id = p_store_id and m.role = 'manager'
  ) or exists (
    select 1 from public.stores st join public.region_managers rm on rm.region_id = st.region_id
    where st.id = p_store_id and rm.user_id = auth.uid()
  ) or public.is_admin();
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.regions enable row level security;
alter table public.region_managers enable row level security;
alter table public.stores enable row level security;
alter table public.store_memberships enable row level security;
alter table public.shifts enable row level security;
alter table public.shift_assignments enable row level security;
alter table public.shift_comments enable row level security;
alter table public.time_entries enable row level security;
alter table public.products enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;

-- Profiles: owner can read/update self; admin can read all
create policy if not exists profiles_self_read on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy if not exists profiles_self_update on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy if not exists profiles_admin_insert on public.profiles
  for insert with check (public.is_admin());

-- Regions: read by authenticated; write by admin
create policy if not exists regions_read_all on public.regions
  for select to authenticated using (true);
create policy if not exists regions_admin_write on public.regions
  for all using (public.is_admin()) with check (public.is_admin());

-- Region managers: manager self-read; admin manage
create policy if not exists region_mgr_read on public.region_managers
  for select using (public.is_admin() or user_id = auth.uid());
create policy if not exists region_mgr_admin_write on public.region_managers
  for all using (public.is_admin()) with check (public.is_admin());

-- Stores: read by authenticated; write by admin
create policy if not exists stores_read_all on public.stores
  for select to authenticated using (true);
create policy if not exists stores_admin_write on public.stores
  for all using (public.is_admin()) with check (public.is_admin());

-- Store memberships: user sees own rows; admin sees all; admin writes
create policy if not exists memberships_self_or_admin_read on public.store_memberships
  for select using (user_id = auth.uid() or public.is_admin());
create policy if not exists memberships_admin_write on public.store_memberships
  for all using (public.is_admin()) with check (public.is_admin());

-- Shifts: members can read; managers/admin write
create policy if not exists shifts_member_read on public.shifts
  for select using (public.is_store_member(store_id));
create policy if not exists shifts_manager_write on public.shifts
  for insert with check (public.is_store_manager(store_id));
create policy if not exists shifts_manager_update on public.shifts
  for update using (public.is_store_manager(store_id)) with check (public.is_store_manager(store_id));
create policy if not exists shifts_manager_delete on public.shifts
  for delete using (public.is_store_manager(store_id));

-- Shift assignments: mirror shifts
create policy if not exists sa_member_read on public.shift_assignments
  for select using (exists (select 1 from public.shifts s where s.id = shift_id and public.is_store_member(s.store_id)));
create policy if not exists sa_manager_write on public.shift_assignments
  for all using (exists (select 1 from public.shifts s where s.id = shift_id and public.is_store_manager(s.store_id)))
  with check (exists (select 1 from public.shifts s where s.id = shift_id and public.is_store_manager(s.store_id)));

-- Shift comments: members read; members insert; owner or manager delete
create policy if not exists sc_member_read on public.shift_comments
  for select using (exists (select 1 from public.shifts s where s.id = shift_id and public.is_store_member(s.store_id)));
create policy if not exists sc_member_insert on public.shift_comments
  for insert with check (exists (select 1 from public.shifts s where s.id = shift_id and public.is_store_member(s.store_id)));
create policy if not exists sc_owner_or_manager_delete on public.shift_comments
  for delete using (
    user_id = auth.uid() or exists (select 1 from public.shifts s where s.id = shift_id and public.is_store_manager(s.store_id))
  );

-- Time entries: owner read/write; store manager read/update; insert requires membership
create policy if not exists te_owner_read on public.time_entries
  for select using (user_id = auth.uid() or public.is_store_manager(store_id));
create policy if not exists te_owner_insert on public.time_entries
  for insert with check (auth.uid() = user_id and public.is_store_member(store_id));
create policy if not exists te_owner_update on public.time_entries
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy if not exists te_mgr_update on public.time_entries
  for update using (public.is_store_manager(store_id)) with check (public.is_store_manager(store_id));

-- Products: read all authenticated; write admin
create policy if not exists products_read_all on public.products
  for select to authenticated using (true);
create policy if not exists products_admin_write on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- Sales: members read; staff/manager insert; manager update; sale items follow parent
create policy if not exists sales_member_read on public.sales
  for select using (public.is_store_member(store_id));
create policy if not exists sales_staff_insert on public.sales
  for insert with check (
    public.is_store_manager(store_id) or exists (
      select 1 from public.store_memberships m where m.user_id = auth.uid() and m.store_id = sales.store_id and m.role in ('manager','staff')
    )
  );
create policy if not exists sales_manager_update on public.sales
  for update using (public.is_store_manager(store_id)) with check (public.is_store_manager(store_id));

create policy if not exists sale_items_member_read on public.sale_items
  for select using (exists (select 1 from public.sales s where s.id = sale_id and public.is_store_member(s.store_id)));
create policy if not exists sale_items_staff_insert on public.sale_items
  for insert with check (
    exists (select 1 from public.sales s where s.id = sale_id and (
      public.is_store_manager(s.store_id) or exists (
        select 1 from public.store_memberships m where m.user_id = auth.uid() and m.store_id = s.store_id and m.role in ('manager','staff')
      )
    ))
  );
create policy if not exists sale_items_manager_update on public.sale_items
  for update using (exists (select 1 from public.sales s where s.id = sale_id and public.is_store_manager(s.store_id)))
  with check (exists (select 1 from public.sales s where s.id = sale_id and public.is_store_manager(s.store_id)));

-- Done
-- Additional reporting views
create or replace view public.vw_hours_by_user_time as
select te.user_id,
       te.store_id,
       date_trunc('day', te.clock_in_at) as day,
       sum(coalesce(te.duration_minutes, extract(epoch from (coalesce(te.clock_out_at, now()) - te.clock_in_at)) / 60.0)) as minutes_worked
from public.time_entries te
group by te.user_id, te.store_id, date_trunc('day', te.clock_in_at);

create or replace view public.vw_sales_by_store_day as
select s.store_id,
       date_trunc('day', s.sold_at) as day,
       p.category,
       coalesce(p.subtype, (sale_items.meta->>'type')) as subtype,
       count(distinct s.id) as sales_count,
       sum(si.qty) as items_qty,
       sum(si.qty * si.unit_price) as revenue
from public.sales s
join public.sale_items si on si.sale_id = s.id
join public.products p on p.id = si.product_id
group by s.store_id, date_trunc('day', s.sold_at), p.category, coalesce(p.subtype, (si.meta->>'type'));
