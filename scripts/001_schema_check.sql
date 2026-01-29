-- This script just verifies the schema exists, it doesn't create anything
-- Run this to confirm all tables are present

SELECT 'Tables check:' as check_type;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

SELECT 'RLS Policies check:' as check_type;
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
