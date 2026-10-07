-- ========================================
-- CORE REFERENCE TABLES
-- ========================================

create table if not exists operators (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  rating numeric(2,1) default 0.0,
  is_verified boolean default false,
  is_active boolean default true,
  commission_rate numeric(5,4) not null default 0.10, -- platform take rate
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists routes (
  id uuid primary key default gen_random_uuid(),
  origin_city text not null,
  origin_state text not null,
  destination_city text not null,
  destination_state text not null,
  distance_km integer,
  typical_duration_minutes integer,
  created_at timestamptz not null default now(),
  unique (origin_city, destination_city)
);

create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  operator_id uuid not null references operators(id) on delete cascade,
  vehicle_type text not null check (vehicle_type in ('bus_18','bus_32','bus_50','sienna','sedan','coaster')),
  total_capacity integer not null check (total_capacity > 0),
  plate_number text not null,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

-- ========================================
-- TRIPS (a scheduled departure)
-- ========================================

create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  operator_id uuid not null references operators(id) on delete restrict,
  route_id uuid not null references routes(id) on delete restrict,
  vehicle_id uuid not null references vehicles(id) on delete restrict,
  departure_at timestamptz not null,
  arrival_estimate_at timestamptz not null,
  base_price numeric(10,2) not null check (base_price >= 0),
  total_seats integer not null check (total_seats > 0),
  available_seats integer not null check (available_seats >= 0),
  status text not null default 'scheduled'
    check (status in ('scheduled','boarding','departed','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint available_not_exceed_total check (available_seats <= total_seats)
);

create index if not exists idx_trips_search on trips (route_id, departure_at, status)
  where status = 'scheduled';
create index if not exists idx_trips_operator on trips (operator_id, departure_at);

-- ========================================
-- BOOKINGS (the reservation + payment + ticket lifecycle)
-- ========================================

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  booking_reference text unique not null, -- e.g. GRD-7X9K2P (human-facing)
  trip_id uuid not null references trips(id) on delete restrict,
  passenger_id uuid not null references auth.users(id) on delete restrict,
  seat_count integer not null check (seat_count > 0 and seat_count <= 10),
  unit_price numeric(10,2) not null,       -- price locked at hold time
  total_amount numeric(10,2) not null,     -- seat_count * unit_price + fees
  platform_fee numeric(10,2) not null default 0,
  status text not null default 'holding'
    check (status in ('holding','payment_pending','confirmed','released','failed','cancelled','refunded')),
  hold_expires_at timestamptz,             -- null once confirmed/released
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_bookings_passenger on bookings (passenger_id, created_at desc);
create index if not exists idx_bookings_trip on bookings (trip_id);
create index if not exists idx_bookings_expiry on bookings (hold_expires_at)
  where status in ('holding','payment_pending');
create index if not exists idx_bookings_reference on bookings (booking_reference);

-- one row per named passenger on a booking (a booking can be seat_count > 1)
create table if not exists booking_passengers (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  full_name text not null,
  phone_number text not null,
  seat_label text, -- e.g. "Passenger 1" (no seat map, so this is just an index)
  created_at timestamptz not null default now()
);

-- ========================================
-- PAYMENTS (gateway-agnostic ledger)
-- ========================================

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete restrict,
  gateway text not null check (gateway in ('paystack','flutterwave')),
  gateway_reference text not null,     -- our idempotency key sent to gateway
  gateway_transaction_id text,          -- returned by gateway on success
  amount numeric(10,2) not null,
  currency text not null default 'NGN',
  status text not null default 'initiated'
    check (status in ('initiated','pending','successful','failed','abandoned')),
  raw_webhook_payload jsonb,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (gateway, gateway_reference)
);

create index if not exists idx_payments_booking on payments (booking_id);

-- ========================================
-- TICKETS
-- ========================================

create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete restrict,
  pdf_url text not null,           -- Supabase Storage path
  issued_at timestamptz not null default now(),
  boarding_status text not null default 'not_boarded'
    check (boarding_status in ('not_boarded','boarded','no_show')),
  boarded_at timestamptz,
  boarded_by uuid references auth.users(id) -- dispatch officer who checked them in
);

-- ========================================
-- AUDIT LOG (append-only)
-- ========================================

