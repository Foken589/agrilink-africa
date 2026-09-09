-- AgriLink Africa Database Schema Migration
-- Migration: 20260909000000_agrilink_schema.sql
-- Production-quality schema for Farm Operations, Livestock Ledger, Worker Accountability,
-- Marketplace, 11-State Orders, Transporter Logistics, Cooperatives, and Audit Trails.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM (
  'farmer', 'livestock_farmer', 'poultry_farmer', 'fish_farmer', 'cattle_rearer', 
  'crop_farmer', 'cooperative', 'buyer', 'aggregator', 'transporter', 
  'agricultural_service_provider', 'worker', 'admin'
);

CREATE TYPE farm_unit_type AS ENUM (
  'poultry_house', 'fish_pond', 'cattle_herd', 'goat_sheep_pen', 
  'piggery', 'rabbitry', 'apiary', 'crop_field', 'mixed'
);

CREATE TYPE movement_type AS ENUM (
  'opening_stock', 'addition_purchase', 'birth_hatch_stocking', 
  'transfer_in', 'transfer_out', 'sale', 'mortality', 'culling'
);

CREATE TYPE task_type AS ENUM (
  'feeding', 'cleaning', 'watering', 'vaccination', 'medication', 
  'pond_maintenance', 'stocking', 'harvesting', 'weighing', 
  'egg_collection', 'milking', 'breeding', 'deworming', 
  'equipment_maintenance', 'other'
);

CREATE TYPE review_status AS ENUM (
  'pending_review', 'approved', 'rejected', 'correction_requested'
);

CREATE TYPE order_state AS ENUM (
  'REQUESTED', 'QUOTED', 'ACCEPTED', 'CONFIRMED', 'SCHEDULED', 
  'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED', 'DISPUTED', 'CANCELLED'
);

CREATE TYPE price_source_type AS ENUM (
  'verified_bulletin', 'aggregator_receipt', 'user_submitted', 'estimated_model'
);

-- 2. CORE USERS & ORGANIZATIONS
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  org_type TEXT NOT NULL DEFAULT 'cooperative',
  registration_number TEXT,
  country TEXT NOT NULL DEFAULT 'Nigeria',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'farmer',
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  avatar_url TEXT,
  country TEXT NOT NULL DEFAULT 'Nigeria',
  state_region TEXT NOT NULL DEFAULT 'Ogun State',
  verification_status TEXT NOT NULL DEFAULT 'unverified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. FARMS & PRODUCTION UNITS
CREATE TABLE IF NOT EXISTS farms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Nigeria',
  state_province TEXT NOT NULL,
  lga_district TEXT NOT NULL,
  size_hectares NUMERIC(10, 2) NOT NULL DEFAULT 1.0,
  primary_activity TEXT NOT NULL DEFAULT 'Poultry & Fish',
  coordinates_lat NUMERIC(10, 6),
  coordinates_lng NUMERIC(10, 6),
  biosecurity_level TEXT NOT NULL DEFAULT 'Standard Protocol',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS farm_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  unit_type farm_unit_type NOT NULL DEFAULT 'poultry_house',
  capacity INTEGER NOT NULL DEFAULT 1000,
  current_occupancy INTEGER NOT NULL DEFAULT 0,
  dimensions_specs TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. LIVESTOCK BATCHES & STOCK MOVEMENTS LEDGER
