-- =============================================
-- FIX: Allow inserting guides without authentication
-- This is useful for seeding data
-- =============================================

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Authenticated users can insert guides" ON public.guides;
DROP POLICY IF EXISTS "Users can insert guides" ON public.guides;

-- Create a new policy that allows inserts when author_id is null OR matches authenticated user
CREATE POLICY "Allow guide inserts" ON public.guides
  FOR INSERT
  WITH CHECK (
    author_id IS NULL OR auth.uid() = author_id
  );

-- =============================================
-- Now you can run: npm run seed:guides
-- =============================================
