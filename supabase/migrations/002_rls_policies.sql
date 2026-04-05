-- ============================================================
-- Row Level Security Policies
-- ============================================================

-- Helper function to get current user's shop_id
CREATE OR REPLACE FUNCTION get_current_shop_id()
RETURNS UUID AS $$
  SELECT shop_id FROM team_members WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION get_current_role()
RETURNS TEXT AS $$
  SELECT role FROM team_members WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- Enable RLS on all tables
-- ============================================================

ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_labor ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE canned_service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE canned_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE canned_service_labor ENABLE ROW LEVEL SECURITY;
ALTER TABLE canned_service_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_template_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_template_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_clock_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_timers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_mileage_log ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Shops policies
-- ============================================================

CREATE POLICY "Users can view their shop" ON shops
  FOR SELECT USING (id = get_current_shop_id());

CREATE POLICY "Owners can update their shop" ON shops
  FOR UPDATE USING (id = get_current_shop_id() AND get_current_role() IN ('owner', 'admin'));

CREATE POLICY "Anyone can create a shop during registration" ON shops
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- Team members policies
-- ============================================================

CREATE POLICY "Users can view team in their shop" ON team_members
  FOR SELECT USING (shop_id = get_current_shop_id());

CREATE POLICY "Admins can manage team" ON team_members
  FOR ALL USING (shop_id = get_current_shop_id() AND get_current_role() IN ('owner', 'admin'));

CREATE POLICY "New members can be created during registration" ON team_members
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- Shop-scoped read/write policies (apply to most tables)
-- ============================================================

-- Customers
CREATE POLICY "Shop members can view customers" ON customers
  FOR SELECT USING (shop_id = get_current_shop_id());
CREATE POLICY "Writers can manage customers" ON customers
  FOR ALL USING (shop_id = get_current_shop_id() AND get_current_role() IN ('owner', 'admin', 'service_writer'));

-- Vehicles
CREATE POLICY "Shop members can view vehicles" ON vehicles
  FOR SELECT USING (shop_id = get_current_shop_id());
CREATE POLICY "Writers can manage vehicles" ON vehicles
  FOR ALL USING (shop_id = get_current_shop_id() AND get_current_role() IN ('owner', 'admin', 'service_writer'));

-- Orders
CREATE POLICY "Shop members can view orders" ON orders
  FOR SELECT USING (shop_id = get_current_shop_id());
CREATE POLICY "Writers can manage orders" ON orders
  FOR ALL USING (shop_id = get_current_shop_id() AND get_current_role() IN ('owner', 'admin', 'service_writer'));

-- Order services, labor, parts — follow parent order access
CREATE POLICY "Shop members can view order services" ON order_services
  FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE shop_id = get_current_shop_id()));
CREATE POLICY "Writers can manage order services" ON order_services
  FOR ALL USING (order_id IN (SELECT id FROM orders WHERE shop_id = get_current_shop_id()));

CREATE POLICY "Shop members can view order labor" ON order_labor
  FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE shop_id = get_current_shop_id()));
CREATE POLICY "Writers can manage order labor" ON order_labor
  FOR ALL USING (order_id IN (SELECT id FROM orders WHERE shop_id = get_current_shop_id()));

CREATE POLICY "Shop members can view order parts" ON order_parts
  FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE shop_id = get_current_shop_id()));
CREATE POLICY "Writers can manage order parts" ON order_parts
  FOR ALL USING (order_id IN (SELECT id FROM orders WHERE shop_id = get_current_shop_id()));

-- Canned services
CREATE POLICY "Shop members can view canned categories" ON canned_service_categories
  FOR SELECT USING (shop_id = get_current_shop_id());
CREATE POLICY "Writers can manage canned categories" ON canned_service_categories
  FOR ALL USING (shop_id = get_current_shop_id() AND get_current_role() IN ('owner', 'admin', 'service_writer'));

CREATE POLICY "Shop members can view canned services" ON canned_services
  FOR SELECT USING (shop_id = get_current_shop_id());
CREATE POLICY "Writers can manage canned services" ON canned_services
  FOR ALL USING (shop_id = get_current_shop_id() AND get_current_role() IN ('owner', 'admin', 'service_writer'));

CREATE POLICY "View canned labor" ON canned_service_labor
  FOR SELECT USING (canned_service_id IN (SELECT id FROM canned_services WHERE shop_id = get_current_shop_id()));
CREATE POLICY "Manage canned labor" ON canned_service_labor
  FOR ALL USING (canned_service_id IN (SELECT id FROM canned_services WHERE shop_id = get_current_shop_id()));

CREATE POLICY "View canned parts" ON canned_service_parts
  FOR SELECT USING (canned_service_id IN (SELECT id FROM canned_services WHERE shop_id = get_current_shop_id()));
CREATE POLICY "Manage canned parts" ON canned_service_parts
  FOR ALL USING (canned_service_id IN (SELECT id FROM canned_services WHERE shop_id = get_current_shop_id()));

-- Inventory
CREATE POLICY "Shop members can view inventory" ON inventory_parts
  FOR SELECT USING (shop_id = get_current_shop_id());
CREATE POLICY "Writers can manage inventory" ON inventory_parts
  FOR ALL USING (shop_id = get_current_shop_id() AND get_current_role() IN ('owner', 'admin', 'service_writer'));

-- Purchase orders
CREATE POLICY "Shop members can view POs" ON purchase_orders
  FOR SELECT USING (shop_id = get_current_shop_id());
