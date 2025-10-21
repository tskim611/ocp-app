-- ============================================
-- GET YOUR USER ID
-- ============================================
-- Run this in Supabase SQL Editor to get your User ID
-- Then use that ID in the sample content script
-- ============================================

-- Show all users in the database
SELECT
  id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Or if you want just the most recent user (likely yours):
-- SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1;
