-- Seed data for Restaurant ECR System
-- Sample data for a KSA restaurant

-- Insert sample restaurant
INSERT INTO restaurants (id, name, address, phone, email, currency, tax_rate)
VALUES 
  ('123e4567-e89b-12d3-a456-426614174000', 'Al Nakheel Restaurant', 'King Fahd Road, Riyadh, KSA', '+966 11 234 5678', 'info@alnakheel.sa', 'SAR', 15.00)
ON CONFLICT (id) DO NOTHING;

-- Insert sample tables
INSERT INTO tables (id, restaurant_id, table_number, capacity, qr_code, status)
VALUES 
  ('223e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', 'T1', 4, 'QR-T1-ALNAKHEEL', 'available'),
  ('223e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174000', 'T2', 2, 'QR-T2-ALNAKHEEL', 'available'),
  ('223e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174000', 'T3', 6, 'QR-T3-ALNAKHEEL', 'available'),
  ('223e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174000', 'T4', 4, 'QR-T4-ALNAKHEEL', 'available'),
  ('223e4567-e89b-12d3-a456-426614174005', '123e4567-e89b-12d3-a456-426614174000', 'T5', 8, 'QR-T5-ALNAKHEEL', 'available')
ON CONFLICT (id) DO NOTHING;

-- Insert menu categories
INSERT INTO menu_categories (id, restaurant_id, name, display_order, is_active)
VALUES 
  ('323e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', 'Appetizers', 1, true),
  ('323e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174000', 'Main Course', 2, true),
  ('323e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174000', 'Grills', 3, true),
  ('323e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174000', 'Desserts', 4, true),
  ('323e4567-e89b-12d3-a456-426614174005', '123e4567-e89b-12d3-a456-426614174000', 'Beverages', 5, true)
ON CONFLICT (id) DO NOTHING;

-- Insert menu items (KSA-style with veg/non-veg classification)
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, food_type, is_available, preparation_time)
VALUES 
  -- Appetizers
  ('423e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174001', 'Hummus', 'Creamy chickpea dip with tahini and olive oil', 18.00, 'veg', true, 5),
  ('423e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174001', 'Mutabal', 'Smoked eggplant dip with tahini', 20.00, 'veg', true, 5),
  ('423e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174001', 'Chicken Wings', 'Spicy grilled chicken wings', 32.00, 'non-veg', true, 15),
  ('423e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174001', 'Falafel', 'Crispy chickpea fritters served with tahini', 22.00, 'veg', true, 10),
  
  -- Main Course
  ('423e4567-e89b-12d3-a456-426614174005', '123e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174002', 'Chicken Mandi', 'Traditional Yemeni rice dish with chicken', 55.00, 'non-veg', true, 30),
  ('423e4567-e89b-12d3-a456-426614174006', '123e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174002', 'Lamb Kabsa', 'Aromatic rice with tender lamb', 68.00, 'non-veg', true, 35),
  ('423e4567-e89b-12d3-a456-426614174007', '123e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174002', 'Vegetable Biryani', 'Fragrant basmati rice with mixed vegetables', 38.00, 'veg', true, 25),
  ('423e4567-e89b-12d3-a456-426614174008', '123e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174002', 'Fish Sayadieh', 'Spiced fish with yellow rice', 62.00, 'non-veg', true, 30),
  
  -- Grills
  ('423e4567-e89b-12d3-a456-426614174009', '123e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174003', 'Mixed Grill Platter', 'Assorted grilled meats with sides', 85.00, 'non-veg', true, 25),
  ('423e4567-e89b-12d3-a456-426614174010', '123e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174003', 'Lamb Chops', 'Grilled lamb chops with herbs', 78.00, 'non-veg', true, 20),
  ('423e4567-e89b-12d3-a456-426614174011', '123e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174003', 'Shish Tawook', 'Marinated chicken skewers', 48.00, 'non-veg', true, 20),
  ('423e4567-e89b-12d3-a456-426614174012', '123e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174003', 'Grilled Vegetables', 'Seasonal vegetables with balsamic glaze', 35.00, 'veg', true, 15),
  
  -- Desserts
  ('423e4567-e89b-12d3-a456-426614174013', '123e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174004', 'Kunafa', 'Sweet cheese pastry with pistachios', 28.00, 'veg', true, 10),
  ('423e4567-e89b-12d3-a456-426614174014', '123e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174004', 'Baklava', 'Layered phyllo with nuts and honey', 25.00, 'veg', true, 5),
  ('423e4567-e89b-12d3-a456-426614174015', '123e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174004', 'Um Ali', 'Traditional bread pudding', 22.00, 'veg', true, 15),
  
  -- Beverages
  ('423e4567-e89b-12d3-a456-426614174016', '123e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174005', 'Fresh Orange Juice', 'Freshly squeezed orange juice', 15.00, 'beverage', true, 5),
  ('423e4567-e89b-12d3-a456-426614174017', '123e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174005', 'Arabic Coffee', 'Traditional Arabic coffee with cardamom', 12.00, 'beverage', true, 5),
  ('423e4567-e89b-12d3-a456-426614174018', '123e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174005', 'Mint Lemonade', 'Refreshing lemonade with fresh mint', 14.00, 'beverage', true, 5),
  ('423e4567-e89b-12d3-a456-426614174019', '123e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174005', 'Soft Drinks', 'Assorted soft drinks', 8.00, 'beverage', true, 2)
ON CONFLICT (id) DO NOTHING;

-- Insert a sample order for table T1
INSERT INTO orders (id, restaurant_id, table_id, order_number, subtotal, tax_amount, total_amount, status)
VALUES 
  ('523e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', '223e4567-e89b-12d3-a456-426614174001', 'ORD-20250110-001', 185.00, 27.75, 212.75, 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert order items for the sample order
INSERT INTO order_items (id, order_id, menu_item_id, quantity, unit_price, subtotal, status)
VALUES 
  ('623e4567-e89b-12d3-a456-426614174001', '523e4567-e89b-12d3-a456-426614174001', '423e4567-e89b-12d3-a456-426614174001', 2, 18.00, 36.00, 'served'),
  ('623e4567-e89b-12d3-a456-426614174002', '523e4567-e89b-12d3-a456-426614174001', '423e4567-e89b-12d3-a456-426614174005', 1, 55.00, 55.00, 'served'),
  ('623e4567-e89b-12d3-a456-426614174003', '523e4567-e89b-12d3-a456-426614174001', '423e4567-e89b-12d3-a456-426614174009', 1, 85.00, 85.00, 'served'),
  ('623e4567-e89b-12d3-a456-426614174004', '523e4567-e89b-12d3-a456-426614174001', '423e4567-e89b-12d3-a456-426614174017', 3, 12.00, 36.00, 'served'),
  ('623e4567-e89b-12d3-a456-426614174005', '523e4567-e89b-12d3-a456-426614174001', '423e4567-e89b-12d3-a456-426614174016', 2, 15.00, 30.00, 'served')
ON CONFLICT (id) DO NOTHING;
