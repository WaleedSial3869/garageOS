-- ============================================================
-- Database Functions & Triggers
-- ============================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER shops_updated_at BEFORE UPDATE ON shops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER team_members_updated_at BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER vehicles_updated_at BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER order_services_updated_at BEFORE UPDATE ON order_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER order_labor_updated_at BEFORE UPDATE ON order_labor
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER order_parts_updated_at BEFORE UPDATE ON order_parts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER canned_services_updated_at BEFORE UPDATE ON canned_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER inventory_parts_updated_at BEFORE UPDATE ON inventory_parts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER purchase_orders_updated_at BEFORE UPDATE ON purchase_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER inspection_templates_updated_at BEFORE UPDATE ON inspection_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER inspections_updated_at BEFORE UPDATE ON inspections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER inspection_results_updated_at BEFORE UPDATE ON inspection_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Order total recalculation
-- ============================================================

CREATE OR REPLACE FUNCTION recalculate_order_totals()
RETURNS TRIGGER AS $$
DECLARE
  v_order_id UUID;
  v_parts DECIMAL(10,2);
  v_labor DECIMAL(10,2);
  v_subtotal DECIMAL(10,2);
  v_discount DECIMAL(10,2);
  v_tax DECIMAL(10,2);
  v_grand DECIMAL(10,2);
  v_tax_rate DECIMAL(5,4);
  v_disc_type TEXT;
  v_disc_value DECIMAL(10,2);
  v_fees DECIMAL(10,2);
  v_paid DECIMAL(10,2);
BEGIN
  -- Get the order_id from the triggering row
  IF TG_OP = 'DELETE' THEN
    v_order_id := OLD.order_id;
  ELSE
    v_order_id := NEW.order_id;
  END IF;

  -- Calculate subtotals
  SELECT COALESCE(SUM(subtotal), 0) INTO v_parts
    FROM order_parts WHERE order_id = v_order_id;
  SELECT COALESCE(SUM(subtotal), 0) INTO v_labor
    FROM order_labor WHERE order_id = v_order_id;

  v_subtotal := v_parts + v_labor;

  -- Get order discount and tax info
  SELECT COALESCE(tax_rate, 0), discount_type, COALESCE(discount_value, 0),
         COALESCE(fees, 0), COALESCE(amount_paid, 0)
    INTO v_tax_rate, v_disc_type, v_disc_value, v_fees, v_paid
    FROM orders WHERE id = v_order_id;

  -- Calculate discount
  IF v_disc_type = 'percentage' THEN
    v_discount := v_subtotal * (v_disc_value / 100);
  ELSE
    v_discount := v_disc_value;
  END IF;

  -- Calculate tax and grand total
  v_tax := (v_subtotal - v_discount) * v_tax_rate;
  v_grand := v_subtotal - v_discount + v_tax + v_fees;

  -- Update order
  UPDATE orders SET
    parts_subtotal = v_parts,
    labor_subtotal = v_labor,
    subtotal = v_subtotal,
    discount_amount = v_discount,
    tax_amount = v_tax,
    grand_total = v_grand,
    balance_due = v_grand - v_paid,
    updated_at = NOW()
  WHERE id = v_order_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_recalc_on_labor
  AFTER INSERT OR UPDATE OR DELETE ON order_labor
  FOR EACH ROW EXECUTE FUNCTION recalculate_order_totals();

CREATE TRIGGER trigger_recalc_on_parts
  AFTER INSERT OR UPDATE OR DELETE ON order_parts
  FOR EACH ROW EXECUTE FUNCTION recalculate_order_totals();

-- ============================================================
-- Customer stats function
-- ============================================================

CREATE OR REPLACE FUNCTION get_customer_stats(p_customer_id UUID)
RETURNS TABLE (
  total_visits BIGINT,
  total_spent DECIMAL,
  average_ticket DECIMAL,
  last_visit DATE,
  outstanding DECIMAL
) AS $$
  SELECT
    COUNT(DISTINCT o.id) as total_visits,
    COALESCE(SUM(o.grand_total), 0) as total_spent,
    COALESCE(AVG(o.grand_total), 0) as average_ticket,
    MAX(o.created_at)::date as last_visit,
    COALESCE(SUM(o.balance_due), 0) as outstanding
  FROM orders o
  WHERE o.customer_id = p_customer_id
    AND o.status NOT IN ('draft', 'void');
$$ LANGUAGE sql STABLE;
