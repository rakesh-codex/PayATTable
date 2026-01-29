-- Add split configuration columns to payments table
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS num_people integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS tip_percent numeric DEFAULT 0;

-- Add comment for clarity
COMMENT ON COLUMN payments.num_people IS 'Number of people splitting the payment';
COMMENT ON COLUMN payments.tip_percent IS 'Tip percentage applied to this payment';