CREATE POLICY "Writers can manage POs" ON purchase_orders
  FOR ALL USING (shop_id = get_current_shop_id() AND get_current_role() IN ('owner', 'admin', 'service_writer'));

CREATE POLICY "View PO items" ON purchase_order_items
  FOR SELECT USING (purchase_order_id IN (SELECT id FROM purchase_orders WHERE shop_id = get_current_shop_id()));
CREATE POLICY "Manage PO items" ON purchase_order_items
  FOR ALL USING (purchase_order_id IN (SELECT id FROM purchase_orders WHERE shop_id = get_current_shop_id()));

-- Inspections
CREATE POLICY "Shop members can view templates" ON inspection_templates
  FOR SELECT USING (shop_id = get_current_shop_id());
CREATE POLICY "Manage templates" ON inspection_templates
  FOR ALL USING (shop_id = get_current_shop_id());

CREATE POLICY "View template sections" ON inspection_template_sections
  FOR SELECT USING (template_id IN (SELECT id FROM inspection_templates WHERE shop_id = get_current_shop_id()));
CREATE POLICY "Manage template sections" ON inspection_template_sections
  FOR ALL USING (template_id IN (SELECT id FROM inspection_templates WHERE shop_id = get_current_shop_id()));

CREATE POLICY "View template items" ON inspection_template_items
  FOR SELECT USING (section_id IN (SELECT id FROM inspection_template_sections WHERE template_id IN (SELECT id FROM inspection_templates WHERE shop_id = get_current_shop_id())));
CREATE POLICY "Manage template items" ON inspection_template_items
  FOR ALL USING (section_id IN (SELECT id FROM inspection_template_sections WHERE template_id IN (SELECT id FROM inspection_templates WHERE shop_id = get_current_shop_id())));

CREATE POLICY "Shop members can view inspections" ON inspections
  FOR SELECT USING (shop_id = get_current_shop_id());
CREATE POLICY "Members can manage inspections" ON inspections
  FOR ALL USING (shop_id = get_current_shop_id());

CREATE POLICY "View inspection results" ON inspection_results
  FOR SELECT USING (inspection_id IN (SELECT id FROM inspections WHERE shop_id = get_current_shop_id()));
CREATE POLICY "Manage inspection results" ON inspection_results
  FOR ALL USING (inspection_id IN (SELECT id FROM inspections WHERE shop_id = get_current_shop_id()));

CREATE POLICY "View inspection photos" ON inspection_photos
  FOR SELECT USING (inspection_result_id IN (SELECT id FROM inspection_results WHERE inspection_id IN (SELECT id FROM inspections WHERE shop_id = get_current_shop_id())));
CREATE POLICY "Manage inspection photos" ON inspection_photos
  FOR ALL USING (inspection_result_id IN (SELECT id FROM inspection_results WHERE inspection_id IN (SELECT id FROM inspections WHERE shop_id = get_current_shop_id())));

-- Time tracking
CREATE POLICY "Shop members can view time entries" ON time_clock_entries
  FOR SELECT USING (shop_id = get_current_shop_id());
CREATE POLICY "Members can manage own time" ON time_clock_entries
  FOR ALL USING (shop_id = get_current_shop_id());

CREATE POLICY "Shop members can view job timers" ON job_timers
  FOR SELECT USING (shop_id = get_current_shop_id());
CREATE POLICY "Members can manage job timers" ON job_timers
  FOR ALL USING (shop_id = get_current_shop_id());

-- Appointments
CREATE POLICY "Shop members can view appointments" ON appointments
  FOR SELECT USING (shop_id = get_current_shop_id());
CREATE POLICY "Writers can manage appointments" ON appointments
  FOR ALL USING (shop_id = get_current_shop_id() AND get_current_role() IN ('owner', 'admin', 'service_writer'));

-- Messages
CREATE POLICY "Shop members can view messages" ON messages
  FOR SELECT USING (shop_id = get_current_shop_id());
CREATE POLICY "Writers can manage messages" ON messages
  FOR ALL USING (shop_id = get_current_shop_id() AND get_current_role() IN ('owner', 'admin', 'service_writer'));

-- Payments
CREATE POLICY "Shop members can view payments" ON payments
  FOR SELECT USING (shop_id = get_current_shop_id());
CREATE POLICY "Writers can manage payments" ON payments
  FOR ALL USING (shop_id = get_current_shop_id() AND get_current_role() IN ('owner', 'admin', 'service_writer'));

-- Activity log
CREATE POLICY "Shop members can view activity" ON activity_log
  FOR SELECT USING (shop_id = get_current_shop_id());
CREATE POLICY "Members can create activity" ON activity_log
  FOR INSERT WITH CHECK (shop_id = get_current_shop_id());

-- Tags
CREATE POLICY "Shop members can view tags" ON tags
  FOR SELECT USING (shop_id = get_current_shop_id());
CREATE POLICY "Writers can manage tags" ON tags
  FOR ALL USING (shop_id = get_current_shop_id() AND get_current_role() IN ('owner', 'admin', 'service_writer'));

-- Vehicle mileage log
CREATE POLICY "Shop members can view mileage" ON vehicle_mileage_log
  FOR SELECT USING (vehicle_id IN (SELECT id FROM vehicles WHERE shop_id = get_current_shop_id()));
CREATE POLICY "Members can manage mileage" ON vehicle_mileage_log
  FOR ALL USING (vehicle_id IN (SELECT id FROM vehicles WHERE shop_id = get_current_shop_id()));
