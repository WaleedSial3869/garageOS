-- ============================================================
-- GarageOS — Initial Database Schema
-- ============================================================

-- Shop configuration (single-tenant, one shop)
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'CA',
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  tax_rate DECIMAL(5,4) DEFAULT 0.13,
  labor_rate DECIMAL(10,2) DEFAULT 120.00,
  currency TEXT DEFAULT 'CAD',
  timezone TEXT DEFAULT 'America/Toronto',
  stripe_account_id TEXT,
  twilio_phone_number TEXT,
  business_hours JSONB DEFAULT '{
    "monday": {"open": "08:00", "close": "18:00"},
    "tuesday": {"open": "08:00", "close": "18:00"},
    "wednesday": {"open": "08:00", "close": "18:00"},
    "thursday": {"open": "08:00", "close": "18:00"},
    "friday": {"open": "08:00", "close": "18:00"},
    "saturday": {"open": "09:00", "close": "14:00"},
    "sunday": null
  }'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members / users
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'service_writer', 'technician', 'apprentice')),
  avatar_url TEXT,
  color TEXT DEFAULT '#4A7CFF',
  hourly_rate DECIMAL(10,2),
  commission_type TEXT CHECK (commission_type IN ('none', 'percentage_labor', 'flat_per_job', 'tiered')),
  commission_rate DECIMAL(5,4),
  is_active BOOLEAN DEFAULT true,
  permissions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CUSTOMER & VEHICLE TABLES
-- ============================================================

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  phone_secondary TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  company_name TEXT,
  is_fleet BOOLEAN DEFAULT false,
  is_tax_exempt BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  preferred_contact TEXT CHECK (preferred_contact IN ('email', 'sms', 'phone')) DEFAULT 'sms',
  customer_since DATE DEFAULT CURRENT_DATE,
  referral_source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  vin TEXT,
  year INTEGER,
  make TEXT,
  model TEXT,
  sub_model TEXT,
  body_style TEXT,
  engine TEXT,
  engine_size TEXT,
  fuel_type TEXT,
  transmission TEXT,
  drivetrain TEXT,
  doors INTEGER,
  color TEXT,
  license_plate TEXT,
  license_state TEXT,
  unit_number TEXT,
  photo_url TEXT,
  production_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_vin_per_shop UNIQUE (shop_id, vin)
);

CREATE TABLE vehicle_mileage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  order_id UUID,
  mileage_in INTEGER,
  mileage_out INTEGER,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ORDER TABLES
-- ============================================================