CREATE TABLE IF NOT EXISTS livestock_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES farm_units(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  batch_code TEXT NOT NULL UNIQUE,
  species_type TEXT NOT NULL,
  breed_strain TEXT NOT NULL,
  acquisition_date DATE NOT NULL DEFAULT CURRENT_DATE,
  supplier_name TEXT,
  opening_quantity INTEGER NOT NULL CHECK (opening_quantity >= 0),
  current_live_quantity INTEGER NOT NULL CHECK (current_live_quantity >= 0),
  age_weeks_or_months TEXT NOT NULL DEFAULT 'Day-old / Fry',
  average_weight_kg NUMERIC(8, 3) NOT NULL DEFAULT 0.040,
  biomass_kg NUMERIC(12, 3) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS livestock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID NOT NULL REFERENCES livestock_batches(id) ON DELETE CASCADE,
  movement_type movement_type NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  previous_quantity INTEGER NOT NULL CHECK (previous_quantity >= 0),
  new_quantity INTEGER NOT NULL CHECK (new_quantity >= 0),
  reference_id TEXT,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. MORTALITY RECORDS
CREATE TABLE IF NOT EXISTS mortality_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID NOT NULL REFERENCES livestock_batches(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES farm_units(id) ON DELETE CASCADE,
  number_dead INTEGER NOT NULL CHECK (number_dead > 0),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  suspected_cause TEXT NOT NULL DEFAULT 'unknown_other',
  handling_method TEXT NOT NULL DEFAULT 'buried_deep_pit',
  worker_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  evidence_photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. FEED & TREATMENTS INVENTORY
CREATE TABLE IF NOT EXISTS feed_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  manufacturer TEXT,
  protein_percentage NUMERIC(5, 2),
  standard_bag_kg NUMERIC(8, 2) NOT NULL DEFAULT 25.0,
  unit_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS feed_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  feed_type_id UUID NOT NULL REFERENCES feed_types(id) ON DELETE RESTRICT,
  current_stock_bags NUMERIC(10, 2) NOT NULL DEFAULT 0,
  current_stock_kg NUMERIC(12, 2) NOT NULL DEFAULT 0,
  low_stock_threshold_kg NUMERIC(12, 2) NOT NULL DEFAULT 100,
  storage_location TEXT,
  expiry_date DATE,
  last_restocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feed_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES farm_units(id) ON DELETE CASCADE,
  batch_id UUID NOT NULL REFERENCES livestock_batches(id) ON DELETE CASCADE,
  feed_type_id UUID NOT NULL REFERENCES feed_types(id) ON DELETE RESTRICT,
  quantity_kg NUMERIC(10, 2) NOT NULL CHECK (quantity_kg > 0),
  feeding_session TEXT NOT NULL DEFAULT 'morning',
  time_recorded TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  worker_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  photo_url TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS treatment_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES farm_units(id) ON DELETE CASCADE,
  batch_id UUID NOT NULL REFERENCES livestock_batches(id) ON DELETE CASCADE,
  treatment_type TEXT NOT NULL,
  drug_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  administration_route TEXT NOT NULL,
  administered_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  withdrawal_period_days INTEGER NOT NULL DEFAULT 0,
  withdrawal_end_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. WORKER ACCOUNTABILITY & SUPERVISOR REVIEW
CREATE TABLE IF NOT EXISTS worker_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  unit_ids UUID[] DEFAULT ARRAY[]::UUID[],
  role_title TEXT NOT NULL DEFAULT 'Attendant / Farm Hand',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS farm_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES farm_units(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  task_type task_type NOT NULL DEFAULT 'other',
  priority TEXT NOT NULL DEFAULT 'normal',
  due_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  assigned_worker_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES farm_tasks(id) ON DELETE SET NULL,
  worker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES farm_units(id) ON DELETE SET NULL,
  task_title TEXT NOT NULL,
  description TEXT,
  quantity_completed NUMERIC(10, 2),
  unit_of_measure TEXT,
  timestamp_recorded TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  issue_flag BOOLEAN NOT NULL DEFAULT FALSE,
  issue_details TEXT,
  review_status review_status NOT NULL DEFAULT 'pending_review',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_log_id UUID NOT NULL REFERENCES activity_logs(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL DEFAULT 'photo',
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size_bytes INTEGER,
  capture_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  gps_approx_lat NUMERIC(10, 6),
  gps_approx_lng NUMERIC(10, 6),
  is_tamper_flagged BOOLEAN NOT NULL DEFAULT FALSE,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evidence_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_log_id UUID NOT NULL REFERENCES activity_logs(id) ON DELETE CASCADE,
  supervisor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  review_action review_status NOT NULL,
  feedback_notes TEXT,
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. PAN-AFRICAN MARKETPLACE, RFQ & 11-STATE ORDERS
CREATE TABLE IF NOT EXISTS produce_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS produce_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  farm_id UUID REFERENCES farms(id) ON DELETE SET NULL,
  commodity_name TEXT NOT NULL,
  category_id UUID REFERENCES produce_categories(id) ON DELETE SET NULL,
  variety_breed TEXT NOT NULL,
  quantity_available NUMERIC(12, 2) NOT NULL CHECK (quantity_available >= 0),
  unit_of_measure TEXT NOT NULL DEFAULT 'kg',
  quality_grade TEXT NOT NULL DEFAULT 'Grade A',
  unit_price_expected NUMERIC(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  minimum_order_qty NUMERIC(12, 2) NOT NULL DEFAULT 1,
  availability_status TEXT NOT NULL DEFAULT 'ready_now',
  approximate_location TEXT NOT NULL,
  description TEXT,
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rfqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  commodity_needed TEXT NOT NULL,
  category_id UUID REFERENCES produce_categories(id) ON DELETE SET NULL,
  required_quantity NUMERIC(12, 2) NOT NULL,
  unit_of_measure TEXT NOT NULL DEFAULT 'kg',
  max_budget_unit NUMERIC(12, 2),
  currency TEXT NOT NULL DEFAULT 'NGN',
  delivery_destination TEXT NOT NULL,
  deadline_date DATE NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES produce_listings(id) ON DELETE SET NULL,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  offered_quantity NUMERIC(12, 2) NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL,
  total_amount NUMERIC(14, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  validity_date DATE NOT NULL,
  delivery_lead_days INTEGER NOT NULL DEFAULT 2,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  rfq_id UUID REFERENCES rfqs(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  listing_id UUID REFERENCES produce_listings(id) ON DELETE SET NULL,
  current_state order_state NOT NULL DEFAULT 'REQUESTED',
  subtotal_amount NUMERIC(14, 2) NOT NULL,
  logistics_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  platform_fee_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(14, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  shipping_address TEXT NOT NULL,
  authorized_pickup_address TEXT,
  authorized_contact_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES produce_listings(id) ON DELETE SET NULL,
  item_title TEXT NOT NULL,
  quantity NUMERIC(12, 2) NOT NULL,
  unit_of_measure TEXT NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL,
  line_total NUMERIC(14, 2) NOT NULL
);

-- 9. TRANSPORTERS & LOGISTICS
CREATE TABLE IF NOT EXISTS transporters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  business_reg TEXT,
  verified_badge BOOLEAN NOT NULL DEFAULT FALSE,
  rating_average NUMERIC(3, 2) NOT NULL DEFAULT 5.0,
  total_deliveries INTEGER NOT NULL DEFAULT 0,
  active_operating_regions TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transporter_id UUID NOT NULL REFERENCES transporters(id) ON DELETE CASCADE,
  vehicle_type TEXT NOT NULL,
  registration_plate TEXT NOT NULL,
  payload_capacity_kg INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'available'
);

CREATE TABLE IF NOT EXISTS delivery_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  transporter_id UUID REFERENCES transporters(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  pickup_contact_authorized TEXT,
  destination_address TEXT NOT NULL,
  dispatch_status TEXT NOT NULL DEFAULT 'pending_assignment',
  waybill_number TEXT NOT NULL UNIQUE,
  pickup_otp TEXT NOT NULL,
  delivery_otp TEXT NOT NULL,
  tracking_notes TEXT,
  departure_time TIMESTAMPTZ,
  estimated_arrival TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- 10. COOPERATIVES
CREATE TABLE IF NOT EXISTS cooperatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  registration_code TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL DEFAULT 'Nigeria',
  region TEXT NOT NULL,
  chair_person_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  member_count INTEGER NOT NULL DEFAULT 1,
  bank_account_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cooperative_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cooperative_id UUID NOT NULL REFERENCES cooperatives(id) ON DELETE CASCADE,
  farmer_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  membership_number TEXT NOT NULL,
  farm_size_acres NUMERIC(8, 2),
  crops_or_livestock TEXT,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active'
);

-- 11. PAYMENTS, DISPUTES, MARKET PRICES
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  payer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  payee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  amount NUMERIC(14, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  provider TEXT NOT NULL DEFAULT 'paystack',
  provider_reference TEXT NOT NULL UNIQUE,
  payment_type TEXT NOT NULL DEFAULT 'order_escrow',
  status TEXT NOT NULL DEFAULT 'pending_confirmation',
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  role_context TEXT NOT NULL DEFAULT 'buyer_to_farmer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  opened_by_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  respondent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dispute_reason TEXT NOT NULL,
  claim_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'NGN',
  status TEXT NOT NULL DEFAULT 'opened',
  resolution_notes TEXT,
  evidence_attachments TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS market_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commodity_name TEXT NOT NULL,
  category TEXT NOT NULL,
  market_name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Nigeria',
  state_region TEXT NOT NULL,
  wholesale_price NUMERIC(12, 2) NOT NULL,
  retail_price NUMERIC(12, 2) NOT NULL,
  unit_of_measure TEXT NOT NULL DEFAULT 'kg',
  currency TEXT NOT NULL DEFAULT 'NGN',
  price_date DATE NOT NULL DEFAULT CURRENT_DATE,
  data_source_type price_source_type NOT NULL DEFAULT 'verified_bulletin',
  verification_badge TEXT NOT NULL DEFAULT 'Verified Exchange / Field Team',
  price_trend_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'stock_alert',
  link_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  actor_role TEXT,
  action_type TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  entity_id TEXT,
  changes_json JSONB DEFAULT '{}'::JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE livestock_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE livestock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortality_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE produce_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles can be viewed by all" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Owners can manage own farms" ON farms FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Public can view active produce listings" ON produce_listings FOR SELECT USING (is_active = true);
CREATE POLICY "Sellers can manage own listings" ON produce_listings FOR ALL USING (auth.uid() = seller_id);
CREATE POLICY "Buyers and Sellers can view their orders" ON orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
