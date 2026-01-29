-- Seed Data for Testing Pay@Table System
-- This script creates a complete restaurant setup with tables, menu items, and sample orders

-- Insert the restaurant first since it was deleted
INSERT INTO restaurants (id, name, email, phone, address, currency, tax_rate)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'The Golden Fork Restaurant',
  'rakesh@gmail.com',
  '+966501234567',
  '123 King Fahd Road, Riyadh, Saudi Arabia',
  'SAR',
  15.00
)
ON CONFLICT (id) DO NOTHING;

-- Insert the initial 3 tables (T1-T3) that were deleted
INSERT INTO tables (id, restaurant_id, table_number, capacity, qr_code, status)
VALUES
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'T1', 4, 'QR-T1-GOLDEN-FORK', 'occupied'),
  ('b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'T2', 2, 'QR-T2-GOLDEN-FORK', 'available'),
  ('b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'T3', 6, 'QR-T3-GOLDEN-FORK', 'available'),
  ('b5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'T5', 2, 'QR-T5-GOLDEN-FORK', 'available'),
  ('b6eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'T6', 6, 'QR-T6-GOLDEN-FORK', 'available'),
  ('b7eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'T7', 4, 'QR-T7-GOLDEN-FORK', 'available'),
  ('b8eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'T8', 2, 'QR-T8-GOLDEN-FORK', 'available')
ON CONFLICT (id) DO NOTHING;

-- Insert the original 4 menu items that were deleted, plus new ones
INSERT INTO menu_items (id, restaurant_id, name, description, price)
VALUES
  -- Original items
  ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Grilled Chicken', 'Tender grilled chicken with herbs', 45.00),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Caesar Salad', 'Fresh romaine lettuce with Caesar dressing', 25.00),
  ('c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Chocolate Cake', 'Rich chocolate cake with ganache', 20.00),
  ('c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Fresh Orange Juice', 'Freshly squeezed orange juice', 15.00),
  
  -- Additional Appetizers
  ('c5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Hummus', 'Creamy chickpea dip with olive oil and tahini', 18.00),
  ('c6eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Falafel Platter', 'Crispy chickpea fritters with tahini sauce', 25.00),
  ('c7eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Greek Salad', 'Fresh vegetables with feta cheese', 28.00),
  
  -- Main Courses
  ('c8eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Grilled Chicken Kabsa', 'Traditional Saudi rice with tender chicken', 58.00),
  ('c9eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Lamb Mandi', 'Slow-cooked lamb with fragrant rice', 78.00),
  ('caeebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Beef Steak', 'Premium ribeye with roasted vegetables', 98.00),
  ('cbeebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Grilled Salmon', 'Atlantic salmon with lemon butter', 88.00),
  ('cceebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Chicken Shawarma Plate', 'Marinated chicken with garlic sauce', 45.00),
  
  -- Desserts
  ('cdeebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Kunafa', 'Traditional Middle Eastern sweet pastry', 28.00),
  ('ceeebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Chocolate Lava Cake', 'Warm chocolate cake with molten center', 35.00),
  ('cfeebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Baklava', 'Layers of phyllo with nuts and honey', 22.00),
  
  -- Beverages
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Arabic Coffee', 'Traditional Saudi coffee', 12.00),
  ('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Mint Lemonade', 'Refreshing lemonade with fresh mint', 18.00),
  ('d2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Mango Juice', 'Fresh mango juice', 16.00),
  ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Tamarind Juice', 'Sweet and tangy tamarind drink', 16.00)
ON CONFLICT (id) DO NOTHING;

-- Create sample orders for table T1 (original) and T2
-- Order for table T1
INSERT INTO orders (id, restaurant_id, table_id, order_number, subtotal, tax_amount, total_amount, status)
VALUES (
  'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'ORD-001',
  105.00,
  15.75,
  120.75,
  'active'
)
ON CONFLICT (id) DO NOTHING;

-- Order items for table T1
INSERT INTO order_items (id, order_id, menu_item_id, quantity, unit_price, subtotal)
VALUES 
  ('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 1, 45.00, 45.00),
  ('e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 1, 25.00, 25.00),
  ('e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 1, 20.00, 20.00),
  ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 1, 15.00, 15.00)
ON CONFLICT (id) DO NOTHING;

-- Order for table T2
INSERT INTO orders (id, restaurant_id, table_id, order_number, subtotal, tax_amount, total_amount, status)
VALUES (
  'd4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'ORD-002',
  146.00,
  21.90,
  167.90,
  'active'
)
ON CONFLICT (id) DO NOTHING;

-- Order items for table T2
INSERT INTO order_items (id, order_id, menu_item_id, quantity, unit_price, subtotal)
VALUES 
  ('e5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'd4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'c5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 1, 18.00, 18.00),
  ('e6eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'd4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'c8eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 2, 58.00, 116.00),
  ('e7eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'd4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 1, 12.00, 12.00)
ON CONFLICT (id) DO NOTHING;

-- Update table status to reflect occupied tables
UPDATE tables SET status = 'occupied' WHERE id IN ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid);
