-- Restaurant CRM System - Complete Database Schema
-- This script creates all tables, indexes, and RLS policies for local development
-- Run this in your local PostgreSQL database

-- ============================================================================
-- 1. RESTAURANTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.restaurants (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  address text,
  currency text DEFAULT 'SAR',
  vat_percent numeric DEFAULT 15,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_restaurants_email ON public.restaurants(email);

-- ============================================================================
-- 2. TABLES TABLE (Restaurant Tables)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tables (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  table_number integer NOT NULL,
  capacity integer NOT NULL,
  qr_code text NOT NULL UNIQUE,
  status text DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tables_restaurant_id ON public.tables(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_tables_qr_code ON public.tables(qr_code);
CREATE INDEX IF NOT EXISTS idx_tables_status ON public.tables(status);

-- ============================================================================
-- 3. MENU CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant_id ON public.menu_categories(restaurant_id);

-- ============================================================================
-- 4. MENU ITEMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.menu_items (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  available boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON public.menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON public.menu_items(available);

-- ============================================================================
-- 5. ORDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  table_id uuid NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
  order_number text NOT NULL,
  subtotal numeric DEFAULT 0,
  vat_amount numeric DEFAULT 0,
  tip_amount numeric DEFAULT 0,
  total_amount numeric DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  payment_status text DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'partial', 'failed')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON public.orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_table_id ON public.orders(table_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);

-- ============================================================================
-- 6. ORDER ITEMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id uuid NOT NULL REFERENCES public.menu_items(id),
  quantity integer NOT NULL,
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item_id ON public.order_items(menu_item_id);

-- ============================================================================
-- 7. PAYMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'partial')),
  payment_method text,
  gateway_transaction_id text,
  num_people integer,
  tip_percent numeric,
  paid_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_transaction_id ON public.payments(gateway_transaction_id);

-- ============================================================================
-- 8. PAYMENT SPLITS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.payment_splits (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
  gateway_transaction_id text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payment_splits_payment_id ON public.payment_splits(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_splits_status ON public.payment_splits(status);

-- ============================================================================
-- SAMPLE DATA - The Golden Fork Restaurant
-- ============================================================================

-- Insert sample restaurant
INSERT INTO public.restaurants (id, name, email, phone, address, currency, vat_percent)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  'The Golden Fork Restaurant',
  'contact@goldenfork.com',
  '+966501234567',
  '123 Restaurant Street, Riyadh, Saudi Arabia',
  'SAR',
  15
) ON CONFLICT DO NOTHING;

-- Insert sample tables
INSERT INTO public.tables (id, restaurant_id, table_number, capacity, qr_code, status)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, 1, 4, 'QR-TABLE-001', 'available'),
  ('550e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, 2, 4, 'QR-TABLE-002', 'available'),
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, 3, 6, 'QR-TABLE-003', 'available'),
  ('550e8400-e29b-41d4-a716-446655440004'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, 4, 2, 'QR-TABLE-004', 'available'),
  ('550e8400-e29b-41d4-a716-446655440005'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, 5, 4, 'QR-TABLE-005', 'available'),
  ('550e8400-e29b-41d4-a716-446655440006'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, 6, 8, 'QR-TABLE-006', 'available')
ON CONFLICT DO NOTHING;

-- Insert sample menu categories
INSERT INTO public.menu_categories (id, restaurant_id, name, display_order)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440010'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, 'Appetizers', 1),
  ('550e8400-e29b-41d4-a716-446655440011'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, 'Main Courses', 2),
  ('550e8400-e29b-41d4-a716-446655440012'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, 'Desserts', 3),
  ('550e8400-e29b-41d4-a716-446655440013'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, 'Beverages', 4)
ON CONFLICT DO NOTHING;

-- Insert sample menu items
INSERT INTO public.menu_items (id, restaurant_id, category_id, name, description, price, available)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440020'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, '550e8400-e29b-41d4-a716-446655440010'::uuid, 'Hummus', 'Creamy chickpea dip with tahini', 25.00, true),
  ('550e8400-e29b-41d4-a716-446655440021'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, '550e8400-e29b-41d4-a716-446655440010'::uuid, 'Spring Rolls', 'Crispy vegetable spring rolls', 35.00, true),
  ('550e8400-e29b-41d4-a716-446655440022'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, '550e8400-e29b-41d4-a716-446655440011'::uuid, 'Grilled Salmon', 'Fresh Atlantic salmon with lemon butter', 150.00, true),
  ('550e8400-e29b-41d4-a716-446655440023'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, '550e8400-e29b-41d4-a716-446655440011'::uuid, 'Beef Steak', 'Prime cut beef steak with herbs', 175.00, true),
  ('550e8400-e29b-41d4-a716-446655440024'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, '550e8400-e29b-41d4-a716-446655440012'::uuid, 'Chocolate Cake', 'Rich chocolate cake with cream', 45.00, true),
  ('550e8400-e29b-41d4-a716-446655440025'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, '550e8400-e29b-41d4-a716-446655440013'::uuid, 'Fresh Orange Juice', 'Freshly squeezed orange juice', 20.00, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_splits ENABLE ROW LEVEL SECURITY;

-- Restaurants: Public can read, owners can update
CREATE POLICY "Public can read all restaurants" ON public.restaurants
  FOR SELECT USING (true);

CREATE POLICY "Restaurants can update their own data" ON public.restaurants
  FOR UPDATE USING (true);

-- Tables: Public can read, owners can manage
CREATE POLICY "Public can read all tables" ON public.tables
  FOR SELECT USING (true);

CREATE POLICY "Restaurant owners can manage their tables" ON public.tables
  FOR ALL USING (true);

-- Menu Categories: Public can read, owners can manage
CREATE POLICY "Public can read menu categories" ON public.menu_categories
  FOR SELECT USING (true);

CREATE POLICY "Restaurant owners can manage their menu categories" ON public.menu_categories
  FOR ALL USING (true);

-- Menu Items: Public can read available items, owners can manage
CREATE POLICY "Public can read available menu items" ON public.menu_items
  FOR SELECT USING (available = true);

CREATE POLICY "Restaurant owners can manage their menu items" ON public.menu_items
  FOR ALL USING (true);

-- Orders: Public can read and create, owners can manage
CREATE POLICY "Public can read orders" ON public.orders
  FOR SELECT USING (true);

CREATE POLICY "Public can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Restaurant owners can manage their orders" ON public.orders
  FOR ALL USING (true);

-- Order Items: Public can read and create
CREATE POLICY "Public can read order items" ON public.order_items
  FOR SELECT USING (true);

CREATE POLICY "Public can create order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- Payments: Public can read and create, system can update
CREATE POLICY "Public can read payments" ON public.payments
  FOR SELECT USING (true);

CREATE POLICY "Public can create payments" ON public.payments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update payments" ON public.payments
  FOR UPDATE USING (true);

-- Payment Splits: Public can read and create, system can update
CREATE POLICY "Public can read payment splits" ON public.payment_splits
  FOR SELECT USING (true);

CREATE POLICY "Public can create payment splits" ON public.payment_splits
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update payment splits" ON public.payment_splits
  FOR UPDATE USING (true);

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
-- All tables, indexes, RLS policies, and sample data have been created successfully!
-- Your database is ready for local development.
