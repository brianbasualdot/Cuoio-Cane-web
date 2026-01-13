-- Migration: 20260113000000_initial_schema
-- Description: Initial schema for Cuoio Cane (Products, Orders, Profiles, Audit)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
-- User roles: strictly for Admin and Staff. Regular customers do not have a role in this enum (represented by NULL or no profile record).
DROP TYPE IF EXISTS user_role;
CREATE TYPE user_role AS ENUM ('admin', 'staff');

-- Order status: Full lifecycle of shipping and payment
DROP TYPE IF EXISTS order_status;
CREATE TYPE order_status AS ENUM ('pending', 'awaiting_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');

-- Payment status: Controlled vocabulary for payment states
DROP TYPE IF EXISTS payment_status;
CREATE TYPE payment_status AS ENUM ('pending', 'approved', 'rejected', 'refunded', 'cancelled', 'in_mediation');

-- 2. TABLES

-- TABLE: profiles
-- Extends Supabase auth.users.
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL, -- NOTE: This is a SNAPSHOT of auth.users.email. Ensure triggers or app logic keep it synced.
    full_name TEXT,
    role user_role, -- NULL = Customer/Public User
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: products
-- Public catalog information.
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    care_instructions TEXT,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: product_variants
-- Sellable units (SKUs).
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    size TEXT, 
    color TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: orders
-- Central transaction entity.
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Nullable for Guest Checkout
    
    -- Snapshot Customer Info
    customer_email TEXT NOT NULL,
    customer_full_name TEXT NOT NULL,
    customer_phone TEXT,
    
    status order_status DEFAULT 'pending' NOT NULL,
    
    -- Financials
    currency TEXT DEFAULT 'ARS' NOT NULL,
    items_subtotal NUMERIC(12, 2) NOT NULL,
    shipping_cost NUMERIC(12, 2) DEFAULT 0,
    discount_amount NUMERIC(12, 2) DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL,
    
    -- Shipping Address (JSONB)
    shipping_address JSONB NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: order_items
-- Immutable snapshot of items in an order.
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    
    -- Historical data
    product_name TEXT NOT NULL,
    variant_sku TEXT NOT NULL,
    
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(12, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

-- TABLE: payments
-- Payment records.
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    provider TEXT NOT NULL,
    provider_payment_id TEXT, 
    status payment_status DEFAULT 'pending' NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: shipments
-- Fulfillment tracking.
CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    carrier TEXT NOT NULL,
    tracking_code TEXT,
    status TEXT DEFAULT 'preparing',
    label_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: audit_logs
-- Immutable security logs.
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_table TEXT NOT NULL,
    entity_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INDEXES
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- 4. RLS PREPARATION
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Note: Policies are NOT included in this initial schema migration. 
-- They should be applied in a separate security migration after this one is verified.
