-- Update restaurant name to Shawaya House
UPDATE restaurants 
SET name = 'Shawaya House', 
    updated_at = NOW()
WHERE id = (SELECT id FROM restaurants LIMIT 1);

-- Verify the update
SELECT id, name, address, phone, currency, vat_percent FROM restaurants LIMIT 1;