create table if not exists booking_audit_log (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  event text not null,   -- 'hold_created','payment_initiated','payment_confirmed','hold_expired', etc.
  actor uuid references auth.users(id),
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ========================================
-- OPERATOR STAFF (joining table for operator roles)
-- ========================================

create table if not exists operator_staff (
  id uuid primary key default gen_random_uuid(),
  operator_id uuid not null references operators(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'staff',
  created_at timestamptz not null default now(),
  unique (operator_id, user_id)
);

-- ========================================
-- ATOMIC HOLD STORED FUNCTION
-- ========================================

create or replace function create_booking_hold(
  p_trip_id uuid,
  p_passenger_id uuid,
  p_seat_count integer
) returns bookings
language plpgsql
security definer
as $$
declare
  v_trip trips%rowtype;
  v_booking bookings;
  v_reference text;
begin
  -- Lock the trip row so no concurrent transaction can read a stale
  -- available_seats value. This is the linchpin against overselling.
  select * into v_trip
  from trips
  where id = p_trip_id
  for update; -- row-level lock, released on commit/rollback

  if v_trip.id is null then
    raise exception 'TRIP_NOT_FOUND';
  end if;

  if v_trip.status <> 'scheduled' then
    raise exception 'TRIP_NOT_BOOKABLE';
  end if;

  if v_trip.available_seats < p_seat_count then
    raise exception 'INSUFFICIENT_SEATS';
  end if;

  -- Decrement inventory atomically
  update trips
  set available_seats = available_seats - p_seat_count,
      updated_at = now()
  where id = p_trip_id;

  v_reference := 'GRD-' || upper(substring(md5(random()::text) from 1 for 7));

  insert into bookings (
    booking_reference, trip_id, passenger_id, seat_count,
    unit_price, total_amount, status, hold_expires_at
  ) values (
    v_reference, p_trip_id, p_passenger_id, p_seat_count,
    v_trip.base_price, v_trip.base_price * p_seat_count,
    'holding', now() + interval '10 minutes'
  )
  returning * into v_booking;

  insert into booking_audit_log (booking_id, event, actor, metadata)
  values (v_booking.id, 'hold_created', p_passenger_id,
          jsonb_build_object('seat_count', p_seat_count));

  return v_booking;
end;
$$;

-- ========================================
-- HOLD EXPIRY FUNCTION & CRON
-- ========================================

create or replace function release_expired_holds() returns void
language plpgsql security definer as $$
declare
  r record;
begin
  for r in
    select id, trip_id, seat_count from bookings
    where status in ('holding','payment_pending')
    and hold_expires_at < now()
    for update skip locked  -- avoid blocking on rows another worker is handling
  loop
    update trips set available_seats = available_seats + r.seat_count
    where id = r.trip_id;

    update bookings set status = 'released', hold_expires_at = null, updated_at = now()
    where id = r.id;

    insert into booking_audit_log (booking_id, event)
    values (r.id, 'hold_expired');
  end loop;
end;
$$;

-- Try loading pg_cron scheduling if enabled/available (otherwise will raise warning but run)
-- select cron.schedule('release-expired-holds', '* * * * *', 'select release_expired_holds()');

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

alter table operators enable row level security;
alter table routes enable row level security;
alter table vehicles enable row level security;
alter table trips enable row level security;
alter table bookings enable row level security;
alter table booking_passengers enable row level security;
alter table payments enable row level security;
alter table tickets enable row level security;
alter table operator_staff enable row level security;
alter table booking_audit_log enable row level security;

-- Public tables policies (everyone can view operators, routes, trips to search)
create policy "anyone can view operators" on operators for select using (true);
create policy "anyone can view routes" on routes for select using (true);
create policy "anyone can view vehicles" on vehicles for select using (true);
create policy "anyone can view trips" on trips for select using (true);

-- Bookings policies
create policy "passengers view own bookings"
  on bookings for select
  using (auth.uid() = passenger_id);

create policy "no direct booking writes"
  on bookings for insert
  with check (false);

create policy "no direct booking updates"
  on bookings for update
  using (false);

create policy "operators view their trip bookings"
  on bookings for select
  using (
    exists (
      select 1 from trips t
      join operator_staff os on os.operator_id = t.operator_id
      where t.id = bookings.trip_id and os.user_id = auth.uid()
    )
  );

-- Booking Passengers policies
create policy "passengers view own booking passengers"
  on booking_passengers for select
  using (
    exists (select 1 from bookings b where b.id = booking_passengers.booking_id and b.passenger_id = auth.uid())
  );

create policy "operators view their trip booking passengers"
  on booking_passengers for select
  using (
    exists (
      select 1 from bookings b
      join trips t on t.id = b.trip_id
      join operator_staff os on os.operator_id = t.operator_id
      where b.id = booking_passengers.booking_id and os.user_id = auth.uid()
    )
  );

-- Payments policies
create policy "passengers view own payments"
  on payments for select
  using (
    exists (select 1 from bookings b where b.id = payments.booking_id and b.passenger_id = auth.uid())
  );

-- Tickets policies
create policy "passengers view own tickets"
  on tickets for select
  using (
    exists (select 1 from bookings b where b.id = tickets.booking_id and b.passenger_id = auth.uid())
  );

create policy "operators view their trip tickets"
  on tickets for select
  using (
    exists (
      select 1 from bookings b
      join trips t on t.id = b.trip_id
      join operator_staff os on os.operator_id = t.operator_id
      where b.id = tickets.booking_id and os.user_id = auth.uid()
    )
  );
