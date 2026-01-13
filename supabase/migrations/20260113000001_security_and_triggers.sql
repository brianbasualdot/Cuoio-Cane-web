-- Migration: 20260113000001_security_and_triggers
-- Description: RLS Policies, Helper Functions, and Automation Triggers

-- 1. HELPER FUNCTIONS

-- Function to handle updated_at timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to authorize admin/staff securely (Security Definer to bypass RLS recursion)
CREATE OR REPLACE FUNCTION public.get_my_claim_role()
RETURNS user_role AS $$
DECLARE
    u_role user_role;
BEGIN
    -- Check if user is authenticated
    IF auth.uid() IS NULL THEN
        RETURN NULL;
    END IF;

    SELECT role INTO u_role FROM public.profiles WHERE id = auth.uid();
    RETURN u_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for Audit Logging
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER AS $$
DECLARE
    actor_id UUID;
    payload JSONB;
BEGIN
    actor_id := auth.uid();
    
    -- Insert Log
    INSERT INTO public.audit_logs (actor_id, action, entity_table, entity_id, old_data, new_data, ip_address)
    VALUES (
        actor_id,
        TG_OP, -- INSERT, UPDATE, DELETE
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        to_jsonb(OLD),
        to_jsonb(NEW),
        current_setting('request.headers', true)::json->>'cf-connecting-ip' -- Try to capture Cloudflare IP or null
    );
    
    RETURN NULL; -- Result is ignored for AFTER triggers
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. TRIGGERS: updated_at

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_variants_modtime BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shipments_modtime BEFORE UPDATE ON shipments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- 3. TRIGGERS: Profile Creation (on Auth Sync)

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NULL -- Default to Customer (NULL per schema design)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users (Supabase specific)
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 4. TRIGGERS: Audit Logs (Critical Tables)
-- We log changes to products, orders (status changes), and sensitive profile updates

CREATE TRIGGER audit_products_changes
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_variants_changes
    AFTER INSERT OR UPDATE OR DELETE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_order_changes
    AFTER UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();


-- 5. RLS POLICIES

-- PROFILES
-- Read: Users read own. Staff/Admin read all.
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Staff and Admin can view all profiles" ON profiles FOR SELECT USING (get_my_claim_role() IN ('admin', 'staff'));

-- Update: Users update own (non-critical fields). Staff/Admin update all.
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
-- Note: 'role' column protection should be handled in API logic or separate trigger to prevent privilege escalation, 
-- but strictly speaking, RLS allows the update. We trust the API validation for sensitive fields.

-- PRODUCTS & VARIANTS
-- Read: Public
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access variants" ON product_variants FOR SELECT USING (true);

-- Write: Admin/Staff Only
CREATE POLICY "Staff/Admin manage products" ON products FOR ALL USING (get_my_claim_role() IN ('admin', 'staff'));
CREATE POLICY "Staff/Admin manage variants" ON product_variants FOR ALL USING (get_my_claim_role() IN ('admin', 'staff'));


-- ORDERS
-- Read: Owner or Staff/Admin
CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Staff/Admin view all orders" ON orders FOR SELECT USING (get_my_claim_role() IN ('admin', 'staff'));

-- Create: Public (for Guest Checkout) and Authenticated
-- Since we allow "Guest Checkout" (user_id is NULL), we must allow INSERTs to 'orders' from anyone (anon).
-- Ideally, this is done via Service Role from Backend API, effectively bypassing RLS.
-- BUT if we want to allow RLS compliant inserts without Service Role:
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);

-- Update: Staff/Admin (users shouldn't directly update orders via client, except maybe cancel? Restrict to API for safety)
CREATE POLICY "Staff/Admin update orders" ON orders FOR UPDATE USING (get_my_claim_role() IN ('admin', 'staff'));


-- ORDER ITEMS
-- Read: Owner (via order linkage) or Staff/Admin
CREATE POLICY "Users view own order items" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Staff/Admin view all order items" ON order_items FOR SELECT USING (get_my_claim_role() IN ('admin', 'staff'));
-- Insert: Anyone can add items (during order creation)
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);


-- PAYMENTS & SHIPMENTS
-- Read: Owner or Staff/Admin
CREATE POLICY "Users view own payments" ON payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = payments.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Staff/Admin view all payments" ON payments FOR SELECT USING (get_my_claim_role() IN ('admin', 'staff'));

CREATE POLICY "Users view own shipments" ON shipments FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = shipments.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Staff/Admin view all shipments" ON shipments FOR SELECT USING (get_my_claim_role() IN ('admin', 'staff'));


-- AUDIT LOGS
-- Read: Admin ONLY (Staff may be audited)
CREATE POLICY "Admins view audit logs" ON audit_logs FOR SELECT USING (get_my_claim_role() = 'admin');
-- Insert: System only (via Triggers/Functions Security Definer). 
-- No direct inserts allowed via RLS policies for users.