CREATE SEQUENCE order_number_seq START 1000;

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  order_number INTEGER DEFAULT nextval('order_number_seq'),
  order_type TEXT NOT NULL CHECK (order_type IN ('estimate', 'repair_order', 'invoice')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'sent', 'waiting_approval', 'approved', 'in_progress',
    'on_hold', 'completed', 'invoiced', 'paid', 'void', 'archived'
  )),
  workflow_status TEXT NOT NULL DEFAULT 'estimates' CHECK (workflow_status IN (
    'estimates', 'approved_work', 'in_progress', 'invoices'
  )),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  service_writer_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  customer_request TEXT,
  tech_recommendation TEXT,
  internal_notes TEXT,
  parts_subtotal DECIMAL(10,2) DEFAULT 0,
  labor_subtotal DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) DEFAULT 0,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  tax_rate DECIMAL(5,4),
  tax_amount DECIMAL(10,2) DEFAULT 0,
  fees DECIMAL(10,2) DEFAULT 0,
  grand_total DECIMAL(10,2) DEFAULT 0,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  balance_due DECIMAL(10,2) DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  payment_terms TEXT DEFAULT 'on_receipt',
  customer_po TEXT,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  invoiced_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  approval_token TEXT UNIQUE,
  approved_at TIMESTAMPTZ,
  approved_by TEXT,
  mileage_in INTEGER,
  mileage_out INTEGER,
  kanban_position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  canned_service_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  is_authorized BOOLEAN DEFAULT false,
  authorized_at TIMESTAMPTZ,
  sort_order INTEGER DEFAULT 0,
  subtotal DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_labor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_service_id UUID REFERENCES order_services(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  technician_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  hours DECIMAL(6,2) DEFAULT 0,
  rate DECIMAL(10,2),
  discount_percent DECIMAL(5,2) DEFAULT 0,
  subtotal DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'incomplete', 'complete')),
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_service_id UUID REFERENCES order_services(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  inventory_part_id UUID,
  name TEXT NOT NULL,
  part_number TEXT,
  vendor TEXT,
  quantity DECIMAL(8,2) DEFAULT 1,
  cost DECIMAL(10,2) DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0,
  discount_percent DECIMAL(5,2) DEFAULT 0,
  subtotal DECIMAL(10,2) DEFAULT 0,
  is_reserved BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CANNED SERVICES
-- ============================================================

CREATE TABLE canned_service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE canned_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  category_id UUID REFERENCES canned_service_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  labor_hours DECIMAL(6,2) DEFAULT 0,
  labor_rate DECIMAL(10,2),
  parts_count INTEGER DEFAULT 0,
  total_price DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE canned_service_labor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canned_service_id UUID REFERENCES canned_services(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  hours DECIMAL(6,2) DEFAULT 0,
  rate DECIMAL(10,2),
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE canned_service_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canned_service_id UUID REFERENCES canned_services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  part_number TEXT,
  quantity DECIMAL(8,2) DEFAULT 1,
  cost DECIMAL(10,2) DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0,
  sort_order INTEGER DEFAULT 0
);

-- ============================================================
-- INVENTORY
-- ============================================================

CREATE TABLE inventory_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  part_number TEXT,
  barcode TEXT,
  category TEXT,
  vendor TEXT,
  location TEXT,
  quantity_on_hand DECIMAL(10,2) DEFAULT 0,
  min_stock_level DECIMAL(10,2) DEFAULT 0,
  cost DECIMAL(10,2) DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0,
  markup_percent DECIMAL(5,2),
  unit TEXT DEFAULT 'each',
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  po_number INTEGER,
  vendor_name TEXT NOT NULL,
  vendor_contact TEXT,
  vendor_email TEXT,
  vendor_phone TEXT,
  vendor_address TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'partial', 'received', 'cancelled')),
  subtotal DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  expected_date DATE,
  received_date DATE,
  notes TEXT,
  created_by UUID REFERENCES team_members(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  inventory_part_id UUID REFERENCES inventory_parts(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  part_number TEXT,
  description TEXT,
  quantity_ordered DECIMAL(10,2) DEFAULT 0,
  quantity_received DECIMAL(10,2) DEFAULT 0,
  unit_cost DECIMAL(10,2) DEFAULT 0,
  line_total DECIMAL(10,2) DEFAULT 0,
  sort_order INTEGER DEFAULT 0
);

-- ============================================================
-- DIGITAL INSPECTIONS
-- ============================================================

CREATE TABLE inspection_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sections_count INTEGER DEFAULT 0,
  items_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inspection_template_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES inspection_templates(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE inspection_template_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES inspection_template_sections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  requires_photo BOOLEAN DEFAULT false,
  requires_notes BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  template_id UUID REFERENCES inspection_templates(id) ON DELETE SET NULL,
  technician_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'sent')),
  share_token TEXT UNIQUE,
  items_total INTEGER DEFAULT 0,
  items_completed INTEGER DEFAULT 0,
  items_good INTEGER DEFAULT 0,
  items_monitor INTEGER DEFAULT 0,
  items_attention INTEGER DEFAULT 0,
  items_immediate INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inspection_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID REFERENCES inspections(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL,
  item_name TEXT NOT NULL,
  condition TEXT CHECK (condition IN ('good', 'monitor', 'attention', 'immediate', 'not_inspected')),
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inspection_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_result_id UUID REFERENCES inspection_results(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TIME TRACKING
-- ============================================================

CREATE TABLE time_clock_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  team_member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
  clock_in TIMESTAMPTZ NOT NULL,
  clock_out TIMESTAMPTZ,
  break_minutes INTEGER DEFAULT 0,
  total_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE job_timers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  team_member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  order_labor_id UUID REFERENCES order_labor(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL,
  paused_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  total_seconds INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- APPOINTMENTS & CALENDAR
-- ============================================================

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  technician_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_all_day BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'no_show', 'cancelled')),
  color TEXT,
  notes TEXT,
  send_confirmation BOOLEAN DEFAULT true,
  send_reminder BOOLEAN DEFAULT true,
  reminder_sent_at TIMESTAMPTZ,
  confirmation_sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES team_members(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COMMUNICATIONS
-- ============================================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  channel TEXT NOT NULL CHECK (channel IN ('sms', 'email')),
  from_number TEXT,
  to_number TEXT,
  from_email TEXT,
  to_email TEXT,
  subject TEXT,
  body TEXT NOT NULL,
  status TEXT DEFAULT 'sent' CHECK (status IN ('queued', 'sent', 'delivered', 'failed', 'received')),
  is_read BOOLEAN DEFAULT false,
  is_automated BOOLEAN DEFAULT false,
  sent_by UUID REFERENCES team_members(id),
  external_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PAYMENTS
-- ============================================================

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('cash', 'credit_card', 'debit', 'check', 'e_transfer', 'other')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
  stripe_payment_id TEXT,
  reference_number TEXT,
  notes TEXT,
  received_by UUID REFERENCES team_members(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ACTIVITY LOG
-- ============================================================

CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  team_member_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TAGS
-- ============================================================

CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#4A7CFF',
  entity_type TEXT NOT NULL CHECK (entity_type IN ('order', 'customer', 'vehicle', 'labor', 'part')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_tag_per_shop UNIQUE (shop_id, name, entity_type)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_customers_shop ON customers(shop_id);
CREATE INDEX idx_customers_name ON customers(shop_id, last_name, first_name);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);

CREATE INDEX idx_vehicles_shop ON vehicles(shop_id);
CREATE INDEX idx_vehicles_customer ON vehicles(customer_id);
CREATE INDEX idx_vehicles_vin ON vehicles(vin);
CREATE INDEX idx_vehicles_plate ON vehicles(license_plate);

CREATE INDEX idx_orders_shop ON orders(shop_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_vehicle ON orders(vehicle_id);
CREATE INDEX idx_orders_status ON orders(shop_id, status);
CREATE INDEX idx_orders_workflow ON orders(shop_id, workflow_status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(shop_id, created_at DESC);

CREATE INDEX idx_order_services_order ON order_services(order_id);
CREATE INDEX idx_order_labor_service ON order_labor(order_service_id);
CREATE INDEX idx_order_labor_order ON order_labor(order_id);
CREATE INDEX idx_order_parts_service ON order_parts(order_service_id);
CREATE INDEX idx_order_parts_order ON order_parts(order_id);

CREATE INDEX idx_inventory_shop ON inventory_parts(shop_id);
CREATE INDEX idx_inventory_number ON inventory_parts(part_number);
CREATE INDEX idx_inventory_barcode ON inventory_parts(barcode);

CREATE INDEX idx_appointments_shop ON appointments(shop_id);
CREATE INDEX idx_appointments_date ON appointments(shop_id, start_time);
CREATE INDEX idx_appointments_customer ON appointments(customer_id);

CREATE INDEX idx_messages_customer ON messages(customer_id);
CREATE INDEX idx_messages_order ON messages(order_id);
CREATE INDEX idx_messages_created ON messages(shop_id, created_at DESC);

CREATE INDEX idx_activity_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_created ON activity_log(shop_id, created_at DESC);

CREATE INDEX idx_time_clock_member ON time_clock_entries(team_member_id);
CREATE INDEX idx_job_timers_member ON job_timers(team_member_id);
CREATE INDEX idx_job_timers_order ON job_timers(order_id);

-- ============================================================
-- FULL TEXT SEARCH
-- ============================================================

ALTER TABLE customers ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(first_name, '') || ' ' || coalesce(last_name, '') || ' ' || coalesce(email, '') || ' ' || coalesce(phone, '') || ' ' || coalesce(company_name, ''))
  ) STORED;

ALTER TABLE vehicles ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(vin, '') || ' ' || coalesce(make, '') || ' ' || coalesce(model, '') || ' ' || coalesce(license_plate, ''))
  ) STORED;

CREATE INDEX idx_customers_fts ON customers USING GIN(fts);
CREATE INDEX idx_vehicles_fts ON vehicles USING GIN(fts);
